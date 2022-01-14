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


var interServerRequestHandlerRegister = function(req, res){
    var path = req.url.split('?')[0];
    if(!path || path =='/'){
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end('{message : "page not found"}');
    }else{
        if(req.method == 'POST'){
            if(path == '/register'){
                var infos = {
                    name:"",
                    host:"",
                    port:""
                };
                res.writeHead(200, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    infos = data;
                });
                req.on('end', function(){
                    let isUserExist = usersList.some(user => user.toString() == infos.toString());
                    if(!isUserExist){
                        usersList.push(infos);                    
                    }

                    isUserExist ? res.end("cet utilisateur existe déjà dans le registre") : res.end(["Utilisateur connecté", usersList].toString());
                });  
            }else if(path == '/logout'){
                // TODO
            }else{
                // TODO
            }           
        }else{
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end('{message : "page not found"}');
        }
    }
}

var registerServer = http.createServer(interServerRequestHandlerRegister);

registerServer.listen(portRegisterServer);