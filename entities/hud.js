class HUD {
  constructor() {
    this.avg_fps = 0;
    this.avg_sample_ct = 0;
  }
  update() {}

  draw(ctx) {
    ctx.fillStyle = "#546b5b";
    this.drawBulletInfo(ctx);
    this.drawCrosshair(ctx);
    this.drawFPS(ctx);
  }

  drawBulletInfo(ctx) {
    const bullets = engine.player.bullets;
    const max_bullets = 32;

    ctx.font = "30px Arial";
    const text = (bullets <= 10 ? "0" : "") + bullets + " / " + (bullets <= 10 ? "0" : "") + max_bullets;
    ctx.fillText(text, 10, 30);

    ctx.fillRect(10, 40, ctx.measureText(text).width * ((1 - engine.player.reload_time) / 1), 10);
  }

  drawCrosshair(ctx) {
    ctx.drawImage(assets.getAsset("./sprites/crosshair.png"), 0, 0, 128, 128, engine.mouse.x - 32, engine.mouse.y - 32, 64, 64);
  }

  drawFPS(ctx) {
    ctx.font = "15px Arial";
    const fps = Math.floor(1 / engine.clockTick);
    ctx.fillText(fps + " FPS", 115, 20);

    ctx.font = "10px Arial";
    this.avg_fps += fps;
    this.avg_sample_ct++;
    ctx.fillText("AVG: " + Math.floor(this.avg_fps / this.avg_sample_ct), 117, 30);
  }
}
