"use client"; // This directive marks the component as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GenericResponse } from '@/models/response/GenericResponse';
import { LoginResponse } from '@/models/response/LoginResponse';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://wp-api.gluttongk.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data: GenericResponse<LoginResponse> = await response.json();
        if (data.success && data.data) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('username', data.data.user.username);
          localStorage.setItem('user', JSON.stringify(data.data));
          console.log("user data: ", JSON.stringify(data.data))
          router.push('/'); // Redirect to dashboard on successful login
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        const data: GenericResponse<null> = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="login">Username or Email</label>
              <input
                type="text"
                placeholder="Enter Username or Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
            </div>
          </div>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
