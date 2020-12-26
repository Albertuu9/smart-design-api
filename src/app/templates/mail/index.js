function sendCodeTemplate(code) {
    return `<div style="padding: 2%">
    <span>El código de verificación para recuperar la contraseña es: <b>${code}</b></span>
    <p>Gracias por utilizar smartdesign.</p>
    </div>`
}

module.exports = { sendCodeTemplate }