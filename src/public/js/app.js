const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');

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
  socket.send(input.value); //내가input에써서 submit한 메시지 서버로 보냄
  input.value = '';
};
messageForm.addEventListener('submit', handleSubmit);
