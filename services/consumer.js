var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
client = new kafka.Client(),
consumer = new Consumer(
    client,
    [
        { topic: 'top1', partition: 0 }
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
