import React, { useState } from 'react';
import MyCalendar from './Calendar';
import moment from 'moment';
import './AdminCalendar.css'; // Asegúrate de tener un archivo CSS para los estilos

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToRemove, setEventToRemove] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDoubleClickEvent = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { title, start, end } = e.target.elements;

    const newEvent = {
      title: title.value,
      start: new Date(start.value),
      end: new Date(end.value)
    };

    if (selectedEvent) {
      setEvents(events.map((event) =>
        event === selectedEvent ? newEvent : event
      ));
    } else {
      setEvents([...events, newEvent]);
    }

    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleRemoveEvent = () => {
    if (eventToRemove) {
      setEvents(events.filter((event) => event !== eventToRemove));
      setEventToRemove(null);
      setShowForm(false);
    }
  }; 

  return (
    <div className="AdminCalendarContainer">
      <MyCalendar
        events={events}
        onSelectEvent={handleSelectEvent}
        onDoubleClickEvent={handleDoubleClickEvent}
      />
      <div className="CalendarButtons">
        <button onClick={() => setShowForm(true)}>Agregar Evento</button>
        <button onClick={handleRemoveEvent} disabled={!eventToRemove}>Eliminar Evento</button>
      </div>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="EventForm">
          <input
            type="text"
            name="title"
            placeholder="Título"
            defaultValue={selectedEvent ? selectedEvent.title : ''}
            required
          />
          <input
            type="datetime-local"
            name="start"
            defaultValue={
              selectedEvent ? moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') : ''
            }
            required
          />
          <input
            type="datetime-local"
            name="end"
            defaultValue={
              selectedEvent ? moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm') : ''
            }
            required
          />
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
};

export default AdminCalendar;
