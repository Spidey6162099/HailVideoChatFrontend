const submitLoginForm=async (obj)=>{
    try{
  
        const headers=new Headers();
       
        headers.append("Authorization","Basic "+btoa(obj.username+':'+obj.password))
        headers.append("Content-type","application/json")
        const response=await fetch("https://server.347658.xyz/v1/auth/login",{
            
            method:'POST',
            headers:headers,
            
            
 
        })

        if(!response.ok){
            throw new Error("invalid username or password")
        }
        const jwt=await response.text()
        
        //should return the jwt token
        //store the jwt in sessionstorage
        sessionStorage.setItem('localJwtKey',jwt);
        
        
        
        
    }
    catch(e){
        throw e
    }
}

const submitSignupForm= async (obj)=>{
    try{
        const data=JSON.stringify(obj)

        const headers=new Headers();
        headers.append("Content-type","application/json")
        const response=await fetch("https://server.347658.xyz/v1/auth/signup",{
            
            method:'POST',
            headers:headers,
            body:data            
        })
        
        
    }
    catch(e){
        console.log("user not registerd"+e)
        throw e;
    }
}

export{submitLoginForm,submitSignupForm}