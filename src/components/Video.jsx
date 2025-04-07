import React, { useEffect, useRef } from 'react'

const Video = ({src,username}) => {
       
    const videoRef=useRef(null)


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
    
        <div className='rounded-ls border-2 border-black flex flex-col min-w-120 flex-grow'>
            
            <video ref={videoRef} playsInline autoPlay className=' min-h-120 min-w-full aspect-video' controls ></video>
            <div className='font-roboto text-xl'>{username}</div>
        </div>    
    
  )

}

export default Video