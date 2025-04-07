import React, { useEffect, useState } from 'react'
import Video from './Video'


const VideoBox = ({sender,receiver,peerConnection}) => {

    const [remoteStream,setRemoteStream]=useState(null)
    const [localStream,setLocalStream]=useState(null)
    useEffect(()=>{

    //if any not present yet then do not proceed
    if(!sender||!receiver||!peerConnection){
            return

        }

    const handleIncomingTrack=async (event)=>{
        setRemoteStream(event.streams)

        console.log("received remote stream "+sender +" from "+receiver)

        //also set localstream if not already set i.e not the initiator
        if(!localStream){
            const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
            setLocalStream(local)
        }
    }

    peerConnection.addEventListener('track',handleIncomingTrack)

    //cleanup
    return ()=>{peerConnection.removeEventListener("track",handleIncomingTrack)}


    },[sender,receiver,peerConnection])

    const initiateExchange=async (event)=>{
        if(!peerConnection){
            return ;
        }
        try{
        const local=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        //set local stream as we will need that
        setLocalStream(local)

        local.getTracks().forEach(track=>{
            peerConnection.addTrack(track,local)
            console.log("sent remote stream from "+sender +" to "+receiver)
        })
    }
    catch(e){
        console.error("issue getting local stream or sending "+e)
    }
    }
  return (
    <div className='flex flex-col min-h-80 min-w-120 justify-center items-center gap-4' >
    <Video src={localStream} username="you"></Video>
    <Video src={remoteStream} username={receiver}></Video>
    <button className='bg-green-200' onClick={initiateExchange} >call</button>
    </div>
  )
}

export default VideoBox