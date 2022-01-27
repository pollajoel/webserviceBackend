var http = require('http');
var url = require('url');


const NumeroGroupe = parseInt( process.argv[2] );
var portRegisterServer = 1337;
var portInterServer1 = 8000 + NumeroGroupe;
var portClient1 = 80 + NumeroGroupe; 
var host2 = "localhost";


var messages = [];
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
                console.log( path.match(/\/chat\/([a-z A-Z 0-9]+)/)  );

                if( !req.headers.from ){
                    res.writeHead(500, {'Content-type': 'application/json'});
                    res.end(`{"message":"erreur parametre 'from' requis"}`);
                }else{        
                        var options = {
                            port : portClient1,
                            hostname : host2,
                            //host : host2 + ':' + portInterServer1,
                            path : path,
                            method : req.method,
                            headers:{
                                "from":req.headers.from,
                                "To":To
                            }
                        };

                        console.log(JSON.parse(usersList) );

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
                        
                        request.on("error", function(e){
                            //console.log(e);
                            res.writeHead(500, {'Content-type': 'application/json'});
                            res.end(`{"message":"error.."}`);
                        });
                                         
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
                    path : path
                }
               
                    
                    var val =""
                    req.on("error", function(e){
                        //console.log(e);
                        res.writeHead(500, {'Content-type': 'application/json'});
                        res.end(e.toString());
                    });
                    req.on("data", function(data){
                        val += data.toString();
                    });
                    req.on('end', function(){
                        res.end(val);
                        console.log( val )
                        console.log("PING.....")
                    })
                
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
            if(path == "/ping"){
                var body = '';
                res.writeHead(200, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    body += data.toString();
                });
                req.on('end', function(){
                    res.end('{status : "ok...."}');
                    let  data = JSON.parse( body );
                    console.log( data )

                }); 


            }    
            if( path.match(/\/chat\/([a-z A-Z 0-9]+)/)){
                var body ="";
                res.writeHead(200, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    body += data.toString();
                    console.log( body )
                });
                req.on('end', function(){
                    messages.push({
                        message: body,
                        to: req.headers.To,
                        from: req.headers.from
                    });

                    console.log( messages );

                })

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