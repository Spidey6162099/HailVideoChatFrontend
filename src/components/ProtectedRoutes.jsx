import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { checkAuth } from '../services/verifyAuth'
import { Spinner } from 'react-bootstrap'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const ProtectedRoutes = () => {
    const [isAuthenticating,setIsAuthenticating]=useState(null)
    // let user=false;
    

    useEffect(()=>{
      const checkAuthFunc=async ()=>{
        try{
        const result=await checkAuth()
        if(result===true){
          setIsAuthenticating(true)
        }
      }
      catch(e){
        console.log("authentication failed: "+e)
        setIsAuthenticating(false)
      }
      }
      checkAuthFunc()
    },[])

    if(isAuthenticating===null){
      return <div>loading..</div>
    }
    
    else if(!isAuthenticating){
      // toast.error("login expired")
      return (<Navigate to={"/login"}></Navigate>)
      
    }
    else if(isAuthenticating){
      // console.log("user authenticated")
    return (
    <Outlet></Outlet>
    )
  }
  
   
     
    }



export default ProtectedRoutes