document.addEventListener('DOMContentLoaded', () => {
    const allDaysContainer = document.getElementById('allDaysContainer');
    const errorMessage = document.getElementById('errorMessage');
  
    // Lista de días a cargar
    const days = ['Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  
    // Cargar todos los días al iniciar
    const loadAllDays = async () => {
      try {
        errorMessage.classList.add('hidden');
        allDaysContainer.innerHTML = ''; // Limpiar contenido anterior
  
        // Cargar cada día en paralelo
        const dayPromises = days.map(day => fetchData(day));
        const results = await Promise.all(dayPromises);
  
        // Renderizar cada día
        results.forEach(({ day, data }) => {
          if (data && data.values) {
            renderDay(day, data.values);
          }
        });
      } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove('hidden');
      }
    };
  
    // Función para obtener datos de un día
    const fetchData = async (day) => {
      try {
        const response = await fetch(`https://backend-del-tata.contenidx.workers.dev/sheet-data?day=${day}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        return { day, data };
      } catch (error) {
        console.error(`Error al cargar ${day}:`, error);
        return { day, data: null };
      }
    };
  
    // Función para renderizar un día
    const renderDay = (day, data) => {
      const dayContainer = document.createElement('div');
      dayContainer.className = 'day-container';
  
      // Título del día
      const title = document.createElement('h2');
      title.textContent = day;
      dayContainer.appendChild(title);
  
      // Crear tabla
      if (data.length === 0) {
        dayContainer.innerHTML += '<p>No hay eventos</p>';
      } else {
        const table = document.createElement('table');
        table.innerHTML = `
          <thead>
            <tr>${data[0].map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.slice(1).map(row => `
              <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        `;
        dayContainer.appendChild(table);
      }
  
      allDaysContainer.appendChild(dayContainer);
    };
  
    // Iniciar carga
    loadAllDays();
  });