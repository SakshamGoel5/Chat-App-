import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authUser = async(req , res , next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1] ;
        if(!token){
            return res.status(401).send({error: 'Unauthorized User.'}) ;
        }
                        // redis ek database jaisa hi h to ram me store karta h
        const isBlackListed = await redisClient.get(token) ;   // agar token redis ke andar mil jata h to matlab token expire  
        if(isBlackListed){
            res.cookie('token', '' ) ;
            return res.status(401).send({message : "Unauthorized User  Redis me token pada h matlab expire."}) ;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
        req.user = decoded ; 
        next() ;
    }
    catch(error){
        return res.status(401).send({message : "Unauthorized User."}) ;
    }
}