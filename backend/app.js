// backend ke start karne ke liye   npx nodemon


import express from 'express' ;

    
import morgan from 'morgan';    // koisa bhi route agar hit ho to mai chahta hu uska log hit ho jae   --> npm i morgan

import connect from './db/db.js';

import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js' ;
import aiRoutes from './routes/ai.routes.js' ;


import cookieParser from 'cookie-parser';

import cors from 'cors' ;

connect();


const app = express() ;

app.use(cors()) ;
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true})) ;
app.use(cookieParser()) ;


app.use('/users', userRoutes) ;
app.use('/projects', projectRoutes) ;


app.use('/ai', aiRoutes) ;


app.get('/', (req, res) => {           // listen ham log yaha pe nhi karwa rhe    server.js me karwaya h
    res.send('Hello World!');   
})

export default app ;