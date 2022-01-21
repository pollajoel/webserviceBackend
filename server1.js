var http = require('http');
var url = require('url');

var portInterServer1 = 8080;
var portInterServer2 = 8081;
var portRegisterServer = 8082;

var portClient1 = 8000;
var portClient2 = 8001;

var host = "localhost";
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
            if(path == '/users'){
                const options = {
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
                        res.end(e);
                    });
                    response.on("data", function(data){
                        usersList = data.toString();
                    });
                    response.on('end', function(){
                        res.writeHead(200, {'Content-type': 'application/json'});
                        res.end(usersList);
                    });
                });

                req.pipe(request);
            }else if(!messages[path]){
                res.end(JSON.stringify([]));
            }else{
                res.end(JSON.stringify(messages[path]));
                messages[path] = 0;
                delete messages[path];
            }    
        }else if(req.method == 'POST'){
            if( path=="/chat"){
                res.writeHead(400, {'Content-type': 'application/json'});
                res.end('{message : "error"}');
            }
            if( path.match(/\/chat\/([a-z A-Z 0-9]+)/)){
                const pathInput = path.match(/\/chat\/([a-z A-Z 0-9]+)/).input;
                const To = pathInput.split("/")[2];                           
                if( !req.headers.from ){
                    res.writeHead(500, {'Content-type': 'application/json'});
                    res.end(`{"message":"erreur parametre 'from' requis"}`);
                }else{        
                    let emetteur = usersList.find(x => x.name == req.headers.from);          
                    let destinataire = usersList.find(x => x.name == To);
                    if(emetteur && destinataire){
                        var options = {
                            port : portInterServer1,
                            hostname : host2,
                            host : host2 + ':' + portInterServer1,
                            path : path,
                            method : req.method,
                            headers:{
                                "from":req.headers.from,
                                "To":To
                            }
                        };
                        var request = http.request(options, function(response){
                            var body = '';
                            response.on("error", function(e){
                                console.log(e);
                                res.writeHead(500, {'Content-type': 'application/json'});
                                res.end(e);
                            });
                            response.on("data", function(data){
                                body += data.toString();
                            });
                            response.on('end', function(){
                                res.writeHead(200, {'Content-type': 'application/json'});
                                res.end(body);
                            });
                        });
                        request.on("error", function(e){
                            console.log(e);
                            res.writeHead(500, {'Content-type': 'application/json'});
                            res.end(e);
                        });
                        req.pipe(request);
                    }else if(!emetteur){
                        request.on("error", function(e){
                            //console.log(e);
                            res.writeHead(500, {'Content-type': 'application/json'});
                            res.end(`{"message":"Veuillez vous connecter au serveur"}`);
                        });
                    }else{
                        request.on("error", function(e){
                            //console.log(e);
                            res.writeHead(500, {'Content-type': 'application/json'});
                            res.end(`{"message":"${To} n'est pas connecté"}`);
                        });
                    }                         
                }   
            }

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
                        let arrayUsers = usersList.split(',');
                        arrayUsers.length > 1 ? res.writeHead(200, {'Content-type': 'application/json'}) : res.writeHead(500, {'Content-type': 'application/json'});
                        
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

            if(path == '/ping'){
                var options = {
                    method: req.method,
                    port : req.headers.port,
                    hostname :req.headers.host,
                    host : req.headers.host + ':' + req.headers.port,
                    path : path,
                }
                var request = http.request(options, function(response){
                    var val =""
                    response.on("error", function(e){
                        //console.log(e);
                        res.writeHead(500, {'Content-type': 'application/json'});
                        res.end(e.toString());
                    });
                    response.on("data", function(data){
                        val += data.toString();
                    });
                    response.on('end', function(){
                        res.end(val);
                    })
                });
                request.on("error", function(e){
                    //console.log(e);
                    res.writeHead(500, {'Content-type': 'application/json'});
                    res.end(e.toString());
                });
                req.pipe(request); 
            }
    
            if(path == '/logout'){
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
                        let arrayUsers = usersList.split(',');
                        arrayUsers.length > 1 ? res.writeHead(200, {'Content-type': 'application/json'}) : res.writeHead(500, {'Content-type': 'application/json'});
                        
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
            if(path = "/ping"){
                var body = '';
                res.writeHead(200, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    body += data.toString();
                });
                req.on('end', function(){
                    usersList = body;
                    console.log(usersList)
                    res.end('{status : "ok"}');
                }); 
            }             
        }else{
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end('{message : "page not found"}');
        }
    }
}

var clientServer = http.createServer(clientRequestHandler);
var interServer = http.createServer(interServerRequestHandler);
clientServer.listen(portClient1);
interServer.listen(portInterServer1);