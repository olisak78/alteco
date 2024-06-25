const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket: any) => {
  console.log(`Connected! ${socket.id}`);

  socket.on('statusUpdated', (data: any) => {
    console.log(`Status Updated! ${data}`);
    socket.broadcast.emit('updateEstablished', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(80, () => {
  console.log(`The Websocket Server is listening on port 80`);
});
