class HUD {
  constructor() {
    this.avg_fps = 0;
    this.avg_sample_ct = 0;
  }
  update() {}

  draw(ctx) {
    ctx.fillStyle = "#546b5b";
    this.drawCrosshair(ctx);
    this.drawInfo(ctx);
  }

  drawCrosshair(ctx) {
    ctx.drawImage(
      assets.getAsset("./sprites/hud/crosshair.png"),
      0,
      0,
      128,
      128,
      engine.mouse.x - 32,
      engine.mouse.y - 32,
      64,
      64
    );
  }

  drawInfo(ctx) {
    if (!engine.debug) {
      return;
    }

    // fps
    ctx.font = "15px Arial";
    const fps = Math.floor(1 / engine.clockTick);
    ctx.fillText(fps + " FPS", 10, 20);

    // avg fps
    ctx.font = "10px Arial";
    this.avg_fps += fps;
    this.avg_sample_ct++;
    ctx.fillText("AVG: " + Math.floor(this.avg_fps / this.avg_sample_ct), 10, 32);
  }
}
