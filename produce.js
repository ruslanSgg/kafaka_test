const producer = require('./services/producer')
const config = require('./config')
const csv=require('csvtojson')
const fs = require('fs');

const fileTXT = process.argv[2]
console.log('File: ', fileTXT.trim())
console.log('Topic: "', config.topic, '"')

function delay(event) {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{resolve(event)}, event.delay)
  })
}

function sendMessage(message) {
  payloads = [
      { topic: config.topic , messages: JSON.stringify(message) , partition: 0 }
  ];
  return new Promise((resolve, reject) => {
    producer.send(payloads, (err, data) => {
      if(err) reject(err)
      console.log('Sending: ', message.type, ':', message.msg)
      resolve(data)
    })
  })
}

producer.on('ready', function () {
  csv()
    .fromFile(fileTXT)
    .then((events) => events.map((event) => delay(event).then(sendMessage)))
    .then((sendAll) => {
      return Promise.all(sendAll)
    })
    .then(() => {
      console.log('All message sent.')
      process.exit()
    })
    .catch((err) => {
      console.error('Erorr: ',err)
      process.exit()
    })
});
