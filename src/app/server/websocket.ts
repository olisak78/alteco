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
  socket.emit('myevent', 'Hello Client');
  io.emit('hello', 'Hello Client');
  console.log(`Connected! ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(5000, () => {
  console.log(`The Websocket Server is listening on port 5000`);
});
