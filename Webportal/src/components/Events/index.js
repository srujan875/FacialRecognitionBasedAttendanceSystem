import { useState, useContext, useEffect } from 'react';
import EventItem from '../EventItem';
import { AuthContext } from '../../contexts/authContext';
import './index.css';




const Events = ({data, selectedEvent, setSelectedEvent, studentsData, user, setUser}) => {

  
  const [activeEventId, setActiveEventId] = useState('');
  const {currentUser, updateUserDetails} = useContext(AuthContext)
  
  const eventsList = Object.entries(data)

  function findStudentByEmail(email) {
    const studentKeys = Object.keys(studentsData);
    for (let key of studentKeys) {
      if (studentsData[key].mail === email) {
        
        setUser(studentsData[key])
        updateUserDetails(studentsData[key])
        console.log(user, 'user2')
        return studentsData[key];
      }
    }
    return null; // Return null if no student is found with the given email
  }
  
  useEffect(() => {
    findStudentByEmail(currentUser.email)
  }, []);
  const renderEventsList = () => {
    return (
      <ul className="events-list">
        {eventsList.map(eachEvent => (
          <EventItem
            key={eachEvent.name}
            eventDetails={eachEvent[1]}
            setActiveEventId={setActiveEventId}
            isActive={eachEvent.id === activeEventId}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="events-container">
      <div className="events-content">
        <h1 className="heading">Events</h1>
        {renderEventsList()}
      </div>
     
    </div>
  );
};

export default Events;

