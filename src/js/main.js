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






    const h2Elements = document.querySelectorAll('#info-entradas h2, #inicio .accion h2, #info-sedes h2, #obras h2, #info-programacion h2, #quienes-somos h2, #otros-festivales h2, #form h2'); // Selecciona TODOS los h2

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
    
   //formulario
  
   if (window.location.pathname.includes("form.html")) {
            import('file-upload-with-preview')
            .then(module => {
                   const FileUploadWithPreview = module.default;
    try {
        new FileUploadWithPreview('file-upload', {
        multiple: true,
        text: {
              chooseFile: "Seleccioná el archivo",
              browse: "Explorar",
              selectedCount: "Archivos seleccionados",
              label: "",
        },
    accept: ".jpg, .jpeg, .png",
    baseImage: 'url("/assets/img/marca-tata-piriri.png")',
     });
    } 
    catch (error) {
    console.error("Error al inicializar FileUploadWithPreview:", error);
    }
    })
    .catch(error => {
    console.error("Error al cargar FileUploadWithPreview:", error);
    });
    }
    const imgBgFile = 'url("/assets/img/marca-tata-piriri.png")';
    const upload = new FileUploadWithPreview('file-upload', {
    multiple: true,
    text: {
          chooseFile: "Seleccioná el archivo",
          browse: "Explorar",
          selectedCount: "Archivos seleccionados",
          label: "",
        },
    accept: ".jpg, .jpeg, .png",
    baseImage: imgBgFile,
    });
//     const form = document.querySelector('form[name="contact"]');
//     if (!form) {
//          console.error("El formulario no fue encontrado en el DOM.");
//         return;
//                }
//       form.addEventListener('submit', async (e) => {
//                            e.preventDefault();
               
//         const formData = new FormData();
//                 upload.cachedFileArray.forEach((file) => {
//                 formData.append('files', file); 
//     });
//      // Agrega los campos del formulario
//      formData.append('nombre', form.querySelector('[name="nombre"]')?.value || '');
//      formData.append('email', form.querySelector('[name="email"]')?.value || '');
//      formData.append('grupo', form.querySelector('[name="grupo"]')?.value || '');
//      formData.append('espectaculo', form.querySelector('[name="espectaculo"]')?.value || '');
//      formData.append('sinopsis', form.querySelector('[name="sinopsis"]')?.value || '');
//      formData.append('duracion', form.querySelector('[name="duracion"]')?.value || '');
//     try {
//     // Envia los archivos al backend
//     const response = await fetch('https://backend-del-tata.contenidx.workers.dev/upload', { 
//                    method: 'POST',
//                 body: formData,
//                 signal: AbortSignal.timeout(60000) 
//     });
//     const data = await response.json();
//         if (!response.ok) {
//          throw new Error(data.error || 'Error al procesar el formulario');
//     }
//     alert('Formulario enviado correctamente');
//     form.reset();
//     upload.resetPreviewPanel();
//     }
    
//     catch (error) {
//                console.error('Error:', error);
//             alert('Hubo un error al procesar el formulario. Por favor, inténtalo de nuevo.');
//             }
//        });
// Obtener el token de acceso del backend
async function getAccessToken() {
    const response = await fetch('https://backend-del-tata.contenidx.workers.dev/get-access-token', {
      method: 'GET',
    });
    const data = await response.json();
    return data.accessToken;
  }
  
  // Subir archivos directamente a Google Drive
  async function uploadFilesToGoogleDrive(files, accessToken) {
    const GOOGLE_DRIVE_FOLDER_ID = 'TU_CARPETA_ID'; // Reemplaza con tu ID de carpeta
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error al subir el archivo ${file.name}: ${response.status} ${response.statusText}. Detalles: ${errorDetails}`);
      }
  
      const data = await response.json();
      fileUrls.push(`https://drive.google.com/file/d/${data.id}/view`);
    }
  
    return fileUrls;
  }
  
  // Manejar el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    try {
      // Obtener el token de acceso
      const accessToken = await getAccessToken();
  
      // Subir archivos a Google Drive
      const fileUrls = await uploadFilesToGoogleDrive(upload.cachedFileArray, accessToken);
  
      // Enviar los datos del formulario al backend
      const formData = {
        nombre: form.querySelector('[name="nombre"]')?.value || '',
        email: form.querySelector('[name="email"]')?.value || '',
        grupo: form.querySelector('[name="grupo"]')?.value || '',
        espectaculo: form.querySelector('[name="espectaculo"]')?.value || '',
        sinopsis: form.querySelector('[name="sinopsis"]')?.value || '',
        duracion: form.querySelector('[name="duracion"]')?.value || '',
        fileUrls,
      };
  
      const response = await fetch('https://backend-del-tata.contenidx.workers.dev/process-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el formulario');
      }
  
      alert('Formulario enviado correctamente');
      form.reset();
      upload.resetPreviewPanel();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el formulario. Por favor, inténtalo de nuevo.');
    }
  });
})
console.log('Archivos seleccionados:', upload.cachedFileArray);