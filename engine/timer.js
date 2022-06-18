class Timer {
  constructor() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.lastTimestamp = 0;
  }

  tick() {
    const current = Date.now();
    const delta = (current - this.lastTimestamp) / 1000;
    this.lastTimestamp = current;

    const gameDelta = Math.min(delta, this.maxStep);
    if (engine.knight && engine.knight.state != 4) {
      this.gameTime += gameDelta;
    }
    return gameDelta;
  }

  reset() {
    this.gameTime = 0;
  }
}
