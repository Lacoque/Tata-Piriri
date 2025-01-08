
document.addEventListener("DOMContentLoaded", () => {
    
    if(window.location.pathname === '/' || window.location.pathname.includes('indexnuevo')){
        const nav = document.getElementById('navegador');

        gsap.from (nav, {
            duration: 0.5, 
            opacity: 0,
            y: 0,
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

})





document.addEventListener("DOMContentLoaded", () => {

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
})


const h2Elements = document.querySelectorAll('#info-entradas h2, #inicio .accion h2, #info-sedes h2, #obras h2, #info-programacion h2, #quienes-somos h2, #otros-festivales h2'); // Selecciona TODOS los h2

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