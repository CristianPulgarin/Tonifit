import React, { useState, useEffect, useContext } from "react";
import './AssignDieta2.css';
import { FirebaseContext } from "../../firebase";

const VerDieta = () => {
  const { firebase } = useContext(FirebaseContext);
  const [users, setUsers] = useState([]);
  const [classs, setClass] = useState([]);
  const [assignedDietas, setAssignedDietas] = useState([]);
  const [searchUserTerm, setSearchUserTerm] = useState(""); // Estado para el filtro de usuarios en las cajitas

console.log(setClass)
  useEffect(() => {
    const unsubscribeUsers = firebase.db.collection("users").onSnapshot((snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    

    return () => {
      unsubscribeUsers();
      
    };
  }, [firebase]);

  useEffect(() => {
    const unsubscribeAssigned = firebase.db.collection("assigned2").onSnapshot((snapshot) => {
      const assignedList = snapshot.docs.map((doc) => ({
        id: doc.id,
        DietaId: doc.data().DietaId,
        userId: doc.data().userId,
        available: doc.data().available,
      }));
      setAssignedDietas(assignedList);
    });

    return () => unsubscribeAssigned();
  }, [firebase]);

  
   

  const unassignDieta = (assignedDietaId) => {
    firebase.db.collection("assigned2").doc(assignedDietaId).update({
      available: false,
    });
    const updatedAssignedDietas = assignedDietas.filter(
      (assignedDieta) => assignedDieta.id !== assignedDietaId
    );
    setAssignedDietas(updatedAssignedDietas);
  };

  

  // Filtrar clases asignadas por el término de búsqueda de usuarios
  const filteredAssignedDietas = assignedDietas.filter(assignedDieta => {
    const user = users.find(user => user.id === assignedDieta.userId);
    return user && user.userName.toLowerCase().includes(searchUserTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col">
      <div className="bg-white p-0 rounded-lg shadow-md mt-2">
        <h2 className="text-3xl text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white h-10">
          ASIGNAR DIETAS
        </h2>
        <div className="space-y-4">
         
         
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md mt-4">
        <h2 className="text-3xl font-bold text-gray-700 text-center">
          Clases asignadas
        </h2>
        {/* Campo de búsqueda para las clases asignadas */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Buscar en clases asignadas..."
            className="border border-gray-300 p-2 rounded w-1/2 mb-4"
            value={searchUserTerm}
            onChange={(e) => {
              setSearchUserTerm(e.target.value);
              console.log("Filtro de clases:", e.target.value);
            }}
          />
        </div>
        <div className="space-y-4">
          {filteredAssignedDietas.map((assignedDieta) => (
            <div key={assignedDieta.id}>
              {assignedDieta.available ? (
                <div className="border rounded-md p-4">
                  <h3 className="text-xl font-semibold">
                    Dieta: {' '}
                    {
                      classs.find(
                        (clas) => clas.id === assignedDieta.DietaId
                      )?.dieta || "Dieta no encontrada"
                    }
                  </h3>
                  <p>
                    <strong>Cliente:</strong>
                    {
                      (function() {
                        const user = users.find(user => user.id === assignedDieta.userId);
                        return user ? user.userName : "Usuario no encontrado";
                      })()
                    }
                  </p>
                  <p>
                    <strong>Horario:</strong>
                    {
                      classs.find(
                        (clas) => clas.id === assignedDieta.DietaId
                      )?.horario || "Horario no encontrado"
                    }
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => unassignDieta(assignedDieta.id)}
                      className="botonAD2"
                    >
                      Cancelar clase
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerDieta;
