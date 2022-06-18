class Enemy {
  constructor(x, y) {
    Object.assign(this, { x, y });
    this.bb = new BoundingBox(x, y, 35, 35);
    this.speed = 200;
    this.health = 100;

    // damage info
    {
      this.damage_alpha = 0;
    }
  }

  update() {
    this.damage_alpha -= engine.clockTick * 8;
    this.damage_alpha = Math.max(this.damage_alpha, 0);

    const player = engine.player;
    const dist = getDistance(this.x, this.y, player.x, player.y);
    const vec = {
      x: (player.x - this.x) / dist,
      y: (player.y - this.y) / dist,
    };

    this.x += vec.x * this.speed * engine.clockTick;
    this.y += vec.y * this.speed * engine.clockTick;

    // update bounding box
    this.bb = new BoundingBox(this.x, this.y, 35, 35);
  }

  damage(dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      // spawn new entity, then remove
      engine.entities.push(new Enemy(engine.player.x + (Math.random() - 0.5) * 500, engine.player.y + (Math.random() - 0.5) * 500));
      this.remove = true;
    }
    this.damage_alpha = 1;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#3d5555";
    ctx.fillRect(this.x - engine.camera.x - 17.5, this.y - engine.camera.y - 17.5, 35, 35);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = this.damage_alpha;
    ctx.fillStyle = "white";
    ctx.fillRect(this.x - engine.camera.x - 17.5, this.y - engine.camera.y - 17.5, 35, 35);
    ctx.restore();
  }
}
