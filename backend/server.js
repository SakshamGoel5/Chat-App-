import dotenv from 'dotenv/config';     // ham es6 use kar rhe h isliye env aise use kara
// dotenv.config() ;    // isse .env use kar sakte h

import http from 'http' ;       // ham socket io use karenge aur socket io jo h agar http module se create karenge to kaafi easily integrate ho jata h
import app from './app.js';
import jwt from 'jsonwebtoken' ;
import {Server} from 'socket.io';
import mongoose from 'mongoose';

import Project from './models/project.model.js';

import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 8000 ;  
const server = http.createServer(app) ;

const io = new Server(server, {
    cors: {
        origin: '*',
    }
}) ;

io.use(async(socket, next) => {     // ye wala taaki khali authenticated user hi socket io me aaye
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1] ;
    
        const projectId = socket.handshake.query.projectId ;

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error('Invalid Project Id')) ;
        }

        socket.project = await Project.findById(projectId) ;

        if(!token){
            return next(new Error('Authentication error')) ;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
        if(!decoded){
            return next(new Error('Authentication error')) ;
        }

        socket.user = decoded ;    

        next() ;
    }
    catch(error){
        next(error) ;
    }
});  // middleware use kar sakte h socket io me


io.on('connection', socket => {
  socket.roomId = socket.project._id.toString()

  console.log('a user connected');
 

  socket.join(socket.roomId) ; // jaise hi socket connect hoga ek client server se connect hoga with the help of web socket to authenticate to ho hi raha tha saath hi saath ham usko ye bhi bata rhe h ki wo kis particular project se connect hoga
  

//   socket.on('project-message', data => {

//     console.log(data) ;
//     socket.broadcast.to(socket.roomId).emit('project-message', data) ;  // ye wala data jo h wo broadcast karega to saare users ko jo us project me honge
//     // io.to(socket.roomId).emit('project-message', data) ;  // isse sab ko jaega aur khud ko bhi jaega
    
//   } )

// socket.on('project-message', data => {
//     const message = data.message ;
//     const aiIsPresentInMessage = message.includes('@ai') ;

//     if(aiIsPresentInMessage){
//         socket.emit('project-message', {
//             sender: data.sender,
//             message: "AI is present in the message" 
//         })
//         return ;
//     }
//     socket.broadcast.to(socket.roomId).emit('project-message', data) ;  // ye wala data jo h wo broadcast karega to saare users ko jo us project me honge
//     // io.to(socket.roomId).emit('project-message', data) ;  // isse sab ko jaega aur khud ko bhi jaega
//   } )

socket.on('project-message',async data => {
    const message = data.message ;
    const aiIsPresentInMessage = message.includes('@ai') ;
    socket.broadcast.to(socket.roomId).emit('project-message', data) ;  // ye wala data jo h wo broadcast karega to saare users ko jo us project me honge
    // io.to(socket.roomId).emit('project-message', data) ;  // isse sab ko jaega aur khud ko bhi jaega
    if(aiIsPresentInMessage){
        const prompt = message.replace('@ai', '') ;
        const result = await generateResult(prompt);
        
        io.to(socket.roomId).emit('project-message', {
            message: result,
            sender: {
                _id: 'ai',
                email: 'AI'
            }
        })

        return ;
    }
  
} )


  socket.on('disconnect', () => { 
        // jab ek user aap se disconnect ho jaega to aapko user ko room se nikalna hoga
        console.log('user disconnected') ;
        socket.leave(socket.roomId) ;
   });
});



server.listen(port, () => {                 // to check this open postman       get   http://localhost:8000
    console.log('Server is running on port -->  ' + port) ;
})

// to run server     cd backend     npx nodemon