import Papa from 'papaparse';

async function obtenerDatosCSV(url) {
    try {
        const response = await fetch(url);
        const csvString = await response.text();

        const lineas = csvString.split('\n');
        const csvLimpio = lineas.slice(1).join('\n');

    return new Promise((resolve, reject) => {
        Papa.parse(csvLimpio, {
            header: true,
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

async function renderizarEntradas() {
    const url = import.meta.env.VITE_URL_ENTRADAS;
    const entradas = await obtenerDatosCSV(url);

    const container = document.querySelector('#entradas');

    container.innerHTML = entradas.map(item => `
        <article class="evento-card" id="${item.id}">
            <img src="/assets/img/img-header-entrada.png" alt="Marca del festival Tata Piriri y fecha de realización del mismo">   
            <div class="info">
                <h5>${item.tipo}</h5>
                <h2 class="precio">${item.precio}</h2>
                <hr></hr>
                <p class="sala">${item.sala}</p>
                <p>Al intercambiar la entrada aseguras tus lugares</p>
                <p class="notificacion"><i class="fa-brands fa-whatsapp"></i>Al hacer click te redirijimos a Whatsapp</p>
            </div>
        </article>
    `).join('');

    container.addEventListener('click', (e) => {
        // Con el target :last-of-type nos aseguramos de que solo se active el evento al hacer click en la última tarjeta, que es la que tiene el fondo oscuro y el mensaje de Whatsapp
        const card = e.target.closest('.evento-card:last-of-type');
        if (card) {
            comunicarWhatsApp(card.id);
        }
    })
}

function comunicarWhatsApp(ticketId) {
    let mensaje = "";
    switch (ticketId){
        case "ticket-1":
            mensaje = "Me gustaría consultar por las Entradas Generales";
            break;
        case "ticket-2":
            mensaje ="Me gustaría consultar por Entradas de Jubilados y Estudiantes";
        break;
        case "ticket-3":
            mensaje = "Me gustaría consultar por Entradas con Bono Escolar";
        break;
        default:
            mensaje = "Me gustaría consultar por las Anticipadas"
    }
    open(`https://wa.me/5493751668811?text=${encodeURIComponent(mensaje)}`, '_blank');
};

renderizarEntradas();