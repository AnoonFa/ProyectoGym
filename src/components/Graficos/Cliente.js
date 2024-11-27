import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export const ClientCreationChart = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const response = await fetch('http://localhost:3005/client');
      const data = await response.json();
      const processedData = processClientData(data);
      updateChartOption(processedData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const processClientData = (data) => {
    // Ordenar los datos por fecha de creación
    const sortedData = data.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));

    // Crear un array con las fechas y valores acumulados
    const cumulativeData = [];
    let totalClients = 0;

    sortedData.forEach((client) => {
      totalClients += 1;
      const date = new Date(client.fechaCreacion); // Convertir a objeto Date
      cumulativeData.push([+date, totalClients]);  // [+timestamp, totalClientes]
    });

    return cumulativeData;
  };

  const updateChartOption = (processedData) => {
    setOption({
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: function (params) {
          const date = new Date(params[0].value[0]);
          return `Fecha: ${date.toLocaleString()}<br/>Total Clientes: ${params[0].value[1]}`;
        }
      },
      title: {
        left: 'center',
        text: 'Crecimiento de Clientes'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'time',  // Eje X en formato de tiempo
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100  // Zoom inicial
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: 'Clientes Acumulados',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: processedData
        }
      ]
    });
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};
