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

    nettimer: 100,
    name: "player",
    gamename: playername,

    messagebox: "",
    messageboxtimer: 100,

    init_health: 32,
    init_shield: 16,
    init_shield_recharge: 300,

    health: 32,
    shield: 16,
    shield_recharge: 300,
    speed: 100,
    kills: 0,
    kill_streaks: 0,
    points: 0,
    creds: 0,
    direction: 1,
    walk: 2,

    s1_dmg: 4,
    s1_desiredVel: 300,
    s1_range: 200,
    s1_init_recharge: 10,
    s1_recharge: 0,
    s1_type: 0,


    init: function( x, y, settings ) {
      this.size.x = this.health;
      this.size.y = this.health;
      this.s1_recharge = this.s1_init_recharge;

      socket.emit('initializeplayer', this.gamename);

      this.parent( x, y, settings );
    },

    update: function() {

      //Set player data
      var data = {
        positionx: this.pos.x,
        positiony: this.pos.y,
        currentanimation: currentanimation,
        health: this.health,
        shield: this.shield,
        speed: this.speed,
        gamename: this.gamename,
        init_health: this.init_health
      };

      //Spending Creds
      if ( this.creds > 0 ) {
        if( ig.input.pressed('health') ) {
          this.health = this.health + 2;
          this.init_health = this.health;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('shield') ) {
          this.init_shield = this.init_shield + 1;
          this.shield = this.shield + 1;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('shield_recharge') ) {
          if ( this.init_shield_recharge > 100 ) {
            this.init_shield_recharge = this.init_shield_recharge - 4;
            this.creds = this.creds - 2;
          }
        } else if( ig.input.pressed('speed') ) {
          this.speed = this.speed + 1;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('dmg') ) {
          this.s1_dmg = this.s1_dmg + 1;
          this.s1_desiredVel = this.s1_desiredVel - 2;
          this.s1_init_recharge = this.s1_init_recharge + 5;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('vel') ) {
          this.s1_desiredVel = this.s1_desiredVel + 2;
          this.s1_init_recharge = this.s1_init_recharge + 5;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('range') ) {
          this.s1_range = this.s1_range + 10;
          this.s1_init_recharge = this.s1_init_recharge + 5;
          this.creds = this.creds - 2;
        } else if( ig.input.pressed('recharge') ) {
          this.s1_init_recharge = this.s1_init_recharge - 1;
          this.creds = this.creds - 2;
        }
      }

      // Shooting
      if( this.s1_recharge >= this.s1_init_recharge ) {
        if( ig.input.state('shoot1') ) {
          var mx = (ig.input.mouse.x + ig.game.screen.x);
          var my = (ig.input.mouse.y + ig.game.screen.y);
          var r = Math.atan2(my-this.pos.y, mx-this.pos.x);
          ig.game.spawnEntity( EntityBullet, this.pos.x, this.pos.y, {angle: r, dmg: this.s1_dmg, desiredVel: this.s1_desiredVel, range: this.s1_range});
          socket.emit('recievedata','shoot',{
            positionx: this.pos.x,
            positiony: this.pos.y,
            angle: r,
            dmg: this.s1_dmg,
            desiredVel: this.s1_desiredVel,
            range: this.s1_range,
            gamename: this.gamename
          });
          this.s1_recharge = 0;
        }
        
      }
      if ( this.s1_recharge < this.s1_init_recharge ) {
        this.s1_recharge = this.s1_recharge + 1;
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
          gamename: this.gamename,
          init_health: this.init_health
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
          gamename: this.gamename,
          init_health: this.init_health
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
          gamename: this.gamename,
          init_health: this.init_health
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
          health: this.health,
          shield: this.shield,
          speed: this.speed,
          gamename: this.gamename,
          init_health: this.init_health
        });
        break;
      }

      // Recharge Shield
      if( this.shield_recharge < 1 ) {
        for(var i = 0; this.shield < this.init_shield; i++) {
          this.shield = this.shield + 1;
        }
        this.shield_recharge = this.init_shield_recharge;
      }
      if ( this.shield < this.init_shield) {
        this.shield_recharge = this.shield_recharge - 1;
      }


      //Sync Player Details
      if(this.nettimer < 1) {
        this.nettimer = 100;
        socket.emit('recievedata','sync',{
          positionx: this.pos.x,
          positiony: this.pos.y,
          currentanimation: currentanimation,
          health: this.health,
          shield: this.shield,
          speed: this.speed,
          gamename: this.gamename,
          init_health: this.init_health
        });
      }
      this.nettimer = this.nettimer - 1;

      this.parent();

      //screen movement
      ig.game.screen.x = this.pos.x - ig.system.width/2;
      ig.game.screen.y = this.pos.y - ig.system.height/2;
    },

    draw: function() {
      this.parent();
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
      if (this.health  > 0 || this.shield > 0) {
        ig.system.context.globalAlpha = 0.8;
        ig.system.context.strokeStyle = "rgb(0,0,0)";
        ig.system.context.lineWidth = 1;
        var gradient = ig.system.context.createRadialGradient(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health/2), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, 0);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        ig.system.context.fillStyle = gradient;
        ig.system.context.beginPath();
        ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health/2), 0, 2 * Math.PI, false);
        ig.system.context.closePath();
        ig.system.context.fill();
        ig.system.context.stroke();
        ig.system.context.globalAlpha = 1;
      }
    }

  });

  // Other Player
  EntityOtherplayer = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.B,

    name: "otherplayer",
    gamename: "",

    init_health: 32,
    init_shield: 16,
    init_shield_recharge: 300,

    health: 32,
    shield: 16,
    shield_recharge: 300,
    speed: 100,
    kills: 0,
    kill_streaks: 0,
    points: 0,
    creds: 0,
    direction: 1,
    walk: 2,

    s1_dmg: 4,
    s1_desiredVel: 300,
    s1_range: 200,
    s1_recharge: 100,
    s1_type: 0,

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
      this.parent();
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
      if (this.health  > 0 || this.shield > 0) {
        ig.system.context.globalAlpha = 0.8;
        ig.system.context.strokeStyle = "rgb(0,0,0)";
        ig.system.context.lineWidth = 1;
        var gradient = ig.system.context.createRadialGradient(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health/2), this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, 0);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        ig.system.context.fillStyle = gradient;
        ig.system.context.beginPath();
        ig.system.context.arc(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, (this.shield + this.health/2), 0, 2 * Math.PI, false);
        ig.system.context.closePath();
        ig.system.context.fill();
        ig.system.context.stroke();
        ig.system.context.globalAlpha = 1;
      }

    }

  });

  //Player Bullet
  EntityBullet = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,

    dmg: 0,
    desiredVel: 0,
    range: 0,

    init: function( x, y, settings ) {
      this.dmg = settings.dmg;
      this.desiredVel = settings.desiredVel;
      this.range = settings.range;

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
    },

    handleMovementTrace: function( res ) {
      this.parent( res );

      var player = ig.game.getEntitiesByType( EntityPlayer )[0];
      if( res.collision.x || res.collision.y ) {
        this.kill();
      } else if (this.distanceTo(player) > this.range) {
        this.kill();
      }
    },

    check: function( other ) {
      var player = ig.game.getEntitiesByType( EntityPlayer )[0];
      if (other.shield <= 0) {
        if (other.health - this.dmg <= 0) {

          //Enemy recieves damage = health to prevent crash
          other.receiveDamage( other.health, this );

          //Player recieves credits and points
          player.creds = player.creds + other.init_health;
          player.points = player.points + other.init_health;
          player.kills = player.kills + 1;

          // Set player kill streak
          player.kill_streaks = 0;
          for (i = 0; i <= player.kills - 3; i = i + 3) {
            player.kill_streaks = player.kill_streaks + 1;
          }

        }

        //Enemy recieves damage
        other.receiveDamage( this.dmg, this );

        //Player recieves points
        player.points = player.points + this.dmg;

      } else if (other.shield - this.dmg <= 0) {
        other.shield = 0;
      } else {
        other.shield = other.shield - this.dmg;
      }
      this.kill();
    },

    draw: function() {
      ig.system.context.fillStyle = "rgb(0,0,0)";
      ig.system.context.beginPath();
      ig.system.context.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
      ig.system.context.closePath();
      ig.system.context.fill();
      this.parent();
    }

  });

  // Other player bullet
  EntityNetbullet = ig.Entity.extend({

    collides: ig.Entity.COLLIDES.PASSIVE,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,

    dmg: 0,
    desiredVel: 0,
    range: 0,

    enemy: {
      startx: 0,
      starty: 0,
      gamename: "",
    },

    init: function( x, y, settings ) {
      this.dmg = settings.dmg;
      this.desiredVel = settings.desiredVel;
      this.range = settings.range;

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


    },

    handleMovementTrace: function( res ) {
      this.parent( res );

      var player = ig.game.getEntitiesByType( EntityPlayer )[0];
      if( res.collision.x || res.collision.y ) {
        this.kill();
      } else if (this.enemy.startx + this.range < this.pos.x || this.enemy.startx - this.range > this.pos.x) {
        this.kill();
      } else if (this.enemy.starty + this.range < this.pos.y || this.enemy.starty - this.range > this.pos.y) {
        this.kill();
      }
    },

    check: function( other ) {
      var otherplayer = ig.game.getEntitiesByType( EntityOtherplayer );
      if(otherplayer) {
        for(var i in otherplayer) {
          if(this.enemy.gamename == otherplayer[i].gamename) {
            var enemy = otherplayer[i];
          }
        }
      }
      if (other.shield <= 0) {
        if (other.health - this.dmg <= 0) {

          //A player recieves damage = health to prevent crash
          other.receiveDamage( other.health, this );

          //Enemy recieves creds and points
          this.enemy.creds = this.enemy.creds + other.init_health;
          this.enemy.points = this.enemy.points + other.init_health;
          this.enemy.kills = this.enemy.kills + 1;

          //Set enemy kill streak
          this.enemy.kill_streaks = 0;
          for (var c = 0; c <= this.enemy.kills - 3; c = c + 3) {
            this.enemy.kill_streaks = this.enemy.kill_streaks + 1;
          }

        }

        //A player recieves damage
        other.receiveDamage( this.dmg, this );

        //Enemy recieves points
        this.enemy.points = this.enemy.points + this.dmg;

      } else if (other.shield - this.dmg <= 0) {
        other.shield = 0;
      } else {
        other.shield = other.shield - this.dmg;
      }
      this.kill();
    },


    draw: function() {
      ig.system.context.fillStyle = "rgb(0,0,0)";
      ig.system.context.beginPath();
      ig.system.context.fillRect(this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y, this.size.x, this.size.y);
      ig.system.context.closePath();
      ig.system.context.fill();
      this.parent();
    }

  });

});
