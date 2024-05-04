import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './signIn.css';
import { getAuth,signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const SignIn = () => {
    console.log("logging started");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='main'> {/* Use className instead of class */}
            <h1>GeeksforGeeks</h1>
            <h3>Enter your login credentials</h3>
            <form onSubmit={signIn}>
                <label>
                    Username:
                    <input type='text' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>

                <label htmlFor="password">
                    Password:
                    <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <button type='submit' name='submit'>Log In</button>
            </form>
        </div>
    );
};

export default SignIn;
