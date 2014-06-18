ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){

  // Create your own entity, subclassed from ig.Enitity
  EntityPlayer = ig.Entity.extend({

    // Set some of the properties
    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,

    size: {x: 32, y: 32},
    health: 64,
    speed: 64,
    direction: 1,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet( 'media/entities/player.png', 32, 32 ),

    init: function( x, y, settings ) {
      // Add the animations
      this.addAnim('up', .21, [1,2]);
      this.addAnim('down', .21, [4,5]);
      this.addAnim('left', .21, [7,8]);
      this.addAnim('right', .21, [10,11]);
      this.addAnim('idleup', 0.1, [0]);
      this.addAnim('idledown', 0.1, [3]);
      this.addAnim('idleleft', 0.1, [6]);
      this.addAnim('idleright', 0.1, [9]);

      // Idle Animations
      this.addAnim('upleft', .21, [13,14]);
      this.addAnim('upright', .21, [16,17]);
      this.addAnim('downleft', .21, [19,20]);
      this.addAnim('downright', .21, [22,23]);
      this.addAnim('idleupleft', 0.1, [12]);
      this.addAnim('idleupright', 0.1, [15]);
      this.addAnim('idledownleft', 0.1, [18]);
      this.addAnim('idledownright', 0.1, [21]);

      // Default Animation at Start
      this.currentAnim = this.anims.idleup;

      // Call the parent constructor
      this.parent( x, y, settings );
    },

    update: function() {
      // Movement
      // If the the input state is left and not right (ismove != 3).
      if (ig.input.state('left') && ismove != 3) {
        if (ig.input.state('up')) {
          this.currentAnim = this.anims.upleft;
          currentanimation = 8;

        } else if (ig.input.state('down')) {
          this.currentAnim = this.anims.downleft;
          currentanimation = 6;

        } else {
          this.currentAnim = this.anims.left;
          currentanimation = 7;

          // Set is Moving Exactly to left.
          ismove = 7;

        }

        // If the the input state is right and not left (ismove != 7).
      } else if (ig.input.state('right') && ismove != 7) {
        if (ig.input.state('up')) {
          this.currentAnim = this.anims.upright;
          currentanimation = 2;

        } else if (ig.input.state('down')) {
          this.currentAnim = this.anims.downright;
          currentanimation = 4;

        } else {
          this.currentAnim = this.anims.right;
          currentanimation = 3;

          // Set is Moving Exactly to right.
          ismove = 3;
        }
      } else if (ig.input.state('down') && ismove != 1) {
        if (ig.input.state('left')) {
          this.currentAnim = this.anims.downleft;
          currentanimation = 6;

        } else if (ig.input.state('right')) {
          this.currentAnim = this.anims.downright;
          currentanimation = 4;

        } else {
          this.currentAnim = this.anims.down;
          currentanimation = 5;

          // Set is Moving Exactly to down.
          ismove = 5;
        }

      } else if (ig.input.state('up') && ismove != 5) {
        if (ig.input.state('left')) {
          this.currentAnim = this.anims.upleft;
          currentanimation = 8;

        } else if (ig.input.state('right')) {
          this.currentAnim = this.anims.upright;
          currentanimation = 2;

        } else {
          currentanimation = 1;
          this.currentAnim = this.anims.up;

          // Set is Moving Exactly to up.
          ismove = 1;
        }

      } else {
        this.vel.x = 0;
        this.vel.y = 0;
        ismove = 0;

        if (this.direction == 1) {
          this.currentAnim = this.anims.idleup;
          currentanimation = 9;
        }
        if (this.direction == 2) {
          this.currentAnim = this.anims.idleupright;
          currentanimation = 10;
        }
        if (this.direction == 3) {
          this.currentAnim = this.anims.idleright;
          currentanimation = 11;
        }
        if (this.direction == 4) {
          this.currentAnim = this.anims.idledownright;
          currentanimation = 12;
        }
        if (this.direction == 5) {
          this.currentAnim = this.anims.idledown;
          currentanimation = 13;
        }
        if (this.direction == 6) {
          this.currentAnim = this.anims.idledownleft;
          currentanimation = 14;
        }
        if (this.direction == 7) {
          this.currentAnim = this.anims.idleleft;
          currentanimation = 15;
        }
        if (this.direction == 8) {
          this.currentAnim = this.anims.idleupleft;
          currentanimation = 16;
        }
      }

      switch (currentanimation) {
      case 1:
        this.vel.x = 0;
        this.vel.y = -this.speed;
        this.direction = 1;
        break;

      case 2:
        this.vel.x = +this.speed;
        this.vel.y = -this.speed;
        this.direction = 2;
        break;

      case 3:
        this.vel.x = +this.speed;
        this.vel.y = 0;
        this.direction = 3;
        break;

      case 4:
        this.vel.x = +this.speed;
        this.vel.y = +this.speed;
        this.direction = 4;
        break;

      case 5:
        this.vel.x = 0;
        this.vel.y = +this.speed;
        this.direction = 5;
        break;

      case 6:
        this.vel.x = -this.speed;
        this.vel.y = +this.speed;
        this.direction = 6;
        break;

      case 7:
        this.vel.x = -this.speed;
        this.vel.y = 0;
        this.direction = 7;
        break;

      case 8:
        this.vel.x = -this.speed;
        this.vel.y = -this.speed;
        this.direction = 8;
        break;
      }

      // Call the parent update() method to move the entity
      // according to its physics
      this.parent();
    }

  });

});