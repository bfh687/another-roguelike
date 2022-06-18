class Bullet {
  constructor(dir_x, dir_y) {
    Object.assign(this, { dir_x, dir_y });

    this.x = engine.player.x;
    this.y = engine.player.y;

    this.bb = new BoundingBox(this.x, this.y, 5, 5);

    this.speed = 2000;
    this.lifetime = 0.25;
    this.damage = 10;
  }

  update() {
    // update bullet position
    this.x += this.speed * this.dir_x * engine.clockTick;
    this.y += this.speed * this.dir_y * engine.clockTick;

    // update bounding box
    this.bb = new BoundingBox(this.x, this.y, 5, 5);

    // check for collisions
    engine.entities
      .filter((entity) => entity instanceof Enemy)
      .forEach((entity) => {
        if (this.bb.collide(entity.bb)) {
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
    ctx.arc(this.x - engine.camera.x, this.y - engine.camera.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
