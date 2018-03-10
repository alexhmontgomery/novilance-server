const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const models = require('../models')
const nodemailer = require('nodemailer')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/launchinquiry', (req, res) => {
  const launchEmail = req.body.email.toLowerCase()

  console.log('received: ' + req.body)
  console.log(launchEmail)

  const prospect = models.Prospect.build({
    email: launchEmail
  })
  prospect.save()
    .then((newProspect) => {
      console.log(newProspect)

      res.json({
        success: true,
        message: 'Email saved successfully'
      })
    })
    .catch((err) => {
      console.log('Error saving email to database')

      res.json({
        success: false,
        error: err
      })
    })

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'alexhmontgomery@gmail.com',
      pass: 'Jennings.85'
    }
  })

  const emailText = 'New launch page inquiry from ' + launchEmail

  const mailOptions = {
    from: 'alexhmontgomery@gmail.com',
    to: 'alexhmontgomery@gmail.com',
    subject: 'Novilance Launch Inquiry',
    text: emailText
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
})

module.exports = router
