class Player {
  constructor(x, y, width, height) {
    Object.assign(this, { x, y, width, height });

    this.bb = new BoundingBox(x, y, width, height);

    // movement stats
    this.velocity = { x: 0, y: 0 };
    this.speed = 350;

    // cooldowns
    {
      this.shot_cd = 0;
      this.fire_rate = 0.33;
    }

    // gun info (temp for now)
    {
      this.bullets = 32;
      this.reloading = false;
      this.reload_time = 0.5;
    }

    engine.player = this;
  }

  update() {
    this.move();
    this.shoot();
    this.reload();
  }

  move() {
    // reset velocity
    this.velocity.x = this.velocity.y = 0;

    // up movement
    if (engine.keys.w) {
      this.velocity.y = Math.max(this.velocity.y - 1, -1);
    }

    // left movement
    if (engine.keys.a) {
      this.velocity.x = Math.max(this.velocity.y - 1, -1);
    }

    // down movement
    if (engine.keys.s) {
      this.velocity.y = Math.min(this.velocity.y + 1, 1);
    }

    //  right movement
    if (engine.keys.d) {
      this.velocity.x = Math.min(this.velocity.x + 1, 1);
    }

    // update player position
    this.x += this.speed * this.velocity.x * engine.clockTick;
    this.y += this.speed * this.velocity.y * engine.clockTick;
  }

  shoot() {
    this.shot_cd -= engine.clockTick;
    if (!this.canShoot()) return;

    engine.camera.screenshake();

    const x = engine.mouse.x + engine.camera.x;
    const y = engine.mouse.y + engine.camera.y;

    // normalize vector
    const mag = getDistance(this.x, this.y, x, y);
    const dir_x = (this.x - x) / mag;
    const dir_y = (this.y - y) / mag;

    this.bullets--;
    if (this.bullets == 0) this.reloading = true;
    engine.bullets.push(new Bullet(-dir_x, -dir_y));

    // // add extra pellets ??
    // const angle = Math.atan2(-dir_y, -dir_x);
    // const a1 = angle + Math.PI / 16;
    // const a2 = angle - Math.PI / 16;

    // const v1_x = Math.cos(a1);
    // const v1_y = Math.sin(a1);
    // const v2_x = Math.cos(a2);
    // const v2_y = Math.sin(a2);

    // engine.bullets.push(new Bullet(v1_x, v1_y));
    // engine.bullets.push(new Bullet(v2_x, v2_y));
  }

  reload() {
    if (engine.keys.r) this.reloading = true;

    if (!this.reloading) return;
    this.reload_time -= engine.clockTick;

    if (this.reload_time <= 0) {
      this.bullets = 32;
      this.reloading = false;
      this.reload_time = 1;
    }
  }

  isMoving() {
    return engine.keys.w || engine.keys.a || engine.keys.s || engine.keys.d;
  }

  canShoot() {
    if (this.shot_cd > 0 || this.bullets == 0 || !engine.click || this.reloading) return false;
    this.shot_cd = 0.33 * this.fire_rate;
    return true;
  }

  draw(ctx) {
    let temp_x;
    for (temp_x = Math.floor(this.x); temp_x % 50 != 0; temp_x--);

    let temp_y;
    for (temp_y = Math.floor(this.y); temp_y % 50 != 0; temp_y--);

    ctx.fillStyle = "#201a24";
    ctx.fillRect(0, 0, engine.width(), engine.height());

    ctx.strokeStyle = "#272030";
    for (let i = -15; i < 15; i++) {
      for (let j = -10; j < 11; j++) {
        ctx.strokeRect(temp_x + i * 50 - engine.camera.x, temp_y + j * 50 - engine.camera.y, 50, 50);
      }
    }

    ctx.save();
    ctx.fillStyle = "#f85060";

    const x = engine.mouse.x + engine.camera.x;
    const y = engine.mouse.y + engine.camera.y;

    // normalize vector
    const mag = getDistance(this.x, this.y, x, y);
    const dir_x = (this.x - x) / mag;
    const dir_y = (this.y - y) / mag;

    const rotation = Math.atan2(dir_x, dir_y);

    ctx.translate(this.x - engine.camera.x, this.y - engine.camera.y);
    ctx.rotate(-rotation);

    ctx.fillRect(-(this.width / 2), -(this.height / 2), this.width, this.height);
    ctx.restore();
  }
}
