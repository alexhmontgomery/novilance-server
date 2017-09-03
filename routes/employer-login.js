// NOT BEING USED RIGHT NOW...............

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
  models.Employer.findOne({
    where: {
      email: registerEmail
    }}).then((user) => {
      if (!user) {
        const employer = models.Employer.build({
          email: registerEmail,
          password: req.body.password,
          displayName: req.body.displayName,
          description: req.body.description,
          city: req.body.city,
          state: req.body.state,
          organization: req.body.organization
        })
        employer.save()
          .then(() => {
            // TODO: redirect to login page
            res.json({
              success: true,
              message: 'New employer successfully created.'
            })
          })
          .catch((err) => {
            console.log(err)
            res.json({
              success: false,
              message: 'Unable to create user.'
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
        message: 'Failed to properly test user email against database.'
      })
    })
})

router.post('/authenticate', (req, res) => {
  const loginEmail = req.body.email.toLowerCase()
  models.Employer.findOne({
    where: {
      email: loginEmail
    }}).then((user) => {
      console.log(user)
      if (user.password !== req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Password was incorrect.'
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
          token: token
        })
      }
    })
    .catch((err) => {
      res.status(422).json({
        success: false,
        message: 'Authentication failed. User not found'
      })
      console.log(err)
    })
})

// MIDDLEWARE TO VERIFY TOKEN
router.use((req, res, next) => {
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

// USER HOME PAGE
router.get('/home', (req, res) => {
  models.Employer.findOne({
    where: {id: req.user.userId}
  }).then((employer) => {
    res.json({
      employer: employer
    })
  })
  .catch((err) => {
    res.json({
      message: 'User look up failed'
    })
    console.log(err)
  })
})

router.post('/project/create', (req, res) => {
  const newProject = models.Project.build({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    rate: req.body.rate,
    city: req.body.city,
    state: req.body.state,
    employerId: req.user.userId
  })
  newProject.save()
    .then((project) => {
      // TODO: redirect to confirmation page
      res.json({
        success: true,
        message: 'New project was successfully created',
        project: project
      })
    })
})

module.exports = router
