var juego = new Phaser.Game(370,550, Phaser.CANVAS,'bloque_juego');
var fondoJuego;
var nave;
var cursores;
var balas;
var tiempoBala=0;
var botonDisparo;
var enemigos;
var texto;
var style;

var estadoPrincipal={
	preload: function(){
		juego.load.image('fondo','img/spacioext.png');
		juego.load.image('personaje','img/nave20.png');
		juego.load.image('laser','img/laser2.png');
		juego.load.image('enemigo','img/cracken2.png');
		juego.load.audio('snd','audio/disparo.mp3');
		juego.load.audio('colision','audio/colision.mp3');
	},

	create: function(){
		fondoJuego = juego.add.tileSprite(0,0,400,550,'fondo');
		nave = juego.add.sprite(juego.width/2,500,'personaje');
		nave.anchor.setTo(0.5);

		cursores=juego.input.keyboard.createCursorKeys();
		botonDisparo=juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		juego.physics.arcade.enable(nave);
		nave.body.collideWorldBounds= true;

		balas=juego.add.group();
		balas.enableBody=true;
		balas.physicsBodyType=Phaser.Physics.ARCADE;
		balas.createMultiple(20,'laser');
		balas.setAll('anchor.x',0.5);
		balas.setAll('anchor.y',3);
		balas.setAll('outOfBoundsKill',true);
		balas.setAll('checkWorldBounds',true);

		texto = juego.add.text(0,525,"DIEGO ACHO ",{font:"20px Arial", fill:"#000000", align:"center"});

		enemigos=juego.add.group();
		enemigos.enableBody=true;
		enemigos.physicsBodyType=Phaser.Physics.ARCADE;

		for (var y = 0; y < 6; y++) {
			for (var x = 0; x < 5 ; x++) {
				var enemigo = enemigos.create(x*60,y*30,'enemigo');
				enemigo.anchor.setTo(0.5)
			}
		}

		enemigos.x=50;
		enemigos.y=30;
		var animacion=juego.add.tween(enemigos).to({x:100},1000,Phaser.Easing.Linear.None,true,0,1000,true);


	},

	update:function(){
		if (cursores.right.isDown) {
			nave.position.x+=3;
		}
		else if (cursores.left.isDown) {
			nave.position.x-=3;
		}

		var bala;
		if (botonDisparo.isDown) {
			if (juego.time.now > tiempoBala) {
				bala=balas.getFirstExists(false);
				var sonido = juego.sound.add('snd');
				sonido.play();
			}
			if (bala) {
				bala.reset(nave.x, nave.y);
				bala.body.velocity.y=-300;
				tiempoBala=juego.time.now +100;
				//var sonidoColi = juego.sound.add('colision');
				//sonidoColi.play();
			}
		}

		juego.physics.arcade.overlap(balas,enemigos,colision,null,this)
		
	}

};

function colision(bala,enemigo){
	bala.kill();
	if (enemigo.kill()) {
		var sonidoColi = juego.sound.add('colision');
		sonidoColi.play();
	}
}


juego.state.add('principal',estadoPrincipal);
juego.state.start('principal');