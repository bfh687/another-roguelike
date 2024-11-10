class Tent {
  constructor(x, y) {
    Object.assign(this, { x, y });

    this.scale = 4;
    this.spritesheet = assets.getAsset("./sprites/characters/largetent.png");
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(
      this.spritesheet,
      0,
      0,
      142,
      84,
      this.x - engine.camera.x,
      this.y - engine.camera.y,
      142 * this.scale,
      84 * this.scale
    );
  }
}
