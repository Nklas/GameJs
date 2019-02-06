export default class SpriteSheet {
  constructor(image, widht, height) {
    this.image = image;
    this.widht = widht;
    this.height = height;
    this.tiles = new Map();
  }

  define(name, x, y) {
    const buffer = document.createElement('canvas');
    buffer.width = this.widht;
    buffer.height = this.height;
    buffer
      .getContext('2d')
      .drawImage(
        this.image,
        x * this.widht,
        y * this.height,
        this.widht,
        this.height,
        0,
        0,
        this.widht,
        this.height);
    this.tiles.set(name, buffer);
  }

  draw(name, context, x, y) {
    const buffer = this.tiles.get(name);
    context.drawImage(buffer, x, y);
  }

  drawTile(name, context, x, y) { 
    this.draw(name, context, x * this.widht, y * this.height);
  }
}