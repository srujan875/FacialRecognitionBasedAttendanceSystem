import './App.css'
import { signOut,getAuth } from "firebase/auth" 
import { auth,app } from "../src/firebase/firebase.js";
import Events from './components/Events/index.js';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Signin } from './components/Routes/SignIn';  
import {AddEventForm} from './components/Routes/AddEventForm'
import {AttendeesPage} from './components/Routes/AttendeesPage'
import {EventDetailsPage} from './components/Routes/EventDetailsPage'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import {Protected} from './components/Routes/Protected'
import { Registered } from './components/Routes/Registered.jsx';


function App(){
  console.log('started');
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [data, setData] = useState(null);
  const [studentsData, setStudentsData] = useState(null);
  
  const database = getDatabase(app);
  console.log(database)
  const eventsRef = ref(database, 'Events');
  const studentsRef = ref(database, 'Students');
  console.log(data,'data')
  
  console.log('setSelected',setSelectedEvent)
  const [user, setUser] = useState(null);

   
   
//   const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
     !studentsData && get(studentsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setStudentsData(snapshot.val());
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      console.log(studentsData,'sdata')
  }, [user]);
  useEffect(() => {
    // Get a reference to the Firebase Realtime Database
   
    // Fetch data once
    !data && get(eventsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }, [user]);
    
   
 

  async function handleSignout(){
    try{
        await signOut(auth);

    }catch(error){
        console.log(error);
    }
}

 const NavBar =()=>{ return (<div className='navBar'>
 <Link to={{ pathname: `/home` }}> <div>  Home</div></Link>
 {(user !== null && !['rohit@umkc.edu', 'shreyan@umkc.edu','srujan@umkc.edu'].includes(user.mail) ) && <Link to={{ pathname: `/addEvent` }}><div> Add Event</div></Link>}
 <div style={{ marginLeft: 'auto' }}>
    {console.log(studentsData)}
    {console.log(user)}
   {console.log('test diabled')}
    <Link onClick={() => { handleSignout() }}>Sign Out</Link>
  </div>
  </div>)}
  const router=createBrowserRouter([
    {
      path:'/home',
      element :<Protected>{data && <div><NavBar/><Events data={data} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} studentsData={studentsData} setUser={setUser} user={user}/></div>}</Protected>
    },
    {
      path:'/',
      element :<Signin/>
    },
    {
      path:'/signIn',
      element :<Signin/>
    },
    {
      path:'/addEvent',
      element: <div><NavBar/><AddEventForm/></div>
    },
    {
      path: '/events/:eventId',
      element: <div ><NavBar/><EventDetailsPage selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} user={user} studentsData={studentsData} /></div>
    },
    {
      path: '/events/:eventId/attendees',
      element: <div><NavBar/><AttendeesPage /></div>
    },
    {
      path: '/events/:eventId/registered',
      element: <div><NavBar/><Registered /></div>
    }


  ])
  return(
   
    
    
    <AuthProvider>
    
    <RouterProvider router ={router}>  </RouterProvider>
   
    </AuthProvider>
   
  )
}

export default App;