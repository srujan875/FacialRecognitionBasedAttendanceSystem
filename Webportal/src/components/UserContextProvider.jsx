// src/contexts/MyProvider.js
import React, { useState } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }) => {
  const [state, setState] = useState({ user: {} });

  // A function to update the state
  const updateState = (newValues) => {
    setState(prevState => ({ ...prevState, ...newValues }));
  };

  return (
    <UserContext.Provider value={{ state, updateState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
