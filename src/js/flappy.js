const game = {
    birdTop: 300,
    flying: false,
    obstacleWidth: 150,
    spacing: 200,
    birdLeft: 600,
    colision: false,
    score: 0
}

// Tela do jogo
const screen = document.querySelector('[wm-flappy]')
screen.classList.add('screen')

// Variaveis globais do jogo
const bird = document.createElement('img')
bird.src = './imgs/passaro.png'
bird.classList.add('bird')
bird.style.left = `${game.birdLeft}px`
screen.appendChild(bird)

// Função caindo
function dropBird() {
    if (!game.flying) {
        game.birdTop = game.birdTop + 5 <= 660 ? game.birdTop + 5 : 660
        bird.style.top = `${game.birdTop}px`
    } else {
        game.birdTop = game.birdTop - 1 > 10 ? game.birdTop - 10 : 0
        bird.style.top = `${game.birdTop}px`
    }
    dropID = window.requestAnimationFrame(dropBird)
}
let dropID = window.requestAnimationFrame(dropBird)

document.onkeydown = (e) => {
    if (e.repeat) { return }
    game.flying = true
}
document.onkeyup = (e) => {
    game.flying = false
}

// Função gera obstáculo
function generateObstacle(min, max, width, spacing, position) {
    const downBorder = Math.round(Math.random() * (max - min) + min)

    const obstacle = document.createElement('div')
    obstacle.classList.add('obstacle')
    obstacle.style.width = `${width}px`
    obstacle.style.left = `${position}px`


    const tube1 = document.createElement('div')
    tube1.classList.add('tube')
    const tube2 = tube1.cloneNode(true)

    tube1.style.height = `${720 - (downBorder + spacing)}px`
    tube2.style.height = `${downBorder}px`

    obstacle.appendChild(tube1)
    obstacle.appendChild(tube2)

    const tubeBorderUP = document.createElement('div')
    tubeBorderUP.classList.add('tube-border')
    const tubeBorderDOWN = tubeBorderUP.cloneNode(true)

    const tubeBodyUP = document.createElement('div')
    tubeBodyUP.classList.add('tube-body')
    const tubeBodyDOWN = tubeBodyUP.cloneNode(true)

    tubeBodyUP.style.height = `${720 - (downBorder + spacing) - 30}px`
    tubeBodyDOWN.style.height = `${downBorder - 30}px`

    tube1.appendChild(tubeBodyUP)
    tube1.appendChild(tubeBorderUP)

    tube2.appendChild(tubeBorderDOWN)
    tube2.appendChild(tubeBodyDOWN)

    obstacle.setAttribute('wm-obstacle', '')
    obstacle.setAttribute('down-border', downBorder)
    screen.appendChild(obstacle)
}

// Anima obstáculo
function animateObstacle() {
    document.querySelectorAll('[wm-obstacle]').forEach(obstacle => {
        const left = Number(obstacle.style.left.replace(/px/g, ''))
        if (left < - (game.obstacleWidth + 5)) {
            screen.removeChild(obstacle)
        } else {
            obstacle.style.left = `${left - 5}px`
        }
        calculateColisionAndScore(obstacle, left)
    })
    if (!game.colision) {
        obstacleID = window.requestAnimationFrame(animateObstacle)
    }
}

// Loop do jogo
function gameLoop() {
    let obstacleID = window.requestAnimationFrame(animateObstacle)
    const intervalObstacles = setInterval(() => {
        if (!game.colision) {
            generateObstacle(50, 400, game.obstacleWidth, game.spacing, 1285)
        }
    }, 1500)
}

// Calcula colisão e Pontuação
function calculateColisionAndScore(obstacle, obstacleLeft) {
    const down = Number(obstacle.getAttribute('down-border'))
    if ((((game.birdLeft + 60) >= obstacleLeft) &&
    (game.birdLeft < (obstacleLeft + game.obstacleWidth))) &&
    ((game.birdTop <= 720 - (down + game.spacing)) || 
    ((game.birdTop + 60) >= (720 - down)))) {
        game.colision = true
        window.cancelAnimationFrame(dropID)
    }
    if (game.birdLeft > (obstacleLeft + game.obstacleWidth - 100)) {
        if (!obstacle.hasAttribute('score')) {
            obstacle.setAttribute('score', '')   
            game.score++
            document.querySelector('.pontuation').innerHTML = `${game.score}`
        }
    }
}

gameLoop()