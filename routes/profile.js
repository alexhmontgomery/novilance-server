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

// FIND PROFILE OF FREELANCER OR CLIENT
router.get('/profile/:role/:id', (req, res) => {
  if (req.params.role === 'client') {
    models.Client.findOne({
      where: {id: req.params.id}
    })
      .then((client) => {
        res.json({
          success: true,
          message: 'Client profile successfully found',
          client: client
        })
      })
      .catch((error) => {
        res.json({
          success: false,
          message: 'Failed to find client profile',
          error: error
        })
      })
  } else if (req.params.role === 'freelancer') {
    models.Freelancer.findOne({
      where: {id: req.params.id}
    })
      .then((freelancer) => {
        res.json({
          success: true,
          message: 'Freelancer profile successfully found',
          freelancer: freelancer
        })
      })
      .catch((error) => {
        res.json({
          success: false,
          message: 'Failed to find freelancer profile',
          error: error
        })
      })
  }
})

// UPDATE USER PROFILE
router.put('/profile/:role/update', (req, res) => {
  if (req.params.role === 'client') {
    models.Client.findOne({
      where: {id: req.user.userId}
    })
        .then((client) => {
          client.displayName = req.body.displayName
          client.organization = req.body.organization
          client.description = req.body.description
          client.city = req.body.city
          client.state = req.body.state
          client.save()
            .then((client2) => {
              console.log('updated client profile info')
              res.json({
                success: true,
                message: 'Your profile was successfully updated',
                client: client2
              })
            })
        })
        .catch((error) => {
          res.json({
            success: false,
            message: 'Unable to update your profile',
            error: error
          })
        })
  } else if (req.params.role === 'freelancer') {
    models.Freelancer.findOne({
      where: {id: req.user.userId}
    })
        .then((freelancer) => {
          freelancer.givenName = req.body.givenName
          freelancer.surname = req.body.surname
          freelancer.description = req.body.description
          freelancer.city = req.body.city
          freelancer.state = req.body.state
          freelancer.school = req.body.school
          freelancer.save()
            .then((freelancer2) => {
              console.log('updated freelancer profile info')
              res.json({
                success: true,
                message: 'Your profile was successfully updated',
                freelancer: freelancer2
              })
            })
        })
        .catch((error) => {
          res.json({
            success: false,
            message: 'Unable to update your profile',
            error: error
          })
        })
  }
})

module.exports = router
