const express=require('express');
const path=require('path');
let app=express();
let server=require('http').createServer(app);
let io=require('socket.io').listen(server);
const publicPath=path.join(__dirname+'/public');
const port=process.enev.PORT ||3000;
console.log(publicPath);
users=[]
connections=[]
server.listen(port,()=>{
    console.log(`server is up on port ${port} `);
});
app.use(express.static(publicPath));
io.sockets.on('connection',(socket)=>{
    connections.push(socket);
    console.log(`CONNECTED:${connections.length} sockets connected`)
    socket.on('disconnect',(data)=>{
        users.splice(users.indexOf(socket.username),1)
        updateUsernames();
        connections.splice(connections.indexOf(socket),1)
        console.log(`DISCONNECTED:${connections.length} sockets connected`)
    })
    socket.on('send message',(data)=>{
        console.log(data)
        io.sockets.emit('new message',{msg:data,user:socket.username})
    })
    socket.on('new user',(data,callback)=>{
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUsernames();
    })
    function updateUsernames(){
        io.sockets.emit('get users',users)
    }
    
})