import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import dbData from '../../Backend/Api/db.json';  // Importación directa del archivo JSON

 export const PlanesChart = () => {
  const [option, setOption] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processData = (data) => {
      const clients = data.client;
      const planCounts = {
        'Año': 0,
        'Semestre': 0,
        'Trimestre': 0,
        'Mensualidad': 0
      };

      clients.forEach(client => {
        client.planes.forEach(plan => {
          if (plan.name === 'Mensualidad') planCounts['Mensualidad']++;
          else if (plan.name === 'Trimestre') planCounts['Trimestre']++;
          else if (plan.name === 'Semestre') planCounts['Semestre']++;
          else if (plan.name === 'Año') planCounts['Año']++;
        });
      });

      const total = Object.values(planCounts).reduce((a, b) => a + b, 0);
      return Object.entries(planCounts).map(([name, value]) => ({
        name,
        value,
        percent: ((value / total) * 100).toFixed(2)
      }));
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        // Usamos directamente los datos importados
        const chartData = processData(dbData);
        setChartOption(chartData);
      } catch (error) {
        console.error('Error processing data:', error);
        // En caso de error, configuramos un gráfico vacío
        setChartOption([]);
      } finally {
        setLoading(false);
      }
    };

    const setChartOption = (chartData) => {
      setOption({
        title: {
          text: 'Distribución de Planes',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Año', 'Semestre', 'Trimestre', 'Mensualidad']
        },
        series: [
          {
            name: 'Planes',
            type: 'pie',
            radius: '50%',
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              formatter: '{b}: {c} ({d}%)'
            }
          }
        ]
      });
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando gráfico de planes...</div>;

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};