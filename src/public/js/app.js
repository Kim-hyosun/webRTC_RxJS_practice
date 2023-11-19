const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

const call = document.querySelector('#call');

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

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

const handleCameraChange = async () => {
  await getMedia(camerasSelect.value); //내가 선택한 카메라로 실행
};

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        //내가 선택한 카메라와 일치하는 label을 selected로 표시 하도록
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
    //console.log(cameras);
  } catch (err) {
    console.log(err);
  }
};

const getMedia = async (deviceId) => {
  const initialConstrains = {
    //카메라 선택안했을때 초기 설정
    audio: true,
    video: { facingMode: 'user' },
  };
  const changedConstrains = {
    //카메라 선택했을때
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? changedConstrains : initialConstrains
    );
    //console.log(myStream);
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (err) {
    console.log(err);
  }
};

//getMedia();

//room을 입력해서 입장
const welcome = document.querySelector('#welcome');
const welcomeForm = welcome.querySelector('form');

const startMedia = () => {
  welcome.hidden = true;
  call.hidden = false;
  getMedia(); //스트림 등 모든것을 호출
};

const handleWelcomeSubmit = (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector('input');
  socket.emit('join_room', input.value, startMedia);
  roomName = input.value;
  input.value = '';
};

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

//socket
socket.on('welcome', () => {
  console.log('누군가 입장했습니다.');
});

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
