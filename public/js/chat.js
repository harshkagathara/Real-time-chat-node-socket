var socket = io();
var messages = document.getElementById("messages");

(function () {
  var socket = io();
  var userName;
  var userConfirm;
  socket.on("connect", function (data) {
    do {
      userName = prompt("Please enter your user name");
      userConfirm = confirm('Click "ok" to confirm your username: ' + userName);
      if (userConfirm) {
        socket.emit("join", userName);
      }
    } while (!userConfirm);
  });

  $("form").submit(function (e) {
    let li = document.createElement("li");
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#message").val());

    messages.appendChild(li).append($("#message").val());
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + userName + ": " + "just now");
    $("#message").val("");

    return false;
  });

  socket.on("received", (data) => {
    //     alert(data);
    // console.log(data);
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by " + data.sender + ": " + "just now");
    console.log("Hello bingo!");
  });
})();

// fetching initial chat messages from the database
(function () {
  fetch("/chats")
    .then((data) => {
      return data.json();
    })
    .then((json) => {
      json.map((data) => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
      });
    });
})();

//is typing...

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", (data) => {
  typing.innerText = data.user + " " + data.message;
  console.log(data.user + data.message);
});

socket.on('join', function(data) {
  $('#typing').append($('<li>').text(data));
  $('html, body').animate({
    scrollTop: $(document).height()
  });
});
