const socket = io();

//Elements
const $chatMessageForm = document.querySelector("#chat-message");
const $chatMessageFormInput = document.querySelector("input");
const $chatSendButton = document.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sideBarTemplate = document.querySelector("#sideBar-template").innerHTML;

//Options
const { displayName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const audioPlay =()=>{
  const audio = new Audio('http://commondatastorage.googleapis.com/codeskulptor-assets/Collision8-Bit.ogg');
  audio.play();
}
const autoScroll =()=>{
  //new message element
  const $newMessage = $messages.lastElementChild;

  //Height of new message
  const newMessageStyles = getComputedStyle($newMessage)

  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  //Visible height
  const visibleHeight = $messages.offsetHeight

  //Height of message container
  const containerHeight =$messages.scrollHeight

  //How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  // if(containerHeight- newMessageHeight <= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight
  // }

}





socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

socket.on("message", (message) => {
  audioPlay();
  const html = Mustache.render(messageTemplate, {
    displayName: message.displayName,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll()
});

socket.on("location-url", (locationUrl) => {
  audioPlay();
  const html = Mustache.render(locationTemplate, {
    displayName: message.displayName,
    url: locationUrl.locationText,
    createdAt: moment(locationUrl.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll()
});

$chatMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $chatSendButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("message", message, (error) => {
    $chatSendButton.removeAttribute("disabled", "disabled");
    $chatMessageFormInput.value = "";
    $chatMessageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message was delivered");
  });
});

$sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation!!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position)
    $sendLocation.setAttribute("disabled", "disabled");
    const userLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("sendLocation", userLocation, () => {
      console.log("Location was shared successfully");
      $sendLocation.removeAttribute("disabled", "disabled");
    });
  
  });
});

socket.emit("join", { displayName, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
