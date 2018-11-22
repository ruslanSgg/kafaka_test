const Kafka = require('node-rdkafka');
const {kafkaConfig} = require('../config')

const producer = new Kafka.Producer({
  'metadata.broker.list': kafkaConfig.url,
  'client.id': 'kafka',
});

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': kafkaConfig.url,
}, {});

console.log('Kafka ver.: ', Kafka.librdkafkaVersion);

module.exports = {producer, consumer}