import Papa from 'papaparse';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offset } from '@popperjs/core';



document.addEventListener('DOMContentLoaded', () => {


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

    // Clona los elementos del template de Obras y los rellena con los datos del CSV "Datos_Tata_2026"
    async function renderizarProgramacion() {
        const url = import.meta.env.VITE_URL_PROGRAMACION;
        const programacion = await obtenerDatosCSV(url);

        const container = document.querySelector('#obras-grid');
        const template = document.querySelector('#template-obra');

        container.innerHTML = '';
        programacion.forEach(item => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.js-imagen').src = item.ruta_imagen;
            clone.querySelector('.js-imagen').alt = item.obra;
            clone.querySelector('.js-titulo').textContent = item.obra;
            clone.querySelector('.js-origen').textContent = item.origen;
            clone.querySelector('.js-grupo').textContent = item.grupo;
            clone.querySelector('.js-duracion').textContent = item.duracion;
            clone.querySelector('.js-descripcion').textContent = item.descripcion;

            container.appendChild(clone);
        });


        const imagenes = container.querySelectorAll('img');
        const promImagenes = Array.from(imagenes).map(img => {
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });

        await Promise.all(promImagenes);

        if (window.innerWidth >= 960) {
            iniciarSlider();
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };
    };
    renderizarProgramacion()

    function iniciarSlider() {
        let mm = gsap.matchMedia();
        mm.add("(min-width: 960px)", () => {
            
            ScrollTrigger.getAll().forEach(t => t.kill());
            
            const container = document.querySelector('#obras-grid');
            
            if(container) {
                const margin = window.innerWidth * 0.1;
                const getAmount = () => {
                    return -(container.scrollWidth - window.innerWidth + margin);
                };
                gsap.to(container, {
                    x: getAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#obras",
                        start: "top top",
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                        end: () => "+=" + Math.abs(getAmount()),
                        // markers: true,
                    },
                });
            }
        });
    }
});