const createError = require('http-errors');
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const routes = require('./routes')
const producer = require('./services/producer')
const consumer = require('./services/consumer')
const path = require('path');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(routes)
app.use('/public', express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const _PORT = 5001

http.listen(_PORT, function(){
  console.log(`listening on http://localhost:${_PORT}`);
});

io.on('connection', function (socket) {
  console.log('connection ! ')
  socket.emit('news', { hello: 'world' });
  socket.on('message', function(msg){
    io.emit('message', msg);
  });
});

consumer.on('message', function (message) {
    io.emit('message', JSON.stringify(message));
});
