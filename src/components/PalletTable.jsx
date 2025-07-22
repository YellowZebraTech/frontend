import React from 'react'

function PalletTable({ pallets, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left text-sm">
            <th className="p-3">Fecha</th>
            <th className="p-3">Hora</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">DNI</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {pallets.map((p) => (
            <tr key={p.id} className="border-t text-sm">
              <td className="p-3">{new Date(p.timestamp).toLocaleDateString()}</td>
              <td className="p-3">{new Date(p.timestamp).toLocaleTimeString()}</td>
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">{p.dni}</td>
              <td className="p-3">{p.cantidad}</td>
              <td className="p-3">
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️ Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PalletTable
