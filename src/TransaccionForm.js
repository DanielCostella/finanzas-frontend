import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransaccionForm() {
  const [tipo, setTipo] = useState('ingreso');
  const [categoriaId, setCategoriaId] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moneda, setMoneda] = useState('pesos');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const result = await axios.get('http://localhost:3001/categorias');
        setCategorias(result.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
        setError('Error al cargar las categorías: ' + (error.response?.data?.error || error.message));
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const transaccionData = {
        tipo,
        categoria_id: tipo === 'gasto' ? parseInt(categoriaId) : null,
        monto: parseFloat(monto),
        fecha,
        moneda
      };

      await axios.post('http://localhost:3001/transaccion', transaccionData);
      alert(`Transacción agregada con éxito: ${monto} ${moneda}`);
      setMonto('');
      setFecha('');
      setCategoriaId('');
      window.dispatchEvent(new Event('transaccionAgregada'));
    } catch (error) {
      console.error('Error al agregar la transacción:', error);
      setError('Error al agregar la transacción: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transaccion-form container mt-4">
      <h2 className="mb-3">{tipo === 'ingreso' ? 'Ingresos' : 'Gastos'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Tipo:
            <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </label>
        </div>
        
        <div className="mb-3">
          <label className="form-label">
            Moneda:
            <select className="form-select" value={moneda} onChange={(e) => setMoneda(e.target.value)}>
              <option value="pesos">Pesos</option>
              <option value="dolares">Dólares</option>
            </select>
          </label>
        </div>
        
        {tipo === 'gasto' && (
          <div className="mb-3">
            <label className="form-label">
              Categoría:
              <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                <option value="" disabled>Selecciona una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">
            Monto:
            <input 
              type="number" 
              className="form-control"
              placeholder="Monto" 
              value={monto} 
              onChange={(e) => setMonto(e.target.value)} 
              required
            />
          </label>
        </div>
        
        <div className="mb-3">
          <label className="form-label">
            Fecha:
            <input 
              type="date" 
              className="form-control"
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
              required
            />
          </label>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Agregando...' : 'Agregar Transacción'}
        </button>
      </form>
    </div>
  );
}

export default TransaccionForm;