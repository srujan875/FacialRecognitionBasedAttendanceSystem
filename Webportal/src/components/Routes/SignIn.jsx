import { useState } from "react"
import { getAuth,signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"
import './signIn.css'
export function Signin(){

    const [email,setEmail] =useState('')
    const [password,setPassword]=useState('')
    const navigate = useNavigate();
    async function handleSignIn(e){
        e.preventDefault();
        signInWithEmailAndPassword(auth,email,password)
        .then((user)=>{
            console.log(user)
            console.log('hello')
            navigate('/home')
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    return  (
    <body id='body'>
    <div className='main'> {/* Use className instead of class */}
            <h1>Events Portal</h1>
  
            <form>
                <label>
                    Username:
                    <input type='text' placeholder='username' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>

                <label htmlFor="password">
                    Password:
                    <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <button id="login" onClick={(e)=>{handleSignIn(e)}}>Log in</button>
            </form>
        </div>
        </body>
        )

   
}