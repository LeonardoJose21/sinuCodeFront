// ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas son diferentes');
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL+'api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'No fue posible cambiar la contraseña');
      }
    } catch (err) {
      setError('Ha ocurrido un error.Intente de nuevo');
    }
  }

  if (!token) {
    return <p>Invalid password reset link.</p>;
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h2 className='font-semibold'>Cambiar la contraseña</h2>
      <form className='flex flex-col space-y-2 mt-3' onSubmit={handleSubmit}>
        <Input 
          type="password" 
          placeholder="Nueva contraseña" 
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          placeholder="Confirmar nueva contraseña" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
        />
        <Button type="submit">Hecho</Button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
