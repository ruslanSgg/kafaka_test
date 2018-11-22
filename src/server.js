const createError = require('http-errors');
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const { consumer, producer } = require('./services/kafka')
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
  socket.emit('fantasy:live', { timestamp: Date.now(), msg: 'world' });
  socket.on('fantasy:live', function(msg){
    io.emit('fantasy:live', msg);
  });
});

consumer.on('message', function (message) {
  let msg = {}
  try{
    msg = JSON.parse(message.value || {})
  } catch(err) {
    msg = {}
  }
  io.emit('fantasy:live', msg);
});
