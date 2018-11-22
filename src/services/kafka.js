
const { of, fromEvent} = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');
const kafka = require('kafka-node')
const Consumer = kafka.Consumer
const Producer = kafka.Producer
const Event = require('../models/event');
const {kafkaConfig} = require('../config')

class KafkaConsumer {
  constructor(options) {
    const Client = kafka.Client
    const client = new Client(kafkaConfig.url, 'live-fantasy', {
      // sessionTimeout: 300,
      spinDelay: 100,
      retries: 2
    });

    client.on('error', function(error) {
      console.error('Kafka client error: ', error);
    });
    const defaultOptions = {
      // autoCommit: true,
      commitOffsetsOnFirstJoin: true,
      fromOffset: 'earliest',
      // fromOffset: false,
      // outOfRangeOffset: 'earliest',
      // fetchMaxWaitMs: 1000,
      // fetchMaxBytes: 1024 * 1024,
      encoding: 'buffer'
    };
    const defaultTopics = [
      {
        topic: kafkaConfig.topic,
        time: Date.now(),
        offset: 0,
        partition: 0
      },
    ]
    this.consumer = new Consumer(client, defaultTopics, Object.assign(defaultOptions, options))
    this.rxMessages = of(this.consumer).pipe(switchMap(csm => {
      return fromEvent(csm, 'message').pipe(map(message => ({ message, csm })))
    })).pipe(map(({message, csm}) => {
      var buf = new Buffer(message.value, 'binary')
      return Event.fromBuffer(buf.slice(0))
    }))
  }
}

class KafkaProducer {
  constructor(options) {
    const Client = kafka.Client
    const client = new Client(kafkaConfig.url, 'live-fantasy', {
      // sessionTimeout: 300,
      spinDelay: 100,
      retries: 2
    });
    this.topic = kafkaConfig.topic
    Object.assign(this, options)
    client.on('error', function(error) {
      console.error('Kafka client error: ', error);
    });
    this.producer = new Producer(client)

    this.producer.on('error', function (err) {
      console.log('Kafka producer error: ', err);
    })

  }
  sendMessage(event) {
    const messageBuffer = Event.toBuffer({
      timestamp: Date.now(),
      playerId: Number(event.playerId),
      changePlayerId: Number(event.changePlayerId),
      fantasyTeamId: Number(event.fantasyTeamId),
      userId: Number(event.userId),
      type: event.type,
    });

    const payload = [{
      topic: this.topic,
      messages: messageBuffer,
      attributes: 1 /* Use GZip compression for the payload */
    }];

    return new Promise((resolve, reject) => {
      this.producer.send(payload, (error, result) => {
        if (error) reject(error)
        console.log('Message sent: ', result)
        resolve(result)
      });
    });
  }
}

module.exports = {KafkaConsumer, KafkaProducer}
