import React, { useEffect, useState, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import './Grafico.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Grafico() {
  const [dataPesos, setDataPesos] = useState(null);
  const [dataDolares, setDataDolares] = useState(null);
  const [totalPesos, setTotalPesos] = useState(0);
  const [totalDolares, setTotalDolares] = useState(0);
  const [error, setError] = useState(null);

  const procesarDatos = useCallback((transacciones, categorias, moneda) => {
    const ingresos = categorias.map(cat => ({
      categoria: cat.nombre,
      monto: transacciones
        .filter(t => t.categoria_id === cat.id && t.tipo === 'ingreso' && t.moneda === moneda)
        .reduce((acc, cur) => acc + parseFloat(cur.monto), 0)
    })).filter(item => item.monto > 0);

    const gastos = categorias.map(cat => ({
      categoria: cat.nombre,
      monto: transacciones
        .filter(t => t.categoria_id === cat.id && t.tipo === 'gasto' && t.moneda === moneda)
        .reduce((acc, cur) => acc + parseFloat(cur.monto), 0)
    })).filter(item => item.monto > 0);

    const labels = [...ingresos.map(i => `+ ${i.categoria}`), ...gastos.map(g => `- ${g.categoria}`)];
    const datos = [...ingresos.map(i => i.monto), ...gastos.map(g => g.monto)];
    const colores = [
      ...ingresos.map(() => 'rgba(75, 192, 192, 0.6)'),
      ...gastos.map(() => 'rgba(255, 99, 132, 0.6)')
    ];

    return { labels, datos, colores };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [transaccionesRes, categoriasRes, totalRes] = await Promise.all([
        axios.get('http://localhost:3001/transacciones'),
        axios.get('http://localhost:3001/categorias'),
        axios.get('http://localhost:3001/total')
      ]);

      const transacciones = transaccionesRes.data;
      const categorias = categoriasRes.data;
      const { totalPesos: totalPesosServer, totalDolares: totalDolaresServer } = totalRes.data;

      const datosPesos = procesarDatos(transacciones, categorias, 'pesos');
      const datosDolares = procesarDatos(transacciones, categorias, 'dolares');

      setDataPesos({
        labels: datosPesos.labels,
        datasets: [{
          data: datosPesos.datos,
          backgroundColor: datosPesos.colores,
        }]
      });
      setTotalPesos(totalPesosServer);

      setDataDolares({
        labels: datosDolares.labels,
        datasets: [{
          data: datosDolares.datos,
          backgroundColor: datosDolares.colores,
        }]
      });
      setTotalDolares(totalDolaresServer);

      setError(null);
    } catch (error) {
      console.error('Error al cargar los datos para la gráfica:', error);
      setError('Error al cargar los datos para la gráfica. Por favor, intenta de nuevo más tarde.');
    }
  }, [procesarDatos]);

  useEffect(() => {
    fetchData();
    window.addEventListener('transaccionAgregada', fetchData);
    return () => window.removeEventListener('transaccionAgregada', fetchData);
  }, [fetchData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 15,
          padding: 8,
          font: {
            size: 9
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => ({
              text: label,
              fillStyle: datasets[0].backgroundColor[i],
              hidden: false,
              lineCap: 'butt',
              lineDash: [],
              lineDashOffset: 0,
              lineJoin: 'miter',
              lineWidth: 1,
              strokeStyle: datasets[0].backgroundColor[i],
              pointStyle: 'circle',
              rotation: 0
            }))
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)}`;
          }
        }
      }
    },
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="graficos-container">
      <div className="graficos-wrapper">
        <div className="grafico">
          <h3>Pesos</h3>
          <div className="grafico-chart">
            {dataPesos && <Pie data={dataPesos} options={options} />}
          </div>
          <p>Total: ${totalPesos.toFixed(2)}</p>
        </div>
        <div className="grafico">
          <h3>Dólares</h3>
          <div className="grafico-chart">
            {dataDolares && <Pie data={dataDolares} options={options} />}
          </div>
          <p>Total: US${totalDolares.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Grafico;