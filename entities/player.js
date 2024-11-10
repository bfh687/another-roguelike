class Player {
  constructor(x, y) {
    Object.assign(this, { x, y });

    this.width = 64;
    this.height = 64;
    this.scale = 4;

    this.bb = new BoundingBox(x, y, this.width * this.scale, this.height * this.scale);

    this.vision_radius = 250;
    this.xp = 0;

    this.guns = [];
    this.loadSprites();

    // 0 - idle, 1 - walk, 2 - run, 3 - light attack, 4 - heavy attack, 5 - roll
    this.state = 0;

    // 0 - down, 1 - left, 2 - up, 3 - right
    this.direction = 0;

    // movement stats
    this.velocity = { x: 0, y: 0 };
    this.speed = 350;
    this.sprintMult = 1.5;

    this.weapon = 0;
    this.gun = 0;

    {
      this.swapCooldown = 0.5;
      this.rollCooldown = 0.75;
    }

    this.updateBoundingBox();

    engine.player = this;
  }

  loadSprites() {
    this.animations = [];
    for (let i = 0; i < 2; i++) {
      this.animations[i] = [];
      for (let j = 0; j < 6; j++) {
        this.animations[i][j] = [];
      }
    }

    this.loadSwordSprites();
    this.loadGunSprites();
  }

  loadSwordSprites() {
    const spritesheet = assets.getAsset("./sprites/characters/hero1.png");

    /** idle */
    // down
    this.animations[0][0].push(
      new Animator(spritesheet, 0, 0, 64, 65, 12, 0.08, false, true, false)
    );
    // left
    this.animations[0][0].push(
      new Animator(spritesheet, 0, 390, 64, 65, 12, 0.08, false, true, true)
    );
    // up
    this.animations[0][0].push(
      new Animator(spritesheet, 0, 780, 64, 65, 12, 0.08, false, true, false)
    );
    /// right
    this.animations[0][0].push(
      new Animator(spritesheet, 0, 390, 64, 65, 12, 0.08, false, true, false)
    );

    /** walking */
    // down
    this.animations[0][1].push(
      new Animator(spritesheet, 0, 65, 64, 65, 8, 0.1, false, true, false)
    );
    // left
    this.animations[0][1].push(
      new Animator(spritesheet, 0, 455, 64, 65, 8, 0.1, false, true, true)
    );
    // up
    this.animations[0][1].push(
      new Animator(spritesheet, 0, 845, 64, 65, 8, 0.1, false, true, false)
    );
    // right
    this.animations[0][1].push(
      new Animator(spritesheet, 0, 455, 64, 65, 8, 0.1, false, true, false)
    );

    /** running */
    // down
    this.animations[0][2].push(
      new Animator(spritesheet, 0, 130, 64, 65, 8, 0.1, false, true, false)
    );
    // left
    this.animations[0][2].push(
      new Animator(spritesheet, 0, 520, 64, 65, 8, 0.1, false, true, true)
    );
    // up
    this.animations[0][2].push(
      new Animator(spritesheet, 0, 910, 64, 65, 8, 0.1, false, true, false)
    );
    //  right
    this.animations[0][2].push(
      new Animator(spritesheet, 0, 520, 64, 65, 8, 0.1, false, true, false)
    );

    /** light attack */
    // down
    this.animations[0][3].push(
      new Animator(spritesheet, 0, 195, 64, 65, 4, 0.08, false, false, false)
    );
    // left
    this.animations[0][3].push(
      new Animator(spritesheet, 0, 650, 64, 65, 4, 0.08, false, false, true)
    );
    // up
    this.animations[0][3].push(
      new Animator(spritesheet, 0, 975, 64, 65, 4, 0.08, false, false, false)
    );
    // right
    this.animations[0][3].push(
      new Animator(spritesheet, 0, 650, 64, 65, 4, 0.08, false, false, false)
    );

    /** heavy attack */
    // down
    this.animations[0][4].push(
      new Animator(spritesheet, 64, 260, 64, 65, 6, 0.07, false, false, false)
    );
    // left
    this.animations[0][4].push(
      new Animator(spritesheet, 0, 715, 64, 65, 5, 0.07, false, false, true)
    );
    // up
    this.animations[0][4].push(
      new Animator(spritesheet, 64, 1040, 64, 65, 6, 0.07, false, false, false)
    );
    // right
    this.animations[0][4].push(
      new Animator(spritesheet, 0, 715, 64, 65, 5, 0.07, false, false, false)
    );

    /** roll */
    // down
    this.animations[0][5].push(
      new Animator(spritesheet, 0, 325, 64, 65, 8, 0.07, false, false, true)
    );
    // left
    this.animations[0][5].push(
      new Animator(spritesheet, 0, 585, 64, 65, 6, 0.07, false, false, true)
    );
    // up
    this.animations[0][5].push(
      new Animator(spritesheet, 0, 1105, 64, 65, 8, 0.07, false, false, false)
    );
    // right
    this.animations[0][5].push(
      new Animator(spritesheet, 0, 585, 64, 65, 6, 0.07, false, false, false)
    );
  }

  loadGunSprites() {
    for (let i = 1; i <= 6; i++) {
      this.guns.push(assets.getAsset(`./sprites/characters/gun${i}.png`));
    }

    const spritesheet = assets.getAsset("./sprites/characters/hero2.png");

    /** idle */
    // down
    this.animations[1][0].push(
      new Animator(spritesheet, 0, 0, 64, 65, 12, 0.08, false, true, false)
    );
    // left
    this.animations[1][0].push(
      new Animator(spritesheet, 0, 260, 64, 65, 12, 0.08, false, true, true)
    );
    // up
    this.animations[1][0].push(
      new Animator(spritesheet, 0, 520, 64, 65, 12, 0.08, false, true, false)
    );
    // right
    this.animations[1][0].push(
      new Animator(spritesheet, 0, 260, 64, 65, 12, 0.08, false, true, false)
    );

    /** walk */
    // down
    this.animations[1][1].push(
      new Animator(spritesheet, 0, 65, 64, 65, 8, 0.08, false, true, false)
    );
    // left
    this.animations[1][1].push(
      new Animator(spritesheet, 0, 325, 64, 65, 8, 0.08, false, true, true)
    );
    // up
    this.animations[1][1].push(
      new Animator(spritesheet, 0, 520, 64, 65, 8, 0.08, false, true, false)
    );
    // right
    this.animations[1][1].push(
      new Animator(spritesheet, 0, 325, 64, 65, 8, 0.08, false, true, false)
    );

    /** sprint */
    // down
    this.animations[1][2].push(
      new Animator(spritesheet, 0, 130, 64, 65, 8, 0.08, false, true, false)
    );
    // left
    this.animations[1][2].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, true)
    );
    // up
    this.animations[1][2].push(
      new Animator(spritesheet, 0, 585, 64, 65, 8, 0.08, false, true, false)
    );
    // right
    this.animations[1][2].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, false)
    );

    /** light attack filler */
    // down
    this.animations[1][3].push(
      new Animator(spritesheet, 0, 130, 64, 65, 8, 0.08, false, true, false)
    );
    // left
    this.animations[1][3].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, true)
    );
    // up
    this.animations[1][3].push(
      new Animator(spritesheet, 0, 585, 64, 65, 8, 0.08, false, true, false)
    );
    // right
    this.animations[1][3].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, false)
    );

    /** heavy attack filler */
    // down
    this.animations[1][4].push(
      new Animator(spritesheet, 0, 130, 64, 65, 8, 0.08, false, true, false)
    );
    // left
    this.animations[1][4].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, true)
    );
    // up
    this.animations[1][4].push(
      new Animator(spritesheet, 0, 585, 64, 65, 8, 0.08, false, true, false)
    );
    // right
    this.animations[1][4].push(
      new Animator(spritesheet, 0, 390, 64, 65, 8, 0.08, false, true, false)
    );

    /** roll */
    // down
    this.animations[1][5].push(
      new Animator(spritesheet, 0, 195, 64, 65, 8, 0.08, false, true, false)
    );
    // left
    this.animations[1][5].push(
      new Animator(spritesheet, 0, 455, 64, 65, 6, 0.08, false, true, true)
    );
    // up
    this.animations[1][5].push(
      new Animator(spritesheet, 0, 715, 64, 65, 8, 0.08, false, true, false)
    );
    // right
    this.animations[1][5].push(
      new Animator(spritesheet, 0, 455, 64, 65, 6, 0.08, false, true, false)
    );
  }

  shoot() {
    this.shootingCooldown -= engine.clockTick;
    if (!this.shooting || this.shootingCooldown > 0) {
      return;
    }

    engine.camera.screenshake();
    this.shootingCooldown = 0.15;

    const x = engine.mouse.x + engine.camera.x;
    const y = engine.mouse.y + engine.camera.y;

    // normalize vector
    const mag = getDistance(this.x, this.y, x, y);
    const dir_x = (this.x - x) / mag;
    const dir_y = (this.y - y) / mag;

    // this.bullets--;
    // if (this.bullets == 0) this.reloading = true;
    engine.bullets.push(new Bullet(-dir_x, -dir_y));
  }

  update() {
    this.swapCooldown -= engine.clockTick;
    this.rollCooldown -= engine.clockTick;

    this.updateBoundingBox();

    engine.entities
      .filter((entity) => entity instanceof Enemy)
      .forEach((entity) => {
        if (this.hitBox?.collide(entity.bb)) {
          entity.damage(25);
          console.log("DAMAGE");
        }
      });

    this.shoot();

    const mouseX = engine.mouse.x - engine.width() / 2;
    const mouseY = engine.mouse.y - engine.height() / 2;
    const absMouseX = Math.abs(mouseX);
    const absMouseY = Math.abs(mouseY);

    // check if in an actionable state
    const isActionableState = this.isActionableState();
    if (!isActionableState) {
      if (engine.keys["q"] && this.swapCooldown < 0) {
        this.swapCooldown = 0.5;
        this.bufferWeapon = this.weapon == 0 ? 1 : 0;
      }

      const animation = this.animations[this.weapon][this.state][this.direction];

      let shouldReturn = false;
      const isAnimationDone = animation.isDone();
      if (!isAnimationDone) {
        if (this.isRollState()) {
          if (this.bufferState == null || animation.currentFrame() < 4) {
            shouldReturn = true;
            if (engine.click && this.weapon == 0) {
              this.move();
              this.bufferState = 4;
            } else {
              this.move();
            }
          }
        } else if (this.isAttackState()) {
          if (this.bufferState == null || animation < 3) {
            shouldReturn = true;
            if (engine.keys[" "] && this.isMoving()) {
              this.bufferState = 5;

              if (engine.keys.w) {
                this.velocity.y = Math.max(this.velocity.y - 1, -1);
              }

              if (engine.keys.a) {
                this.velocity.x = Math.max(this.velocity.y - 1, -1);
              }

              if (engine.keys.s) {
                this.velocity.y = Math.min(this.velocity.y + 1, 1);
              }

              if (engine.keys.d) {
                this.velocity.x = Math.min(this.velocity.x + 1, 1);
              }
            }
          }
        }
      }

      if (shouldReturn) {
        return;
      }

      animation.reset();
    }

    // calculate new state based on input
    if (this.bufferState != null) {
      this.state = this.bufferState;
      this.bufferState = null;
    } else if (this.weapon == 0 && engine.click) {
      this.state = 4;
    } else {
      this.state = 0;
    }

    if (this.weapon == 1 && engine.leftClick) {
      this.shooting = true;
    } else {
      this.shooting = false;
    }

    // if we are now in an attack state, make sure we update the direction based on the mouse
    if (this.isAttackState()) {
      if (mouseX < 0) {
        if (mouseY > 0 && absMouseY > absMouseX) {
          this.direction = 0;
        } else if (mouseY < 0 && absMouseY > absMouseX) {
          this.direction = 2;
        } else {
          this.direction = 1;
        }
      } else {
        if (mouseY > 0 && absMouseY > absMouseX) {
          this.direction = 0;
        } else if (mouseY < 0 && absMouseY > absMouseX) {
          this.direction = 2;
        } else {
          this.direction = 3;
        }
      }
      return;
    }

    // in a state where we can switch weapons
    if (this.isActionableState()) {
      if (this.bufferWeapon != null) {
        this.weapon = this.bufferWeapon;
        this.bufferWeapon = null;
      } else if (engine.keys["q"] && this.swapCooldown < 0) {
        this.swapCooldown = 0.5;
        this.weapon = this.weapon == 0 ? 1 : 0;
      }
    }

    this.move();

    // update direction
    if (this.velocity.x > 0) {
      this.direction = 3;
    } else if (this.velocity.x < 0) {
      this.direction = 1;
    } else if (this.velocity.y > 0) {
      this.direction = 0;
    } else if (this.velocity.y < 0) {
      this.direction = 2;
    }
  }

  updateBoundingBox() {
    const x = this.x;
    const y = this.y;

    this.hurtBox = !this.isRollState() ? new BoundingBox(x - 20, y - 24, 36, 64) : null;

    if (
      this.isAttackState() &&
      this.animations[this.weapon][this.state][this.direction].currentFrame() < 2
    ) {
      if (this.state === 3) {
        if (this.direction === 0) {
          this.hitBox = new BoundingBox(x - 70, y - 24, 96, 156);
        } else if (this.direction === 1) {
          this.hitBox = new BoundingBox(x - 142, y - 38, 170, 92);
        } else if (this.direction === 2) {
          this.hitBox = new BoundingBox(x - 32, y - 120, 92, 156);
        } else {
          this.hitBox = new BoundingBox(x - 32, y - 40, 170, 92);
        }
      } else {
        if (this.direction === 0) {
          this.hitBox = new BoundingBox(x - 75, y - 32, 160, 156);
        } else if (this.direction === 1) {
          this.hitBox = new BoundingBox(x - 175, y - 24, 230, 100);
        } else if (this.direction === 2) {
          this.hitBox = new BoundingBox(x - 75, y - 110, 160, 156);
        } else {
          this.hitBox = new BoundingBox(x - 48, y - 24, 230, 100);
        }
      }
    } else {
      this.hitBox = null;
    }
  }

  move() {
    // reset velocity
    if (!this.isRollState()) {
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

      // if moving, we can now see if we are rolling/sprinting, etc.
      if (this.velocity.x != 0 || (this.velocity.y != 0 && this.isActionableState())) {
        if (engine.keys[" "] && this.rollCooldown < 0) {
          this.state = 5;
          this.rollCooldown = 0.75;
        } else {
          this.state = this.isSprinting() ? 2 : 1;
        }
      }
    }

    // movement multipliers
    const normalizationFactor = this.velocity.x !== 0 && this.velocity.y !== 0 ? Math.sqrt(2) : 1;
    const sprintMult = this.isSprinting() && !this.isRollState() ? this.sprintMult : 1;
    const rollMult = this.isRollState() ? 2 : 1;

    // calculate new position
    this.x +=
      this.speed *
      sprintMult *
      rollMult *
      (this.velocity.x / normalizationFactor) *
      engine.clockTick;
    this.y +=
      this.speed *
      sprintMult *
      rollMult *
      (this.velocity.y / normalizationFactor) *
      engine.clockTick;
  }

  isMoving() {
    return (
      (engine.keys.w || engine.keys.a || engine.keys.s || engine.keys.d) &&
      (engine.keys.w != engine.keys.s || engine.keys.a != engine.keys.d)
    );
  }

  isSprinting() {
    return engine.keys["shift"];
  }

  isRolling() {
    const isAnimationDone = this.animations[this.state][this.direction].isDone();
    if (isAnimationDone) this.animations[this.state][this.direction].reset();
    return engine.keys[" "] || (this.isRollState() && !isAnimationDone);
  }

  isRollState() {
    return this.state === 5;
  }

  isAttacking() {
    const isAnimationDone = this.animations[this.state][this.direction].isDone();
    if (isAnimationDone && this.isAttackState())
      this.animations[this.state][this.direction].reset();
    return engine.click || (this.isAttackState() && !isAnimationDone);
  }

  isLightAttacking() {
    const isAnimationDone = this.animations[this.state][this.direction].isDone();
    if (isAnimationDone && this.state === 3) this.animations[this.state][this.direction].reset();
    return engine.leftClick || (this.state === 3 && !isAnimationDone);
  }

  isHeavyAttacking() {
    const isAnimationDone = this.animations[this.state][this.direction].isDone();
    if (isAnimationDone && this.state === 4) this.animations[this.state][this.direction].reset();
    return engine.rightClick || (this.state === 4 && !isAnimationDone);
  }

  isAttackState() {
    return this.state === 3 || this.state === 4;
  }

  isActionableState() {
    return this.state < 3;
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
        ctx.strokeRect(
          temp_x + i * 50 - engine.camera.x,
          temp_y + j * 50 - engine.camera.y,
          50,
          50
        );
      }
    }

    ctx.save();
    ctx.translate(this.x - engine.camera.x, this.y - engine.camera.y);

    // draw player sprite
    const tick = engine.clockTick;
    const x = -((this.width * this.scale) / 2) + 12 * this.scale;
    const y = -((this.height * this.scale) / 2);

    this.drawShadow(ctx, x, y);

    if (this.direction == 2) {
      this.drawGun(ctx, x, y);
    }

    // draw player
    this.animations[this.weapon][this.state][this.direction].drawFrame(tick, ctx, x, y, this.scale);

    if (this.direction != 2) {
      this.drawGun(ctx, x, y);
    }

    ctx.restore();

    // draw hit/hurtboxes
    if (engine.debug) {
      drawBoundingBox(this.hurtBox, ctx, "red");
      drawBoundingBox(this.hitBox, ctx, "blue");
    }
  }

  drawGun(ctx, x, y) {
    if (this.gun == null || this.state == 5 || this.weapon != 1) {
      return;
    }

    ctx.save();

    const mouseX = engine.mouse.x - engine.width() / 2;

    const spritesheet = this.guns[this.gun];

    const x1 = engine.mouse.x + engine.camera.x;
    const y1 = engine.mouse.y + engine.camera.y;

    const mag = getDistance(this.x, this.y, x1, y1);

    const dirX = (this.x - x1) / mag;
    const dirY = (this.y - y1) / mag;

    if (mouseX < 0) {
      ctx.scale(1, -1);
      ctx.translate(0, -10);
    } else {
      ctx.translate(0, 10);
    }

    const rotation = mouseX > 0 ? Math.atan2(dirY, -dirX) : -Math.atan2(dirY, -dirX);
    ctx.rotate(-rotation);

    ctx.drawImage(spritesheet, 0, 0, 16, 16, x + 64, y + 96, 16 * this.scale, 16 * this.scale);

    ctx.restore();
  }

  drawShadow(ctx, x, y) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.ellipse(x + 80, y + 172, 28, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.restore();
  }
}
