const {KafkaConsumer, KafkaProducer} = require('../services/kafka')
const State = require('../models/state')
const authSocket = require('../services/authSocket')
class Game {
  constructor(socket) {
    this.socket = socket
    this.socket.on('user', this.auth.bind(this))
    console.log('Satrt game: ', socket.id)
  }
  async auth(userData) {
    let rooms = []
    const authData = await authSocket(userData)
    Object.assign(this, authData)
    if(!(this.user && this.user.id)) {
      this.user = null
      return
    }
    rooms.push(this.userRoom)
    this.socket.join(rooms)
    //ToDo Get state from client, for test
    this.socket.on('fantasy:live:team', (data) => {
      this.init(data)
    })
    this.socket.on('fantasy:live:event', (data) => {
      console.log('fantasy:live:event', data)
      this.kafkaProducer.sendMessage(data)
    })
    this.socket.emit('fantasy:live:connect', {id: this.socket.id})
  }
  get userRoom() {
    return [this.whiteLabel.name, 'user', (this.user.sub || this.user.id)].join('/')
  }
  init(data) {
    console.log('User: ', this.user)
    this.fantasyTeamId = data.team
    this.state = new State(data.team, data)
    this.state.on(this.handlerState.bind(this))
    this.kafkaProducer = new KafkaProducer()
    this.kafkaConsumer = new KafkaConsumer({groupId: 'kafka-node-group-' + [data.team, this.user.id].join('-')})
    this.kafkaConsumer.rxMessages.subscribe(this.handlerKafka.bind(this))
    this.socket.to(this.userRoom).emit('fantasy:live', { init: 'ok',team: data.team, user: this.user, state: this.state.toObj });
    console.log(this.socket.rooms)
  }
  destroy() {
    // this.state.off(this.handlerState.bind(this))
  }
  handlerKafka(msg) {
    console.log('userId', msg.userId, this.user.id, msg.userId != 0 && msg.userId != this.user.id)
    console.log('fantasyTeamId', msg.fantasyTeamId, this.fantasyTeamId,  msg.fantasyTeamId != 0 && msg.fantasyTeamId != this.fantasyTeamId)
    if(msg.userId != 0 && msg.userId != this.user.id) return
    if(msg.fantasyTeamId != 0 && msg.fantasyTeamId != this.fantasyTeamId) return
    // console.log('--', msg)
    switch(msg.type) {
      case 'out':
        this.state.changes.map(change => {
          let activePlayer = this.state.activePlayers.find(ap => ap === change.activePlayer)
          let benchPlayer = this.state.benchPlayers.find(bp => bp === change.benchPlayer)
          if(!activePlayer && !benchPlayer) return
          console.log([activePlayer, benchPlayer])
          [activePlayer, benchPlayer] = [change.benchPlayer, change.activePlayer]
          console.log([activePlayer, benchPlayer])
          this.state.changes = []
        })

        break
      case 'goal':
        break
      case 'penalti':
        break
      case 'change':
        console.log('Change!!!', this.state.changes)
        let changes = this.state.changes
        changes.push({activePlayer: msg.playerId, benchPlayer: msg.changePlayerId})
        this.state.changes = changes
        break
    }
  }
  handlerState(changes) {
    // this.socket.to(this.userRoom).emit('fantasy:live', changes);
    console.log('fantasy:live', changes)
    this.socket.emit('fantasy:live', changes);
  }
}
module.exports = Game