class Orb {
  constructor(x, y, value) {
    Object.assign(this, { x, y, value });
    this.bb = new BoundingBox(x, y, 5, 5);
  }
  update() {
    const dist = getDistance(this.x, this.y, engine.player.x, engine.player.y);
    const vec = {
      x: dist <= engine.player.vision_radius ? (engine.player.x - this.x) / (dist * dist) : 0,
      y: dist <= engine.player.vision_radius ? (engine.player.y - this.y) / (dist * dist) : 0,
    };

    this.x += vec.x * 400;
    this.y += vec.y * 400;

    this.bb = new BoundingBox(this.x, this.y, 5, 5);

    if (dist < engine.player.vision_radius / 10) {
      this.remove = true;
      engine.player.xp += this.value;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x - engine.camera.x, this.y - engine.camera.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
