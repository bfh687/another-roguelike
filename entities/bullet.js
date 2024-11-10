class Bullet {
  constructor(dir_x, dir_y) {
    Object.assign(this, { dir_x, dir_y });

    this.x = engine.player.x;
    this.y = engine.player.y;

    this.speed = 3000;
    this.lifetime = 0.25;
    this.damage = 10;
  }

  update() {
    const oldX = this.x;
    const oldY = this.y;

    const newX = oldX + this.speed * this.dir_x * engine.clockTick;
    const newY = oldY + this.speed * this.dir_y * engine.clockTick;

    // update bullet position
    this.x += this.speed * this.dir_x * engine.clockTick;
    this.y += this.speed * this.dir_y * engine.clockTick;

    // check for collisions
    engine.entities
      .filter((entity) => entity instanceof Enemy)
      .forEach((entity) => {
        if (entity.bb.collideLine(oldX, oldY, newX, newY)) {
          entity.damage(this.damage);
          this.remove = true;
        }
      });

    // update lifetime
    this.lifetime -= engine.clockTick;
    if (this.lifetime <= 0) this.remove = true;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x - engine.camera.x, this.y - engine.camera.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
}
