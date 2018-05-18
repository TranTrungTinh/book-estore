const secretKey = '6LcFFloUAAAAAMXHtDGHC_7HuOp9M3z0aYCiibMx';
const request = require('request');

function mustCheckCaptcha(req, res, next) {
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
  request(verifyUrl, (err, response, body) => {
    const { success } = JSON.parse(body);
    if(!success) return res.send({ success: false, message: "INVALID_CAPTCHA" });
    next();
  });
}

module.exports = { mustCheckCaptcha };