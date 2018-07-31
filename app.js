var express = require("express");
var app = express();
var http = require("http").Server(app);

//socket 加载
var io = require("socket.io")(http);

//配置端口号
var port = (process.env.PORT || 8021);

var usocket = []; //用户名

//静态文件加载
app.use('/public', express.static('public'));

app.get("/",function (req,res,next) {
    res.sendFile( __dirname + "/views/index.html" )
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    //监听用户
    socket.on("join",function (name) {
        usocket[name] = socket;
        io.emit("join", name);   //服务端通过广播将新用户发送给全体群聊成员
        //console.log(usocket);
    })

    //监听消息
    socket.on("msg",function (msg,name) {
      io.emit("msg",{msg,name});
    })
});

http.listen(port);



