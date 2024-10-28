import React, { useState, useEffect, useContext } from "react";
import './AssignDieta.css';
import { FirebaseContext } from "../../firebase";

const AssignDieta = () => {
  const { firebase } = useContext(FirebaseContext);
  const [users, setUsers] = useState([]);
  const [classs, setClass] = useState([]);
  const [selectedDieta, setSelectedDieta] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [availableDietas, setAvailableDietas] = useState([]);
  const [assignedDietas, setAssignedDietas] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [searchUserTerm, setSearchUserTerm] = useState(""); // Estado para el filtro de usuarios en las cajitas
console.log(setSearchTerm)
  useEffect(() => {
    const unsubscribeUsers = firebase.db.collection("users").onSnapshot((snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    const unsubscribeDietas = firebase.db.collection("dieta").onSnapshot((snapshot) => {
      const dietaList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableDietas(dietaList);
      setClass(dietaList);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeDietas();
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

  const assignDieta = () => {
    if (!selectedUser || !selectedDieta) {
      window.alert("Selecciona un usuario y un horario de entrenamiento.");
      return;
    }
    firebase.db.collection("assigned2").add({
      userId: selectedUser,
      DietaId: selectedDieta,
      available: true,
    });
    window.alert("Entrenamiento asignado correctamente.");
    setSelectedUser("");
    setSelectedDieta("");
  };

  const unassignDieta = (assignedDietaId) => {
    firebase.db.collection("assigned2").doc(assignedDietaId).update({
      available: false,
    });
    const updatedAssignedDietas = assignedDietas.filter(
      (assignedDieta) => assignedDieta.id !== assignedDietaId
    );
    setAssignedDietas(updatedAssignedDietas);
  };

  const availableOptions = availableDietas
    .filter((dieta) => {
      return !assignedDietas.some(
        (assigned) => assigned.DietaId === dieta.id && assigned.available === true
      );
    })
    .map((dieta) => (
      <option key={dieta.id} value={dieta.id}>
        {`Dieta: ${dieta.dieta} - Cantidad: ${dieta.cantidad} - Fecha inicio: ${dieta.horario}`}
      </option>
    ));

  // Filtrar usuarios por el término de búsqueda
  const filteredUsers = users
    .filter(user => !user.blocked && user.userName.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <div>
            <label htmlFor="user" className="text-xl block font-bold text-center">
              Datos del Usuario
            </label>
            <div className="flex justify-center items-center">
              <select
                id="user"
                className="bg-white py-2 pl-8 pr-4 outline-none w-1500 rounded"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Selecciona un usuario</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="training" className="text-xl block font-bold text-center">
              Entrenamientos y horarios disponibles
            </label>
            <div className="flex justify-center items-center">
              <select
                id="training"
                className="bg-white py-2 pl-8 pr-4 outline-none w-1500 rounded"
                value={selectedDieta}
                onChange={(e) => setSelectedDieta(e.target.value)}
              >
                <option value="">Selecciona un Entrenamiento</option>
                {availableOptions}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center h-20">
            <button onClick={assignDieta} className="botonAD">
              Asignar dieta
            </button>
          </div>
         
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
                      Cancelar clase del cliente
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

export default AssignDieta;
