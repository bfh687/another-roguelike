class GameEngine {
  constructor(options) {
    this.ctx = null;

    this.entities = [];

    // information about input
    this.click = false;
    this.keys = {};

    this.locked = false;
    this.running = false;

    // html options
    this.options = options || {
      prevent: {
        contextMenu: true,
        scrolling: true,
      },
      debugging: false,
    };
  }

  init(ctx) {
    this.ctx = ctx;
    this.mouse = {
      x: this.ctx.canvas.width / 2,
      y: this.ctx.canvas.height / 2,
    };
    this.startInput();
    this.timer = new Timer();
    this.camera = new Camera(this);
  }

  start() {
    this.running = true;
    const gameLoop = () => {
      this.loop();
      if (this.running) {
        requestAnimFrame(gameLoop, this.ctx.canvas);
      }
    };
    gameLoop();
  }

  startInput() {
    const getXandY = (e) => ({
      pressed: true,
      x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
      y: e.clientY - this.ctx.canvas.getBoundingClientRect().top,
    });

    // on click, lock input
    this.ctx.canvas.onclick = () => {
      if (!this.locked) {
        this.ctx.canvas.requestPointerLock({
          unadjustedMovement: true,
        });
        this.mouse.x = this.ctx.canvas.width / 2;
        this.mouse.y = this.ctx.canvas.height / 2;
        this.locked = true;
      }
    };

    const lockChangeAlert = () => {
      if (document.pointerLockElement === this.ctx.canvas || document.mozPointerLockElement === this.ctx.canvas) {
        document.addEventListener("mousemove", updatePosition, false);
        this.locked = true;
      } else {
        document.removeEventListener("mousemove", updatePosition, false);
        this.locked = false;
      }
    };

    // handle locked cursor movement
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

    const updatePosition = (e) => {
      this.mouse.x = Math.min(Math.max(0 + 5, (this.mouse.x += e.movementX)), this.ctx.canvas.width - 5);
      this.mouse.y = Math.min(Math.max(0 + 5, (this.mouse.y += e.movementY)), this.ctx.canvas.height - 5);
    };

    window.addEventListener("keydown", (e) => {
      if (e.key == " " || e.key == "Tab") e.preventDefault();
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.ctx.canvas.addEventListener("mousedown", (e) => {
      this.click = true;
    });

    this.ctx.canvas.addEventListener("mouseup", (e) => {
      this.click = false;
    });

    this.mouse.x = this.ctx.canvas.width / 2;
    this.mouse.y = this.ctx.canvas.height / 2;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.ctx, this);
    }
  }

  update() {
    this.entities.forEach((entity) => entity.update(this));
    this.entities = this.entities.filter((entity) => !entity.remove);
  }

  loop() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();

    this.camera.update();
    this.camera.draw(this.ctx);
  }

  width() {
    return this.ctx?.canvas?.width || 0;
  }

  height() {
    return this.ctx?.canvas?.height || 0;
  }
}
