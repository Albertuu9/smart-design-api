function sendCodeTemplate(code) {
    return `<div style="padding: 2%">
    <span>El código de verificación para recuperar la contraseña es: <b>${code}</b></span>
    <p>Gracias por utilizar smartdesign.</p>
    </div>`
}

function userRegisteredTemplate(data) {
    return `<div style="padding: 2%">
    <span>Enhorabuena <b>${data.name} ${data.surname ? data.surname : ''}</b> has sido registrado correctamente.</span>
    <p>Tu correo electrónico para acceder es: <b>${data.email}</b></p>
    <p>Tu contraseña para acceder es: <b>${data.passwordShowed}</b></p>
    <p>Puedes cambiarla en cualquier momento desde la opción <b>Mi perfil</b></p>
    <p>Gracias por utilizar smartdesign.</p>
    </div>`
}

module.exports = { sendCodeTemplate, userRegisteredTemplate }