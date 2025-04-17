document.addEventListener('DOMContentLoaded', () => {
    console.log('Evento DOMContentLoaded disparado. Verificando elementos del DOM...');

    // Referencias a los elementos del DOM
    const allDaysContainer = document.getElementById('allDaysContainer');
    const errorMessage = document.getElementById('errorMessage');

    // Validación inicial de elementos
    if (!allDaysContainer) {
        console.error('El elemento allDaysContainer no existe en el DOM. Verifica que el ID esté correctamente definido en el HTML.');
        return;
    }
    if (!errorMessage) {
        console.error('El elemento errorMessage no existe en el DOM. Verifica que el ID esté correctamente definido en el HTML.');
        return;
    }

    console.log('Elementos del DOM encontrados:', {
        allDaysContainer: allDaysContainer ? 'Encontrado' : 'No encontrado',
        errorMessage: errorMessage ? 'Encontrado' : 'No encontrado'
    });

    // Lista de días a cargar
    const days = ['Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    // Cargar todos los días al iniciar
    const loadAllDays = async () => {
        try {
            console.log('Iniciando carga de días...');

            // Manipulación de errorMessage
            console.log('Manipulando errorMessage:', { errorMessage });
            errorMessage.classList.add('hidden');

            // Limpiar contenido anterior
            console.log('Limpiando contenido de allDaysContainer:', { allDaysContainer });
            allDaysContainer.innerHTML = '';

            // Cargar cada día en paralelo
            console.log('Cargando datos para los días:', days);
            const dayPromises = days.map(day => fetchData(day));
            const results = await Promise.all(dayPromises);

            // Renderizar cada día
            console.log('Renderizando datos para los días...');
            results.forEach(({ day, data }) => {
                if (data && data.values) {
                    renderDay(day, data.values);
                } else {
                    console.warn(`No se encontraron datos para el día: ${day}`);
                }
            });

            // Verificar estado final del DOM
            console.log('Estado final del DOM:', {
                errorMessage: errorMessage || 'No encontrado',
                allDaysContainer: allDaysContainer || 'No encontrado'
            });
        } catch (error) {
            console.error('Error en loadAllDays:', error);
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.classList.remove('hidden');
        }
    };

    // Función para obtener datos de un día
    const fetchData = async (day) => {
        try {
            console.log(`Obteniendo datos para el día: ${day}`);
            const response = await fetch(`https://backend-del-tata.contenidx.workers.dev/sheet-data?day=${day}`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            console.log(`Datos recibidos para ${day}:`, data); // Log para depuración
            return { day, data };
        } catch (error) {
            console.error(`Error al cargar ${day}:`, error);
            return { day, data: null };
        }
    };

    // Función para renderizar un día
    const renderDay = (day, data) => {
        console.log(`Renderizando datos para ${day}:`, data); // Log para depuración

        const dayContainer = document.createElement('div');
        dayContainer.className = 'day-container';

        // Título del día
        const title = document.createElement('h2');
        title.textContent = day;
        dayContainer.appendChild(title);

        // Crear tabla
        if (data.length === 0) {
            console.warn(`No hay datos para renderizar en la tabla para el día: ${day}`);
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
    console.log('Iniciando carga de días...');
    loadAllDays();
});