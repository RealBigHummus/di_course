var boardSize = 625
var keyBuffer = [];
var score = 0;
let fruitAudio = new Audio('assets/mixkit-quick-win-video-game-notification-269.mp3');
let deathAudio = new Audio('assets/Sad-Trombone-A1-www.fesliyanstudios.com.mp3')



function initBoardDOM(boardSize) {

    board = document.querySelector('#board');

    for (let i = 0; i < boardSize; i++) {
        stringI = i.toString();
        cell = document.createElement('div');
        cell.setAttribute('id', stringI);
        cell.setAttribute('class', 'cell');
        board.appendChild(cell);
    }

}

function initControls() {

    document.addEventListener('keydown', function (event) {

        if (event.key == 'a' && keyBuffer[keyBuffer.length - 1] !== 'l') {
            keyBuffer.push('l');
        }

        else if (event.key == 'd' && keyBuffer[keyBuffer.length - 1] !== 'r') {
            keyBuffer.push('r');
        }

        else if (event.key == 'w' && keyBuffer[keyBuffer.length - 1] !== 'u') {
            keyBuffer.push('u');
        }

        else if (event.key == 's' && keyBuffer[keyBuffer.length - 1] !== 'd') {
            keyBuffer.push('d');
        }

    });

}

function whatKey() {

    let key = keyBuffer.shift();

    if (key === 'r' && snake.direction !== 'l') {
        snake.direction = 'r';
    }
    else if (key === 'l' && snake.direction !== 'r') {
        snake.direction = 'l';
    }
    else if (key === 'u' && snake.direction !== 'd') {
        snake.direction = 'u';
    }
    else if (key === 'd' && snake.direction !== 'u') {
        snake.direction = 'd';
    }

}

function initGameBoard() {

    gameBoard = new Array(25).fill(0);

    for (let i = 0; i < 25; i++) {
        gameBoard[i] = new Array(25).fill(0);
    }

}

function getRandNumBetween(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}



function initGame() {

    snake = {
        size: 12,
        direction: 'u',
        body: [],

        eatFruit: function () {
            increaseX = snake.body[snake.size - 1][1] - snake.body[snake.size - 2][1];
            increaseY = snake.body[snake.size - 1][0] - snake.body[snake.size - 2][0];

            newX = snake.body[snake.size - 1][1] + increaseX;
            newY = snake.body[snake.size - 1][0] + increaseY;

            arr = [newY, newX];
            snake.body.push(arr);

            snake.size += 1;
            fruit.pos = [getRandNumBetween(24, 0), getRandNumBetween(24, 0)];
            
        }

    }

    for (let p = 12; p > 0; p--) {
        arr = [p, 12];
        snake.body.push(arr);
    }

    fruit = {
        pos: [4, 4],
        increaseSizeBy: 1,
    }

    initControls();
    initGameBoard();
    initBoardDOM(boardSize);

    putSnake();
    showEntitiesOnBoard();

}

function cleanBoard() {

    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {

            if (gameBoard[i][j] !== 2)
                gameBoard[i][j] = 0;

        }
    }

}

function putSnake() {

    for (let k = 0; k < snake.size; k++) {
        y = snake.body[k][0];
        x = snake.body[k][1];
        gameBoard[x][y] = 1;
    }

}

function showEntitiesOnBoard() {

    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            let index = j + 25 * i;

            if (gameBoard[i][j] === 0) {
                cell = document.getElementById(index);
                cell.classList.remove('cellsnake');
                cell.classList.remove('cellfruit');
                cell.classList.add('cell');
            }
            else if (gameBoard[i][j] === 1) {
                cell = document.getElementById(index);
                cell.classList.remove('cell');
                cell.classList.remove('cellfruit');
                cell.classList.add('cellsnake');
            }
            else {
                cell = document.getElementById(index);
                cell.classList.remove('cell');
                cell.classList.add('cellfruit');
            }

        }
    }

}

function putFruit() {

    y = fruit.pos[0];
    x = fruit.pos[1];
    gameBoard[x][y] = 2;

}

function slither() {

    for (let i = snake.size - 1; i > 0; i--) {
        snake.body[i] = snake.body[i - 1].slice();
    }

    switch (snake.direction) {
        case 'r':
            snake.body[0][0]++;
            break;

        case 'l':
            (snake.body[0][0])--;
            break;

        case 'u':
            (snake.body[0][1])--;
            break;

        case 'd':
            (snake.body[0][1])++;
            break;
    }

}
function collide() {

    snake.body.map((arr) => {
        if (arr[0] < 0) {
            arr[0] = 24;
        }

        if (arr[0] > 24) {
            arr[0] = 0;
        }

        if (arr[1] < 0) {
            arr[1] = 24;
        }

        if (arr[1] > 24) {
            arr[1] = 0;
        }

    });

    for (let i = 1; i < snake.size; i++) {
        for (let j = i + 1; j < snake.size; j++) {
            if (snake.body[i][1] === snake.body[j][1] && snake.body[i][0] === snake.body[j][0]) {
                document.location.reload(true);
                deathAudio.play();
                alert("GAME OVER\nYour score was " + score + ".\n Want to play again?");
            }

        }

    }

    snake.body.forEach((arr) => {

        if (arr[1] === fruit.pos[1] && arr[0] === fruit.pos[0]) {
            snake.eatFruit();
            score++;
            fruitAudio.play();

        }
    });
}


function update() {

    whatKey();
    slither();
    collide();
    cleanBoard();
    putSnake();
    showEntitiesOnBoard();
    putFruit();

}

initGame();
setInterval(update, 80);