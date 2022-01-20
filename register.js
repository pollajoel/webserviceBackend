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
const TimeTorestart = 30000;


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
                    infos = data.toString();
                });
                req.on('end', function(){
                    let UserToRegister = JSON.parse(infos);
                    if(UserToRegister.port && UserToRegister.host && UserToRegister.name){
                        let isPresent = usersList.find( user => (user.host == UserToRegister.host && user.port == UserToRegister.port) || user.name == UserToRegister.name)
                        if(!isPresent){
                            usersList.push(JSON.parse(infos));                    
                        }
                        let data = JSON.stringify(usersList);
                        isPresent ? res.end(`{"message":"cet utilisateur existe déjà dans le registre"}`) : res.end(`{"message":"Utilisateur connecté", "users":${data}}`.toString());
                    }else{
                        res.end(`{"message":"wrong parameter"}`)
                    }
                });  
            }else if(path == '/logout'){
                var infos = {
                    name:"",
                    host:"",
                    port:""
                };
                res.writeHead(200, {'Content-type': 'application/json'});
                req.on('data', function(data){
                    infos = data.toString();
                });
                req.on('end', function(){
                    let UserLogout = JSON.parse(infos);
                    let userDelete = false;
                    if(UserLogout.port && UserLogout.host && UserLogout.name){
                        let user = usersList.find(x => x.name == UserLogout.name); 
                        if(user){
                            let indexOfUserDelete = usersList.indexOf(user);
                            usersList.splice(indexOfUserDelete, 1);
                            userDelete = true;                 
                        }                       
                    }
                    let data = JSON.stringify(UserLogout);

                    userDelete ? res.end(`{"message":"L'utilisateur suivant a bien déconnecté", "user":${data}}`.toString()) : res.end(`{"message":"cet utilisateur n'est pas encore connecté"}`);
                });  
            }else{
                // TODO
            }           
        }else if(req.method == 'GET'){            
            if(path == '/users'){
                let data = JSON.stringify(usersList);
                res.writeHead(200, {'Content-type': 'application/json'});
                res.end(`{"data":${data}}`.toString());
            }else{
                res.writeHead(404, {'Content-type': 'application/json'});
                res.end('{message : "page not found"}');
            }
        }
        else{
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end('{message : "page not found"}');
        }
    }
}


var registerServer = http.createServer(interServerRequestHandlerRegister);

registerServer.listen(portRegisterServer);