var _states = {}
class State {
  constructor(fantasyTeamId, stateOptions) {
    if(_states[fantasyTeamId]){
      return _states[fantasyTeamId];
    }
    this._eventListeners = []
    this._state = null
    this.defaultState = {
      fantasyTeamId: fantasyTeamId,
      activePlayers: [],
      benchPlayers: [],
      changes: [],
      capitan: null,
    }
    this.stateInit(Object.assign(this.defaultState, stateOptions))
    _states[fantasyTeamId] = this
  }
  stateInit(obj) {
    this._state = obj
    Object.keys(this._state).map(key => {
      Object.defineProperty(this, key, {
        get: function() {
          return this._state[key]
          },
        set: function(newValue) {
          this._state[key] = newValue
          this.cmd({method:'set', field: key, value: this._state[key]})
          },
        enumerable: true,
        configurable: true
      });
    })
  }
  get toObj() {
    return this._state
  }

  on(callback) {
    this._eventListeners.push(callback)
  }
  off(callback) {
    delete this._eventListeners.find(c => c === callback)
  }
  muteOn() {
    this._mute = true
  }
  muteOff() {
    this._mute = false
  }
  cmd(prm) {
    if(this._eventListeners && this._eventListeners.length && !this._mute) {
      this._eventListeners.map(callback => callback(prm))
    }
  }
}

module.exports = State