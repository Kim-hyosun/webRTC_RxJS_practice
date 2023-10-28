const socket = io();

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
});
/* const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

const makeMassage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};
const socket = new WebSocket(`ws://${window.location.host}`); //서버로의 연결

socket.addEventListener('open', () => {
  console.log('connected to server');
});

socket.addEventListener('message', (msg) => {
  //입력한 채팅을 화면에 표시
  const li = document.createElement('li');
  li.innerText = msg.data;
  messageList.appendChild(li);
});

socket.addEventListener('close', () => {
  console.log('연결이 끊어졌습니다.');
});

const handleSubmit = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMassage('new_message', input.value)); //내가input에써서 submit한 메시지 서버로 보냄
  input.value = '';
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMassage('nickname', input.value));
  input.value = '';
};
messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
 */
