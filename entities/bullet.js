class Bullet {
  constructor(dir_x, dir_y) {
    Object.assign(this, { dir_x, dir_y });

    this.x = engine.player.x;
    this.y = engine.player.y;

    this.speed = 1500;
    this.lifetime = 0.5;
  }

  update() {
    // update player position
    this.x += this.speed * this.dir_x * engine.clockTick;
    this.y += this.speed * this.dir_y * engine.clockTick;

    // update lifetime
    this.lifetime -= engine.clockTick;
    if (this.lifetime <= 0) this.remove = true;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x - engine.camera.x, this.y - engine.camera.y, 7.5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
