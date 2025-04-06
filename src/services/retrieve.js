const getAll= async ()=>{
    try{
        const res=await fetch("/api/v1/util/users")
        
        const data=await res.json()
        return data;
    }
    catch(e){
        console.log("ERROR: "+e)
    }

}

// const getAllFriends=async(name)=>{
//     try{
//         let headers=new Headers()
//         // headers.append("Authorization","Bearer "+sessionStorage.getItem())
//         // const res=await fetch(`/api/v1/util/friends/${name}`)
//         const data=await res.json()
//         return data;
//     }
//     catch(e){
//         console.log("ERROR: "+e)
//     }
// }

const getAllOnline=async(name)=>{
        try{
        let headers=new Headers()
        const localJwtToken=sessionStorage.getItem("localJwtToken")
        if(localJwtToken===null){throw new Error("Jwt token not set")}
        headers.append("Authorization","Bearer "+localJwtToken)
        const res=await fetch(`/api/v1/util/users/online/`)
        const data=await res.json()
        console.log(data)
        return data;
    }
    catch(e){
        console.log("ERROR: "+e)
    }
}

export {getAll,getAllOnline}
