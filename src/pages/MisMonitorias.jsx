import { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants'

export const MisMonitorias = () => {
  const [monitorias, setMonitorias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN); // Or your constant

    axios.get(import.meta.env.VITE_API_URL + 'playground/monitorias/mias/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setMonitorias(response.data))
      .catch(error => console.error('Error al obtener tus monitorías:', error));
  }, []);

  return (
    <div className='mt-5 mx-auto w-full md:w-2/3'>
      <h2 className="text-xl font-bold mb-4">Mis Monitorías</h2>
      <ul>
        {monitorias.map(m => (
          <li key={m.id} className="mb-2 p-2 border rounded">
            <span className='font-semibold'> Tema:</span> {m.tema} <br />
            <span className='font-semibold'> Modalidad:</span> {m.modalidad} <br />
            <span className='font-semibold'>Fecha:</span> {new Date(m.fecha).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};
