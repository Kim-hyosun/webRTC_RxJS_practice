import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on localhost:3000`);

const server = http.createServer(app);

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
});

server.listen(3000, handleListen);
