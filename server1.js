var http = require('http');
var url = require('url');

var portInterServer1 = 8080;
var portInterServer2 = 8081;
var portRegisterServer = 8082;

var portClient1 = 8000;
var portClient2 = 8001;

var host1 = "localhost";
var host2 = "localhost";
var hostRegister = "localhost";

var messages = {};
var usersList = [];

var clientRequestHandler = function(req, res){
    var path = req.url.split('?')[0];
    if(!path || path =='/'){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
    }else{
        if(req.method == 'GET'){
            res.writeHead(200, {'Content-type': 'application/json'});
            if(!messages[path]){
                res.end(JSON.stringify([]));
            }else{
                res.end(JSON.stringify(messages[path]));
                messages[path] = 0;
                delete messages[path];
            }    
        }else if(req.method == 'POST'){
            if(path == '/register'){                
                var options = {
                    port : portRegisterServer,
                    hostname : host2,
                    host : host2 + ':' + portRegisterServer,
                    path : path,
                    method : req.method
                }
                
                var request = http.request(options, function(response){
                    response.on("error", function(e){
                        console.log(e);
                        res.writeHead(500, {'Content-type': 'application/json'});
                        res.end(e.toString());
                    });
                    response.on("data", function(data){
                        usersList = data.toString();
                    });
                    response.on('end', function(){
                        res.writeHead(200, {'Content-type': 'application/json'});
                        res.end(usersList);
                    });
                });
                request.on("error", function(e){
                    console.log(e);
                    res.writeHead(500, {'Content-type': 'application/json'});
                    res.end(e.toString());
                });
                req.pipe(request); 
            }
            if(path == '/connectuser'){

            }
            // if(path.match(/\/sendmessage/\/([a-z A-Z 0-9]+)/){

            // }
            if(path == '/getmessage'){

            }
            if(path == '/logout'){

            }
           
            // var options = {
            //     port : portRegisterServer,
            //     hostname : host2,
            //     host : host2 + ':' + portInterServer2,
            //     path : path,
            //     method : req.method
            // };
            // var request = http.request(options, function(response){
            //     var body = '';
            //     response.on("error", function(e){
            //         console.log(e);
            //         res.writeHead(500, {'Content-type': 'application/json'});
            //         res.end(e);
            //     });
            //     response.on("data", function(data){
            //         body += data.toString();
            //     });
            //     response.on('end', function(){
            //         res.writeHead(200, {'Content-type': 'application/json'});
            //         res.end(body);
            //     });
            // });
            // request.on("error", function(e){
            //     console.log(e);
            //     res.writeHead(500, {'Content-type': 'application/json'});
            //     res.end(e);
            // });
            // req.pipe(request); 
        }else{
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end('{message : "page not found"}');
        }
    }
}
var interServerRequestHandler = function(req, res){
    var path = req.url.split('?')[0];
    if(!path || path =='/'){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
    }else{
        if(req.method == 'POST'){
            var body = '';
            res.writeHead(200, {'Content-type': 'application/json'});
            req.on('data', function(data){
                body += data.toString();
            });
            req.on('end', function(){
                if(!messages[path]){
                    messages[path] = [];
                }
                messages[path].push(body);
                res.end('{status : "ok"}');
            });  
        }else{
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end('{message : "page not found"}');
        }
    }
}

function arrayBufferToString(buffer){

    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2,16)-1;

    for(var i = 0;i<length;i+=addition){

        if(i + addition > length){
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
    }

    console.log("fonc => "+ result.toString() )
    return result;

}

var clientServer = http.createServer(clientRequestHandler);
var interServer = http.createServer(interServerRequestHandler);
clientServer.listen(portClient1);
interServer.listen(portInterServer1);
