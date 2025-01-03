
document.addEventListener("DOMContentLoaded", () => {
    // Animación de navegador
    // const nav = document.getElementById('navegador')
    
    // gsap.fromTo(nav, { visibility: 'hidden' }, { visibility: 'visible', duration: 0.5 });
    
    // function handleScroll () {
    //     if (window.scrollY >= 100){
    //         gsap.to(nav, { visibility: 'visible', duration: 0.5, opacity: 1, transition: 0.85 });
    //     } else {
    //         gsap.to(nav, { visibility: 'hidden', duration: 0.5, opacity: 0, transition: 0.85 });
    //     }
    // }
    // window.addEventListener('scroll', handleScroll);


    const nav = document.getElementById('navegador')
    const navTrigger = document.getElementById('nav-trigger')

    // gsap.set(nav, { opacity: 0, yPercent: 0});
    
    gsap.from (nav, {
        duration: 0.5, 
        opacity: 1,
        y: 0,
        scrollTrigger: {
            // trigger: navTrigger,
            trigger: "#navegador",
            start:"top top",
            end: "bottom bottom",
            scrub: true,
            toggleActions: "play none none reverse",
            // markers: true
        } 
    })




    let ticketButton = document.querySelectorAll(".checkbox-ticket");
    ticketButton.forEach(button =>{
        button.onclick = accionButton;
    })




    function accionButton (evento) {
        // alert("El boton funciona!")
        open('https://wa.me/543751362949?text=Me%20gustaría%20consultar%20por%20las%20entradas...')
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


const h2Elements = document.querySelectorAll('#info-entradas h2, #inicio .accion h2, #info-sedes h2, #obras h2, #info-programacion h2'); // Selecciona TODOS los h2

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