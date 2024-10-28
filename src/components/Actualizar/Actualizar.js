// Importaciones de librerías, componentes y hooks
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { FirebaseContext } from "../../firebase";
import './Register2.css';

function Actualizar() {
  // Hooks y variables
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(null); // Estado para almacenar el usuario encontrado
  const [userName, setUserName] = useState(""); // Estado para el nombre de usuario a buscar

  // Inicialización y validaciones
  const formik = useFormik({
    initialValues: {
      name: "",
      cc: "",
      edad: "",
      estatura: "",
      email: "",
      password: "", // Nuevo campo para la contraseña
      rol: "",
      blocked: false,
    },
    onSubmit: async (values) => {
      try {
        if (user) {
          const updatedData = { ...values };
          if (!values.password) delete updatedData.password; // Solo actualizar la contraseña si hay un nuevo valor

          await firebase.db.collection("users").doc(user.id).update(updatedData);
          window.alert("Datos actualizados exitosamente");
        }
      } catch (e) {
        window.alert("No se pudo actualizar, causa --> " + e);
      }
    },
  });

  // Función para buscar el usuario por nombre de usuario
  const handleSearchUser = async () => {
    try {
      const existingUser = await firebase.db
        .collection("users")
        .where("userName", "==", userName)
        .get();

      if (!existingUser.empty) {
        const userData = existingUser.docs[0].data();
        setUser({ ...userData, id: existingUser.docs[0].id });
        formik.setValues(userData); // Cargar los datos del usuario en el formulario
      } else {
        window.alert("Usuario no encontrado");
      }
    } catch (e) {
      window.alert("Error al buscar el usuario, causa --> " + e);
    }
  };

  return (
    <div>
      <div className="col-span-1">
        <section className="bg-white-50">
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800">
            <div className="p-8 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-3xl text-center font-bold leading-tight tracking-tight text-gray-800 dark:text-white">
                MODIFICAR DATOS DEL USUARIO
              </h1>

              <div className="mb-6">
                <label
                  htmlFor="userName"
                  className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                >
                  Usuario a buscar
                </label>
                <input
                  type="text"
                  id="userName"
                  className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button
                  type="button"
                  className="btnBuscar"
                  onClick={handleSearchUser}
                >
                  Buscar
                </button>
              </div>

              {user && (
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-white py-2 pl-8 pr-3 outline-none w-full rounded"
                      required
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="cc"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Cédula
                    </label>
                    <input
                      type="number"
                      id="cc"
                      className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                      required
                      value={formik.values.cc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="edad"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Edad
                    </label>
                    <input
                      type="number"
                      id="edad"
                      className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                      required
                      value={formik.values.edad}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="estatura"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Estatura
                    </label>
                    <input
                      type="number"
                      id="estatura"
                      className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                      required
                      value={formik.values.estatura}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                      required
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-xl font-bold text-gray-700 dark:text-white"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="bg-white py-2 pl-8 pr-4 outline-none w-full rounded"
                      placeholder="Dejar vacío para no cambiar"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="contbt">
                    <button
                      type="submit"
                      className="btnActualizar"
                    >
                      Actualizar datos
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Actualizar;
