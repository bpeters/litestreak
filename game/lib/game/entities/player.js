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
      this.size.x = this.health;
      this.size.y = this.health;

      socket.emit('initializeplayer', this.gamename);

      this.parent( x, y, settings );
    },

    update: function() {

      // Shooting
      if( ig.input.pressed('shoot1') ) {
        var mx = (ig.input.mouse.x + ig.game.screen.x);
        var my = (ig.input.mouse.y + ig.game.screen.y);
        var r = Math.atan2(my-this.pos.y, mx-this.pos.x);
        ig.game.spawnEntity( EntityBullet, this.pos.x, this.pos.y, {angle: r});
        socket.emit('recievedata','shoot',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          angle: r,
          gamename: this.gamename
        });
      }

      // Movement
      if (ig.input.state('left') && ismove != 3) {
        if (ig.input.state('up')) {
          currentanimation = 8;

        } else if (ig.input.state('down')) {
          currentanimation = 6;

        } else {
          currentanimation = 7;
          ismove = 7;

        }

      } else if (ig.input.state('right') && ismove != 7) {
        if (ig.input.state('up')) {
          currentanimation = 2;

        } else if (ig.input.state('down')) {
          currentanimation = 4;

        } else {
          this.currentAnim = this.anims.right;
          currentanimation = 3;
          ismove = 3;
        }
      } else if (ig.input.state('down') && ismove != 1) {
        if (ig.input.state('left')) {
          currentanimation = 6;

        } else if (ig.input.state('right')) {
          currentanimation = 4;

        } else {
          currentanimation = 5;
          ismove = 5;
        }

      } else if (ig.input.state('up') && ismove != 5) {
        if (ig.input.state('left')) {
          currentanimation = 8;

        } else if (ig.input.state('right')) {
          currentanimation = 2;

        } else {
          currentanimation = 1;
          ismove = 1;
        }

      } else {
        this.vel.x = 0;
        this.vel.y = 0;
        ismove = 0;
        currentanimation = 0;

        if (this.direction == 1) {
          currentanimation = 9;
        }
        if (this.direction == 2) {
          currentanimation = 10;
        }
        if (this.direction == 3) {
          currentanimation = 11;
        }
        if (this.direction == 4) {
          currentanimation = 12;
        }
        if (this.direction == 5) {
          currentanimation = 13;
        }
        if (this.direction == 6) {
          currentanimation = 14;
        }
        if (this.direction == 7) {
          currentanimation = 15;
        }
        if (this.direction == 8) {
          currentanimation = 16;
        }
      }

      switch (currentanimation) {
      case 1:
        this.vel.x = 0;
        this.vel.y = -this.speed;
        this.direction = 1;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 2:
        this.vel.x = +this.speed;
        this.vel.y = -this.speed;
        this.direction = 2;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 3:
        this.vel.x = +this.speed;
        this.vel.y = 0;
        this.direction = 3;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 4:
        this.vel.x = +this.speed;
        this.vel.y = +this.speed;
        this.direction = 4;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 5:
        this.vel.x = 0;
        this.vel.y = +this.speed;
        this.direction = 5;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 6:
        this.vel.x = -this.speed;
        this.vel.y = +this.speed;
        this.direction = 6;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 7:
        this.vel.x = -this.speed;
        this.vel.y = 0;
        this.direction = 7;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;

      case 8:
        this.vel.x = -this.speed;
        this.vel.y = -this.speed;
        this.direction = 8;
        socket.emit('recievedata','move',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          gamename: this.gamename
        });
        break;
      }

      if(this.nettimer < 1) {
        this.nettimer = 5;
      }
      this.nettimer = this.nettimer - 1;

      this.parent();

      //screen movement
      ig.game.screen.x = this.pos.x - ig.system.width/2;
      ig.game.screen.y = this.pos.y - ig.system.height/2;
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
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 1:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 2:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 3:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 4:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 5:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 6:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x - this.walk, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 7:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x -this.walk, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 8:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x - this.walk, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;
        }

      //draw shield
      ig.system.context.globalAlpha = 0.8;
      ig.system.context.strokeStyle = "rgb(0,0,0)";
      ig.system.context.lineWidth = 1;
      var gradient = ig.system.context.createRadialGradient(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health) - 32, this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, 0);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      ig.system.context.fillStyle = gradient;
      ig.system.context.beginPath();
      ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health) - 32, 0, 2 * Math.PI, false);
      ig.system.context.closePath();
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
      this.size.x = this.health;
      this.size.y = this.health;
      this.parent( x, y, settings );
    },

    netmoveplayer: function() {
      this.pos.x = positionx;
      this.pos.y = positiony;
    },

    update: function() {
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
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 1:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 2:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 3:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 4:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x + this.walk, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 5:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 6:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x - this.walk, this.pos.y - ig.game.screen.y + this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 7:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x -this.walk, this.pos.y - ig.game.screen.y, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;

        case 8:
          ig.system.context.fillStyle = "rgb(0,0,0)";
          ig.system.context.beginPath();
          ig.system.context.arc(this.pos.x - ig.game.screen.x - this.walk, this.pos.y - ig.game.screen.y - this.walk, this.health/2, 0, 2 * Math.PI, false);
          ig.system.context.closePath();
          ig.system.context.fill();
          break;
        }

      //draw shield
      ig.system.context.globalAlpha = 0.8;
      ig.system.context.strokeStyle = "rgb(0,0,0)";
      ig.system.context.lineWidth = 1;
      var gradient = ig.system.context.createRadialGradient(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health) - 32, this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, 0);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      ig.system.context.fillStyle = gradient;
      ig.system.context.beginPath();
      ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health) - 32, 0, 2 * Math.PI, false);
      ig.system.context.closePath();
      ig.system.context.fill();
      ig.system.context.stroke();
      ig.system.context.globalAlpha = 1;

      this.parent();
    }

  });

  // Bullet
  EntityBullet = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,

    dmg: 4,
    desiredVel: 300,
    range: 200,

    init: function( x, y, settings ) {
      this.size.x = this.dmg;
      this.size.y = this.dmg;

      var startx = x;
      var starty = y;

      var vely = Math.sin(settings.angle) * this.desiredVel;
      var velx =  Math.cos(settings.angle) * this.desiredVel;

      this.maxVel.x = this.vel.x = this.accel.x = velx;
      this.maxVel.y = this.vel.y = this.accel.y = vely;

      this.parent( x, y, settings );
    },

    update: function() {
      this.parent();
      var player = ig.game.getEntitiesByType( EntityPlayer )[0];
      if (this.distanceTo(player) > this.range) {
        this.kill();
      }
    },

    draw: function() {
      ig.system.context.fillStyle = "rgb(200,0,0)";
      ig.system.context.beginPath();
      ig.system.context.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
      ig.system.context.closePath();
      ig.system.context.fill();
      this.parent();
    }

  });

  // Enemy Bullet
  EntityNetbullet = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,

    dmg: 4,
    desiredVel: 300,
    range: 200,
    enemy: {
      startx: 0,
      starty: 0,
      gamename: "",
    },

    init: function( x, y, settings ) {
      this.size.x = this.dmg;
      this.size.y = this.dmg;

      this.enemy.startx = x;
      this.enemy.starty = y;
      this.enemy.gamename = settings.thisgamename;

      var vely = Math.sin(settings.angle) * this.desiredVel;
      var velx =  Math.cos(settings.angle) * this.desiredVel;

      this.maxVel.x = this.vel.x = this.accel.x = velx;
      this.maxVel.y = this.vel.y = this.accel.y = vely;

      this.parent( x, y, settings );
    },

    update: function() {
      this.parent();

      if (this.enemy.startx + this.range < this.pos.x || this.enemy.startx - this.range > this.pos.x) {
        this.kill();
      } else if (this.enemy.starty + this.range < this.pos.y || this.enemy.starty - this.range > this.pos.y) {
        this.kill();
      }
    },

    draw: function() {
      ig.system.context.fillStyle = "rgb(200,0,0)";
      ig.system.context.beginPath();
      ig.system.context.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
      ig.system.context.closePath();
      ig.system.context.fill();
      this.parent();
    }

  });

});
