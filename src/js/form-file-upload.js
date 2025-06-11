
// import { FileUploadWithPreview } from 'file-upload-with-preview';
// import 'file-upload-with-preview/dist/style.css';

//    //formulario
 
//    if (window.location.pathname.includes("form.html")) {
//     import('file-upload-with-preview')
//       .then(module => {
//         const FileUploadWithPreview = module.default;
//         try {
//           new FileUploadWithPreview('file-upload', {
//             multiple: true,
//             text: {
//               chooseFile: "Seleccioná el archivo",
//               browse: "Explorar",
//               selectedCount: "Archivos seleccionados",
//               label: "",
//             },
//             accept: ".jpg, .jpeg, .png, .pdf",
//             baseImage: 'url("/assets/img/marca-tata-piriri.png")',
//           });
//         } catch (error) {
//           console.error("Error al inicializar FileUploadWithPreview:", error);
//         }
//       })
//       .catch(error => {
//         console.error("Error al cargar FileUploadWithPreview:", error);
//       });
//   }
  
//   const imgBgFile = 'url("/assets/img/marca-tata-piriri.png")';
//   const upload = new FileUploadWithPreview('file-upload', {
//     multiple: true,
//     text: {
//       chooseFile: "Seleccioná el archivo",
//       browse: "Explorar",
//       selectedCount: "Archivos seleccionados",
//       label: "",
//     },
//     accept: ".jpg, .jpeg, .png, .pdf",
//     baseImage: imgBgFile,
//   });
// src/js/form-file-upload.js

import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';

// Configuración base
const imgBgFile = 'url("/assets/img/marca-tata-piriri.png")';

// Crea e instancia el componente y lo exporta
export const upload = new FileUploadWithPreview('file-upload', {
  multiple: true,
  text: {
    chooseFile: "Seleccioná el archivo",
    browse: "Explorar",
    selectedCount: "Archivos seleccionados",
    label: "",
  },
  accept: ".jpg, .jpeg, .png, .pdf",
  baseImage: imgBgFile,
});