// Imoprtación de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import { library, dom } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import '../css/style.css';
import '../css/style-mobile.css';

import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';
import SplitType from 'split-type'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener("DOMContentLoaded", () => {


    // Implementación del menu navegador según pantalla
    if(window.location.pathname === '/' || window.location.pathname.includes('index')){
        const nav = document.getElementById('navegador');

        gsap.from (nav, {
            duration: 0.5, 
            opacity: 0,
            // y: 0,
            scrollTrigger: {
                trigger: "#navegador",
                start:"top top",
                end: "bottom bottom",
                scrub: true,
                toggleActions: "play none none reverse",
                // markers: true
            } 
        })
    }

    // Menu mobile
    document.querySelectorAll('.nav-mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('toggle').checked = false;
      });
    });




    // Selección de mensaje según card entradas
    let ticketButton = document.querySelectorAll(".checkbox-ticket");
    ticketButton.forEach(button =>{
        button.onclick = accionButton;
    })

    function accionButton () {
        const ticketId = this.id;

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
                mensaje = "Me gustaría consultar por las Entradas"
        }
        open(`https://wa.me/543751362949?text=${encodeURIComponent(mensaje)}`);
    };



  let scrollTween;
  function initSlider() {
    const articulos = gsap.utils.toArray(".slider article");

    if (articulos.length > 0) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      scrollTween = gsap.to(articulos, {
        xPercent: -100 * (articulos.length - 0.63),
        ease: "none",
        scrollTrigger: {
          trigger: ".slider",
          pin: true,
          scrub: 1,
          start: "top 20%",
          end: "+=3000",
          // markers: true,
        },
      });
    }
  }





  function handleResize() {
    if (window.innerWidth >= 960) {
      initSlider();
    } else {
      if (scrollTween) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        scrollTween.kill();
        scrollTween = null;
      }
    }
  }

  if (window.innerWidth >= 960) {
    initSlider();
  }

  // Redimensionamiento optimizado con debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  





    const h2Elements = document.querySelectorAll('#info-entradas h2, #inicio .accion h2, #info-sedes h2, #obras h2, #info-programacion h2, #quienes-somos h2, #otros-festivales h2, #form h2, #aca-los-ves h5'); // Selecciona TODOS los h2

    h2Elements.forEach(h2 => { // Itera sobre CADA h2
        const textoSplit = new SplitType(h2); // SplitType para CADA h2

        gsap.from(textoSplit.chars, { // Usa gsap.from para animar desde un estado inicial
            yPercent: 100, // Comienza fuera de la pantalla (100% hacia abajo)
            opacity: 0, // Inicia con opacidad 0
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out", // Un easing más suave
            scrollTrigger: {
                trigger: h2, // El trigger es el h2 actual
                once: true, 
                markers: false,
            }
        });
    });



// token  desde el backend
async function getAccessToken() {
  const response = await fetch('https://backend-del-tata.contenidx.workers.dev/get-access-token', {
    method: 'GET',
  });
  if (!response.ok) {
    const errorDetails = await response.text();
    console.error('Error al obtener el token de acceso:', errorDetails);
    throw new Error(`Error al obtener el token de acceso: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.accessToken;
}

async function uploadFilesToGoogleDrive(files, accessToken) {
  const GOOGLE_DRIVE_FOLDER_ID = "1YOMFe6BxHD3tdvSLOxy5s5ztulIjMuwf";
  console.log('ID de la carpeta de Google Drive:', GOOGLE_DRIVE_FOLDER_ID);
  const fileUrls = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify({
      name: file.name,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    })], { type: 'application/json' }));
    formData.append('file', file);
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error al subir el archivo ${file.name}: ${response.status} ${response.statusText}. Detalles: ${errorDetails}`);
    }
    const data = await response.json();
    fileUrls.push(`https://drive.google.com/file/d/${data.id}/view`);
  }
  console.log('URLs de los archivos subidos:', fileUrls);
  return fileUrls;
}

// Envía el correo electrónico
async function sendEmail(formData) {
  const EMAILJS_PUBLIC_KEY = 'rJxAhBYzAk7XIFXk6';
  const EMAILJS_SERVICE_ID = 'service_a3g0l17';
  const EMAILJS_TEMPLATE_ID = 'template_x4mo2hj';

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: formData,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Error al enviar el correo: ${response.status} ${response.statusText}. Detalles: ${errorDetails}`);
  }

  const text = await response.text();
  if (text.trim() === "OK") {
    return true; 
  } else {
    throw new Error(`Respuesta inesperada de EmailJS: ${text}`);
  }
}





// Manejo de confirmación formulario Sumate
const form = document.getElementById('contact-form');
  const alertContainer = document.getElementById('alert-container');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alertContainer.innerHTML = ''; // Limpiar alertas
  
    const formData = new FormData(form); // Obtener datos del formulario
  
    fetch('/tu-ruta-en-nodejs', { // Reemplaza con la ruta correcta
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en el envío'); // Lanza un error si la respuesta no es OK
      }
      return response.json(); // Si la respuesta es OK, intenta parsear el JSON
    })
    .then(data => {
        // Si el servidor responde con un JSON, puedes acceder a los datos aquí
        // Ejemplo: if (data.success) { ... }
        const successAlert = document.createElement('div');
        successAlert.classList.add('alert', 'alert-success');
        successAlert.textContent = 'Mensaje enviado correctamente!';
        alertContainer.appendChild(successAlert);
        form.reset();
    })
    .catch(error => {
      const errorAlert = document.createElement('div');
      errorAlert.classList.add('alert', 'alert-danger');
      errorAlert.textContent = 'Error al enviar el mensaje: ' + error.message; // Muestra el mensaje de error
      alertContainer.appendChild(errorAlert);
      console.error('Error:', error);
    });
  });

});