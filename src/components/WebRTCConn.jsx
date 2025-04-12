import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Chatbox from './Chatbox'
import Video from './Video'
import VideoBox from './VideoBox'
import { toast } from 'react-toastify'


const WebRTCConn = ({friend,ws}) => {

    const {username}=useParams()

    //isready keeps track of datachannel for use
    const [isReady,setIsReady]=useState(false)


    // console.log(username)
    const peerConnection=useRef(null)
    const dataChannel=useRef(null)
    const [remoteStream,setRemoteStream]=useState(null)
    const [localStream,setLocalStream]=useState(null)
    const [shouldRefresh,setShouldRefresh]=useState(false)
    // const localStream=useRef(null)
    // const [friendState,setFriendState]=useState(friend)
    const handleWebRTCMessages=async (message)=>{
        const data=JSON.parse(message.data)
        //now check

        
        if(!data||(data.receiver!=username)){
            return;
        }

        if(data.type==="offer"){
            //first check if they are interested or not
            const status=await window.confirm(`receiving call from ${data.sender} , do you want to answer`)
            if (status){

         
            peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.content))
            
            const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
            setLocalStream(local)

            local.getTracks().forEach(track=>{
                peerConnection.current.addTrack(track,local)
                console.log("sent  stream from "+username +" to "+friend)
            })
            try{
            const answer=await peerConnection.current.createAnswer()
            await peerConnection.current.setLocalDescription(answer)
            const answerMessage={
                "type":"answer",
                "content":answer,
                "sender":username,
                "receiver":friend
            }
            ws.send(JSON.stringify(answerMessage))
            console.log("offer received, answer sent: " +answer)
            console.log(peerConnection.current.connectionState)
        }
        catch(e){

        }
        }
        else{
            //send close message to the person
            const answerMessage={
                "type":"close",
                "content":"close",
                "sender":username,
                "receiver":friend
            }
            console.log("close message")
            ws.send(JSON.stringify(answerMessage))
        }
        }
        
        if(data.type==="close"){
            //do whatever you were doing in 
            if(peerConnection.current){
                peerConnection.current.close()
                peerConnection.current=null
                setLocalStream(null)
                setRemoteStream(null)
                setShouldRefresh(prev=>!prev)
                toast.error(`${friend} has disconnected`)
    
                //send message to other to closeup
            }
        }

        if(data.type==="answer"){
            const remoteDescription=new RTCSessionDescription(data.content)
            await peerConnection.current.setRemoteDescription(remoteDescription)
            console.log("answer received ")
            console.log(peerConnection.current.connectionState)
        }
        if(data.type==="newIceCandidate"){
            try{
                await peerConnection.current.addIceCandidate(data.content)
                console.log("ice candidate")
                console.log(peerConnection.current.connectionState)
            }
            catch(e){
                console.error("failed to add ice candidate")
            }
        }
        
    }

    const initiatePeerConnection=()=>{
        peerConnection.current.addEventListener('icecandidate',event=>{
            
            //if new candidates received transmit to the other guy
            if(event.candidate){
                const answerMessage={
                    "type":"newIceCandidate",
                    "content":event.candidate,
                    "sender":username,
                    "receiver":friend
                }
                ws.send(JSON.stringify(answerMessage))
            }
        })

        peerConnection.current.addEventListener('connectionstatechange',event=>{
            // if(peerConnection.current.connectionState==='disconnected'){
               
            //     //tear down everything
            //     toast.error(`${friend} disconnected`)
            //     dataChannel.current=null
            //     peerConnection.current=null
            //     setLocalStream(null)
            //     setRemoteStream(null)
            //     setShouldRefresh((prev)=>!prev)
            //     //make the useEffect rerun , we can use loc
            // }
            

            // if(peerConnection.current.connectionState==='connected'){
                console.log("connection state: "+peerConnection.current.connectionState)
            // }
        })

        

        // peerConnection.current.addEventListener('track',async (event)=>{
        //     const [remoteStream]=event.streams
            
        // })
    

        //WebSocket Signalling Server Usecases


       


        const handleIncomingTrack=async (event)=>{
            setRemoteStream(event.streams[0])
    
            console.log("received remote stream "+username +" from "+friend)
    
            //redundant no need
        //     if(!localStream){
        //         const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        //         setLocalStream(local)

        //         local.getTracks().forEach(track=>{
        //             peerConnection.current.addTrack(track,local)
        //             console.log("sent remote stream from "+username +" to "+friend)
        //         })
        //     }
        //     else{
        //     localStream.getTracks().forEach(track=>{
        //         peerConnection.current.addTrack(track,localStream)
        //         console.log("sent stream from "+username +" to "+friend)
        //     })
        // }

            // finally you must also send back to the source so it can set it's own remote

        }
    
        peerConnection.current.addEventListener('track',handleIncomingTrack)
    }


    //called everytime if friend changed
    useEffect(()=>{

        console.log("webrtc effect runs")
        // if(!friend||!ws){
        //     return <div>choose a friend to chat with</div>
        // }
        

        //since reciever won't have friend set not working 
        if(!friend||!ws){
            return;
        }

        ws.addEventListener("message",handleWebRTCMessages)

        // if (peerConnection.current) {
        //     peerConnection.current.close();
        //     peerConnection.current = null;
        // }


            //if this is the initiator then the makeoffer would set this up so no need to do this
        if(!peerConnection.current){
            const iceConfiguration = {
                iceServers: [
                    {
                        urls: 'turn:myturn.347658.xyz:3478',
                        username: 'admin',
                        credential: 'adsf@34faa86ADF905_'
                    }
                ]
            }
        peerConnection.current=new RTCPeerConnection(iceConfiguration)
        }
        
        initiatePeerConnection()

        //this only happens for receiver so in this
        peerConnection.current.addEventListener('datachannel',event=>{
            //if datachannel received means connection opened with new so any old just rmove
                if(dataChannel.current){
                        dataChannel.current.close()
                        dataChannel.current=null
                }
                

                const dataChannel1=event.channel;
                dataChannel.current=dataChannel1
                
                dataChannel1.onopen=()=>{
                    console.log("data channel open to" +username)
                    setIsReady(true)
                }
                dataChannel.current.onclose=()=>{
                    console.log("data channel closed"+ username)
                    dataChannel.current=null
                    setIsReady(false)
                }
            

        })


        
//if websocket connection,friend or peerconnection changes then rerun to
return ()=>{ws.removeEventListener("message",handleWebRTCMessages)}

    },[ws,friend,shouldRefresh])


    //if initiator open the channel
    
    const makeOffer=async()=>{

        //open a peerconnection , if already then don't care just close it
        const iceConfiguration = {
            iceServers: [
                {
                    urls: 'turn:myturn.347658.xyz:3478',
                    username: 'admin',
                    credential: 'adsf@34faa86ADF905_'
                }
            ]
        }
        if(peerConnection.current){
            peerConnection.current.close()
            if(dataChannel.current){
                //initiate closing 
                dataChannel.current.close()
                dataChannel.current=null
            }
        }

    peerConnection.current=new RTCPeerConnection(iceConfiguration)
        initiatePeerConnection()

        //setup all the connections for peerConnection

        //only the sender should open datachannel
        
        dataChannel.current=peerConnection.current.createDataChannel("chat")
        
        dataChannel.current.onopen=()=>{
            console.log("data channel open from "+username)
            setIsReady(true)
        }
        dataChannel.current.onclose=()=>{
            console.log("data channel closed"+ username)
            dataChannel.current=null
            setIsReady(false)
        }
        //open mediachannel before sending offer so the remote becomes aware 
        
        const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
            //set local stream as we will need that
            setLocalStream(local)
    
            local.getTracks().forEach(track=>{
                peerConnection.current.addTrack(track,local)
                console.log("sent remote stream from "+username +" to "+friend)
            })
         

        const offer=await peerConnection.current.createOffer()
        await peerConnection.current.setLocalDescription(offer)
        const offerMessage={
            "type":"offer",
            "content":offer,
            "sender":username,
            "receiver":friend
        }
        console.log("offer sent: "+offer)

        ws.send(JSON.stringify(offerMessage))
        
    }

    //ws is the websocket connection
    //friend would be the selected friend
    //now we can begin work in actual webrtc

    //if recieved then close the peerconnection if exists
    const closeCall=()=>{

        //if a connection is active
        if(peerConnection.current){
            peerConnection.current.close()
            peerConnection.current=null
            setLocalStream(null)
            setRemoteStream(null)
            setShouldRefresh(prev=>!prev)
            toast.success(`you succesfully ended the call`)

            //send message to other to closeup
            const answerMessage={
                "type":"close",
                "content":"close",
                "sender":username,
                "receiver":friend
            }
            ws.send(JSON.stringify(answerMessage))
        }
    }



    
  return (
    <div className='flex flex-col justify-center items-center overflow-auto'>
    <div>WebRTC {friend}</div>
    <div className='flex flex-row justify-center items-center mt-5 gap-5'>
    <Video src={localStream} username={"you"} closeCall></Video>
    <Video src={remoteStream} username={friend}></Video>
    
    </div>
    <Chatbox datachannel={dataChannel.current} friend={friend} ></Chatbox>
    <button onClick={makeOffer} className='bg-green-200 hover:bg-green-100'>make Call</button>
    <button onClick={closeCall} className='bg-red-200 hover:bg-red-100'>close call</button>
    </div>
    
  )
}

export default WebRTCConn