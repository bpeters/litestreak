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

  font: new ig.Font( 'media/04b03.font.png' ),

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
    this.loadLevel( LevelGameLevel );
    this.spawnEntity(EntityPlayer, 400, 300);
  },

  update: function() {

    this.parent();
  },

  draw: function() {
    // Draw all entities and backgroundMaps
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

    this.font.draw( "P  " + player.points, 10, 190 );
    this.font.draw( "Ks " + player.kill_streaks, 10, 220 );
    this.font.draw( "K  " + player.kills, 10, 250 );
    this.font.draw( "H  " + player.health, 10, 280 );
    this.font.draw( "Sh " + player.shield, 10, 310 );
    this.font.draw( "Sr " + player.shield_recharge, 10, 340 );
    this.font.draw( "Sp " + player.speed, 10, 370 );

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

    this.font.draw( player.messagebox, 10, -10 );

  }
});

ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
