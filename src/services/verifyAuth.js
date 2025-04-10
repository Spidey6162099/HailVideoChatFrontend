const checkAuth=async()=>{
    const user=sessionStorage.getItem("localJwtKey")
    const response=await fetch("https://server.347658.xyz/v1/auth/verifyAuth",{
        method:'GET',
        headers:{"Authorization":`Bearer ${user}`}
      })
      // if(response.ok){
      //   console.log("ok it is")
      // }
        
      if(!response.ok){
        throw new Error("authentication failed")
      }
       
      if(user==null){
        throw new Error("no jwt token found")
      }
      return true;
}

export {checkAuth}