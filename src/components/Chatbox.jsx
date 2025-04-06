import React, { useEffect, useState } from 'react'
import { Form,Button } from 'react-bootstrap'
import Chat from './Chat'
import { useParams } from 'react-router-dom'

//importing datachannel to actually send data
const Chatbox = ({friend,datachannel}) => {

    // const [friendState,setFriendState]=useState(null)
    const {username}=useParams()
    const [chats,setChats]=useState([])
    const[chat,setChat]=useState({type:"",content:""})
    useEffect(()=>{
    if(!datachannel){
        return;
    }

    // setFriendState(friend)
    //if called means datachannel or friends changed so empty it out and thus rerender
    setChats([])
    const func=event=>{
        //this is for received messages
            const data=JSON.parse(event.data)
            data.type="receiver"
            console.log("messge received by "+username+" data :"+data.type)
            
            setChats(prev=>[...prev,data])
            
    }
    datachannel.addEventListener("message",func)

    return ()=>datachannel.removeEventListener("message",func)
    
    },[datachannel,friend])


  return (
    <div className='bg-purple-50 flex flex-col content-center items-end'>
        <div className='w-full'>{chats.map((chatIndiv,index)=>{
            
            return chatIndiv?<Chat key={index} type={chatIndiv.type} message={chatIndiv.content}></Chat>:null
    
    })}</div>
        <Form onSubmit={(e)=>{

            //sender sending message
            e.preventDefault()
            try{
            const newChat =chat
            newChat.type="sender"
            datachannel.send(JSON.stringify(newChat))
            console.log("message sent by "+username + " data :"+newChat.type)
            setChats(prev=>[...prev,chat])
            setChat({type:"",content:""})
            }
            catch(e){
                console.error("failed to send the message " )
                setChat({type:"",content:""})
            }
            }} className='flex flex-row font-roboto justify-center items-center  content-center rounded-xl p-10' >
        <Form.Group
        controlId='text' className='flex flex-col ' >
            {/* <Form.Label className='text-xl'>u:</Form.Label> */}
            <Form.Control className='bg-purple-200'
            onChange={(e)=>{
                const newChat={
                    type:"sender",
                    content:e.target.value||""
                }
                setChat(newChat)}}
            type='text'
            value={chat.content}
            placeholder='hello there'
            required
            
            ></Form.Control>
            

        </Form.Group>
        <Button variant='primary' className='px-3 text-xl' type='submit'>send</Button>

    </Form>

    </div>
  )
}

export default Chatbox