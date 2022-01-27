var http = require('http');
var url = require('url');

var portRegisterServer = 1337;
var usersList = [];
const NumeroGroupe = parseInt( process.argv[2] );
const portInterServer1 = 80 + NumeroGroupe;
const host = "localhost";
const TimeTorestart = 10000;


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

function request() {
    if( usersList ){
        usersList.map(user=>{
            let options = {
                hostname: host,
                host:  host+":"+user.port,
                port : user.port,
                method : "POST",
                path: "/ping",
                headers:{
                    host:user.host,
                    port:user.port
                }
            }
            var req = http.request(options, function(res){
                var data = ""
                res.on('data', function(chunk){
                    data += chunk;
                });
                res.on('end', function(){
                    console.log( "status code ...")
                    console.log( res.statusCode)
                    if( res.statusCode=="500"){
                        let userdata = usersList.find(userTofind => userTofind.name == user.name);
                        if(userdata){
                            let indexOfUserDelete = usersList.indexOf(userdata);
                            usersList.splice(indexOfUserDelete, 1);                 
                        }
                    }
                })
            });
            req.on("error", function(e){
                //console.log( e )
                //console.log( "An error occur...." );
                let userdata = usersList.find(userTofind => userTofind.name == user.name);
                        if(userdata){
                            let indexOfUserDelete = usersList.indexOf(userdata);
                            usersList.splice(indexOfUserDelete, 1);                 
                        }
            });
            console.log( JSON.stringify(usersList) )
            req.end(JSON.stringify(usersList));
        });
    }
}
setInterval(request, TimeTorestart);
var registerServer = http.createServer(interServerRequestHandlerRegister);
registerServer.listen(portRegisterServer);