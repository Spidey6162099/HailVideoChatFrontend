import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Chatbox from './Chatbox'
import Video from './Video'
import VideoBox from './VideoBox'


const WebRTCConn = ({friend,ws}) => {

    const {username}=useParams()

    //isready keeps track of datachannel for use
    const [isReady,setIsReady]=useState(false)

    // console.log(username)
    const peerConnection=useRef(null)
    const dataChannel=useRef(null)
    const [remoteStream,setRemoteStream]=useState(null)
    const [localStream,setLocalStream]=useState(null)
    // const localStream=useRef(null)
    // const [friendState,setFriendState]=useState(friend)


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

       

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }


            //if this is the initiator then the makeoffer would set this up so no need to do this

        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        peerConnection.current=new RTCPeerConnection(configuration)

        
        // dataChannel.current=peerConnection.current.createDataChannel("chat")


        // dataChannel.current.onopen=()=>{
        //     console.log("data channel open"+username)

        // }

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

            // if(peerConnection.current.connectionState==='connected'){
                console.log("connections open baby!")
            // }
        })

        peerConnection.current.addEventListener('datachannel',event=>{
            if(dataChannel.current){
                //initiate closing 
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

        // peerConnection.current.addEventListener('track',async (event)=>{
        //     const [remoteStream]=event.streams
            
        // })
    

        //WebSocket Signalling Server Usecases
        const handleWebRTCMessages=async (message)=>{
            const data=JSON.parse(message.data)
            //now check

            if(!data||(data.receiver!=username)){
                return;
            }

            if(data.type==="offer"){
                peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.content))
                
                const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
                setLocalStream(local)

                local.getTracks().forEach(track=>{
                    peerConnection.current.addTrack(track,local)
                    console.log("sent  stream from "+username +" to "+friend)
                })

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

            if(data.type==="answer"){
                const remoteDescription=new RTCSessionDescription(data.content)
                await peerConnection.current.setRemoteDescription(remoteDescription)
                console.log("answer received ")
                console.log(peerConnection.current.connectionState)
            }
            if(data.type==="newIceCandidate"){
                try{
                    await peerConnection.current.addIceCandidate(data.content)
                    // console.log("ice candidate")
                    // console.log(peerConnection.current.connectionState)
                }
                catch(e){
                    console.error("failed to add ice candidate")
                }
            }
            
        }

        ws.addEventListener("message",handleWebRTCMessages)


        const handleIncomingTrack=async (event)=>{
            setRemoteStream(event.streams[0])
    
            console.log("received remote stream "+username +" from "+friend)
    
            //also set localstream if not already set i.e not the initiator
            if(!localStream){
                const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
                setLocalStream(local)

                local.getTracks().forEach(track=>{
                    peerConnection.current.addTrack(track,local)
                    console.log("sent remote stream from "+username +" to "+friend)
                })
            }
            else{
            localStream.getTracks().forEach(track=>{
                peerConnection.current.addTrack(track,localStream)
                console.log("sent stream from "+username +" to "+friend)
            })
        }

            // finally you must also send back to the source so it can set it's own remote

        }
    
        peerConnection.current.addEventListener('track',handleIncomingTrack)
    
        


        return ()=>{
            ws.removeEventListener("message",handleWebRTCMessages)
            
        }

        


    },[ws,friend])


    //if initiator open the channel
    
    const makeOffer=async()=>{

        
        if(dataChannel.current){
            //initiate closing 
            dataChannel.current.close()
            dataChannel.current=null
        }

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

    
  return (
    <div className='flex flex-col justify-center items-center overflow-auto'>
    <div>WebRTC {friend}</div>
    <div className='flex flex-col justify-center items-center'>
    <Video src={localStream} username={"you"}></Video>
    <Video src={remoteStream} username={friend}></Video>
    </div>
    <Chatbox datachannel={dataChannel.current} friend={friend}></Chatbox>
    <button onClick={makeOffer} className='bg-green-200 hover:bg-green-100'>make Call</button>
    </div>
    
  )
}

export default WebRTCConn