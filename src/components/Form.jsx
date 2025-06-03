import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the path as necessary
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Adjust the path as necessary
import { Loader } from 'lucide-react';
import { useUser } from '../roleContext';

const AuthForm = ({ method, route }) => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nombre_completo, setNombre] = useState("");
  const [programa_academico, setCarrera] = useState("");
  const [rol, setRol] = useState("")
  const navigate = useNavigate();
  const location = useLocation();
  const username = email;

  const name = method === "login" ? "Iniciar Sesión" : "Registrarse";
  const isPersonalAcademicoRe = location.pathname === "/login/personal-academico";
  const isPersonalAcademico = location.pathname === "/register/personal-academico";
  const esMonitor = rol == "monitor"


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confPassword && method === "register") {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    let payload;
    if (method === "login") {
      payload = {
        username,
        email,
        password,
      };
    }
    else if (method == "register" && !isPersonalAcademico) {  // Assuming method === "register"
      payload = {
        user: {
          username,
          email,
          password,
        },
        cantidad_ejercicios_resueltos: 0,
        nombre_completo,
        programa_academico,
        dificultad_predominante: "facil"
      };
    }
    else {
      if (esMonitor) {
        route = route + "-monitor/"
      }
      else {
        route = route + "-docente/"
      }
      console.log(route)
      payload = {
        user: {
          username,
          email,
          password,
        },
        nombre_completo,
        rol,
      };
    }
    // console.log("Payload:", payload);
   
    try {

      const res = await api.post(route, payload);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        if (location.pathname.includes("personal-academico")) {
          navigate("/personal-academico/dashboard")
        }
        else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container space-y-4 p-4 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold">{name}</h1>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Insttucional</label>
        <Input
          id="email"
          className="form-input block w-full p-2 border border-gray-300 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <Input
          id="password"
          className="form-input block w-full p-2 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
      </div>
      {method === "register" && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <Input
              id="password"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <Input
              id="nombre"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="text"
              value={nombre_completo}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            {!isPersonalAcademico && (
              <>
                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Programa académico</label>
                <Select value={programa_academico} onValueChange={setCarrera} required>
                  <SelectTrigger className="w-full p-2 border rounded bg- text-black">
                    <SelectValue placeholder="Seleccione su programa académico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingenieria de sistemas">Ingeniería de Sistemas</SelectItem>
                    <SelectItem value="Ingenieria industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="Ingenieria electromecanica">Ingeniería Electromecánica</SelectItem>
                    <SelectItem value="Ingenieria electrica">Ingeniería Eléctrica</SelectItem>
                    <SelectItem value="Ingenieria civil">Ingeniería Civil</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            {isPersonalAcademico && (
              <>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                <Select value={rol} onValueChange={setRol} required>
                  <SelectTrigger className="w-full p-2 border rounded bg- text-black">
                    <SelectValue placeholder="Seleccione su rol (monitor o docente)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="docente">Docente</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </>
      )}
      {method === "login" && (
        <div className="text-sm text-gray-600">
          <a className='text-blue-500 mb-3' href="/request-reset">¿Olvidó su contraseña?</a>
          <p>¿No estás registrado? <a
            href={isPersonalAcademicoRe ? "/register/personal-academico" : "/register"}
            className="text-blue-500">Regístrate aquí </a></p>
        </div>)}

      {method === "register" && (
        <div className="text-sm text-gray-600">
          <p>¿Ya tienes cuenta? <a href={isPersonalAcademico ? "/login/personal-academico" : "/login"}
            className="text-blue-500">Inicia sesión aquí</a></p>
        </div>
      )}

      <div className='text-center w-full'>
        {loading && <Loader className="animate-spin mx-auto" />}
      </div>
      <Button
        className="form-button w-full p-2"
        type="submit"
        disabled={loading}
      >
        {name}
      </Button>
    </form>
  );
};

export default AuthForm;
