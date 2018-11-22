var avro = require('avsc');

var liveFantasyEvent = {
  name: 'LiveFantasyEvent',
  type: 'record',
  fields: [
   {
      name: 'timestamp',
      type: 'long'
    }, {
      name: 'playerId',
      type: 'long'
    }, {
      name: 'changePlayerId',
      type: 'long'
    }, {
      name: 'fantasyTeamId',
      type: 'long'
    }, {
      name: 'userId',
      type: 'long'
    }, {
      name: 'type',
      type: {
        name: 'EnumField',
        type: 'enum',
        symbols: ['goal', 'out', 'penalti', 'change']
      }
    }]
};

module.exports = avro.parse(liveFantasyEvent);