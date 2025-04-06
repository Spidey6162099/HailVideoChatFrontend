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
    
        <div className='rounded-ls border-2 border-black h-60 w-100 flex'>
            <video ref={videoRef} playsInline autoPlay className='flex-grow' >{username}</video>
        </div>    
    
  )

}

export default Video