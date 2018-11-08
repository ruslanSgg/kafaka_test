const kafka = require('kafka-node')
const config = require('../config')
const Consumer = kafka.Consumer
const client = new kafka.Client()
const consumer = new Consumer(
    client,
    [
        { topic: config.topic, partition: 0 }
    ],
    {
        autoCommit: false
    }
);

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
})
module.exports = consumer
