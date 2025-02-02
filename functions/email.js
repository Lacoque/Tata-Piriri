const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        const body = JSON.parse(event.body);

        const emailContent = {
            to: "tatapiriri8@gmail.com",
            from: "tatapiriri8@gmail.com",
            subject: "Nuevo formulario con archivos adjuntos",
            text: `
                Nombre del Referente: ${body.nombre}
                Correo del Referente: ${body.email}
                Grupo/Compañía: ${body.grupo}
                Nombre del Espectáculo: ${body.espectaculo}
                Sinopsis: ${body.sinopsis}
                Duración: ${body.duracion} minutos
                Público recomendado: ${body.role}
                Origen: ${body.origen}
                Mensaje adicional: ${body.message || "No hay mensaje adicional"}
            `,
            attachments: body.archivos.map((archivo) => ({
                content: archivo.base64, // Base64 sin el prefijo
                filename: archivo.nombre,
                type: archivo.tipo,
                disposition: "attachment"
            }))
        };

        await sgMail.send(emailContent);
        return { statusCode: 200, body: "Correo enviado con archivos adjuntos." };
    } catch (error) {
        console.error("Error al enviar correo:", error);
        return { statusCode: 500, body: `Error al enviar correo: ${error.message}` };
    }
};

