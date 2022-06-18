class AssetManager {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
  }

  queueDownload(path) {
    this.downloadQueue.push(path);
  }

  isDone() {
    return this.downloadQueue.length === this.successCount + this.errorCount;
  }

  downloadAll(callback) {
    if (this.downloadQueue.length === 0) setTimeout(callback, 10);

    const self = this;
    for (let i = 0; i < this.downloadQueue.length; i++) {
      const path = this.downloadQueue[i];
      const ext = path.substring(path.length - 3);

      switch (ext) {
        case "png":
          const img = new Image();
          img.addEventListener("load", () => {
            self.successCount++;
            if (self.isDone()) callback();
          });

          img.addEventListener("error", () => {
            self.errorCount++;
            if (self.isDone()) callback();
          });

          img.src = path;
          self.cache[path] = img;
          break;
        case "wav":
        case "mp3":
        case "mp4":
          const audio = new Audio();
          audio.addEventListener("loadeddata", () => {
            self.successCount++;
            if (self.isDone()) callback();
          });

          audio.addEventListener("error", () => {
            self.errorCount++;
            if (self.isDone()) callback();
          });

          audio.addEventListener("ended", () => {
            audio.pause();
            audio.currentTime = 0;
          });

          audio.src = path;
          audio.load();
          self.cache[path] = audio;
          break;
      }
    }
  }

  getAsset(path) {
    return this.cache[path];
  }

  playAudio(track) {
    const path = track.path;
    const volume = track.volume;
    const global_volume = document.getElementById("volume").value;

    const audio = this.cache[path];
    audio.currentTime = 0;

    this.setVolume(path, volume * global_volume);
    audio.play();
  }

  pauseAudio() {
    for (var key in this.cache) {
      let asset = this.cache[key];
      if (asset instanceof Audio) {
        asset.pause();
        asset.currentTime = 0;
      }
    }
  }

  muteAudio(mute) {
    for (var key in this.cache) {
      let asset = this.cache[key];
      if (asset instanceof Audio) {
        asset.muted = mute;
      }
    }
  }

  playMusic(track) {
    const path = track.path;
    this.pauseAudio();
    this.playAudio(track);
    this.autoRepeat(path);
  }

  updateMusic() {
    const mute = document.getElementById("mute").checked;
    const volume = document.getElementById("volume").value;

    this.muteAudio(mute);

    music.paths.forEach((path) => {
      this.setVolume(path.path, volume * music.volume);
    });
  }

  setVolume(path, volume) {
    let asset = this.cache[path];
    if (asset instanceof Audio) {
      asset.volume = volume;
    }
  }

  autoRepeat(path) {
    var audio = this.cache[path];
    audio.addEventListener("ended", function () {
      audio.play();
    });
  }
}
