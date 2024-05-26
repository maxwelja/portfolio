import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

function BitHeroGame() {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: 0x222222,
            parent: gameRef.current,
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 800 },
                    debug: false
                }
            }
        };

        const game = new Phaser.Game(config);

        function preload() {
            const path = "assets/Sprites/8x8"
            this.load.image("barbarian", `${path}/Characters/barbarian.png`);
            this.load.image("gunner", `${path}/Characters/gunner.png`);
            this.load.image("priest", `${path}/Characters/priest.png`);
            this.load.image("swordie", `${path}/Characters/swordie.png`);
            this.load.spritesheet("wizard", `${path}/SpriteSheets/ss-wizard.png`, { frameWidth: 64, frameHeight: 64 } );
            this.load.spritesheet("zombie", `${path}/SpriteSheets/ss-zombie.png`, { frameWidth: 64, frameHeight: 64 } );
            this.load.image("ground", "assets/platform.png");
            this.load.image("sky", "assets/sky.png");
            this.load.image("bag", `${path}/items/bag.png`);
            this.load.image("chest", `${path}/items/chest.png`);
            this.load.image("coin", `${path}/items/coin.png`);
            this.load.image("heart", `${path}/items/heart.png`);
            this.load.image("power", `${path}/items/power.png`);
        }

        // player status variables
        let isRunning = false;
        let isSliding = false;
        let midSlide = false;
        let canSwap = false;
        let activeSprite = "zombie";
        let log;
        let platforms;
        let cursors;
        let shiftKey;
        let player, wizard, barbarian, gunner, swordie, priest, zombie;
        let bags, chests, coins, hearts, powers;

        function create() {
            cursors = this.input.keyboard.createCursorKeys();
            shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

            this.add.image(400,300, "sky");

            platforms = this.physics.add.staticGroup();
            platforms.create(400,570, "ground").setScale(2).refreshBody();
            platforms.create(750,150, "ground");
            platforms.create(600,250, "ground");
            platforms.create(50,350, "ground");
            platforms.create(150,450, "ground");

           bags = this.physics.add.group({
                key: "bag",
                repeat: 2,
                setXY: {x: 50, y: 0, stepX: 75}
            })
            bags.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.0,0.2));
            })
            this.physics.add.collider(bags, platforms);

            coins = this.physics.add.group({
                key: "coin",
                repeat: 5,
                setXY: {x: 425, y: 200, stepX: 60}
            })
            coins.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4,0.6));
            })
            this.physics.add.collider(coins, platforms);

            chests = this.physics.add.group({
                key: "chest",
                repeat: 2,
                setXY: {x: 50, y: 400, stepX: 75}
            })
            chests.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.0,0.1));
            })
            this.physics.add.collider(chests, platforms);

            hearts = this.physics.add.group({
                key: "heart",
                repeat: 2,
                setXY: {x: 650, y: 0, stepX: 60}
            })
            hearts.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.5,0.8));
            })
            this.physics.add.collider(hearts, platforms);

            powers = this.physics.add.group({
                key: "power",
                repeat: 2,
                setXY: {x: 650, y: 500, stepX: 60}
            })
            powers.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4,0.6));
            })
            this.physics.add.collider(powers, platforms);
            
            barbarian = this.physics.add.sprite(50,500, "barbarian");
            barbarian.setBounce(0.2);
            barbarian.setCollideWorldBounds(true);
            this.physics.add.collider(barbarian, platforms);
            
            gunner = this.physics.add.sprite(150,500, "gunner");
            gunner.setBounce(0.2);
            gunner.setCollideWorldBounds(true);
            this.physics.add.collider(gunner, platforms);
            
            priest = this.physics.add.sprite(250,500, "priest");
            priest.setBounce(0.2);
            priest.setCollideWorldBounds(true);
            this.physics.add.collider(priest, platforms);
            
            swordie = this.physics.add.sprite(350,500, "swordie");
            swordie.setBounce(0.2);
            swordie.setCollideWorldBounds(true);
            this.physics.add.collider(swordie, platforms);
            
            wizard = this.physics.add.sprite(450,500, "wizard");
            wizard.setBounce(0.2);
            wizard.setCollideWorldBounds(true);
            this.physics.add.collider(wizard, platforms);
            
            zombie = this.physics.add.sprite(550,500, "zombie");
            zombie.setBounce(0.2);
            zombie.setCollideWorldBounds(true);
            this.physics.add.collider(zombie, platforms);
            

            player = this.physics.add.sprite(650,500, "zombie");
            player.setCollideWorldBounds(true);
            this.physics.add.collider(player, platforms);
            player.previousVelocity = new Phaser.Math.Vector2();
            player.facing = "right";

            // Player Item Collisions
            this.physics.add.overlap(player, bags, collectItem, null, this);
            this.physics.add.overlap(player, coins, collectItem, null, this);
            this.physics.add.overlap(player, chests, collectItem, null, this);
            this.physics.add.overlap(player, hearts, collectItem, null, this);
            this.physics.add.overlap(player, powers, collectItem, null, this);

            // Player Select Character Collisions
            this.physics.add.overlap(player, barbarian, changeCharacter, null, this);
            this.physics.add.overlap(player, gunner, changeCharacter, null, this);
            this.physics.add.overlap(player, priest, changeCharacter, null, this);
            this.physics.add.overlap(player, swordie, changeCharacter, null, this);
            this.physics.add.overlap(player, wizard, changeCharacter, null, this);
            this.physics.add.overlap(player, zombie, changeCharacter, null, this);

            // Animations
            // Barbarian
            this.anims.create({
                key: "barbarian_right",
                frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "barbarian_stopRight",
                frames: [ { key: "zombie", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "barbarian_stopLeft",
                frames: [ { key: "zombie", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "barbarian_left",
                frames: this.anims.generateFrameNumbers("zombie", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            // Gunner
            this.anims.create({
                key: "gunner_right",
                frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "gunner_stopRight",
                frames: [ { key: "zombie", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "gunner_stopLeft",
                frames: [ { key: "zombie", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "gunner_left",
                frames: this.anims.generateFrameNumbers("zombie", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            // Priest
            this.anims.create({
                key: "priest_right",
                frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "priest_stopRight",
                frames: [ { key: "zombie", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "priest_stopLeft",
                frames: [ { key: "zombie", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "priest_left",
                frames: this.anims.generateFrameNumbers("zombie", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            // Swordie
            this.anims.create({
                key: "swordie_right",
                frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "swordie_stopRight",
                frames: [ { key: "zombie", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "swordie_stopLeft",
                frames: [ { key: "zombie", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "swordie_left",
                frames: this.anims.generateFrameNumbers("zombie", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            // Wizard
            this.anims.create({
                key: "wizard_right",
                frames: this.anims.generateFrameNumbers("wizard", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "wizard_stopRight",
                frames: [ { key: "wizard", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "wizard_stopLeft",
                frames: [ { key: "wizard", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "wizard_left",
                frames: this.anims.generateFrameNumbers("wizard", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            // Zombie
            this.anims.create({
                key: "zombie_right",
                frames: this.anims.generateFrameNumbers("zombie", { start: 0, end: 3}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "zombie_stopRight",
                frames: [ { key: "zombie", frame: 1 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "zombie_stopLeft",
                frames: [ { key: "zombie", frame: 6 } ],
                frameRate: 20
            });
            this.anims.create({
                key: "zombie_left",
                frames: this.anims.generateFrameNumbers("zombie", { start: 4, end: 7}),
                frameRate: 10,
                repeat: -1
            });

            this.changeSprite = changeSprite.bind(this);

            // UI
            log = this.add.text(20, 20, `Sliding: ${isSliding}`, {fontFamily: "Arial", fontSize: "24px", fill: "#ffffff"});
        }

        function update() {
            if (isSliding) console.log(isSliding, player.body.velocity.x);
            // render text
            log.setText(isSliding);

            // Player input
            if (cursors.left.isDown) {
                isRunning = true;
                player.setVelocityX(-300);
                playAnimation('left');
                player.facing = "left";
            }
            else if (cursors.right.isDown) {
                isRunning = true;
                player.setVelocityX(300);
                playAnimation('right');
                player.facing = "right";
            }
            else if (player.previousVelocity.x > 30) {
                isRunning = false;
                player.body.velocity.x -= 30;
                playAnimation('stopRight');
                player.facing = "right";
            }
            else if (player.previousVelocity.x < -30) {
                isRunning = false;
                player.body.velocity.x += 30;
                playAnimation('stopLeft');
                player.facing = "left";
            }
            if (Math.abs(player.body.velocity.x) <= 30) {
                player.setVelocityX(0);
                if (midSlide) {
                    midSlide = false;
                }
            }
            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-500);
            }

            if (!isSliding && !midSlide) {
                if (cursors.down.isDown && Phaser.Input.Keyboard.JustDown(shiftKey) && player.body.touching.down) {
                    isSliding = true;
                }
                if (isRunning && shiftKey.isDown && player.body.touching.down && player.facing == "right") {
                    player.body.velocity.x = 800;
                }
                if (isRunning && shiftKey.isDown && player.body.touching.down && player.facing == "left") {
                    player.body.velocity.x = -800;
                }

                if (!player.body.touching.down && !cursors.up.isDown && player.body.velocity.y < 0) {
                    player.setVelocityY(0);
                }

                if (cursors.down.isDown && !player.body.touching.down) {
                    if (player.body.velocity.y < 360) {
                        player.setVelocityY(360);
                    } else {
                        player.body.velocity.y += 300;
                    }
                }
            }


            console.log(canSwap, player.texture.key);
            // Character Swap Input
            if (canSwap && cursors.down.isDown) {
                changeSprite(canSwap);
                player.body.y -= 5;
            }
            canSwap = false;

            // Player update physics
            if (isSliding) {
                isSliding = false;
                midSlide = true;
                if (player.facing == "right") {
                    player.body.velocity.x = 800;
                } else {
                    player.body.velocity.x = -800;
                }
            }


            // adjusted fall speed
            if (player.body.velocity.y >= -100) {
                player.body.velocity.y += 50;
            } else if (-200 < player.body.velocity.y && player.body.velocity.y < -100) {
                player.body.velocity.y += 25;
            }
            // store velocity for future checks
            player.previousVelocity = player.body.velocity;
        }
        
        // systems functions
        function collectItem(player, item) {
            item.disableBody(true, true);
        }

        function changeCharacter(player, character) {
            if (canSwap != character.texture.key) {
                canSwap = character.texture.key;
            }
        }

        const changeSprite = function(spriteName) {
            // Set active sprite
            player.setTexture(spriteName);
            activeSprite = spriteName;
        }

        function playAnimation(animName) {
            player.anims.play(activeSprite + "_" + animName, true);
        }

        return () => {
            // clean up function for the game
            game.destroy(true);
        };

    }, []);

    return <div ref={gameRef} />
};

export default BitHeroGame;