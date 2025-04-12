import React, { useEffect, useRef, useState } from 'react'
import FriendsList from './FriendsList'
import NavBar from "../components/NavBar"
import { useNavigate, useParams } from 'react-router-dom'
import WebRTCConn from './WebRTCConn'
import { checkAuth } from '../services/verifyAuth'

const WebSocketConn = () => {

    const ws=useRef(null)
    const [onlineUsers,setOnlineUsers]=useState([])
    const [selectedFriend,setSelectedFriend]=useState(null)
    const {username}=useParams()
    const navigate=useNavigate()

    const setFriend=(friend)=>{
        // console.log("state changed")

        //set friend
        if(ws.current){
            console.log("friend sent")
            ws.current.send(JSON.stringify({
                "type":"friend",
                "content":username,
                "sender":username,
                "receiver":friend
            }))
        }
        
        setSelectedFriend(friend)
    }
    useEffect(()=>{

        console.log("websocket effect called")
        //establish connection
        try{
        const token=sessionStorage.getItem("localJwtKey")
        const conn=new WebSocket(`wss://server.347658.xyz/chatServer?token=${token}`)
        
        ws.current=conn
        
        conn.onopen=()=>{
            console.log("connected")
        }

        conn.onmessage=async(mess)=>{
            //this can be of three types 
            // 
            //  1:connect i.e when some new user joins
            //  2:disconnect i.e when some user leaves
            //  3:userslist i.e the list of online users when first join
            const data= await JSON.parse(mess.data)
            // const prev=onlineUsers
            if(data.type==="connect"){

                setOnlineUsers(prev=>(prev.includes(data.username)||data.username===username)?prev:[...prev,data.username])
            }
            else if(data.type==="disconnect"){
                const currOnline=onlineUsers

                setOnlineUsers(prev=>prev.filter((curr)=>curr!=data.username))
            }

            else if(data.type==="allusers"){
                setOnlineUsers(data.list.filter(x=>x!=username))
            }
            else if(data.type==="friend"){
                console.log("friend received and set")
                setSelectedFriend(data.content)
            }

        }
        

        conn.onclose=async ()=>{
            console.log("closed")
            // login again or refresh but need to check why it failed where jwt expired or what
            let reloads=parseInt(sessionStorage.getItem("reloadCount")||"0")
            let result=false;
            result=await checkAuth();
            
            if(result&&reloads<1){
                window.location.reload(false)
                sessionStorage.setItem("reloadCount",1)
            }
            else if(!result){
                 navigate("/login")
            }
           
        }
        

        return ()=>{ console.log("I am cleared") 
                    conn.close()}
    }
    catch (e){
        //meaning something went wrong so make login again
        navigate("login/",{replace:true})
        
    }
    },[])
  return (

    

<div className='h-screen grid grid-rows-[auto_1fr]'>
<NavBar></NavBar>
<div className="grid grid-cols-[180px_1fr] overflow-hidden">
<FriendsList friends={onlineUsers} setFriend={setFriend}></FriendsList>
<WebRTCConn friend={selectedFriend} ws={ws.current}></WebRTCConn>
</div>
</div>
  )
}

export default WebSocketConn