const express = require('express')
const app = express()
const platform = require('./app/settings/settings')
const mongoose = require('mongoose')
const session = require('express-session');
const bodyParser = require('body-parser');

// middlewares
app.use(express.json())

app.use(session({
  secret: 'agfinformatique',
  resave: false,
  saveUninitialized: true
}))

app.set('secret', platform.settings.secret);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
const loginRoutes = require('./app/routes/login/routes');
const avatarRoutes = require('./app/routes/avatar/routes')

app.use('/', loginRoutes)
app.use('/', avatarRoutes)

// db connection
const port = platform.settings.port
mongoose.connect(platform.settings.dbUri,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}).catch((err) => {
  console.log(err)
})