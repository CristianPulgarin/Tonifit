import React, { useState } from "react";
import { Routes, Route } from "react-router";
import firebase, { FirebaseContext } from "./firebase";
import 'bootstrap/dist/css/bootstrap.min.css';

// Importación de componentes
import Sidebar from "./ui/Sidebar";
import Navbar from "./components/Nav/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import Training from "./components/Training";
import Assign from "./components/Assign";
import Admin from "./components/Admin";
import Pagar from "./components/Pagar";
import AssignDieta from "./components/AssignDieta";
import Dieta from "./components/Dieta";
import IniciarSesion from "./components/IniciarSesion";
import VerDieta from "./components/VerDieta";
import VerRutina from "./components/VerRutina/VerRutina";
import Actualizar from "./components/Actualizar/Actualizar";
function App() {
  const [userRole, setUserRole] = useState(null); // Puede ser 'entrenador' o 'usuario'

  return (
    <FirebaseContext.Provider value={{ firebase }}>
      <div className="min-h-screen lg:grid lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-2">
          <Sidebar userRole={userRole} />
        </div>
        <div className="col-span-1 lg:col-span-5">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciarSesion" element={<IniciarSesion setUserRole={setUserRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/training" element={<Training />} />
            <Route path="/assign" element={<Assign />} />
            <Route path="/dieta" element={<Dieta />} />
            <Route path="/assignDieta" element={<AssignDieta />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pagar" element={<Pagar />} />
            <Route path="/VerDieta" element={<VerDieta/>}/>
            <Route path="/VerRutina" element={<VerRutina/>}/>
            <Route path="/Actualizar" element={<Actualizar/>}/>
            
          </Routes>
        </div>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
