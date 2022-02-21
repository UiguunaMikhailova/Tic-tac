const step = document.querySelector('.step')
const button = document.querySelector('.button')
const modalBtn = document.querySelector('.modal-btn')
const modalClose = document.querySelector('.modal-close')
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const boxes = document.querySelector('.boxes')
const box = document.querySelectorAll('.box')
const audio = document.querySelector('.audio')

const winCombinations = [ //выигрышные комбинации
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

let steps = 0 // счётчик ходов
let cross = true // ход крестиков
let circle = false // ход ноликов
let victoryStory = [] // массив с выигравшими

const crossSteps = [] // комбинация ходов крестиков
const circleSteps = [] // комбинация ходов нолика

window.addEventListener('load', getLocalStorage) // при перезагрузке подтягиваются данные из локалсторидж

function getLocalStorage() { // функция получения данных с локал сторидж
    if (localStorage.getItem('winner')) {
        victoryStory = JSON.parse(localStorage.getItem('winner')) // если локал сторидж не пустой, то массив с выигравшими подтягивается
        showVictoryStory(victoryStory) // и в модальное окно они вписываются
    }
}

button.addEventListener('click', startGame) // слушатель на кнопку старта игры
modalBtn.addEventListener('click', openModal) // слушатель на кнопку открытия модалки - история побед
modalClose.addEventListener('click', closeModal) // слушатель на кнопку крестик закрытия модалки

function openModal() { // при открытии модалки накидывается оверлей и появляется модальное окно
    overlay.style = 'display: block'
    modal.style = 'display: block'
}

function closeModal() { // при закрытии модалки
    overlay.style = 'display: none'
    modal.style = 'display: none'
}

function startGame() { // при нажатии на кнопку старта появляется игровое поле
    boxes.style = 'display: flex'
    button.style = 'display: none'
    step.textContent = 'Ход крестиком'
}

box.forEach((elem) => elem.addEventListener('click', () => { // слушатель на квадратик
    gameStep(elem)
    audio.play()
    audio.currentTime = 0
}))

function gameStep(box) { // функция ходов
    if (!(box.classList.contains('cross--active') || box.classList.contains('circle--active'))) { // чтобы запретить два раза нажимать на один и тот же квадратик
        if (cross) { // если ходят крестики, то +1 к счётчику ходов, в комбинацию ходов крестика добавили номер квадратика
            steps += 1
            crossSteps.push(+box.dataset.number)
            cross = false
            circle = true
            step.textContent = 'Ход ноликом'
            box.classList.add('cross--active')

            if (checkWinner(crossSteps)) { // каждый ход проверяем есть ли выигравшие
                finishGame('Крестик')
            }
            if (steps === 9) { // если прошло 9 ходов и никто не выиграл, то ничья
                finishGame('Никто не')
            }
        } else { // то же самое для ноликов
            steps += 1
            circleSteps.push(+box.dataset.number)
            cross = true
            circle = false
            step.textContent = 'Ход крестиком'
            box.classList.add('circle--active')
            if (checkWinner(circleSteps)) {
                finishGame('Нолик')
            }
            if (steps === 9) {
                finishGame('Никто не')
            }
        }
    }
}

function finishGame(winner) { // если кто-то выиграл, то игровое поле исчезает, появляется кнопка старта
    boxes.style = 'display: none'
    button.style = 'display: flex'
    button.textContent = 'Новая игра'
    step.textContent = `${winner} победил. Было ${steps} ходов` // показываем кто и за сколько ходов победил
    cross = true
    circle = false
    steps = 0
    crossSteps.length = 0
    circleSteps.length = 0
    box.forEach((elem) => { // всем квадратикам удаляем крестики нолики
        elem.classList.remove('circle--active')
        elem.classList.remove('cross--active')
    })

    addingToVictoryStory(step.textContent) // в локал сторадж записываем кто выиграл
}

function checkWinner(comb) { // проверяем победные комбинации
    return winCombinations.some((winComb) => winComb.every((number) => comb.includes(number))) // есть ли выигрышная комбинация, проверяем наличие всех цифр выигрышной комбинации
}

function addingToVictoryStory(text) { // в массив с выигравшими добавляем или удаляем строку с выигравшим
    if (victoryStory.length < 10) {
        victoryStory.unshift(text)
    } else { // как только больше 10 выигравших, то мы старые записи удаляем
        victoryStory.pop()
        victoryStory.unshift(text)
    }
    localStorage.setItem('winner', JSON.stringify(victoryStory)) // в локал сторидж записали массив с выигравшими
    showVictoryStory(victoryStory) // отобразили их в модалке
}

function showVictoryStory(arr) { // функция отображения списка выигравших в модальном окне
    const winner = document.querySelectorAll('.winner') // каждый раз обнуляем список
    winner.forEach((elem) => elem.remove())

    if (arr.length > 0) {
        arr.forEach((elem) => {
            const winner = document.createElement('p') // создаем строчку списка выигравших
            winner.classList.add('winner')
            winner.textContent = `${elem}`
            modal.appendChild(winner)
        })
    }
}

showVictoryStory(victoryStory)