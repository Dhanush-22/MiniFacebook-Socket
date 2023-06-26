// const io = require("socket.io")(8900,{
//     cors:{
//         origin:"https://dhanush-minisocialmedia.onrender.com"
//     }
// });


const io = require('socket.io')(https, {
    cors: {
        origin:"https://dhanush-minisocialmedia.onrender.com",
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });


let users = []

const addUser = (userId,socketId)=>{
    !users.some((user)=>user.userId === userId) && 
        users.push({userId,socketId})
}

const removeUser = (socketId)=>{
    users = users.filter((user)=>user.socketId !== socketId);
}

const getUser = (userId)=>{
    return users.find((user)=>user.userId === userId)
}

io.on("connection", (socket) => {
    // When connected
    console.log("A user connected");
    socket.on("addUser", userId=>{
        addUser(userId, socket.id);
        io.emit("getUsers",users);
    });

    // send and get message
socket.on("sendMessage",({senderId, receiverId, text})=>{
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage",{
        senderId,
        text
    });
});


    // When disconnected
    socket.on("disconnect",()=>{
        console.log("A user disconnected.");
        removeUser(socket.id);
        io.emit("getUsers",users);
    });
})