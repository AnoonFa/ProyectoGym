import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

export const TicketeraChart = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    fetchTicketeraData();
  }, []);

  const fetchTicketeraData = async () => {
    try {
      const response = await fetch('http://localhost:3005/ticketera');
      const data = await response.json();
      const processedData = processTicketeraData(data);
      updateChartOption(processedData);
    } catch (error) {
      console.error('Error fetching ticketera data:', error);
    }
  };

  const processTicketeraData = (data) => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const filteredData = data.filter(ticket => 
      ticket.status === 'Pagado' && new Date(ticket.date) >= oneWeekAgo
    );

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const weekData = Array(7).fill(0);

    filteredData.forEach(ticket => {
      const ticketDate = new Date(ticket.date);
      const dayIndex = ticketDate.getDay();
      weekData[dayIndex] += ticket.totalPrice;
    });

    // Reordenar para que comience en Lunes
    const reorderedData = [...weekData.slice(1), weekData[0]];
    const reorderedDays = [...dayNames.slice(1), dayNames[0]];

    return { days: reorderedDays, data: reorderedData };
  };

  const updateChartOption = (processedData) => {
    setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      title: {
        left: 'center',
        text: 'Ticketeras Pagadas (Última Semana)'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: processedData.days,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Monto Total (COP)'
        }
      ],
      series: [
        {
          name: 'Monto Pagado',
          type: 'bar',
          barWidth: '60%',
          data: processedData.data
        }
      ]
    });
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
};


