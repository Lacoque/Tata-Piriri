const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const body = JSON.parse(event.body);
    
    const emailContent = {
        to: "tatapiriri@gmail.com",
        from: "tatapiriri@gmail.com",
        subject: "Nuevo formulario con archivos",
        text: "Has recibido un nuevo formulario con archivos adjuntos.",
        attachments: body.archivos.map((archivo) => ({
            content: archivo.base64,
            filename: archivo.nombre,
            type: archivo.tipo,
            disposition: "attachment"
        }))
    };

    try {
        await sgMail.send(emailContent);
        return { statusCode: 200, body: "Correo enviado con archivos adjuntos." };
    } catch (error) {
        return { statusCode: 500, body: "Error al enviar correo." };
    }
};
