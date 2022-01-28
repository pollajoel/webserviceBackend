var http = require('http');
var url = require('url');


const NumeroGroupe = 1;
var portRegisterServer = 1337;
var portInterServer1 = 8000 + NumeroGroupe;
var portClient1 = 80 + NumeroGroupe; 
var host2 = "localhost";²


var messages = [];
var usersList = [];

var clientRequestHandler = function(req, res){
    var path = req.url.split('?')[0];
    if(!path || path =='/'){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
    }else{
        if(req.method == 'GET'){


         

            if( path=="/chat" || path=="/chat/"){
                res.writeHead(404, {'Content-type': 'application/json'});
                res.end('{message : "error"}');
                console.log( path )
            }else{
            if( path.match(/\/chat\/([a-z A-Z 0-9]+)/)){
                    const pathInput = path.match(/\/chat\/([a-z A-Z 0-9]+)/).input;
                    const To = pathInput.split("/")[2].toString();
                    const from = req.headers.from;                   
                    const data = messages.filter(elt=>elt.to==To && elt.from==from);
                    res.writeHead(200,  {'Content-type': 'application/json'});
                    res.end(JSON.stringify(data));
                
            }
        }

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
            }   

        }else if(req.method == 'POST'){
            if( path=="/chat"){
                res.writeHead(400, {'Content-type': 'application/json'});
                res.end('{message : "error"}');
            }
            if( path.match(/\/chat\/([a-z A-Z 0-9]+)/)){
                const pathInput = path.match(/\/chat\/([a-z A-Z 0-9]+)/).input;
                const To = pathInput.split("/")[2].toString();     
                
                if( !req.headers.from ){
                    res.writeHead(500, {'Content-type': 'application/json'});
                    res.end(`{"message":"erreur parametre 'from' requis"}`);
                }else{ 
                    
                    if( !usersList ){
                        res.writeHead(500, {'Content-type': 'application/json'});
                        res.end('{error : "Forbidden..."}');
                    }
                    const istTo  = usersList.find( elt => elt.name == To );
                    const isFrom = usersList.find( elt => elt.name == req.headers.from );       
                    console.log( usersList );
                    var options = {
                            port : istTo?.port,
                            hostname : istTo?.host,
                            host : istTo?.host + ':' + istTo?.port,
                            path : path,
                            method : req.method,
                            headers:{
                                "from":req.headers.from,
                                "To":To
                            }
                        };

                        if(!istTo ||  !isFrom) {
                            res.writeHead(500, {'Content-type': 'application/json'});
                            res.end('{error : "Forbidden"}');
                        }else{

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
                        let data = JSON.parse(val);
                        usersList = data;
                        console.log( data );
                        res.end(val);
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
            
            if( path.match(/\/chat\/([a-z A-Z 0-9]+)/)){
                var body ="";
                res.writeHead(204, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    body += data.toString();
                    console.log( body )
                });
                req.on('end', function(){
                    messages.push({
                        message: body,
                        to: req.headers.to,
                        from: req.headers.from
                    });
                    res.end('{status : "ok...."}');
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