import React from 'react'
import { useState } from 'react'
import { Form,FormLabel,FormControl, FormGroup, Button } from 'react-bootstrap'
import { submitLoginForm } from '../services/formSubmit'
import { Link, Navigate, replace, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
    const [username,setUserName]=useState("")
    const [password,setPassword]=useState("")
const navigate=useNavigate()
    const handleSubmit= async(e)=>{
        e.preventDefault()
        //make an object using the state
        const obj={
            username,password
        }
        try{

        //extracts jwt and stores it in the local storage
        await submitLoginForm(obj)
        
        toast.success("login successful")
        navigate(`/user/${obj.username}`,{replace:true})
        }
        catch(e){
            toast.error("login failed")
        }

    }

  return (
    <Form onSubmit={handleSubmit} className='mx-auto  mt-5 min-h-100 flex flex-col flex-grow-1 gap-2 font-roboto content-center items-center bg-purple-50 content-center w-90 mb-5 rounded-xl p-10' >
        <h1 className='text-5xl'>Login</h1>
        <Form.Group
        controlId='username' className='mb-3  flex flex-col ' >
            <Form.Label className='text-xl'>username:</Form.Label>
            <Form.Control className='bg-purple-200'
            onChange={(e)=>{setUserName(e.target.value)}}
            type='text'
            value={username}
            placeholder='Raju'
            required
            
            ></Form.Control>
            

        </Form.Group>

        <Form.Group className='mb-3  flex flex-col'
        controlId='password'>
            <Form.Label className='text-xl'>password:</Form.Label>
            <Form.Control className='bg-purple-200'
            type='password'
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
            value={password}
            placeholder='.....'
            required
            ></Form.Control>
        </Form.Group>
        

        <Button variant='primary' className='px-3 text-xl' type='submit'>Login</Button>
        <Form.Text className='text-xl'>new here?<Link to={"/signup"} >Sign up</Link></Form.Text>
    </Form>
  )
}

export default LoginPage