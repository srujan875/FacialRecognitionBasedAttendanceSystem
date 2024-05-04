
import Events from './components/Events'

/* global firebase */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import EventDetailsPage from './components/Routes/EventDetailsPage';
import {app} from './firebase/firebase.js'
import { getDatabase, ref, get } from 'firebase/database';
import AddEventForm from './components/Events/AddEventForm';
import AttendeesPage from './components/Routes/AttendeesPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function App() {

  console.log('started')
  const [data, setData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    // Get a reference to the Firebase Realtime Database
    const database = getDatabase(app);
    console.log(database)
    const eventsRef = ref(database, 'Events');
    console.log(data,'data')
    // Fetch data once
    get(eventsRef)
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
  }, []);

  return (
    <div className="App">
  <Router>
     <div className='navBar'>
     <Link to={{ pathname: `/` }}> <div>  Home</div></Link>
     <Link to={{ pathname: `/addEvent` }}><div>  Add Event</div></Link>
     </div>
   
    
      <Routes>
        <Route path="/" element={data && <Events data={data} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>} />
        <Route path="/addEvent" element={<AddEventForm/>} />
        <Route path="/events/:eventId" element={<EventDetailsPage selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>} />
        <Route path="/events/:eventId/attendees" element={<AttendeesPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
