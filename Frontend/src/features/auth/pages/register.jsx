import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
// IMPORTANT: Ensure this path matches where your tutor created the hook
import { useAuth } from '../hooks/useAuth.js'; 

export default function Register() {
  // 1. Extract loading state and the register function from the custom hook
  const { loading, handleRegister } = useAuth();
  
  // 2. Initialize the navigation hook
  const navigate = useNavigate();

  // 3. Create state variables for the inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 4. The async submit function calling the backend and redirecting
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate("/");
  };

  // 5. Premium Loading Screen (Cyan themed to match Register branding)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-cyan-500 rounded-full mb-4"></div>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Provisioning Account...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-950 text-slate-50">
      {/* Right Side: Visual Branding (Flipped for dynamic feel) */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 relative overflow-hidden order-2">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">
            Level Up Your Career
          </h2>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Join the platform that analyzes Job Descriptions in seconds and builds your exact roadmap to getting hired.
          </p>
        </div>
      </div>

      {/* Left Side: The Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 order-1">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-slate-400 mt-2">Start preparing for your next role today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="johndoe123"
              />
            </div>

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
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-600 text-white hover:bg-cyan-700 h-10 px-4 py-2 active:scale-[0.98]"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}