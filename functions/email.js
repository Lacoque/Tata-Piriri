const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        const body = JSON.parse(event.body);

        if (!body.archivos || body.archivos.length === 0) {
            return { statusCode: 400, body: "No se proporcionaron archivos adjuntos." };
        }

        const emailContent = {
            to: "tatapiriri8@gmail.com",
            from: "tatapiriri8@gmail.com",
            subject: "Nuevo formulario con archivos",
            text: "Has recibido un nuevo formulario con archivos adjuntos.",
            attachments: body.archivos.map((archivo) => ({
                content: archivo.base64, // Asegúrate de que esté en base64
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

