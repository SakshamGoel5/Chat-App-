import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context.jsx';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';

import MarkDown from 'markdown-to-jsx'

import '../index.css';
function Project() {
  const location = useLocation();
  console.log(location.state);

  const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);

  const [project, setProject] = useState(location.state.project);
  
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState('') ;

  const [messages, setMessages] = useState([]) ;

  const { user } = useContext(UserContext);

  const messageBox = React.createRef();


  function addCollaborators() {
    axios.put('/projects/add-user', {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    }).then((res) => {
      console.log(res.data);
      setIsModalOpen(false);
    }).catch((err) => {
      console.log(err);
    })
  }

  const send = () => {
    sendMessage('project-message', {
      message,
      sender: user
    })
    setMessages(prevMessages => [...prevMessages, {sender: user, message}]);
    setMessage("");
  }

  useEffect(() => {
    axios.get('/users/all').then((res) => {
      setUsers(res.data.users);
    }).catch((err)=> {
      console.log(err) ;
    })

    axios.get(`/projects/get-project/${location.state.project._id}`).then((res)=> { 
      console.log(res.data.project);
      setProject(res.data.project);
    })


    initializeSocket(project._id) ;


    receiveMessage('project-message', (data) => {
      setMessages(prevMessages => [...prevMessages , data]) 
    });

    
  }, [])


 
  

  const handleUserClick = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
      newSelectedUserId.delete(id);
      } else {
      newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };


  // function appendIncomingMessage(messageObject){
  //   const messageBox = document.querySelector('.message-box') ;
  //   const message = document.createElement('div') ;
  //   message.classList.add('message', 'max-w-56', 'p-2', 'flex', 'flex-col', 'bg-slate-50', 'rounded-md') ;

  //   if(messageObject.sender.id === 'ai'){
  //     const markDown = (<MarkDown>{messageObject.message}</MarkDown>)      // jsx me ye direct aise kuch kaam nhi kar rha   ai se code genereate kara rhe h to format kharab aa rha h isliye hame useref wagera ka use karna padega 
  //     message.innerHTML = `
  //     <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
  //     <p class='text-sm'>${messageObject.message}</p>
  //     ` ;
  //     messageBox.appendChild(markDown) ;
  //     scrollToBottom() ;
  //   }
  //   else{
  //     message.innerHTML = `
  //     <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
  //     <p class='text-sm'>${messageObject.message}</p>
  //     ` ;
  //     messageBox.appendChild(message) ;
  //     scrollToBottom() ;
  //   }
  // }
    

  // function appendOutgoingMessage(message){
  //   const messageBox = document.querySelector('.message-box') ;
  //   const newMessage = document.createElement('div') ;
  //   newMessage.classList.add('ml-auto', 'max-w-56', 'p-2', 'flex', 'flex-col', 'bg-slate-50', 'rounded-md') ;
  //   newMessage.innerHTML = `
  //     <small class='opacity-65 text-xs'>${user.email}</small>
  //     <p class='text-sm'>${message}</p>
  //   ` ;
  //   messageBox.appendChild(newMessage) ;
  //   scrollToBottom() ;
  // }

  function scrollToBottom(){
    messageBox.current.scrollTop = messageBox.current.scrollHeight ;
  }


  return (
    <main className='h-screen w-screen flex '>
      <section className="flex flex-col left relative h-screen min-w-full bg-slate-300 ">
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute top-0'>
          <button className='flex gap-2 z-30' onClick={() => setIsModalOpen(true)}>
            <i className='ri-add-fill mr-1'></i>
            <p> Add collaborator </p>
          </button>

          <button className='p-2 z-30' onClick={() => setisSidePanelOpen(!isSidePanelOpen)}>
            <i className='ri-group-fill'></i>
          </button>
        </header>

        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col relative h-full">
          <div ref={messageBox} className="message-box flex-grow flex flex-col gap-1 p-1 overflow-auto max-h-full ">
          {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                  <p className='text-sm'> {msg.sender._id === 'ai' ? <div className='overflow-scroll bg-slate-950 text-white'><MarkDown>{msg.message}</MarkDown></div>  : msg.message} </p>
                            </div>
            ))}
          </div>
         
          <div className="inputField w-full flex absolute bottom-0">
            <input value={message} onChange={(e)=> setMessage(e.target.value)} className='p-2 px-4 border-none outline-none flex-grow' type='text' placeholder='Enter Message' />
            <button onClick={send} className='px-5 bg-slate-950 text-white'><i className='ri-send-plane-fill'></i></button>
          </div>
        </div>

        <div className={`sidePanel w-full h-full bg-slate-50 flex flex-col gap-2 absolute transform transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
          <header className='flex justify-between items-center p-2 px-3 w-full bg-slate-200'>
            <h2 className="text-xl font-semibold">Collaborators</h2>


            <button className='p-2' onClick={() => setisSidePanelOpen(!isSidePanelOpen)}>
              <i className='ri-close-fill'></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2 ml-4">
           
          {project.users && project.users.map((user) => {
            return (
              <div key={user._id} className="user flex gap-2 items-center">
                <div className='aspect-square rounded-full p-2 w-fit h-fit bg-slate-600'>
                  <i className='ri-user-fill text-white'></i>
                </div>
                <div className='font-semibold text-lg cursor-pointer hover:bg-slate-200 w-full p-2'>{user.email}</div>
              </div>
            )
          })}


          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-11/12 max-w-md relative">
              <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select User</h2>
                <button className="p-2" onClick={() => setIsModalOpen(false)}>
                  <i className="ri-close-fill"></i>
                </button>
              </header>
              <div className="flex max-h-96 overflow-auto flex-col gap-2">
                {users.map(user => (
                  <div key={user?._id || user?.email || Math.random()} className={`user flex gap-2 items-center cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ''}  p-2`} onClick={() => handleUserClick(user._id)}>
                    <div className='aspect-square rounded-full p-2 w-fit h-fit bg-slate-600'>
                      <i className='ri-user-fill text-white'></i>
                    </div>
                    <div className='font-semibold text-lg'>{user.email}</div>
                  </div>
                ))}
              </div>
              <button className=" mt-5 mx-auto flex justify-center  bg-blue-500 text-white py-2 px-4 rounded" onClick={()=> addCollaborators()}>
                Add Collaborators
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Project;