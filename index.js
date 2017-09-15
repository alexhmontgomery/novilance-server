const express = require('express')
const app = express()
const cors = require('cors') // TODO: Determine if needed to add later
const bodyParser = require('body-parser')
const config = require('./config/main')
const models = require('./models')
const jwt = require('jsonwebtoken')
const logger = require('morgan')
const router = express.Router()
const authenticateRoutes = require('./routes/authenticate.js')
const projectRoutes = require('./routes/project.js')
// const freelancerLoginRoutes = require('./routes/freelancer-login.js')
// const employerLoginRoutes = require('./routes/employer-login.js')

app.set('superSecret', config.secret)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'))

app.listen(config.port, () => {
  console.log(`Server is on host:port:${config.port}`)
})

app.get('/', function (req, res) {
  res.json({ message: 'This is the Novilance Homepage!' })
})

const client = models.Client.build({
  email: 'test@whatever.com',
  password: 'password',
  displayName: 'TESTERSSSS',
  description: 'Company that needs developers',
  city: 'Houston',
  state: 'Texas',
  organization: 'Test Company Group'
})

client.save().then(function (newClient) {
  console.log(newClient)
})

// CREATE NEW FREELANCER FOR TESTING
// const freelancer = models.Freelancer.build({
//   username: 'tester',
//   email: 'test@aol.com',
//   password: 'testword',
//   givenName: 'Tester',
//   surname: 'Name',
//   description: 'test agent',
//   city: 'Houston',
//   state: 'Texas',
//   school: 'The Iron Yard'
// })
//
// freelancer.save().then(function (newFreelancer) {
//   console.log(newFreelancer)
// })

app.use('/', authenticateRoutes)
app.use('/', projectRoutes)

// app.use('/f', freelancerLoginRoutes)
// app.use('/e', employerLoginRoutes)
