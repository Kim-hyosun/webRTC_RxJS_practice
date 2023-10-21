import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
  socket.onAny((e) => {
    console.log(`소켓이벤트: ${e}`);
  });
  socket.on('enter_room', (roomName, FEcallback) => {
    socket.join(roomName);
    FEcallback(); //프론트에서 보낸 콜백을 서버에서 실행
    socket.to(roomName).emit('welcome');
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye');
    });
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', msg);
    done();
  });
});

//ws보다 socketIO가 좋은점
//1. 이벤트 커스텀 가능(send만 쓰지 않아도 됨)
//2. front에서 object, 인자를 원하는만큼 전송가능(ws는 string만가능)
//3. 프론트에서 입력한 콜백을 서버로부터 실행할수 있음(콜백함수는 emit의 마지막 인수이어야 함)
//4. 서버연결 끊기면 알아서 재연결 시도함

httpServer.listen(3000, handleListen);

/* 
//ws 를 이용한 연결
import WebSocket from 'ws';
const wss = new WebSocket.Server({ server });

const sockets = []; //사용자 연결위해

wss.on('connection', (socket) => {
  //@socket : 브라우저로의 연결
  sockets.push(socket);
  socket['nickname'] = 'Anonymous';
  console.log('connected to browser');
  socket.on('close', () => console.log('브라우저와 연결이 끊어졌습니다.'));
  socket.on('message', (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case 'nickname':
        socket['nickname'] = message.payload;
    }
    //프론트에서 서버로 받은 메시지 바로 프론트로 보냄
  });
}); */
