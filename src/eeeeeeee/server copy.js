import http from "http";
import SocketIO from "socket.io";
// import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/",(req,res) => res.render("home"));
app.get("/*",(req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on httP://localhost:3000`)

const httpServer =  http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets:{
            adapter: {sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) =>{
    socket["nickname"] = "익명";
    socket.on("enter_room", (roomName,showRoom) => {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change",publicRooms());
    });
    
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room)- 1)
        );
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change",publicRooms());
    })

    socket.on("new_message", (msg,room,done) =>{
        socket.to(room).emit("new_message",`${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname",(nickname) => (socket["nickname"] = nickname));
});

// const wss = new WebSocket.Server({server});

/*const sockets = [];
wss.on("connection",(socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명";
    console.log("Connected to Browser");
    socket.on("close",()=> console.log("Disconnected from Server ❌"));
    socket.on("message", (msg) => {
        const translatedMessageData = msg.toString('utf8');
        const message = JSON.parse(translatedMessageData);
        switch(message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        } 
    });    
});*/

httpServer.listen(3000, handleListen)
