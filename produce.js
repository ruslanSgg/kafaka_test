const producer = require('./services/producer')
const fs = require('fs');

const fileTXT = process.argv[3]
const topic = process.argv[2]
console.log('File: ', fileTXT.trim())
console.log('Topic: "', topic.trim(), '"')
var context = fs.readFileSync(fileTXT, 'utf8');
producer.on('ready', function () {
  context.split('\n').map(str => {
    const ss = str.split(' ')
    setTimeout(() => {
      var sentMessage = JSON.stringify({time: ss[0], type: ss[1], message: ss[2]});
      payloads = [
          { topic: topic.trim() , messages:sentMessage , partition: 0 }
      ];
      console.log('Sending: ', sentMessage)
      producer.send(payloads, function (err, data) {
          console.log('Sent: ', data);
      });
    }, ss[0])
  })

});
