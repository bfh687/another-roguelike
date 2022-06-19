const engine = new GameEngine();
const assets = new AssetManager();

assets.queueDownload("./sprites/crosshair.png");

assets.downloadAll(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  engine.addEntity(new Player(engine.width() / 2, engine.height() / 2, 40, 40));

  // initialize and start engine
  engine.init(ctx);
  engine.start();

  // add test entities
  engine.addEntity(new Enemy(0, -250));
  engine.addEntity(new Enemy(-150, -250));
  engine.addEntity(new Enemy(150, -250));
});
