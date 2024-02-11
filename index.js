const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
app.set('view engine', 'ejs');
// socket io connection server side
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const { ExpressPeerServer } = require('peer');
const opinions = {
  debug: true,
};

app.use('/peerjs', ExpressPeerServer(server, opinions));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});
// connection
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    console.log(roomId, userId, userName);
    setTimeout(() => {
      // socket.to(roomId).broadcast.emit('user-connected', userId);
      socket.broadcast.to(roomId).emit('user-connected', userId);
    }, 1000);
    // message
    socket.on('message', message => {
      console.log(message);
      io.to(roomId).emit('createMessage', message, userName);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// new set up
// const express = require('express');
// const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const { v4: uuidV4 } = require('uuid');

// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`);
// });

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room });
// });
// commented chilo
// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     console.log(roomId, userId);
//     socket.join(roomId);
//     // socket.to(roomId).broadcast.emit('user-connected', userId);
//     const room = socket.to(roomId);
//     if (room && room.broadcast) {
//       room.broadcast.emit('user-connected', userId);
//     } else {
//       console.error(
//         'Unable to emit user-connected event: room or broadcast is undefined.'
//       );
//     }
//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId);
//     });
//   });
// });
// commented chilo
// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     console.log(roomId, userId);
//     socket.join(roomId);
//     const room = io.sockets.adapter.rooms.get(roomId);
//     if (room && room.size > 1) {
//       io.to(roomId).emit('user-connected', userId);
//       // socket.to(roomId).broadcast.emit('user-connected', userId);
//     } else {
//       console.error('Room is empty or undefined.');
//       // console.error(
//       //   'Unable to emit user-connected event: room is empty or undefined.'
//       // );
//     }
//     socket.on('disconnect', () => {
//       if (room && room.size > 1) {
//         io.to(roomId).emit('user-disconnected', userId);
//         // socket.to(roomId).broadcast.emit('user-disconnected', userId);
//       }
//     });
//   });
// });

// server.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });
