import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext  } from "../../contexts/authContext/index";


export function Protected({children}){
    const {currentUser} = useContext(AuthContext)
   
    if(!currentUser){
        return <Navigate to='/signin' replace/>
    }
    else{
        return children;
    }
}