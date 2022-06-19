class Camera {
  constructor() {
    this.x = engine.player.x - engine.width() / 2;
    this.y = engine.player.y - engine.height() / 2;

    // camera shake variables
    this.x_offset = this.y_offset = 0;
    this.shake_duration = 0.05;
    this.shake_amplitude = 5;
  }

  update() {
    this.lerp();
    this.shake();
  }

  lerp() {
    var offset_x = engine.mouse.x - engine.width() / 2;
    offset_x = Math.max(Math.min(offset_x, 50), -50);

    var offset_y = engine.mouse.y - engine.height() / 2;
    offset_y = Math.max(Math.min(offset_y, 25), -25);

    const lerp_value = 0.1;

    const position_x = this.x;
    const target_x = engine.player.x - engine.width() / 2 + offset_x;

    const position_y = this.y;
    const target_y = engine.player.y - engine.height() / 2 + offset_y;

    const velocity_x = (target_x - position_x) * lerp_value;
    const velocity_y = (target_y - position_y) * lerp_value;

    this.x += velocity_x;
    this.y += velocity_y;
  }

  shake() {
    this.shake_duration -= engine.clockTick;

    if (this.shake_duration > 0) {
      this.x_offset = Math.random() * this.shake_amplitude - this.shake_amplitude / 2;
      this.y_offset = Math.random() * this.shake_amplitude - this.shake_amplitude / 2;
    } else {
      this.x_offset = this.y_offset = 0;
    }

    // apply shake
    this.x += this.x_offset;
    this.y += this.y_offset;
  }

  screenshake() {
    if (this.shake_duration < 0) {
      this.shake_duration = 0.05;
      this.shake_cd = 0.2;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.15;
    ctx.filter = "blur(20px)";
    ctx.beginPath();
    ctx.arc(engine.player.x - this.x, engine.player.y - this.y, engine.player.vision_radius, 0, 2 * Math.PI);
    ctx.rect(engine.width() + 40, -20, -(engine.width() + 40), engine.height() + 40);
    ctx.fill();
    ctx.restore();
  }
}
