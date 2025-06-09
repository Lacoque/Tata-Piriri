// === Función que faltaba ===
async function getAccessToken() {
  const token = localStorage.getItem('access_token'); // Cambia por el nombre que uses
  if (!token) {
    throw new Error("No se encontró el token de acceso");
  }
  return token;
}

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      
      const enviarSpan = document.getElementById('enviar');
      const enviandoSpan = document.getElementById('enviando');
      const submitButton = document.getElementById('btn-transicion');
      enviarSpan.classList.add('d-none');
      enviandoSpan.classList.remove('d-none');
      submitButton.disabled = true;
  
      
      const accessToken = await getAccessToken();
      console.log('Token de acceso:', accessToken);
  
    
      const fileUrls = await uploadFilesToGoogleDrive(upload.cachedFileArray, accessToken);
  
      // Preparar los datos 
      const formData = {
        nombre: document.querySelector('[name="nombre"]')?.value || '',
        email: document.querySelector('[name="email"]')?.value || '',
        grupo: document.querySelector('[name="grupo"]')?.value || '',
        espectaculo: document.querySelector('[name="espectaculo"]')?.value || '',
        sinopsis: document.querySelector('[name="sinopsis"]')?.value || '',
        duracion: document.querySelector('[name="duracion"]')?.value || '',
        message: document.querySelector('[name="message"]')?.value || '',
        fileUrls: fileUrls.join(', '),
      };
  
    
      await sendEmail(formData);
      
  
      const form = document.getElementById('form');
      if (form && typeof form.reset === 'function') {
        form.reset(); 
      } else {
        clearFormFields(); 
      }
      
      if (upload.resetPreviewPanel) {
        upload.resetPreviewPanel();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el formulario.');
    } finally {
      // fin del spinner 
      const enviarSpan = document.getElementById('enviar');
      const enviandoSpan = document.getElementById('enviando');
      const submitButton = document.getElementById('btn-transicion');
      enviarSpan.classList.remove('d-none');
      enviandoSpan.classList.add('d-none');
      submitButton.disabled = false;
    }
  });
  //  limpiar campos del formulario
  function clearFormFields() {
    const form = document.getElementById('form');
    if (!form) return;
  
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false; // Desmarca checkboxes y radios
      } else {
        input.value = ''; // Limpia el valor de otros campos
      }
    });
  
    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(fileInput => {
      fileInput.value = ''; // Limpia el input de archivos
    });
  }