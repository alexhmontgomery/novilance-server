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

// FIND CLIENT PROFILE
router.get('/profile/client/:id', (req, res) => {
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
})

// EDIT CLIENT PROFILE
router.put('/profile/client/update', (req, res) => {
  console.log('request id: ' + req.params.id + 'end')
  console.log('user id: ' + req.user.userId + 'end')
  // if (req.user.userId === req.params.id) {
  console.log('passed initial test')
  models.Client.findOne({
    where: {id: req.user.userId}
  })
      .then((client) => {
        console.log('found client profile info to update')
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
              message: 'Client profile successfully updated',
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
  // } else {
  //   res.json({
  //     success: false,
  //     message: 'Cannot update profile of another user'
  //   })
  // }
})

module.exports = router
