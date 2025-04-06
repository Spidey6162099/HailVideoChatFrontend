import React from 'react'


const Chat = ({message,type}) => {


  
return type==="sender" ? <div className='font-roboto flex justify-end bg-green-100 w-full'>{message}</div>:<div className='font-roboto flex justify-start bg-gray-100 w-full'>{message}</div>  
  

}

export default Chat