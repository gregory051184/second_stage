import {EventEmitter} from "events";
import http from "http";

export class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this.serverCreator();
        this.middlewares = [];
        this.PORT = 3000;
    };

    use(middleware) {
        this.middlewares.push(middleware)
    }

    add_router(router) {
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach(method => {
                const handler = endpoint[method];
                this.emitter.on(this.routerMask(path, method), (req, res) => {
                    handler(req, res);
                })
            })
        })
    };

    serverCreator() {
        return http.createServer((req, res) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            })
            req.on('end', () => {
                if (body) {
                    req.body = JSON.parse(body)
                }
                this.middlewares.forEach(middleware => middleware(req, res));
                const emitted = this.emitter.emit(this.routerMask(req.pathname, req.method), req, res);
                if (!emitted) {
                    res.end()
                }
            })

        })
    };

    routerMask(path, method) {
        return `[${path}]:[${method}]`
    };

    listen() {
        this.server.listen(this.PORT, () => console.log(`Сервер запущен на порту ${this.PORT}...`))
    }
}
