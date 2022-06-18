const engine = new GameEngine();
const assets = new AssetManager();

assets.queueDownload("./sprites/crosshair.png");

assets.downloadAll(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // initialize and start engine
  engine.addEntity(new Player(engine.width() / 2, engine.height() / 2, 40, 40));

  engine.init(ctx);
  engine.start();

  // add player
  engine.addEntity(new HUD());
});
