module.exports = class Audio {
  constructor (url) {
    this.url = url
    this.currentTime = 0
    this.onended = null
    this.paused = true
  }

  get paused () {
    return this._paused
  }

  set paused (isPaused) {
    if (isPaused) {
      this._paused = isPaused
    }
  }

  play () {

  }

  pause () {

  }
}
