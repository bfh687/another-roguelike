class Animator {
  constructor(
    spritesheet,
    xStart,
    yStart,
    width,
    height,
    frameCount,
    frameDuration,
    reverse,
    loop,
    flip
  ) {
    Object.assign(this, {
      spritesheet,
      xStart,
      yStart,
      height,
      width,
      frameCount,
      frameDuration,
      reverse,
      loop,
      flip,
    });

    this.elapsedTime = 0;
    this.totalTime = this.frameCount * this.frameDuration;
    this.paused = false;
  }

  pause() {
    this.paused = true;
  }

  drawFrame(tick, ctx, x, y, scale) {
    if (!this.paused) {
      if (this.isDone()) {
        if (this.loop) {
          this.elapsedTime = 0;
        }
        return;
      }

      this.elapsedTime += tick;
    }

    var frame = Math.max(Math.min(this.currentFrame(), this.frameCount), 0);
    if (this.reverse) frame = this.frameCount - frame - 1;

    if (this.flip) {
      ctx.save();
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      this.spritesheet,
      this.xStart + frame * this.width,
      this.yStart,
      this.width,
      this.height,
      x,
      y,
      this.width * scale,
      this.height * scale
    );

    if (this.flip) {
      ctx.restore();
    }
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }

  reset() {
    this.elapsedTime = 0;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  isDone() {
    return this.elapsedTime >= this.totalTime;
  }
}
