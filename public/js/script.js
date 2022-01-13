const socket = io();

// Elements
const $formElement = document.querySelector(".message-form");
const $formInput = $formElement.querySelector("input");
const $formButton = $formElement.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate = document.querySelector("#location-template").innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// search query
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


const autoScroll = () => {
  //new message
  const $newMessage = $messages.lastElementChild;

  //height of the new messsage
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  //visible height
  const visibleHeight = $messages.offsetHeight;

  //messages container height 
  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }

  console.log(containerHeight);
}

$formElement.addEventListener("submit", e => {
  e.preventDefault();
  $formButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (deliverReport) => {
    $formButton.removeAttribute("disabled");
    $formInput.value = ""
    $formInput.focus();
    console.log(deliverReport);
  });
})

$locationButton.addEventListener("click", e => {
  e.preventDefault();
  $locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Location is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((location) => {
    const { coords: { longitude, latitude } } = location;
    console.log(longitude);
    socket.emit("sendLocation", { longitude, latitude }, () => {
      $locationButton.removeAttribute("disabled");
      console.log("Location Shared");
    });
  })
})

socket.on("message", message => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
})

socket.on("locationMessage", message => {
  console.log(message);
  const html = Mustache.render($locationTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
})

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate, {
    room, users
  });
  document.querySelector(".chat__sidebar").innerHTML = html;
})

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = "/";
  }
});