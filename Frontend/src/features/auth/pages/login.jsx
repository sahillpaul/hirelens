import { useState } from 'react';
import { Link } from 'react-router';
// IMPORTANT: Ensure this path matches where your tutor created the hook
import { useAuth } from '../hooks/useAuth.js'; 
import { useNavigate } from 'react-router';

export default function Login() {
  // 1. Extract the loading state and login function from the hook
  const { loading, handleLogin } = useAuth();

  const navigate=useNavigate();

  // 2. The "two states" for two-way data binding
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 3. The async submit function calling the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Capture the boolean returned by the hook
    const isSuccess = await handleLogin(email, password);
    // Only navigate to the dashboard if the login actually worked
    if (isSuccess) {
      navigate('/');
    }
    // If it failed, the code stops here. The user stays on the login page.
  };

  
  // 4. Premium Loading Screen (Replaces the tutor's basic <h1>Loading...</h1>)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-indigo-500 rounded-full mb-4"></div>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-950 text-slate-50">
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        
        <div className="relative z-10 text-center px-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            HireLens
          </h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            AI-powered precision for your next technical interview. Identify gaps, generate roadmaps, and land the offer.
          </p>
        </div>
      </div>

      {/* Right Side: The Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-slate-400 mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="developer@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}