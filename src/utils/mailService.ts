var nodemailer = require("nodemailer")
//-----------------------------------------------------------------------------
export async function sendMail(subject: any, toEmail: any, otpText: any) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW
    }
  })

  var mailOptions = {
    from: `From Time Tracker web application ${process.env.NODEMAILER_EMAIL}`,
    to: toEmail,
    subject: subject,
    text: otpText
  }

  transporter.sendMail(
    mailOptions,
    function (error: string | undefined, info: any) {
      if (error) {
        throw new Error(error)
      } else {
        console.log("Email Sent")
        return true
      }
    }
  )
}
