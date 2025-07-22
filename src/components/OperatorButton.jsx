import React from 'react'

function OperatorButton({ operator, onClick }) {
  return (
    <button
      onClick={() => onClick(operator.dni)}
      className="bg-blue-600 text-white py-3 px-5 rounded-xl hover:bg-blue-700 transition shadow-md w-full"
    >
      {operator.nombre}
    </button>
  )
}

export default OperatorButton
