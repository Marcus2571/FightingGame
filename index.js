const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const speed = 7.5;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/Sprites/background.gif',
    scale: 2.6,
    framesMax: 1
})

const shop = new Sprite({
    position: {
        x: 650,
        y: 350
    },
    imageSrc: './Assets/Sprites/shop.png',
    scale: 1,
    framesMax: 6
})

const player = new Fighter({ 
    position: {
        x: 0, 
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'red',
    imageSrc: './Assets/Sprites/Player/Idle.png',
    framesMax: 10,
    scale: 4,
    offset: {
        x: 250,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './Assets/Sprites/Player/Idle.png',
            framesMax: 10
        },
        attack: {
            imageSrc: './Assets/Sprites/Player/Attack1.png',
            framesMax: 4
        },
        ability1: {
            imageSrc: './Assets/Sprites/Player/Attack3.png',
            framesMax: 5
        },
        run: {
            imageSrc: './Assets/Sprites/Player/Run.png',
            framesMax: 6
        },
        jump: {
            imageSrc: './Assets/Sprites/Player/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/Sprites/Player/Fall.png',
            framesMax: 2
        },
        hurt: {
            imageSrc: './Assets/Sprites/Player/Hurt.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Assets/Sprites/Player/Death.png',
            framesMax: 9
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 170,
        height: 50
    },
    fireball: {
        offset: {
            x: 100,
            y: 75
        },
        width: 120,
        height: 50,
        velocity: {
            x: 2.5,
            y: 0
        },
        color: 'orange',
        damage: 10,
        isReady: true,
        hit: false,
        abilityUsed: false
    }
});

const enemy = new Fighter({
    position: {
        x: 400, 
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: './Assets/Sprites/Enemy/Idle.png',
    framesMax: 4,
    scale: 3,
    offset: {
        x: 250,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './Assets/Sprites/Enemy/Idle.png',
            framesMax: 4
        },
        attack: {
            imageSrc: './Assets/Sprites/Enemy/Attack1.png',
            framesMax: 4
        },
        ability1: {
            imageSrc: './Assets/Sprites/Enemy/Attack2.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Assets/Sprites/Enemy/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/Sprites/Enemy/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/Sprites/Enemy/Fall.png',
            framesMax: 2
        },
        hurt: {
            imageSrc: './Assets/Sprites/Enemy/Hurt.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Assets/Sprites/Enemy/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    },
    fireball: {
        offset: {
            x: -100,
            y: 75
        },
        width: 120,
        height: 50,
        velocity: {
            x: -2.5,
            y: 0
        },
        color: 'blue',
        damage: 10,
        isReady: true,
        hit: false,
        abilityUsed: false
    }
});

const keys = {
    a: {
        isDown: false
    },
    d: {
        isDown: false
    },

    ArrowLeft: {
        isDown: false
    },
    ArrowRight: {
        isDown: false
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    background.update();
    shop.update();

    player.update();
    enemy.update();
    
    // Player movement
    player.velocity.x = 0

    if (keys.a.isDown && player.lastKey === 'a') {
        player.velocity.x = -speed;
        player.changeSprite('run');
    } else if (keys.d.isDown && player.lastKey === 'd') {
        player.velocity.x = speed;
        player.changeSprite('run');
    } else {
        player.changeSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.changeSprite('jump');
    } else if (player.velocity.y > 0) {
        player.changeSprite('fall');
    }

    // Enemy movement
    enemy.velocity.x = 0

    if (keys.ArrowLeft.isDown && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -speed;
        enemy.changeSprite('run');
    } else if (keys.ArrowRight.isDown && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speed;
        enemy.changeSprite('run');
    } else {
        enemy.changeSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.changeSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.changeSprite('fall');
    }

    // if player attacks
    if (
        rectangularCollision({
            rect1: player,
            rect2: enemy
        }) && 
        player.isAttacking && player.framesCurrent === 2 || player.usedAbility
    ) {
        document.querySelector('.enemyHealth').style.width = enemy.health + '%';
        
        enemy.takeHit();
        player.isAttacking = false;
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false;
    }
    
    // if enemy attacks
    if (
        rectangularCollision({
            rect1: enemy,
            rect2: player
        }) && 
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        document.querySelector('.playerHealth').style.width = player.health + '%';
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // if player used ability
    if (
        checkAbilityCollision({
            rect1: player,
            rect2: enemy
        }) && !player.fireball.hit && player.fireball.abilityUsed
    ) {
        enemy.takeHit();
        player.fireball.hit = true;
        document.querySelector('.enemyHealth').style.width = enemy.health + '%';
    }

    // if enemy used ability
    if (
        checkAbilityCollision({
            rect1: enemy,
            rect2: player
        }) && !enemy.fireball.hit && enemy.fireball.abilityUsed
    ) {
        player.takeHit();
        enemy.fireball.hit = true;
        document.querySelector('.playerHealth').style.width = player.health + '%';
    }

    // if player or enemy dies
    if (enemy.health <= 0 || player.health <= 0) {
        pickAWinner({player, enemy, timerId});
    }

    // wall collision
    if (player.position.x < 0) {
        player.position.x = 0;
    } else if (player.position.x + player.width > canvas.width) {
        player.position.x = canvas.width - player.width;
    }

    if (enemy.position.x < 0) {
        enemy.position.x = 0;
    } else if (enemy.position.x + enemy.width > canvas.width) {
        enemy.position.x = canvas.width - enemy.width;
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.isDead) {
        switch (event.key) {
            case 'a':
                keys.a.isDown = true;
                player.lastKey = 'a'
                break;
            case 'd':
                keys.d.isDown = true;
                player.lastKey = 'd'
                break;
            case 'w':
                player.velocity.y = -15;
                break;
            case ' ':
                player.attack();
                break;
            case 'q':
                player.useAbility('player');
                break;
        }
    }

    if (!enemy.isDead) {
        switch (event.key) {
            case 'ArrowUp':
                enemy.velocity.y = -15;
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.isDown = true;
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowRight':
                keys.ArrowRight.isDown = true;
                enemy.lastKey = 'ArrowRight'
                break;
            case 'Enter':
                enemy.attack();
                break;
            case 'o':
                enemy.useAbility('enemy');
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.isDown = false;
            break;
        case 'd':
            keys.d.isDown = false;
            break;
    }

    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.isDown = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = false;
            break;
    }
});