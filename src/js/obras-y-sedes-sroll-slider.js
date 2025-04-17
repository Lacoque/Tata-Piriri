  // Desplazamiento inicial hacia la izquierda de las tarjetas de Obras
  const desplazamietoSlider = document.querySelector('.slider-container');
  desplazamietoSlider.classList.add('slider-offset');
  
  desplazamietoSlider.addEventListener('scroll', function() {
    if(this.scrollLeft = 60){
      desplazamietoSlider.classList.remove('slider-offset');
      console.log("Se deslpaza")
    }
  }, { once: true });