import { useContext,useEffect} from 'react';
import { AuthContext } from '../services/auth.context.jsx';
// Ensure this path matches where you saved your API functions
import { login, register, logout, getMe } from '../services/auth.api.js'; 

export const useAuth = () => {
  // 1. Extract states and setters from the Context layer
  const { user, setUser, loading, setLoading } = useContext(AuthContext);


    // --- HYDRATION LOGIC: Added to prevent logout on page refresh ---
  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        // Silently hit the backend to check if the user has a valid cookie token
        const data = await getMe(); 
        setUser(data.user); // If successful, set the user data
      } catch (err) {
        console.log(err); // If token is invalid/expired, it falls here
      } finally {
        // Regardless of success or failure, turn off the loading screen
        setLoading(false); 
      }
    };

    getAndSetUser();
  }, []); // Empty dependency array ensures this runs only once when the app loads
  // ----------------------------------------------------------------


 // 2. Create the Login handler
  const handleLogin = async (email, password) => {
    setLoading(true); 
    try {
      const data = await login(email, password); 
      setUser(data.user); 
      return true; // FIX: Tell the UI the login succeeded
    } catch (err) {
      console.error("Login failed:", err);
      return false; // FIX: Tell the UI the login failed
    } finally {
      setLoading(false); 
    }
  };

  // 3. Create the Register handler
  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try{
    const data = await register(username, email, password);
    setUser(data.user);
    }catch(err){
    }finally{
    setLoading(false);
    }
  };

  // 4. Create the Logout handler
  const handleLogout = async () => {
    setLoading(true);
    try{
      const data = await logout();
      setUser(null); // Clear the user data from global state
    }catch(err){

    }finally{
      setLoading(false);
    }
  };

  // 5. Return the states and functions so the UI layer can use them
  return { 
    user, 
    loading, 
    handleLogin, 
    handleRegister, 
    handleLogout 
  };
}