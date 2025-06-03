import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ACCESS_TOKEN } from "./../constants";
import exportPdf from '../lib/exportPdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const DashboardPersonalA = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN); // Or whatever key you're using

    axios.get(`${import.meta.env.VITE_API_URL}playground/api/dashboard-metrics/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => setData(res.data))
      .catch(err => console.error('Error fetching metrics', err));
  }, []);


  if (!data) return <div className="p-4">Cargando métricas...</div>;

  return (
    <div className="p-6 space-y-10 bg-white text-slate-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Panel de Métricas</h1>
        <button
          onClick={() => {
            exportPdf(data);
            window.location.reload();
          }}

          className="bg-green-700 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-400 transition"
        >
          Exportar como PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 border rounded shadow">🎓 Estudiantes: <strong>{data.total_estudiantes}</strong></div>
        <div className="p-4 border rounded shadow">🧠 Prom. ejercicios resueltos: <strong>{Math.round(data.promedio_resueltos_por_estudiante)}</strong></div>
        <div className="p-4 border rounded shadow">📘 Total problemas resueltos: <strong>{data.resueltos_totales}</strong></div>
        <div className="p-4 border rounded shadow">📝 Feedback total: <strong>{data.retroalimentaciones_totales}</strong></div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problemas por Dificultad */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📈 Problemas por Dificultad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.problemas_por_dificultad}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="dificultad" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Lenguajes */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">💻 Distribución de Lenguajes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="total"
                data={data.problemas_por_lenguaje}
                nameKey="lenguaje"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.problemas_por_lenguaje.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback por Día */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📅 Retroalimentaciones por Día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.feedback_por_dia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monitorías por Modalidad */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">👨‍🏫 Monitorías por Modalidad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monitorias_por_modalidad}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="modalidad" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* NEW: Problemas por Tema */}
        <div>
          <h2 className="text-xl mb-2">Top 10 Temas de Problemas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.problemas_por_tema}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tema" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NEW: Top Estudiantes */}
        <div>
          <h2 className="text-xl mb-2">Top Estudiantes (Problemas Resueltos)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.resueltos_por_estudiante}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="estudiante__nombre_completo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NEW: Monitorías por Tema */}
        <div>
          <h2 className="text-xl mb-2">Top Temas de Monitorías</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monitorias_por_tema}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tema" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NEW: Dificultad Predominante */}
        <div>
          <h2 className="text-xl mb-2">Dificultad Predominante de Estudiantes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="total"
                data={data.dificultad_predominante}
                nameKey="dificultad_predominante"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.dificultad_predominante.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
};

export default DashboardPersonalA;
