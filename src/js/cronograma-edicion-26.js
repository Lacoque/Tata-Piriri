import Papa from 'papaparse';

async function obtenerCronograma(url) {
    const response = await fetch(url);
    const csvString = await response.text();

    const lineas = csvString.split('\n');
    const csvLimpio = lineas.slice(1).join('\n');

    return new Promise((resolve) => {
        Papa.parse(csvLimpio, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            let ultimoDiaDetectado = "";
            
            // Normalización de datos
            const datosNormalizados = results.data.map(fila => {
            if (fila.Lunes || fila.Martes || fila.Dia || fila[""]) { 
                if (fila.Dia && fila.Dia.trim() !== "") {
                ultimoDiaDetectado = fila.Dia;
                }
            }

            return {
                dia: ultimoDiaDetectado,
                obra: fila.Obra,
                grupo: fila.Grupo,
                hora: fila.Hora,
                sala: fila.Sala
            };
            }).filter(fila => fila.obra);

            resolve(datosNormalizados);
        }
        });
    });
}

async function renderCronograma() {
    const datos = await obtenerCronograma(import.meta.env.VITE_URL_CRONOGRAMA);
    const contenedor = document.querySelector('#cronograma');

    const agrupadosPorDia = datos.reduce((acc, curr) => {
        if (!acc[curr.dia]) acc[curr.dia] = [];
        acc[curr.dia].push(curr);
        return acc;
    }, {});

    contenedor.innerHTML = Object.keys(agrupadosPorDia).map(dia => `
        <div class="dia-bloque">
            <h4 class="dia-titulo">${dia}</h4>
            <div class="tabla-cronograma">
                ${agrupadosPorDia[dia].map(evento => `
                <div class="fila-evento">
                    <span class="hora">${evento.hora} hs</span>
                    <span class="obra"><strong>${evento.obra}</strong></span>
                    <span class="sala">${evento.sala}</span>
                </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}
renderCronograma();
