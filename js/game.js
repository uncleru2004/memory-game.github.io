const BUTTON = document.querySelector("button");
const BOARD = document.querySelector(".board");
const MOVES = document.querySelector(".moves");
const TIMER = document.querySelector(".timer");
const WIN = document.querySelector(".win");
const BOARD_CONTAINER = document.querySelector(".board-container");

const DIMENSION = document.querySelector(".board").getAttribute("data-dimension");
const PICTURES = ["🍎", "🍒", "🍁", "🌽", "💮", "🍇", "🍉", "🍌", "🌾", "🍍"];

const STATISTICS = {
  game: false,
  moves: 0,
  time: 0,
  interval: null,
  rus: ["ход", "хода", "ходов"],
}

// Функция получения n пар случайных карточек из массива для построения квадратного поля с заданной стороной (сейчас это 4, значит n = 8)
function getRandomCards() { 

  let array = [...PICTURES];
  let cards = [];
  let halfAmount = Math.pow(DIMENSION, 2) / 2;

  for (let i = 0; i < halfAmount; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);

    cards.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }

  return [...cards, ...cards]; // возвращаем массив пар случайных карточек
}

// Функция перемешивания n пар случайных карточек ("Тасование Фишера — Йетса")
function shuffle() {
  let array = [...getRandomCards()];

  for (let i = 0; i < array.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array; // возвращаем перемешанный массив пар случайных карточек
}

// Функция отрисовки игрового поля с карточками
function displayPlayBoard() {
  let pics = shuffle(); // получаем перемешанный массив пар случайных карточек
  console.log(pics);

  // Рисуем игровое поле
  pics.forEach((pic) => {
    let div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <div class="card-front"></div>
      <div class="card-back">${pic}</div>
    `;
    BOARD.append(div);
  });
}

displayPlayBoard(); // Отрисовка игрового поля с карточками

// Функция обработки клика на каждой конкретной карточке
function addEventListeners() {
  let cards = document.querySelectorAll(".card"); // коллекция всех карточек поля

  // Обработка события клика на каждой конкретной карточке
  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      // Получаем коллекцию открытых, несовпавших карточек
      let flipped = document.querySelectorAll(".flipped:not(.matched)");

      //  Если длина коллекции меньше 2, открываем карточку
      if (flipped.length <= 1) {
        flipCard(event.currentTarget);
      }
    });
  });
}

// Функция переворачивания карточки
function flipCard(target) {
  STATISTICS.moves++;
  MOVES.textContent = `${STATISTICS.moves} шагов`;
    
  target.classList.add("flipped"); // Добавляем карточке класс для ее переворачивания

  // Получаем коллекцию открытых, несовпавших карточек
  let flipped = document.querySelectorAll(".flipped:not(.matched)");

  if (flipped.length === 2) {
    // Проверяем две открытые карточки на идентичность
    if (flipped[0].textContent === flipped[1].textContent) {
      flipped[0].classList.add("matched");
      flipped[1].classList.add("matched");
    } else {
      setTimeout(() => {
        overturnCard(flipped); //через 1 секунду переворачиваем карточки рубашкой вверх, если совпадений нет
      }, 1000);
    }
  }

  let matched = document.querySelectorAll(".matched");
  if (matched.length === Math.pow(DIMENSION, 2)) {
    setTimeout(() => {
      BOARD_CONTAINER.classList.add("flipped");

      WIN.innerHTML = `
        <div class='win-text'>
          Победа! <br/> 
          <span class="highlight">${STATISTICS.moves}
          </span> ${(STATISTICS.moves + "").slice(-1) === "1" ? "ход"
          : (STATISTICS.moves + "").slice(-1) === "2"
          || (STATISTICS.moves + "").slice(-1) === "3"
          || (STATISTICS.moves + "").slice(-1) === "4" ? "хода"
          : "ходов"}  <br/>
          <span class="highlight">${STATISTICS.time}
          </span> ${(STATISTICS.time + "").slice(-1) === "1" ? "секунда"
          : (STATISTICS.time + "").slice(-1) === "2"
          || (STATISTICS.time + "").slice(-1) === "3"
          || (STATISTICS.time + "").slice(-1) === "4" ? "секунды"
          : "секунд"}  <br/>
        </div>
      `
      BUTTON.disabled = false;
      STATISTICS.game = true;
      STATISTICS.moves = 0;
      STATISTICS.time = 0;   

      clearInterval(STATISTICS.interval); // приостанавливаем отсчет времени
    }, 1000);
   
  }
}

// Функция переверачивания карточки рубашкой вверх (скрытия)
function overturnCard(flipped) {
  flipped[0].classList.remove("flipped");
  flipped[1].classList.remove("flipped");
}

// Функция запуска игры
function startGame() {
  BUTTON.disabled = true; // Активируем кнопку "Старт"
  MOVES.textContent = `${STATISTICS.moves} ходов`;
  BOARD_CONTAINER.classList.remove("flipped");
  
  if (STATISTICS.game) {
    BOARD.innerHTML = '';
    displayPlayBoard();
  };

  STATISTICS.interval = setInterval(() => {
    STATISTICS.time++;
    TIMER.textContent = `Время: ${STATISTICS.time} c`;    
  }, 1000)
}

// Запуск игры и добавление прослушивания событий
BUTTON.addEventListener("click", () => {
  startGame();
  addEventListeners();
});
