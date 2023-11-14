const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');
let myStream;
let muted = false;
let cameraOff = false;

const handleMuteClick = () => {
  //console.log(myStream.getAudioTracks());
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = '내 마이크 켜기';
    muted = true;
  } else {
    muteBtn.innerText = '내 마이크 끄기';
    muted = false;
  }
};

const handleCameraClick = () => {
  //console.log(myStream.getVideoTracks());
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = '내 카메라 끄기';
    cameraOff = false;
  } else {
    cameraBtn.innerText = '내 카메라 켜기';
    cameraOff = true;
  }
};

const handleCameraChange = () => {
  console.log(camerasSelect.value);
};

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
    //console.log(cameras);
  } catch (err) {
    console.log(err);
  }
};

const getMedia = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    //console.log(myStream);
    myFace.srcObject = myStream;
    await getCameras();
  } catch (err) {
    console.log(err);
  }
};
getMedia();

/* 
채팅 기능
const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  let value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`me: ${value}`);
  });
  input.value = '';
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#name input');

  socket.emit('nickname', input.value);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerHTML = `Room ${roomName}`;
  const msgForm = room.querySelector('#msg');
  //const nameForm = room.querySelector('#name');
  msgForm.addEventListener('submit', handleMessageSubmit);
  // nameForm.addEventListener('submit', handleNicknameSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();

  const roomInput = form.querySelector('#roomName');
  const nicknameInput = form.querySelector('#nickName');
  socket.emit(
    'enter_room',
    roomInput.value,
    nicknameInput.value,
    showRoom //인수는 순차 실행됨
  );
  roomName = roomInput.value;
  roomInput.value = '';
};

const paintRoomTitle = (roomName, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerHTML = `Room ${roomName} (현재 ${newCount}명)`;
};

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, newCount) => {
  paintRoomTitle(roomName, newCount);
  addMessage(`${user}님이 이 방에 착륙하였습니다.`);
});

socket.on('bye', (user, newCount) => {
  paintRoomTitle(roomName, newCount);
  addMessage(`${user}님이 이 방에서 나갔습니다.`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerText = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((roomtitle) => {
    const li = document.createElement('li');
    li.innerText = roomtitle;
    roomList.appendChild(li);
  });
}); */
