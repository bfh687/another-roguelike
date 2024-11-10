class BoundingBox {
  constructor(x, y, width, height) {
    Object.assign(this, { x, y, width, height });

    this.left = x;
    this.top = y;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  collide(oth) {
    if (
      this.right > oth.left &&
      this.left < oth.right &&
      this.top < oth.bottom &&
      this.bottom > oth.top
    )
      return true;
    return false;
  }

  collideLine(x1, y1, x2, y2) {
    return (
      this.lineInsersectsBoxEdge(x1, y1, x2, y2, this.left, this.top, this.right, this.top) |
        this.lineInsersectsBoxEdge(
          x1,
          y1,
          x2,
          y2,
          this.left,
          this.bottom,
          this.right,
          this.bottom
        ) ||
      this.lineInsersectsBoxEdge(x1, y1, x2, y2, this.left, this.top, this.left, this.bottom) ||
      this.lineInsersectsBoxEdge(x1, y1, x2, y2, this.right, this.top, this.right, this.bottom)
    );
  }

  lineInsersectsBoxEdge(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calculate the determinant of the line segments
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false; // lines are parallel

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

    // check if the intersection point is on both line segments
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }
}

// draws bounding box to the screen
const drawBoundingBox = (box, ctx, color) => {
  if (!box) {
    return;
  }
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(box.x - engine.camera.x, box.y - engine.camera.y, box.width, box.height);
  ctx.restore();
};
