const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const config = require('../config/main')
const models = require('../models')

app.set('superSecret', config.secret)
// router.use(expressJWT({secret: app.get('superSecret')}))
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', (req, res) => {
  const registerEmail = req.body.email.toLowerCase()

  console.log('sent: ' + req.body)

  if (req.body.role === 'freelancer') { // register for Freelancer
    models.Freelancer.findOne({
      where: {
        email: registerEmail
      }}).then((user) => {
        if (!user) {
          const freelancer = models.Freelancer.build({
            email: registerEmail,
            password: req.body.password,
            givenName: req.body.givenName,
            surname: req.body.surname,
            description: req.body.description,
            city: req.body.city,
            state: req.body.state,
            school: req.body.school
          })
          freelancer.save()
            .then((user) => {
              const secret = app.get('superSecret')
              console.log(secret)
              var token = jwt.sign({
                expiresIn: 1440,
                email: user.email,
                userId: user.id,
                role: user.role
              }, secret)

              console.log('performed token creation')
              // return the information including token as JSON
              res.json({
                success: true,
                message: 'New freelancer successfully created',
                token: token,
                role: 'freelancer',
                user: user
              })
            })
            .catch((err) => {
              console.log(err)
              res.json({
                success: false,
                error: err
              })
            })
        } else {
          res.json({
            success: false,
            message: 'User already exists. Please use another email address.'
          })
        }
      }).catch((err) => {
        res.json({
          success: false,
          error: err
        })
      })
  } else { // register for Client
    models.Client.findOne({
      where: {
        email: registerEmail
      }}).then((user) => {
        if (!user) {
          const client = models.Client.build({
            email: registerEmail,
            password: req.body.password,
            displayName: req.body.displayName,
            description: req.body.description,
            city: req.body.city,
            state: req.body.state,
            organization: req.body.organization
          })
          client.save()
            .then((user) => {
              const secret = app.get('superSecret')
              console.log(secret)
              var token = jwt.sign({
                expiresIn: 1440,
                email: user.email,
                userId: user.id,
                role: user.role
              }, secret)

              console.log('performed token creation')
              // return the information including token as JSON
              res.json({
                success: true,
                message: 'New client successfully created',
                token: token,
                role: 'client',
                user: user
              })
            })
            .catch((err) => {
              console.log(err)
              res.json({
                success: false,
                message: 'Unable to create user.',
                error: err
              })
            })
        } else {
          res.json({
            success: false,
            message: 'User already exists. Please use another email address.'
          })
        }
      }).catch((err) => {
        res.json({
          success: false,
          message: 'Failed to properly test user email against database.',
          error: err
        })
      })
  }
})

router.post('/authenticate', (req, res) => {
  const loginEmail = req.body.email.toLowerCase()

  if (req.body.role === 'freelancer') { // login as Freelancer
    models.Freelancer.findOne({
      where: {
        email: loginEmail
      }}).then((user) => {
        console.log(user)
        if (user.password !== req.body.password) {
          res.json({
            success: false,
            message: 'Authentication failed. Password did not match account associated with email.'
          })
        } else {
          console.log('determined password and username correct')

          const secret = app.get('superSecret')
          console.log(secret)
          var token = jwt.sign({
            expiresIn: 1440,
            email: user.email,
            userId: user.id,
            role: user.role
          }, secret)

          console.log('performed token creation')
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'User is authenticated',
            token: token,
            role: 'freelancer',
            user: user
          })
        }
      })
      .catch((err) => {
        res.status(422).json({
          success: false,
          message: 'Authentication failed. User not found',
          error: err
        })
        console.log(err)
      })
  } else { // login as Client
    models.Client.findOne({
      where: {
        email: loginEmail
      }}).then((user) => {
        console.log(user)
        if (user.password !== req.body.password) {
          res.json({
            success: false,
            message: 'Authentication failed. Password did not match account associated with email.'
          })
        } else {
          console.log('determined password and username correct')

          const secret = app.get('superSecret')
          console.log(secret)
          var token = jwt.sign({
            expiresIn: 1440,
            email: user.email,
            userId: user.id,
            role: user.role
          }, secret)

          console.log('performed token creation')
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'User is authenticated',
            token: token,
            role: 'client',
            user: user
          })
        }
      })
      .catch((err) => {
        res.status(422).json({
          success: false,
          message: 'Authentication failed. User not found',
          error: err
        })
        console.log(err)
      })
  }
})

// MIDDLEWARE TO VERIFY TOKEN
router.use((req, res, next) => {
  console.log(req.body)
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    const secret = req.app.get('superSecret')
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log('Error: ' + err)
        console.log('Failed to authenticate token')
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        req.user = decoded
        console.log('Token successfully authenticated')
        next()
      }
    })
  } else {
    console.log('No token provided')
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})

// CLIENT HOME PAGE
router.get('/profile', (req, res) => {
  models.Client.findOne({
    where: {id: req.user.userId}
  }).then((client) => {
    res.json({
      client: client
    })
  })
  .catch((err) => {
    res.json({
      message: 'User look up failed'
    })
    console.log(err)
  })
})

module.exports = router
