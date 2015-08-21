var net = require('net');
var httpFiles = require('./http_files');
var HOST = '0.0.0.0';
var PORT = 8080;
var server_started = new Date().toUTCString();

function renderResponse (name) {
    return httpFiles[name];
}

function responseHeaders (status, contentType, contentLength) {
    return 'HTTP/1.1 '+status+' OK\n\
Date: '+ new Date().toUTCString() +'\n\
Server: Custom HTTP Server\n\
Last-Modified: '+server_started+'\n\
Content-Length: '+contentLength+'\n\
Connection: close\n\
Content-Type: '+contentType
}

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        // sock.write('You said "' + data + '"');
        var found = data.toString().match('GET ([a-zA-Z\/\.]*)');
        var path = '';
        if(found != null && found.length > 0){
          path = found[1];
        }
        console.log('requesting', path);
        var body = '';
        var type = 'text/html';
        var status = 200;
        
        switch(path){
            case '/':
                body = renderResponse('index.html');
                break;
            case '/hydrogen.html':
                body = renderResponse('hydrogen.html');
                break;
            case '/helium.html':
                body = renderResponse('helium.html');
                break;
            case '/css/styles.css':
                body = renderResponse('css/styles.css');
                type = 'text/css';
                break;
            default:
                body = renderResponse('404.html');
                status = 404;

        }

        // send headers
        sock.write( responseHeaders(status, type, body.length) );
        sock.write( '\n\n'+body );

        sock.end();
    });

    sock.on('close', function () {
        
    })
    
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);