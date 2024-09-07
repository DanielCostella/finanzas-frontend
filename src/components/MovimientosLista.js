import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovimientosLista.css';

function MovimientosLista() {
  const [movimientos, setMovimientos] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mostrarLista) {
      fetchMovimientos();
    }
  }, [mostrarLista]);

  const fetchMovimientos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/transacciones');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
      setError('Error al cargar los movimientos. Por favor, intenta de nuevo más tarde.');
    }
  };

  const toggleLista = () => {
    setMostrarLista(!mostrarLista);
  };

  return (
    <div className="movimientos-container">
      <button onClick={toggleLista} className="toggle-button">
        {mostrarLista ? 'Ocultar Movimientos' : 'Ver Movimientos'}
      </button>
      {mostrarLista && (
        <div className="movimientos-lista">
          <h3>Movimientos Recientes</h3>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Moneda</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                    <td>{movimiento.tipo}</td>
                    <td>{movimiento.categoria_nombre}</td>
                    <td>{parseFloat(movimiento.monto).toFixed(2)}</td>
                    <td>{movimiento.moneda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default MovimientosLista;