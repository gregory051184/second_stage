export const headers_middleware = (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.send = (data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data))
    }

};

export const url_middleware = (baseUrl) => (req, res) => {
    const url = new URL(req.url, baseUrl);
    const params = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    })
    req.pathname = url.pathname;
    req.params = params;
};


