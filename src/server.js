const express = require('express')
const app = express()
const platform = require('./app/settings/settings')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
var getRealIp = require('express-real-ip')()

// middlewares
app.use(express.json())

app.use(cors())

app.use(getRealIp);

app.set('secret', platform.settings.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
const loginRoutes = require('./app/routes/login/routes');
const avatarRoutes = require('./app/routes/avatar/routes')

app.use('/', loginRoutes)
app.use('/', avatarRoutes)

app.get('/', (req, res) => {
  res.send('<b>Versión: 0.1</b>');
})

// db connection
const port = process.env.PORT || platform.settings.port
mongoose.connect(platform.settings.dbUri,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}).catch((err) => {
  console.log(err)
})