//Context API = A way to share data globally in your app without manually passing props through every component.
//useContext() = A hook that allows you to access the context value in functional components.
import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component to share data to all components inside it
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

