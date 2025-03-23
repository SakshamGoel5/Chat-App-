
import socket from 'socket.io-client' ;
//  is me  mai 3 function banaunga ek socket connect karne ke liye     ek data receive karne ke liye aur     ek data send karne ke liye

let socketInstance = null ;

export const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },  
        query: {
            projectId
        } 
    }) ;
    return socketInstance ;
}



export const receiveMessage = (eventName ,cb) => {
    socketInstance.on(eventName, cb) ;
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data) ;
}