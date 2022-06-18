class Camera {
  constructor(game) {
    this.game = game;
    this.x = engine.player.x - engine.width() / 2;
    this.y = engine.player.y - engine.height() / 2;
  }

  update() {
    this.lerp();
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

  draw(ctx) {}
}
