
import {auth} from '../../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import React,{createContext,useContext,useState,useEffect} from "react";

export  const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}
export function AuthProvider({children}){
    const [currentUser,setCurrentUser] = useState(null);
    const [userDetails,setUserDetails] = useState(null);
    const[userLoggedIn,setUserLoggedIn] = useState(false);
    const[loading,setLoading] = useState(true);

    useEffect(()=>{
        const unsubsribe = onAuthStateChanged(auth,initializeUser);
        return unsubsribe;
    },[])
    
    async function initializeUser(user){
        if(user){
            setCurrentUser({...user});
            setUserLoggedIn(true);

        }
        else{
            setCurrentUser(null);
            setUserLoggedIn(false); 
        }
        setLoading(false);
    }
    function updateUserDetails(details) {
        setUserDetails(details);
        console.log(userDetails,"userDetails")
    }
    const value= {
        currentUser,
        userLoggedIn,
        loading,
        userDetails,
        updateUserDetails
        
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}