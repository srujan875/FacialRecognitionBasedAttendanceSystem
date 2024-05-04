import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../../firebase/firebase.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AuthContext  } from "../../contexts/authContext/index";
import UserContext from '../UserContext.jsx';


export const EventDetailsPage = ({selectedEvent, studentsData}) => {
  const eventId = useParams();
  const [attendees, setAttendees] = useState(null);
  const [user, setUser] = useState(null);
  const [reg, setReg] = useState(null);
  const [register, setRegister] = useState('Register');
  function findStudentByEmail(email) {
    console.log(studentsData)
    console.log('printing')
    const studentKeys = Object.keys(studentsData);
    for (let key of studentKeys) {
      console.log(studentsData[key].mail +' '+ email)
      console.log('hello')
      if (studentsData[key].mail === email) {
        
        setUser({ ...studentsData[key], id:key})
        
        return studentsData[key];
      }
    }
    return null; // Return null if no student is found with the given email
  }
  useEffect(() => {
    const database = getDatabase(app);
    const attendanceRef = ref(database, 'Attendance', eventId);
    
    get(attendanceRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAttendees(snapshot.val()[eventId?.eventId]);
          console.log(attendees,eventId,'att')
          // checkStudentAttendance(eventId,user)
        } else {
          console.log('No attendance data available for this event');
        }
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });
  }, [eventId, user]);
 
  useEffect(() => {
    const redatabase = getDatabase(app);
    const regRef = ref(redatabase, 'Registrations', eventId);
    console.log('admin'+user)
    get(regRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setReg(snapshot.val()[eventId?.eventId]);
          console.log(reg,eventId,'reg')
         
          // checkStudentAttendance(eventId,user)
        } else {
          console.log('No attendance data available for this event');
        }
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });
  }, [eventId, user]);
 
  const {currentUser} = useContext(AuthContext)
  

  useEffect(()=>{
    console.log(currentUser.email)
    console.log('currentUser')
    findStudentByEmail(currentUser.email)
  },[])
  
  console.log(user, "user1")
  const {name, description, id, image, date, location, startTime, endTime} =selectedEvent
  const rdatabase = getDatabase(app);
  
  console.log(eventId,"eventId")
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      set(ref(rdatabase, `Registrations/${eventId.eventId}/${user.id}`), user.name)
        setRegister('Registered')
.then(() => {
 
  console.log('Data successfully written to the database');

})
.catch((error) => {
  console.error('Error writing data to the database:', error);
});
       
        // Optionally, reset the form after submission
       
    } catch (error) {
        console.error('Error adding event: ', error);
    }
};


function checkStudentAttendance( user) {
  console.log(attendees && attendees[user.id],"attendance" )
  return (attendees && attendees[user.id] );
}
function checkStudentRegistration( user) {
  console.log(reg && reg[user.id],"registration" )
  return (reg && reg[user.id] );
}
  
    console.log(selectedEvent,"event Details")
    
  
  return (
    <div>
    {user && <div className='EventDetailsPage'>
      {/* {checkStudentRegistration(user) && setRegister('Registered')} */}
     <h1 className="headingEvent headingEventPage">Event</h1>
     <div className='checkedInButton'>
     {(user !== null && !['rohit@umkc.edu', 'shreyan@umkc.edu','srujan@umkc.edu'].includes(user.mail) ) && <Link to={{ pathname: `/events/${id}/attendees` }}>
     <button className="icon-button" onClick={()=>{}}>
      <FontAwesomeIcon icon={faUsers} className="icon" />
      <span className="checkedLabel">Checked In List</span>
    </button>
    </Link>  }
   
     <Link to={{ pathname: `/events/${id}/registered` }}>
     <button className="icon-button" onClick={()=>{}}>
      <FontAwesomeIcon icon={faUsers} className="icon" />
      <span className="checkedLabel">Registered List</span>
    </button>
    </Link> 
    
   {(user !== null && !['admin@umkc.edu'].includes(user.mail) )&& <button type="submit" className={`button-3 ${checkStudentRegistration(user)?'Registered':register}`} onClick={handleSubmit}>{checkStudentRegistration(user)?'Registered':register}</button> }
    {user && checkStudentAttendance(user) && <button type="submit" className='button-3 noClick'onClick={()=>{}}>Checked-In</button>  }  
     
    </div>
   
    <div className='fullDetails'>
        
    <img src={selectedEvent?.image} alt="event" className='fullImage' />
    <div className='detailsContainer'>
    <p className="name">{name}</p>
      <p className="location">Event Location: {location}</p>
      <p className="location">Event Date: {date}</p>
      <p className="location">Event Time: {startTime} - {endTime}</p>
      <p className="location">{description}</p>
      </div>
    </div>
    </div>}
    </div>
  );
};

