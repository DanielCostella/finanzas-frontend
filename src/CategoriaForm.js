import React, { useState } from 'react';
import axios from 'axios';

function CategoriaForm() {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://localhost:3001/categoria', { nombre: nombreCategoria });
      alert('Categoría agregada con éxito');
      setNombreCategoria('');
      window.dispatchEvent(new Event('categoriaAgregada'));
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      setError('Error al agregar categoría: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="categoria-form">
      <h3>Agregar Nueva Categoría</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nombreCategoria}
          onChange={(e) => setNombreCategoria(e.target.value)}
          placeholder="Nombre de la categoría"
          required
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-2">Agregar Categoría</button>
      </form>
    </div>
  );
}

export default CategoriaForm;