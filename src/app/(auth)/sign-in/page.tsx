"use client"
import React from 'react'
import {useSession,signIn,signOut} from 'next-auth/react'


export default function Component() {
    const {data:session} = useSession();
    if(session){
        return (
            <div>
            <h1>Welcome {session.user.name}</h1>
            <button onClick={()=>signOut()}>Sign Out</button>
            </div>
        )
    }
    
    return(
        <div>
        <h1> Not Sign In</h1>
        <br />
        <button onClick={()=>signIn()} className='p-2 bg-orange-500 rounded-xl'>Sign In</button>
        </div>
    )
}
