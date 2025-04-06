import React from 'react'
import Logo from '../assets/images/video-chat.png'
import { NavLink } from 'react-router-dom'
const NavBar = () => {
  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
    <div className="sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        <div
          className="flex flex-1 items-center justify-between"
        >
    
        <div className="flex flex-shrink-0 items-center justify-between gap-5">
          <NavLink  to="/">
            <img
              className="h-20 w-auto"
              src={Logo}
              alt="React Jobs"
            />
            </NavLink>
            <div className="flex space-x-2 items-center">
              <p className='text-5xl text-gray-200 flex item-center font-roboto text-center font-extrabold'>Hail</p>
            </div>
 
            </div>
          <div className="md:ml-auto">

          </div>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default NavBar