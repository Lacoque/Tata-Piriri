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
   
   
    if (window.location.pathname.includes("form.html")) { 
        import('file-upload-with-preview')
            .then(module => {
                const FileUploadWithPreview = module.default;
                document.addEventListener('DOMContentLoaded', () => {
                    try {
                        new upload('file-upload', {
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
                });
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

    // Manejar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Detener el envío automático del formulario

        // Crear un objeto FormData para enviar los archivos
        const formData = new FormData(form);

        // Agregar los archivos seleccionados al FormData
        upload.cachedFileArray.forEach((file, index) => {
            formData.append('archivo[]', file); // Asegúrate de que el nombre coincida con el esperado por Netlify
        });

        // Enviar el formulario usando fetch este funciona sin la API
        // fetch(form.action, {
        //     method: 'POST',
        //     body: formData,
        // })
        
 fetch('/functions/email', {
 method: 'POST',
 body: multipart,
      })
        .then(response => {
            if (response.ok) {
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
    });
})
.catch(error => {
    console.error("Error al cargar FileUploadWithPreview:", error);
});
upload.cachedFileArray;
upload.emulateInputSelection(); // to open image browser
upload.resetPreviewPanel();

//     if (window.location.pathname.includes("form.html")) {
//         import('file-upload-with-preview')
//             .then(module => {
//                 console.log("Módulo cargado:", module);
//                 const FileUploadWithPreview = module.default;
    
//                 document.addEventListener('DOMContentLoaded', () => {
//                     try {
//                         const fileContainer = document.querySelector('[data-upload-id="file-upload"]');
//                         if (!fileContainer) {
//                             console.error("Contenedor de archivos no encontrado en el DOM.");
//                             return;
//                         }
    
//                         const upload = new FileUploadWithPreview('file-upload', {
//                             multiple: true,
//                             text: {
//                                 chooseFile: "Seleccioná el archivo",
//                                 browse: "Explorar",
//                                 selectedCount: "Archivos seleccionados",
//                                 label: "",
//                             },
//                             accept: ".jpg, .jpeg, .png",
//                             baseImage: 'url("/assets/img/marca-tata-piriri.png")',
//                         });
    
//                         console.log(upload);
    
//                         const form = document.querySelector('form[name="contact"]');
//                         if (!form) {
//                             console.error("Formulario no encontrado en el DOM.");
//                             return;
//                         }
    
//                         form.addEventListener('submit', async (e) => {
//                             e.preventDefault();
    
//                             const archivos = [];
//                             for (const file of upload.cachedFileArray) {
//                                 const reader = new FileReader();
//                                 reader.readAsDataURL(file);
    
//                                 await new Promise((resolve) => {
//                                     reader.onload = () => {
//                                         archivos.push({
//                                             nombre: file.name,
//                                             tipo: file.type,
//                                             base64: reader.result.split(',')[1], // Convertir a Base64
//                                         });
//                                         resolve();
//                                     };
//                                 });
//                             }
    
//                             console.log("Archivos a enviar:", archivos);
    
//                             fetch('/.netlify/functions/email', {
//                                 method: 'POST',
//                                 headers: { "Content-Type": "application/json" },
//                                 body: JSON.stringify({ archivos }),
//                             })
//                             .then(response => {
//                                 if (response.ok) {
//                                     alert('Formulario enviado correctamente');
//                                     form.reset();
//                                     upload.resetPreviewPanel();
//                                 } else {
//                                     alert('Hubo un error al enviar el formulario');
//                                 }
//                             })
//                             .catch(error => {
//                                 console.error('Error:', error);
//                                 alert('Hubo un error al enviar el formulario');
//                             });
//                         });
//                     } catch (error) {
//                         console.error("Error al inicializar FileUploadWithPreview:", error);
//                     }
//                 });
//             })
//             .catch(error => {
//                 console.error("Error al cargar FileUploadWithPreview:", error);
//             });
            
//     }
//     upload.cachedFileArray; 
//     upload.emulateInputSelection(); // to open image browser
// upload.resetPreviewPanel(); // clear all selected images

// });
