import React, { useEffect, useRef, useState } from 'react'

import Logo from "../assets/images/video-chat.png"

const Video = ({src,username}) => {

    const [shouldVideoPlay,setShouldVideoPlay]=useState(false)
    const [shouldAudioPlay,setShouldAudioPlay]=useState(false)
    const videoRef=useRef(null)

    const setVideoPlay=async ()=>{
        //if peerConnection Exists
        
        if(src){

            //if not needed then remove
            src.getVideoTracks().forEach(track=>track.enabled=shouldVideoPlay?true:false)

        }
        //toggle the value
        setShouldVideoPlay(prev=>!prev)
    }

    const setAudioPlay=async ()=>{
                //if peerConnection Exists
        
                if(src){

                    //if not needed then remove
                    src.getAudioTracks().forEach(track=>track.enabled=shouldAudioPlay?true:false)
        
                }
                //toggle the value
                setShouldAudioPlay(prev=>!prev)
    }
    useEffect(()=>{
        //if video has been mounted and src is also availaible
        if(!src){
            return 
        }
        try{
        if(videoRef.current&&src){
            videoRef.current.srcObject=src
        }
        }
        catch(e){
            console.error("issue playing video "+e)
        }

    },[src,username])

    
    
    return (
        
    
        <div className='rounded-ls border-2 border-black flex flex-col mt-5  flex-grow'>
            {src?<>
            <video ref={videoRef} autoPlay className=' h-480px w-640 aspect-video' controls ></video>
            {username=="you"?
            
            <div className='flex flex-row justify-between items-center'>
            <button onClick={setVideoPlay}>{shouldVideoPlay?"start video":"stop video"}</button>
            <button onClick={setAudioPlay}>{shouldAudioPlay?"start audio":"stop audio"}</button>
            </div>
            
            
            :null}
            <div className='font-roboto text-2xl font-weight-bold'>{username}</div>
            </>:<img src={Logo} className='min-h-60px min-w-full '></img>}
        </div>    
    
  )

}

export default Video