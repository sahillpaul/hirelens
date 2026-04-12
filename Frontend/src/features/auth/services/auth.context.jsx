import { createContext, useState } from 'react';

// Create the Context
export const AuthContext = createContext();

// Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // CRUCIAL CHANGE: Set initial loading state to 'true' for hydration
  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};