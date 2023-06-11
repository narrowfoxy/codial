var socket = io("http://localhost:3000");
var user = document.getElementById("socket");
const juser = $("#socket")
socket.on("connection_done", function (args) {
  socket.emit('join', {email: user.email});
});