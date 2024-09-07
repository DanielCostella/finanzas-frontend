import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TotalActual() {
  const [totalPesos, setTotalPesos] = useState(0);
  const [totalDolares, setTotalDolares] = useState(0);
  const [error, setError] = useState(null);

  const fetchTotal = async () => {
    try {
      const result = await axios.get('http://localhost:3001/total');
      console.log('Resultado de /total:', result.data); // Para depuración
      
      setTotalPesos(parseFloat(result.data.totalPesos) || 0);
      setTotalDolares(parseFloat(result.data.totalDolares) || 0);
    } catch (error) {
      console.error('Error al cargar el total', error);
      setError('Error al cargar el total: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    fetchTotal();
    window.addEventListener('transaccionAgregada', fetchTotal);
    return () => window.removeEventListener('transaccionAgregada', fetchTotal);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="total-actual">
      <h3>Total Actual:</h3>
      <p>Pesos: ${totalPesos.toFixed(2)}</p>
      <p>Dólares: US${totalDolares.toFixed(2)}</p>
    </div>
  );
}

export default TotalActual;