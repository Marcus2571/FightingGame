function rectangularCollision({rect1, rect2}) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= 
        rect2.position.x && 
        rect1.attackBox.position.x <= 
        rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= 
        rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function checkAbilityCollision({rect1, rect2}) {
    return (
        rect1.fireball.position.x + rect1.fireball.width >= 
        rect2.position.x && 
        rect1.fireball.position.x <= 
        rect2.position.x + rect2.width &&
        rect1.fireball.position.y + rect1.fireball.height >= 
        rect2.position.y &&
        rect1.fireball.position.y <= rect2.position.y + rect2.height
    )
}

let timer = 60;
let timerId

const displayTimer = document.querySelector('.timer');
const displayText = document.querySelector('.displayText');

function pickAWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    if (player.health === enemy.health) {
        displayTimer.textContent = 'Tie!';
    } else if (player.health > enemy.health) {
        displayText.style.color = 'Red';
        displayText.textContent = 'Player 1 Wins!';
    } else if (player.health < enemy.health) {
        displayText.style.color = 'Blue';
        displayText.textContent = 'Player 2 Wins!';
    }

    // reload page after 4 seconds
    setTimeout(() => {
        window.location.reload();
    }, 4000);
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        displayTimer.innerHTML = timer;
    }

    if (timer === 0) {
        pickAWinner({player, enemy, timerId});
    }
}