import { Geom, Math, Actions } from 'phaser';

//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

export default class Snake {

  constructor (scene, x, y) {
    this.headPosition = new Geom.Point(x, y);

    this.body = scene.add.group();

    this.head = this.body.create(x * 16, y * 16, 'body');
    this.head.setOrigin(0);

    this.alive = true;

    this.speed = 100;

    this.moveTime = 0;

    this.tail = new Geom.Point(x, y);

    this.heading = RIGHT;
    this.direction = RIGHT;
  }

  update(time) {
    if (time >= this.moveTime) {
      return this.move(time);
    }
  }

  faceLeft() {
    if (this.direction === UP || this.direction === DOWN) {
        this.heading = LEFT;
    }
  }

  faceRight() {
    if (this.direction === UP || this.direction === DOWN) {
      this.heading = RIGHT;
    }
  }

  faceUp() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = UP;
    }
  }

  faceDown() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      this.heading = DOWN;
    }
  }

  move(time) {
    /**
    * Based on the heading property (which is the direction the pgroup pressed)
    * we update the headPosition value accordingly.
    * 
    * The Math.wrap call allow the snake to wrap around the screen, so when
    * it goes off any of the sides it re-appears on the other.
    */
    switch (this.heading) {
      case LEFT:
        this.headPosition.x = Math.Wrap(this.headPosition.x - 1, 0, 40);
        break;

      case RIGHT:
        this.headPosition.x = Math.Wrap(this.headPosition.x + 1, 0, 40);
        break;

      case UP:
        this.headPosition.y = Math.Wrap(this.headPosition.y - 1, 0, 30);
        break;

      case DOWN:
        this.headPosition.y = Math.Wrap(this.headPosition.y + 1, 0, 30);
        break;
    }

    this.direction = this.heading;

    //  Update the body segments and place the last coordinate into this.tail
    Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

    //  Check to see if any of the body pieces have the same x/y as the head
    //  If they do, the head ran into the body

    var hitBody = Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

    if (hitBody) {
      console.log('dead');
      this.alive = false;
      return false;
    } else {
      //  Update the timer ready for the next movement
      this.moveTime = time + this.speed;
      return true;
    }
  }

  grow() {
    var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
    newPart.setOrigin(0);
  }

  collideWithFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.grow();

      return true;
    } else {
      return false;
    }
  }

  updateGrid(grid) {
    //  Remove all body pieces from valid positions list
    this.body.children.each(function (segment) {
      var bx = segment.x / 16;
      var by = segment.y / 16;
      grid[by][bx] = false;
    });
    return grid;
  }
}