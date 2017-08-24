const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config/main')
const models = require('./models')
const jwt = require('jsonwebtoken')
const logger = require('morgan')
const router = express.Router()
const freelancerRoutes = require('./routes/freelancer.js')
// app.use(cors())

app.set('superSecret', config.secret)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

app.listen(config.port, () => {
  console.log(`Server is on host:port:${config.port}`)
})

// API ROUTES -------------------

// ROUTE TO AUTHENTICATE USER & CREATE TOKEN
// router.post('/authenticate', (req, res) => {
//   models.Freelancer.findOne({
//     where: {
//       username: req.body.username
//     }}).then((user) => {
//       if (user.password !== req.body.password) {
//         res.json({
//           success: false,
//           message: 'Authentication failed. Password was incorrect.'
//         })
//       } else {
//         console.log('determined password and username correct')
//
//         const secret = app.get('superSecret')
//         console.log(secret)
//         var token = jwt.sign({
//           expiresIn: 1440,
//           username: user.username,
//           password: user.password
//           // TODO: add role to pass
//         }, secret)
//
//         console.log('performed token creation')
//         // return the information including token as JSON
//         res.json({
//           success: true,
//           message: 'User is authenticated',
//           token: token
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(422).json({
//         success: false,
//         message: 'Authentication failed. User not found'
//       })
//       console.log(err)
//     })
// })
//
// // MIDDLEWARE TO VERIFY TOKEN
// router.use((req, res, next) => {
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token']
//
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     const secret = req.app.get('superSecret')
//     jwt.verify(token, secret, (err, decoded) => {
//       if (err) {
//         console.log('Error: ' + err)
//         console.log('Failed to authenticate token')
//         return res.json({
//           success: false,
//           message: 'Failed to authenticate token.'
//         })
//       } else {
//         // Save to request for use in other routes
//         req.decoded = decoded
//         console.log('Token successfully authenticated')
//         next()
//       }
//     })
//   } else {
//     console.log('No token provided')
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided.'
//     })
//   }
// })

// TEST ROUTE
app.get('/', function (req, res) {
  res.json({ message: 'This is the Novilance Homepage!' })
})

// ROUTE TO RETURN ALL USERS
// router.get('/users', function (req, res) {
//   models.Freelancer.findAll().then(function (freelancers) {
//     res.json(freelancers)
//   })
// })

// ADD API PREFIX TO ALL ROUTES
app.use('/f', freelancerRoutes)

// CREATE NEW FREELANCER FOR TESTING
// const freelancer = models.Freelancer.build({
//   username: 'alexhmonty',
//   password: 'jmayer.04',
//   email: 'alexhmontgomery@gmail.com'
// })
//
// freelancer.save().then(function (newFreelancer) {
//   console.log(newFreelancer)
// })
