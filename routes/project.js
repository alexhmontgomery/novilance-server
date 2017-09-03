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

// EMPLOYER PROJECT CREATE
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

// LOAD A PROJECT
router.get('/project/:id', (req, res) => {
  console.log(req.params)
  models.Project.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: models.Employer,
      as: 'employer'
    }
  })
    .then((project) => {
      res.json({
        success: true,
        message: 'Project successfully found.',
        project: project
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: 'Failed to find project.',
        error: error
      })
    })
})

module.exports = router
