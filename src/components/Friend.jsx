import React from 'react'
import ProfilePic from "../assets/images/woman.png"


const Friend = ({name,setFriend}) => {
  return (
    <>
    <div className='font-roboto min-h-15 text-xl flex gap-2 p-2 mb-2 flex-between bg-purple-100 hover:bg-indigo-100' onClick={()=>{setFriend(name)}}>
    <img src={ProfilePic} className='rounded-ms border-1px border-indigo-100 rounded-full h-10 '></img>
    <div className='h-10'>{name}</div>
    
    </div>
    </>
  )
}

export default Friend