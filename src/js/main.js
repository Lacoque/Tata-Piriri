import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free/css/all.min.css';

import '../css/style.css';

import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';
import SplitType from 'split-type'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrollTrigger, TextPlugin);
dom.watch()

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

    

    // Slider de descripción de las obras
    const articulos = gsap.utils.toArray(".slider article")

    let scrollTween = gsap.to(articulos, {
      xPercent: -100 * (articulos.length - .75),
        ease: "none",
        scrollTrigger: {
            trigger: ".slider",
            pin: true,
            scrub: 1,
            start: "top 20%",
            end: "+=3000",
            // markers: true
        }
    })






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


  // Spinner
  // document.getElementById('btn-transicion').addEventListener('click', function () {
  //   const enviarSpan = document.getElementById('enviar');
  //   const enviandoSpan = document.getElementById('enviando');


  //   enviarSpan.classList.add('d-none');
  //   enviandoSpan.classList.remove('d-none');
  //   // Deshabilita el btn de Enviar
  //   this.disabled = true;
  //   setTimeout(() => {
  //     // Vuelve a activar el btn de Enviar
  //       enviarSpan.classList.remove('d-none');
  //       enviandoSpan.classList.add('d-none');
  //       this.disabled = false;
  //   }, 7000);
  // });



   //formulario
  // Verifica si estamos en la página del formulario
if (window.location.pathname.includes("form.html")) {
  import('file-upload-with-preview')
    .then(module => {
      const FileUploadWithPreview = module.default;
      try {
        // Inicializa el componente de subida de archivos
        new FileUploadWithPreview('file-upload', {
          multiple: true,
          text: {
            chooseFile: "Seleccioná el archivo",
            browse: "Explorar",
            selectedCount: "Archivos seleccionados",
            label: "",
          },
          accept: ".jpg, .jpeg, .png, .pdf",
          baseImage: 'url("/assets/img/marca-tata-piriri.png")',
        });
      } catch (error) {
        console.error("Error al inicializar FileUploadWithPreview:", error);
      }
    })
    .catch(error => {
      console.error("Error al cargar FileUploadWithPreview:", error);
    });
}

// Configuración del componente de subida de archivos
const imgBgFile = 'url("/assets/img/marca-tata-piriri.png")';
const upload = new FileUploadWithPreview('file-upload', {
  multiple: true,
  text: {
    chooseFile: "Seleccioná el archivo",
    browse: "Explorar",
    selectedCount: "Archivos seleccionados",
    label: "",
  },
  accept: ".jpg, .jpeg, .png, .pdf",
  baseImage: imgBgFile,
});

// Obtiene el token de acceso desde el backend
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

// Sube archivos a Google Drive
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
}

// Envía el formulario al backend
async function submitForm(formData) {
  const response = await fetch('https://backend-del-tata.contenidx.workers.dev/process-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Error al enviar el formulario: ${errorDetails}`);
  }

  return response.json();
}

// Maneja el envío del formulario
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    // Mostrar el spinner y deshabilitar el botón de envío
    const enviarSpan = document.getElementById('enviar');
    const enviandoSpan = document.getElementById('enviando');
    const submitButton = document.getElementById('btn-transicion');

    enviarSpan.classList.add('d-none');
    enviandoSpan.classList.remove('d-none');
    submitButton.disabled = true;

    // Obtener el token de acceso
    const accessToken = await getAccessToken();
    console.log('Token de acceso:', accessToken);

    // Subir archivos a Google Drive
    const fileUrls = await uploadFilesToGoogleDrive(upload.cachedFileArray, accessToken);

    // Preparar los datos del formulario
    const formData = {
      nombre: document.querySelector('[name="nombre"]')?.value || '',
      email: document.querySelector('[name="email"]')?.value || '',
      grupo: document.querySelector('[name="grupo"]')?.value || '',
      espectaculo: document.querySelector('[name="espectaculo"]')?.value || '',
      sinopsis: document.querySelector('[name="sinopsis"]')?.value || '',
      duracion: document.querySelector('[name="duracion"]')?.value || '',
      fileUrls: fileUrls.join(', '), // URLs de los archivos subidos
    };

    // Enviar el formulario al backend
    const response = await submitForm(formData);
    console.log('Respuesta del backend:', response);

    // Mostrar mensaje de éxito
    if (response.status === "success") {
      alert(response.message);
      document.getElementById('form').reset();
      upload.resetPreviewPanel();
    } else {
      alert(response.message || "Hubo un error al procesar el formulario.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al procesar el formulario.');
  } finally {
    // Ocultar el spinner y habilitar el botón de envío
    const enviarSpan = document.getElementById('enviar');
    const enviandoSpan = document.getElementById('enviando');
    const submitButton = document.getElementById('btn-transicion');

    enviarSpan.classList.remove('d-none');
    enviandoSpan.classList.add('d-none');
    submitButton.disabled = false;
  }
})
},1000)
