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
  const input = room.querySelector('input');
  let value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`me: ${value}`);
  });
  input.value = '';
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerHTML = `Room ${roomName}`;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit(
    'enter_room',
    input.value,
    showRoom //인수는 순차 실행됨
  );
  roomName = input.value;
  input.value = '';
};

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
  addMessage(`???님이 ??방에 입장하였습니다.`);
});

socket.on('bye', () => {
  addMessage(`???님이 ??방에 퇴장하였습니다.`);
});

socket.on('new_message', addMessage);
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
