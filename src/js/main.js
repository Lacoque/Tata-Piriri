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
    //configuracion de Google Drive API
    
const { google } = require('googleapis');
const fs = require('fs');

async function uploadFileToDrive(file) {
    
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credenciales.json', 
        scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    const drive = google.drive({ version: 'v3', auth });

    // Crear un archivo temporal para subir
    const tempFilePath = `/tmp/${file.name}`;
    fs.writeFileSync(tempFilePath, file);

    // Subir el archivo a Google Drive
    const response = await drive.files.create({
        requestBody: {
            name: file.name, // Nombre del archivo
            mimeType: file.type // Tipo MIME del archivo
        },
        media: {
            mimeType: file.type,
            body: fs.createReadStream(tempFilePath)
        }
    });


}
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
                } catch (error) {
                    console.error("Error al inicializar FileUploadWithPreview:", error);
                }
            })
            .catch(error => {
                console.error("Error al cargar FileUploadWithPreview:", error);
            });
    }

    // Remplazar imagen de bg de la carga de archivos en el formulario
    const imgBgFile = 'url("/assets/img/marca-tata-piriri.png")';

    // Características de file-upload
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

    // Seleccionar el formulario
    const form = document.querySelector('form[name="contact"]');
    if (!form) {
        console.error("El formulario no fue encontrado en el DOM.");
        return;
    }

    // Inicializar EmailJS con la API
    emailjs.init('3-Q_I_P3_12dxNIJb'); 
    // Función para subir archivos a Google Drive
    async function uploadFileToDrive(file) {
        const { google } = await import('googleapis');
        const fs = require('fs');
        // Configurar autenticación de Google Drive
        const auth = new google.auth.GoogleAuth({
            keyFile: 'credenciales.json', // Reemplaza con la ruta a tus credenciales JSON
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });

        const drive = google.drive({ version: 'v3', auth });
         // Crear un archivo temporal para subir
         const tempFilePath = `/tmp/${file.name}`;
         fs.writeFileSync(tempFilePath, file);
          // Subir el archivo a Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: file.name, // Nombre del archivo
                mimeType: file.type // Tipo MIME del archivo
            },
            media: {
                mimeType: file.type,
                body: fs.createReadStream(tempFilePath)
            }
        });
        // Obtener el enlace de descarga
        const fileId = response.data.id;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });

        return result.data.webContentLink; // Enlace de descarga
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Detener el envío automático del formulario
        try {
            // Subir archivos a Google Drive y obtener los enlaces
        const fileLinks = await Promise.all(
            upload.cachedFileArray.map(async (file) => {
                return await uploadFileToDrive(file); // Subir cada archivo a Google Drive
            })
        );
         // Crear un objeto con los datos del formulario
         const formDataObject = {
            nombre: form.querySelector('[name="nombre"]').value,
            email: form.querySelector('[name="email"]').value,
            mensaje: form.querySelector('[name="mensaje"]').value,
            archivos: fileLinks.join('\n') // Unir los enlaces en una cadena
        };

        
        // Enviar el correo usando EmailJS
        emailjs.send('service_a3g0l17', 'template_x4mo2hj', formDataObject) // Pasar el formulario HTML como tercer parámetro
            .then(response => {
                if (response.status === 200) {
                    alert('Formulario enviado correctamente');
                    form.reset(); // Limpiar el formulario
                    upload.resetPreviewPanel(); // Limpiar la vista previa de archivos
                } else {
                    alert('Hubo un error al enviar el formulario');
                }
            })
        .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el formulario');
            });

        // Limpiar los campos de archivo adicionales después del envío
        upload.cachedFileArray.forEach(() => {
            form.removeChild(form.lastChild);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  });
})
