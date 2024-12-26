
// Animación de navegador
const nav = document.getElementById('navegador')

gsap.fromTo(nav, { visibility: 'hidden' }, { visibility: 'visible', duration: 0.5 });

function handleScroll () {
    if (window.scrollY >= 100){
        gsap.to(nav, { visibility: 'visible', duration: 0.5, opacity: 1, transition: 0.85 });
    } else {
        gsap.to(nav, { visibility: 'hidden', duration: 0.5, opacity: 0, transition: 0.85 });
    }
}
window.addEventListener('scroll', handleScroll);

gsap.to(".accion h2", {
    y: 20,
    duration: 2,
    scrollTrigger: {
        trigger: ".accion",
        start: "top center",
        markers: true
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