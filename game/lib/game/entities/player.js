ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){

  var ismove = 0;

  // Client Player
  EntityPlayer = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,

    nettimer: 10,
    name: "player",
    gamename: playername,

    messagebox: "",
    messageboxtimer: 50,

    health: 32,
    shield: 32,
    speed: 96,
    direction: 1,
    walk: 2,

    init: function( x, y, settings ) {
      this.size.x = 32;
      this.size.y = 32;

      socket.emit('initializeplayer', this.gamename);

      // Call the parent constructor
      this.parent( x, y, settings );
    },

    update: function() {
      // Stat Check

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
        currentanimation = 0;

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

      if(this.nettimer < 1) {
        this.nettimer = 5;
        socket.emit('recievedata',this.pos.x,this.pos.y,currentanimation,this.gamename);
      }
      this.nettimer = this.nettimer - 1;

      // Call the parent update() method to move the entity
      // according to its physics
      this.parent();
    },

    draw: function() {
      //draw player
      switch (currentanimation) {
        case 9:
        case 10:
        case 11:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 0:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 1:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 2:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 3:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 4:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 5:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 6:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x - this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 7:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x -this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 8:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x - this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;
        }

      //draw shield
      ig.system.context.globalAlpha = 0.8;
      ig.system.context.strokeStyle = "rgb(0,0,0)";
      ig.system.context.lineWidth = 1;
      var gradient = ig.system.context.createRadialGradient((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, (this.shield + this.health) - 32, (this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, 0);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      ig.system.context.fillStyle = gradient;
      ig.system.context.beginPath();
      ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, (this.shield + this.health) - 32, 0, 2 * Math.PI, false);
      ig.system.context.closePath();  // added
      ig.system.context.fill();
      ig.system.context.stroke();
      ig.system.context.globalAlpha = 1;

      this.parent();
    }

  });

  // Other Player
  EntityOtherplayer = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,

    name: "otherplayer",
    gamename: "",

    health: 32,
    shield: 32,
    speed: 96,
    direction: 1,
    walk: 2,
    animation: 1,

    init: function( x, y, settings ) {
      this.size.x = 32;
      this.size.y = 32;

      // Call the parent constructor
      this.parent( x, y, settings );
    },

    netmoveplayer: function() {
      this.pos.x = positionx;
      this.pos.y = positiony;
    },

    update: function() {
      // Stat Check

      // Call the parent update() method to move the entity
      // according to its physics
      this.parent();
    },

    draw: function() {
      //draw player
      switch (this.animation) {
        case 9:
        case 10:
        case 11:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 0:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 1:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 2:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 3:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 4:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x + this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 5:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 6:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x - this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 7:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x -this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 8:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x - this.walk, (this.pos.y + this.size.y/2) - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;
        }

      //draw shield
      ig.system.context.globalAlpha = 0.8;
      ig.system.context.strokeStyle = "rgb(0,0,0)";
      ig.system.context.lineWidth = 1;
      var gradient = ig.system.context.createRadialGradient((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, (this.shield + this.health) - 32, (this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, 0);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      ig.system.context.fillStyle = gradient;
      ig.system.context.beginPath();
      ig.system.context.arc((this.pos.x + this.size.x/2) - ig.game.screen.x, (this.pos.y + this.size.y/2) - ig.game.screen.y, (this.shield + this.health) - 32, 0, 2 * Math.PI, false);
      ig.system.context.closePath();  // added
      ig.system.context.fill();
      ig.system.context.stroke();
      ig.system.context.globalAlpha = 1;

      this.parent();
    }

  });


});