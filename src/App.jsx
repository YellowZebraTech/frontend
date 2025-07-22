import React, { useState, useEffect } from "react";
import { operarios } from "./mockOperarios";
import { settings } from "./settings";

const App = () => {
  const [workers, setWorkers] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [lastClickTime, setLastClickTime] = useState({});
  const [toast, setToast] = useState(null);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);

  const DELAY_MINUTOS = settings[0].delay;

  useEffect(() => {
    setWorkers(operarios); // Simulación local sin backend
  }, []);

  // Contar pallets acumulados por operario (por dni)
  // const conteos = registros.reduce((acc, registro) => {
  //   acc[registro.dni] = (acc[registro.dni] || 0) + registro.cantidad;
  //   return acc;
  // }, {});

  const esHoy = (fechaString) => {
    const hoy = new Date();
    const fecha = new Date(fechaString);
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const conteos = registros
    .filter((registro) => esHoy(registro.fecha))
    .reduce((acc, registro) => {
      acc[registro.dni] = (acc[registro.dni] || 0) + registro.cantidad;
      return acc;
    }, {});

  const mostrarToast = (mensaje, tipo = "info") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClick = (operario) => {
    const ahora = new Date();
    const anterior = lastClickTime[operario.dni];
    const diff = anterior ? (ahora - anterior) / 1000 / 60 : Infinity;

    if (diff < DELAY_MINUTOS) {
      mostrarToast("😠 ¡Tan rápido? Jajaja... creo te adelantas", "error");
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      nombre: operario.nombre,
      dni: operario.dni,
      cantidad: 1,
      fecha: ahora.toISOString(), // ✅ formato ISO para evitar errores de comparación
    };

    setRegistros([nuevoRegistro, ...registros]);
    setLastClickTime({ ...lastClickTime, [operario.dni]: ahora });
    mostrarToast("😄 ¡Sumaste 1 pallet!", "success");
  };

  const confirmarEliminar = (registro) => {
    setRegistroAEliminar(registro);
  };

  const eliminarRegistro = () => {
    if (registroAEliminar) {
      setRegistros(registros.filter((r) => r.id !== registroAEliminar.id));
      setRegistroAEliminar(null);
      mostrarToast("🗑️ Registro eliminado", "success");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Registro de Pallets Clasificados Hoy
      </h1>

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 transition-all ${
            toast.tipo === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.mensaje}
        </div>
      )}

      {registroAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro?</h3>
            <p className="mb-6 text-gray-600">
              Vas a eliminar el registro de <strong>{registroAEliminar.nombre}</strong> del{" "}
              <strong>
                {new Date(registroAEliminar.fecha).toLocaleString("es-AR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </strong>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={eliminarRegistro}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setRegistroAEliminar(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {workers.map((w) => (
          <button
            key={w.dni}
            onClick={() => handleClick(w)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex justify-between items-center"
          >
            <span>{w.nombre}</span>
            <span className="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-bold">
              {conteos[w.dni] || 0} pallets hoy
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Historial de Pallets</h2>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Fecha y Hora</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">DNI</th>
              <th className="py-2 px-4">Cantidad</th>
              <th className="py-2 px-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 px-4">
                  {new Date(r.fecha).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="py-2 px-4">{r.nombre}</td>
                <td className="py-2 px-4">{r.dni}</td>
                <td className="py-2 px-4 text-center">{r.cantidad}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => confirmarEliminar(r)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {registros.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No hay registros todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
