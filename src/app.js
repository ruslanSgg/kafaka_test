require('./lib/lodash')

const express = require('express')
const bodyParser = require('body-parser')
const responseTime = require('response-time')
const cors = require('cors')
const path = require('path')

const routes = require('./routes')

const app = express()

app
  .enable('trust proxy')
  .set('x-powered-by', false)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use('/public', express.static(path.join(__dirname, '/../public')))
  .use(responseTime())
  .use(cors({
    maxAge: 30 * 24 * 3600 * 1000,
  }))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json({limit: '16MB'}))
  .use(routes)

// error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app