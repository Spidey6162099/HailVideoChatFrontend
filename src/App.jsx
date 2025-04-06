import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import { SignUpPage } from './pages/SignUpPage';
import NavBar from './components/NavBar';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import WebSocketConn from './components/WebSocketConn';

const router=createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes></ProtectedRoutes>,
    children:[
      {
        index:true,
        element:<h1>Protected page</h1>
      },
      {
        path:"/user/:username",
        element:<><WebSocketConn></WebSocketConn></>
      }

    ]
  },
{
  path:'/login',
  element:
  <>
  <NavBar></NavBar>
  <LoginPage></LoginPage>

  </>
},
{
  path:"/signup",
  element:
  <>
    <NavBar></NavBar>
  <SignUpPage></SignUpPage>

  </>
}
])
const App = () => {
  return (
    <>
    <ToastContainer></ToastContainer>
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
