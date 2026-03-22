import Papa from 'papaparse';

async function obtenerDatosCSV(url) {
    try {
        const response = await fetch(url);
        const csvString = await response.text();

        const lineas = csvString.split('\n');
        const csvLimpio = lineas.slice(1).join('\n');

    return new Promise((resolve, reject) => {
        Papa.parse(csvLimpio, {
            header: true, // Usa la primera fila como nombres de propiedades
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                resolve(results.data);
                },
            error: (error) => {
                reject(error);
            }
        });
    });
    } catch (error) {
        console.error("Error al conectar con Google Sheets:", error);
    }
}

async function renderizarProgramacion() {
    const url = import.meta.env.VITE_URL_PROGRAMACION;
    const programacion = await obtenerDatosCSV(url);

    const container = document.querySelector('#programacion-grid');

    container.innerHTML = programacion.map(item => `
            <article class="evento-card">
            <img src="${item.ruta_imagen}" alt="${item.obra}">
            <div class="info">
                <h3>${item.obra}</h3>
                <p class="grupo"><strong>${item.grupo}</strong> (${item.origen})</p>
                <p class="descripcion">${item.descripcion}</p>
                <div class="footer-card">
                <span>🕒 ${item.duracion}</span>
                </div>
            </div>
            </article>
        `).join('');
    }