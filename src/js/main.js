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
   document.addEventListener("DOMContentLoaded", function () {
    // Inicializa el campo de subida de archivos
    try {
        const upload = new Upload('file-upload', {
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

        // Maneja el envío del formulario
        document.getElementById("contact-form").addEventListener("submit", async function (e) {
            e.preventDefault();

            // Obtén los datos del formulario
            let formData = new FormData(this);
            let archivos = upload.getFiles(); // Obtiene los archivos subidos

            // Verifica si se adjuntó un archivo
            // if (archivos.length === 0) {
            //     alert("Por favor, adjunta un archivo.");
            //     return;
            // }

            // Convierte el archivo a Base64
            let archivo = archivos[0]; // Tomamos el primer archivo
            let reader = new FileReader();

            reader.readAsDataURL(archivo);
            reader.onload = async function () {
                let base64File = reader.result.split(",")[1]; // Elimina el encabezado Base64

                // Prepara los datos para EmailJS
                let data = {
                    service_id: "service_a3g0l17", // Reemplaza con tu Service ID
                    template_id: "template_x4mo2hj", // Reemplaza con tu Template ID
                    user_id: "3-Q_I_P3_12dxNIJb", // Reemplaza con tu User ID
                    template_params: {
                        nombre: formData.get("nombre"),
                        email: formData.get("email"),
                        grupo: formData.get("grupo"),
                        espectaculo: formData.get("espectaculo"),
                        sinopsis: formData.get("sinopsis"),
                        duracion: formData.get("duracion"),
                        publico: formData.get("publico"),
                        origen: formData.get("origen"),
                        message: formData.get("message"),
                        archivo: base64File, // Archivo en Base64
                        archivo_nombre: archivo.name,
                        archivo_tipo: archivo.type
                    }
                };

                // Envía el correo usando EmailJS
                try {
                    let response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert("Formulario enviado con éxito.");
                        upload.clear(); // Limpia la previsualización de archivos
                        document.getElementById("contact-form").reset(); // Limpia el formulario
                    } else {
                        alert("Error al enviar el formulario. Inténtalo de nuevo.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Hubo un error al enviar el formulario.");
                }
            };
        });
    } catch (error) {
        console.error("Error al inicializar el campo de subida de archivos:", error);
    }
});
} 
)
