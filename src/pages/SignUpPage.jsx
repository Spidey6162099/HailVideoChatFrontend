//register the user in the database
import React from 'react'
import { useState } from 'react'
import { Form,Button } from 'react-bootstrap'
import { replace, useNavigate } from 'react-router-dom'
import { submitLoginForm,submitSignupForm } from '../services/formSubmit'
import { ToastContainer, toast } from 'react-toastify';

export const SignUpPage = () => {
    const navigate=useNavigate()
    const [username,setUserName]=useState("")
    const [password,setPassword]=useState("")
    const   [email,setEmail]=useState("")

    const handleSubmit= async(e)=>{
        e.preventDefault()
        //make an object using the state
        const obj={
            username,password,email
        }
  
        try{

        //extracts jwt and stores it in the local storage
        await submitSignupForm(obj)
        
        navigate('/login',{replace:true})
        toast.success("sign up successfull")
        
        }
        catch(e){
            toast.error("failed to signup")
        }

    }

  return (
    <Form onSubmit={handleSubmit} className='mx-auto mt-5 min-h-100 flex flex-col flex-grow-1 gap-2 font-roboto content-center items-center bg-purple-50 content-center w-90 mb-5 rounded-xl p-10' >
        <h1 className='text-5xl'>Signup</h1>
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

        <Form.Group className='mb-3 flex flex-col'
        controlId='email'>
            <Form.Label className='text-xl'>email:</Form.Label>
            <Form.Control
            className='bg-purple-200'
            type='email'
            onChange={(e)=>{setEmail(e.target.value)}}
            placeholder='123@abc.com'
            required
            value={email}
            
            ></Form.Control>
        </Form.Group>
        <Button variant='primary' type='submit'>Signup</Button>
    </Form>
  )
}
