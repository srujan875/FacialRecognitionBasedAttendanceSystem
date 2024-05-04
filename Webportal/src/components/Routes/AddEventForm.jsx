import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../../firebase/firebase.js';
import { useNavigate } from "react-router-dom"

export const AddEventForm = () => {
    const database = getDatabase(app);
    const eventsRef = ref(database, 'Events');
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        endTime: '',
        eventAdmin: '',
        id: '',
        image: '',
        location: '',
        name: '',
        startTime: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            push(eventsRef, {...formData})
    .then(() => {
      console.log('Data successfully written to the database');
      navigate('/home')
    })
    .catch((error) => {
      console.error('Error writing data to the database:', error);
    });
           
            // Optionally, reset the form after submission
            setFormData({
                date: '',
                description: '',
                endTime: '',
                eventAdmin: '',
                id: '',
                image: '',
                location: '',
                name: '',
                startTime: ''
            });
        } catch (error) {
            console.error('Error adding event: ', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="startTime" placeholder="Start Time" value={formData.startTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="endTime" placeholder="End Time" value={formData.endTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="eventAdmin" placeholder="Event Admin" value={formData.eventAdmin} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                </div>
                
               
                <button type="submit" className='button-3'>Add Event</button>
            </form>
        </div>
    );
};


