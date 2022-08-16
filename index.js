import express from 'express';
import mongoose from 'mongoose';

import { Server } from 'socket.io';

import PhoneSchema from './models/Phone.js';

const app = express();
const port = 8000;

// const server = app.listen(process.env.PORT || port, (err) => {
const server = app.listen(process.env.PORT || port, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server start');
});

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
});

// const mongoDB = process.env.MONGODB_URI;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('mongoDB connected')

    io.sockets.on('connection', async (socket) => {

      console.log("Socket Connected");

      // PhoneSchema.find().then(result => {
      //   console.log(result)
      //   socket.broadcast.emit('result-number', result);
      // })


      // socket.on('newPhoneNumber', number => {
      //   const numbers = new PhoneSchema({ number });

      //   numbers.save().then(() => {
      //     io.emit('numbers', number)
      //   })
      // })

      const phoneCollections = await PhoneSchema.getNumber();

      io.sockets.emit('result-number', { phone: phoneCollections });

      socket.on('newPhoneNumber', async (data) => {
        await PhoneSchema.insertNumber(data);

        const phoneCollections = await PhoneSchema.getNumber();

        console.log("phoneCollections", phoneCollections);

        io.sockets.emit('result-number', { phone: phoneCollections })
      })

    });
  })
  .catch(err => console.log(err))

