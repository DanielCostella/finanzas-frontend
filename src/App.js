import React from 'react';
import './App.css';
import TransaccionForm from './TransaccionForm';
import TotalActual from './TotalActual';
import CategoriaForm from './CategoriaForm';
import Grafico from './Grafico';
import MovimientosLista from './components/MovimientosLista';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestor de Finanzas</h1>
      </header>
      <main className="App-main">
        <div className="App-left-section">
          <section className="App-section">
            <TransaccionForm />
          </section>
          <section className="App-section">
            <TotalActual />
          </section>
          <section className="App-section">
            <CategoriaForm />
          </section>
        </div>
        <div className="App-right-section">
          <section className="App-chart-container">
            <h2>Distribución de Ingresos y Gastos</h2>
            <Grafico />
          </section>
          <section className="App-section">
            <MovimientosLista /> {/* Agrega el nuevo componente aquí */}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;