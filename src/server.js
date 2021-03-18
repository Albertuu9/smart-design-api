const express = require('express')
const app = express()
const platform = require('./app/settings/settings')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport');

// middlewares
app.use(express.json())
app.use(cors())


app.use(cookieSession({
  name: 'smartdesign',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());

app.set('secret', platform.settings.secret);
app.use(express.urlencoded({ extended: true }));

// routes
const loginRoutes = require('./app/routes/login/routes');
const avatarRoutes = require('./app/routes/avatar/routes')
const utilRoutes = require('./app/routes/util/routes')

app.use('/', loginRoutes)
app.use('/', utilRoutes)
app.use('/', avatarRoutes)

app.get('/', (req, res) => {
  res.send('<b>Versión: 0.1</b>');
})

// db connection
const port = process.env.PORT || platform.settings.port
mongoose.connect(platform.settings.dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}).catch((err) => {
  console.log(err)
})