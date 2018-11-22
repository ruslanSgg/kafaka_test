const {KafkaProducer} = require('./src/services/kafka')
const {kafkaConfig} = require('./src/config')
const kafkaProducer = new KafkaProducer()
// const uniqid = require('uniqid')
const csv = require('csvtojson')

const fileTXT = process.argv[2]

function delay(event) {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{resolve(event)}, event.delay)
  })
}

function createTopick(topics) {
  return new Promise((resolve, reject) => {
    kafkaProducer.producer.createTopics(topics, true, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

kafkaProducer.producer.on('ready', function () {
  console.log('Kafka producer is ready');
  createTopick([kafkaConfig.topic]).then((data) => {
    console.log(`Topic ${kafkaConfig.topic} is created.`, data)
    return data
  }).then(() => {return csv().fromFile(fileTXT)})
    .then((events) => events.map((event) => delay(event).then(kafkaProducer.sendMessage.bind(kafkaProducer))))
    .then((sendAll) => {
      return Promise.all(sendAll)
    })
    .then(() => {
      console.log('All message sent.')
      process.exit()
    })
    .catch((err) => {
    console.log('Kafka producer error: ', err);
      process.exit()
  })
});
