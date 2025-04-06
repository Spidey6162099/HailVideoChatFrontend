import React, { useEffect, useState } from 'react'
import { getAll,getAllOnline } from '../services/retrieve'
import Friend from './Friend'

const FriendsList = ({friends,setFriend}) => {


    
    //fetch the friends of the user or just for now let's just retrieve all online users

    //temporary hack to ensure unique keys
    const localFriends= [...new Set(friends)]
    return (
      <div className='bg-purple-300 py-2 px-3 flex flex-col gap-2 h-100% overflow-y-auto'>
      <div className='text-2xl font-roboto font-bold'>Online users</div>
      <div className='flex-grow'>
    {
        localFriends.map(friend=><Friend name={friend} key={friend} setFriend={setFriend}></Friend>)
    }
    </div>
  </div>
  )
}

export default FriendsList