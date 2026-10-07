const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true, // Fondamentale per la grafica retro
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Vista dall'alto, niente gravità
            debug: false        // Metti a true se vuoi vedere i box delle collisioni
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player;
let cursors;

function preload() {
    // 1. Carica il tileset in formato immagine
    this.load.image('tileset_image', 'assets/tileset.png');

    // 2. Carica la mappa esportata in JSON da Tiled
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    // 3. Carica l'avatar del giocatore (es. uno spritesheet o una singola immagine per test)
    // Assicurati di avere uno spritesheet con i frame di movimento o un'immagine temporanea
    this.load.spritesheet('player_sprite', 'assets/player.png', { 
        frameWidth: 16,  // Modifica in base alla dimensione dei tuoi tile/personaggio (es. 16 o 32)
        frameHeight: 16 
    });
}

function create() {
    // --- CREAZIONE MAPPA ---
    const map = this.make.tilemap({ key: 'map' });
    
    // Il nome 'tileset' qui dentro deve corrispondere al nome dato al Tileset dentro Tiled
    const tileset = map.addTilesetImage('NomeDelTuoTilesetInTiled', 'tileset_image');

    // Crea i layer (assicurati che i nomi corrispondano a quelli creati in Tiled)
    const backgroundLayer = map.createLayer('Sfondo', tileset, 0, 0);
    const roadsLayer = map.createLayer('Strade', tileset, 0, 0);
    const collisionLayer = map.createLayer('Collisioni', tileset, 0, 0);

    // Abilita le collisioni sul livello dedicato
    collisionLayer.setCollisionByExclusion([-1]);

    // --- CREAZIONE GIOCATORE ---
    // Posiziona il player alle coordinate iniziali (es. X: 100, Y: 100)
    player = this.physics.add.sprite(100, 100, 'player_sprite', 0);
    
    // Impedisce al player di uscire dai bordi del mondo di gioco
    player.setCollideWorldBounds(true);

    // Aggiungi la collisione tra il player e il livello delle collisioni di Tiled
    this.physics.add.collider(player, collisionLayer);

    // --- TELECAMERA ---
    // Imposta i confini della telecamera in base alle dimensioni della mappa
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // Fai seguire l'avatar dalla telecamera principale
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    // Imposta uno zoom opzionale se vuoi ingrandire la visuale retro (es. 2x o 3x)
    this.cameras.main.setZoom(2);

    // --- INPUT TASTIERA ---
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Reset della velocità a ogni fotogramma
    player.body.setVelocity(0);

    const speed = 120; // Velocità di movimento dell'avatar

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
        // player.anims.play('left', true); // Decommenta quando configuri le animazioni
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
        // player.anims.play('right', true);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
        // player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
        // player.anims.play('down', true);
    }
}
