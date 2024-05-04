import { signOut,getAuth } from "firebase/auth" 
import { auth,app } from "../../firebase/firebase";
import Events from '../Events'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../../App.css';
import {EventDetailsPage} from './EventDetailsPage';
import { getDatabase, ref, get } from 'firebase/database';
import {AddEventForm} from './AddEventForm'
import {AttendeesPage} from './AttendeesPage';

export function Home({selectedEvent, setSelectedEvent, studentsData}){

   

    const navigate = useNavigate();

    async function handleSignout(){
        try{
            await signOut(auth);
            navigate('/signIn')

        }catch(error){
            console.log(error);
        }
    }

    
    return (
    
    <div className="App">

       <div className='navBar'>
       <Link to={{ pathname: `/` }}> <div>  Home</div></Link>
       <Link to={{ pathname: `/addEvent` }}><div>  Add Event</div></Link>
       <div style={{ marginLeft: 'auto' }}>
          {console.log(studentsData)}
          <Link onClick={() => { handleSignout() }}>Sign Out</Link>
        </div>
       </div>
     
       <Events data={data} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} studentsData={studentsData} />
       

      </div>
    );
}