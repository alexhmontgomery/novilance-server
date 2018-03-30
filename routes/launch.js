const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const models = require('../models')
const nodemailer = require('nodemailer')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'You have successfully connected'
  })
})

router.post('/launchRegister', (req, res) => {
  const launchEmail = req.body.email.toLowerCase()

  console.log('received: ')
  console.log(req.body)
  console.log(launchEmail)

  const prospect = models.Prospect.build({
    email: launchEmail
  })

  prospect.save()
    .then((newProspect) => {
      console.log(newProspect)

      res.json({
        success: true,
        message: "Thank you! We'll let you know when we're up and running."
      })

      const transporter = nodemailer.createTransport({
        host: 'mi3-ss15.a2hosting.com',
        port: 465,
        secure: true,
        auth: {
          user: 'info@novilance.com',
          pass: 'Hn&X{uLWWD-6'
        }
      })

      const emailText = 'New Novilance.com launch page inquiry from ' + launchEmail

      const mailOptions = {
        from: 'info@novilance.com',
        to: ['alexhmontgomery@gmail.com', 'williamfentress@gmail.com'],
        cc: ['alex@novilance.com', 'will@novilance.com'],
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
    .catch((err) => {
      console.log('Error saving email to database')
      console.log(err)

      res.json({
        success: false,
        error: err
      })
    })
})

module.exports = router
