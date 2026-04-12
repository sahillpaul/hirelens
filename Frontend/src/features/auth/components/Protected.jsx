import { Navigate } from 'react-router';
// Ensure this path matches where you saved your useAuth hook
import { useAuth } from '../hooks/useAuth.js'; 

const Protected = ({ children }) => {
  // 1. Extract loading and user states from the hook layer
  const { loading, user } = useAuth();

  // 2. If the app is currently loading/processing, show a loading screen
  if (loading) {
    return (
      <main>
        <h1>Loading</h1>
      </main>
    );
  }

  // 3. If loading is finished but no user is found (null), force redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 4. If a user exists, render the protected page (the children)
  return children;
};

export default Protected;
