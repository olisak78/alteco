const { createServer } = require('http');
const { Server } = require('socket.io');

// This is the Websocket Server

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
    // Upon receiving the message from a client about Status update,
    console.log(`Status Updated! ${data}`); //    emits message to all clients with the update data received
    socket.broadcast.emit('updateEstablished', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(80, () => {
  console.log(`The Websocket Server is listening on port 80`);
});
