class HUD {
  constructor() {}
  update() {}

  draw(ctx) {
    this.drawBulletInfo(ctx);
    this.drawCrosshair(ctx);
  }

  drawBulletInfo(ctx) {
    const bullets = engine.player.bullets;
    const max_bullets = 10;

    ctx.font = "30px Arial";
    const text = (bullets < 10 ? "0" : "") + bullets + " / " + max_bullets;
    ctx.fillText(text, 10, 30);

    ctx.fillRect(10, 40, ctx.measureText(text).width * ((1 - engine.player.reload_time) / 1), 10);
  }

  drawCrosshair(ctx) {
    ctx.drawImage(assets.getAsset("./sprites/crosshair.png"), 0, 0, 128, 128, engine.mouse.x - 32, engine.mouse.y - 32, 64, 64);
  }
}
