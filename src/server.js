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
httpServer.listen(3000, handleListen);


