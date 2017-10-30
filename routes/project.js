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

// CLIENT PROJECT CREATE
router.post('/project/create', (req, res) => {
  const newProject = models.Project.build({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    rate: req.body.rate,
    city: req.body.city,
    state: req.body.state,
    clientId: req.user.userId
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

// LOAD ALL Projects
router.get('/projects/all', (req, res) => {
  models.Project.findAll({
    include: [
      {model: models.Client, as: 'client'},
      {model: models.Interest, as: 'interest'}
      // {
      //   model: models.Interest,
      //   where: {
      //     freelancerId: req.user.userId
      //   },
      //   as: 'interest'
      // }
    ]
  })
    .then((projects) => {
      res.json({
        success: true,
        projects: projects
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: 'Failed to find projects.',
        error: error
      })
    })
})

// SEARCH projects
router.get('/projects/search', (req, res) => {
  const whereClause = {}
  whereClause[req.query.key] = {
    $iLike: `%${req.query.value}`
  }
  // whereClause.start = "yesterday"
  // whereClause[req.query.id] = req.query.value;

  if (req.query.key === 'client') {
    models.Project.findAll({
      include: [
        {model: models.Client, as: 'client'},
        {model: models.Interest, as: 'interest'}]
    })
    .then((projects) => {
      let clientProjects = []

      for (var i = 0; i < projects.length; i++) {
        if (projects[i].client.displayName === req.query.value) {
          clientProjects.push(projects[i])
        }
      }

      res.json({
        success: true,
        projects: clientProjects
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: 'Failed to find projects.',
        error: error
      })
    })
  } else {
    models.Project.findAll({
      where: whereClause,
      include: [
        {model: models.Client, as: 'client'},
        {model: models.Interest, as: 'interest'}]
    })
    .then((projects) => {
      res.json({
        success: true,
        projects: projects
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: 'Failed to find projects.',
        error: error
      })
    })
  }
})

// LOAD A PROJECT
router.get('/projects/:id', (req, res) => {
  console.log(req.params)
  models.Project.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {model: models.Client, as: 'client'},
      {model: models.Interest, as: 'interest'}
    ]
  })
    .then((project) => {
      models.Interest.findAll({
        where: {
          projectId: project.id
        },
        include: {
          model: models.Freelancer,
          as: 'freelancer'
        }
      }).then((interests) => {
        res.json({
          success: true,
          message: 'Project successfully found.',
          project: project,
          interests: interests
        })
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

router.post('/project/interest', (req, res) => {
  console.log('Trying to create interest----------')
  const newInterest = models.Interest.build({
    projectId: req.body.projectId,
    freelancerId: req.user.userId
  })
  newInterest.save()
    .then((interest) => {
      res.json({
        success: true,
        message: 'New interest was successfully created',
        interest: interest
      })
    })
    .catch((error) => {
      res.json({
        success: false,
        message: 'Failed to create interest.',
        error: error
      })
    })
})

router.get('/projects/:role/master', (req, res) => {
  console.log('entered route to get master list')
  if (req.params.role === 'client') {
    models.Project.findAll({
      where: {
        clientId: req.user.userId
      },
      include: {
        model: models.Interest,
        as: 'interest'
      }
    })
      .then((projects) => {
        console.log('found:' + projects)
        res.json({
          success: true,
          projects: projects
        })
      })
      .catch((error) => {
        res.json({
          success: false,
          message: 'Failed to find projects.',
          error: error
        })
      })
  } else if (req.params.role === 'freelancer') {
    models.Project.findAll({
      include: [
        {model: models.Client, as: 'client'},
        {
          model: models.Interest,
          where: {
            freelancerId: req.user.userId
          },
          as: 'interest'
        }
      ]
    })
      .then((projects) => {
        console.log('found:' + projects)
        res.json({
          success: true,
          projects: projects
        })
      })
      .catch((error) => {
        res.json({
          success: false,
          message: 'Failed to find projects.',
          error: error
        })
      })
  }
})

module.exports = router
