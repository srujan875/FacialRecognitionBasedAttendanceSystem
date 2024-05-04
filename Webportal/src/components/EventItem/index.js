import './index.css'
import { Link } from 'react-router-dom';

const EventItem = props => {
  const {eventDetails, setActiveEventId, isActive, setSelectedEvent} = props
  const {image, name, location, id} = eventDetails
  const eventImageClassName = isActive ? 'event-image active' : 'event-image'

  const onClickEvent = () => {
    setActiveEventId(id)
    setSelectedEvent(eventDetails)
  }

  return (
    <li className="event-item">
      <Link to={{ pathname: `/events/${id}` }}>
      <button type="button" className="event-button" onClick={onClickEvent}>
        <img src={image} alt="event" className={eventImageClassName} />
      </button>
      </Link>
      <p className="name">{name}</p>
      <p className="location">{location}</p>
      
    </li>
  )
}

export default EventItem
