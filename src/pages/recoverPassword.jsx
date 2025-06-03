// RequestReset.jsx
import { useState } from 'react';
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
export default function RequestReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL+'api/request-password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <h2 className='font-semibold'>Cambio de constraseña</h2>
      <p className='text-sm'>Para solicitar un cambio de contraseña, ingrese el correo con 
        el que se registró
      </p>
      <form className='flex gap-2 mt-3' onSubmit={handleSubmit}>
        <Input 
          type="email" 
          placeholder="Su email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <Button type="submit">Solicitar cambio</Button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
