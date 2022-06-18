class Camera {
  constructor() {
    this.x = engine.player.x - engine.width() / 2;
    this.y = engine.player.y - engine.height() / 2;

    // camera shake variables
    this.x_offset = this.y_offset = 0;
    this.shake_duration = 0.05;
    this.shake_cd = 0;
  }

  update() {
    this.shake_duration -= engine.clockTick;
    this.shake_cd -= engine.clockTick;

    if (this.shake_duration > 0) {
      this.x_offset = Math.random() * 5 - 2.5;
      this.y_offset = Math.random() * 5 - 2.5;
    } else {
      this.x_offset = this.y_offset = 0;
    }

    // smooth camera if not currently screenshaking
    if (this.x_offset == 0 && this.y_offset == 0) this.lerp();

    // apply shake
    this.x += this.x_offset;
    this.y += this.y_offset;
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

  screenshake() {
    if (this.shake_duration < 0 && this.shake_cd < 0) {
      this.shake_duration = 0.05;
      this.shake_cd = 0.2;
    }
  }

  draw(ctx) {}
}
