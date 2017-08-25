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
  models.Freelancer.findOne({
    where: {
      email: req.body.email
    }}).then((user) => {
      if (!user) {
        const freelancer = models.Freelancer.build({
          email: req.body.email,
          password: req.body.password,
          givenName: req.body.givenName,
          surname: req.body.surname,
          description: req.body.description,
          city: req.body.city,
          state: req.body.state,
          school: req.body.school
        })
        freelancer.save()
          .then(() => {
            // TODO: redirect to login page
            res.json({
              success: true,
              message: 'New freelancer successfully created.'
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
  models.Freelancer.findOne({
    where: {
      email: req.body.email
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
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token']

  // decode token
  if (token) {
    // verifies secret and checks exp
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
        // Save to request for use in other routes
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
  models.Freelancer.findOne({
    where: {id: req.user.userId}
  }).then((freelancer) => {
    res.json({
      freelancer: freelancer
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