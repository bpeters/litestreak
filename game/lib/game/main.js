ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',
  'game.levels.GameLevel',
  'game.entities.player'
)
.defines(function(){

MyGame = ig.Game.extend({

  white: new ig.Font( 'media/white.font.png' ),
  redbold: new ig.Font( 'media/red_bold.font.png' ),

  minimap : {
    size : 200, //128x128px on the screen
    c : 16, // Compression factor, for a square map of 16x128pixel .
    //Absolute positions on the screen
    x: 0,
    y: 600 - 200
  },

  init: function() {
    ig.input.bind( ig.KEY.W, 'up' );
    ig.input.bind( ig.KEY.S, 'down' );
    ig.input.bind( ig.KEY.A, 'left' );
    ig.input.bind( ig.KEY.D, 'right' );
    ig.input.bind( ig.KEY.MOUSE1, 'shoot1');
    ig.input.bind( ig.KEY.MOUSE2, 'shoot2');
    ig.input.bind( ig.KEY._1, 'health');
    ig.input.bind( ig.KEY._2, 'shield');
    ig.input.bind( ig.KEY._3, 'shield_recharge');
    ig.input.bind( ig.KEY._4, 'speed');
    ig.input.bind( ig.KEY._5, 'dmg');
    ig.input.bind( ig.KEY._6, 'vel');
    ig.input.bind( ig.KEY._7, 'range');
    ig.input.bind( ig.KEY._8, 'recharge');
    this.loadLevel( LevelGameLevel );
    this.spawnEntity(EntityPlayer, 400, 300);
  },

  update: function() {

    this.parent();
  },

  draw: function() {
    this.parent();

    var players = this.getEntitiesByType(EntityOtherplayer);
    var player = this.getEntitiesByType( EntityPlayer )[0];
    var ctx = ig.system.context;
    var s = ig.system.scale;
    var x,y,size;
    ctx.save();
    ctx.fillStyle = "rgba(100, 100, 100, 0.1)";
    ctx.fillRect(this.minimap.x,
                 this.minimap.y,
                 this.minimap.x+this.minimap.size,
                 this.minimap.y+this.minimap.size);
    // Draw Other Players on MiniMap
    for (i=0;i<players.length;i++) {
        x = players[i].pos.x * s / this.minimap.c +this.minimap.x;
        y = players[i].pos.y * s / this.minimap.c +this.minimap.y;
        size = players[i].size.x * s / this.minimap.c;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(x,y,size,size);
    }
    // Draw Client Player on MiniMap
    x = player.pos.x * s / this.minimap.c +this.minimap.x;
    y = player.pos.y * s / this.minimap.c +this.minimap.y;
    size = player.size.x * s / this.minimap.c;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(x,y,size,size);
    ctx.restore();

    this.white.draw( "P  " + player.points, 10, 50 );
    this.white.draw( "Ks " + player.kill_streaks, 10, 75 );
    this.white.draw( "K  " + player.kills, 10, 100 );
    if ( player.creds > 0 ){
      this.redbold.draw( "C  " + player.creds, 10, 165 );
    }
    this.white.draw( "H  " + player.health, 10, 190 );
    this.white.draw( "Sh " + player.shield, 10, 215 );
    this.white.draw( "Sr " + player.shield_recharge, 10, 240 );
    this.white.draw( "Sp " + player.speed, 10, 265 );
    this.white.draw( "D  " + player.s1_dmg, 10, 290 );
    this.white.draw( "V  " + player.s1_desiredVel, 10, 315 );
    this.white.draw( "Ra " + player.s1_range, 10, 340 );
    this.white.draw( "Re " + player.s1_recharge, 10, 365 );

    player.messageboxtimer = player.messageboxtimer - 1;

    if( player.messageboxtimer < 1 ) {
      player.messageboxtimer = 50;
      var newtext = "";
      var newsplit = player.messagebox.split("\n");
      for(var i = 0; i < newsplit.length; i++) {
        if( i > 1 ) {
          newtext = newtext + "\n" + newsplit[i];
        }
      }
    player.messagebox = newtext;
    }

    this.white.draw( player.messagebox, 10, -10 );

  }
});

ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
