import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (
      username === import.meta.env.VITE_ADMIN_USERNAME &&
      hashHex === import.meta.env.VITE_ADMIN_PASSWORD_HASH
    ) {
      sessionStorage.setItem('is_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-pastel-hero flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300/40 rounded-full blur-3xl animate-float-reverse" />

      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-white">
        <div className="w-16 h-16 bg-pastel-button rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-extrabold mb-2 text-center">
          <span className="text-gradient">Admin</span> Portal
        </h1>
        <p className="text-ink-soft text-center text-sm mb-6">Authorized access only</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm mb-4 p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-lilac focus:outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-lilac focus:outline-none focus:border-accent"
          />
          <button type="submit" className="btn-primary w-full py-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}