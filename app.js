var express = require("express");
var app = express();
var http = require("http").Server(app);

//socket 加载
var io = require("socket.io")(http);

//配置端口号
var port = (process.env.PORT || 8021);

var usocket = [];
var ediuser = [];   //修改的用户
var userall = [];   //存储在线聊天用户；

//静态文件加载
app.use('/public', express.static('public'));

app.get("/",function (req,res,next) {
    res.sendFile( __dirname + "/views/index.html" )
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    //监听用户
    socket.on("join",function (name) {
        //usocket[name] = socket;
        //判断用户名是否在数组中，没有就添加用户，并广播；没有则不添加不广播
        if( !isInArray(userall,name) ){
            userall.push(name);
            isRepeat(userall);                      //数组去重
            io.emit("join", name);                  //服务端通过广播将新用户发送给全体群聊成员
            console.log(userall);
        }
        //不管用户是否存在，都要广播在线人数
        io.emit("connected",userall.length);

    })

    //修改昵称
    socket.on("editname",function (name) {
        //从数组中删除旧用户名
        userall.push(name.newname);
        removeVlaue(userall,name.oldname);
        var userCount = userall.length;
        console.log(userall);
        io.emit("editname", {name,userCount});   //服务端通过广播将新用户发送给全体群聊成员
    })

    //监听消息
    socket.on("msg",function ( msgContent ) {
      io.emit("msg",msgContent);
    })
});

http.listen(port);


/*数组去重*/
function isRepeat(arr){
    var narr = arr.sort();

    for( var i=0; i<narr.length; i++ ){
        if( narr[i] == narr[i+1] ){
            narr.splice(i,1);
        }
    }
    return narr;
}

/*判断元素是否在数组中*/
function isInArray(arr,value) {
    for(var i=0; i<arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

/*从数组中去指定元素*/
function removeVlaue(arr,value){
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}