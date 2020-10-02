class Game {

  constructor(selectors, figures) {
    this._selectors = selectors;
    this._figures = figures;
    this._interval = 1000;
    this._timer;
    this._level;
    this._paused = false;
    this._activeGame = false;
  }
  createGameField() {
    gameField._defineCellsAndRows();
    gameField._createField();
    nextField._defineCellsAndRows();
    nextField._createField();
  }
  defineFigure() {
    gameField._randomNumber();
    gameField._chooseFigure();
    gameField._setInitCoords();

    nextField._nextRandomNumber();
    nextField._randomNumber();
    nextField._chooseFigure();
    nextField._setInitCoords();
  }
  startGame() {
    if (storage._savePoint) {
      gameField._remove();

      curFigure = new Figure('#back');
      gameField = new Field('#back');

      Object.assign(curFigure, saveFigure);
      Object.assign(gameField, saveField);

      gameField._setInitCoords();
      gameField._appendFigure();

      this._activeGame = true;
      this._blockStartGame();
      curFigure._initiiateEvent();
      this._addEvent();
      this._initiate();
      storage._savePoint = false;
    } else {
      curFigure._index = 0;
      this._activeGame = true;
      this._blockStartGame();
      this.defineFigure()
      gameField._appendFigure();
      nextField._appendFigure();
      curFigure._initiiateEvent();
      this._addEvent();
      this._initiate();
      storage._savePoint = false;
    }
  }
  resetGame() {
    $$("#gameOver").style.display = "none"
    window.clearInterval(this._timer);
    this._activeGame = false;
    storage._savePoint = false;
    this._blockStartGame();
    this._removeEvent();
    this._interval = 1000;
    this._paused = false;
    gameField._figure = [];
    nextField._figure = [];
    curFigure._cubes = [];
    curFigure._cubeIndex = [];
    curFigure._index = 0;
    scoreClass._score = 0;
    levelClass._level = 0;
    $$(selectors.infoScore).innerHTML = scoreClass._score;
    $$(selectors.level).innerHTML = ` ${levelClass._level}`;
    [...$$('.cube')].forEach(item => item.parentNode.removeChild(item));
  }
  pauseGame() {
    if (this._paused) {
      this._initiate();
      this._paused = false;
    } else {
      window.clearInterval(this._timer)
      this._paused = true;
    }
  }
  _isEndGame() {
    let figure = [this._figures[gameField._random].firstPos, this._figures[gameField._random].secondPos, this._figures[gameField._random].thirdPos, this._figures[gameField._random].fourthPos];
    return figure.some((item, i) => $$(gameField._parent).children[item[i][1]].children[item[i][0]].firstElementChild);
  }
  _initiate() {
    this._timer = setInterval(curFigure._moveFigure.bind(curFigure), this._interval)
  }
  _addEvent() {
    window.addEventListener('keydown', curFigure._event);
    window.addEventListener('keydown', curFigure._rotateEvent);
    window.addEventListener('keydown', curFigure._moveHor);
    window.addEventListener('keydown', curFigure._pause);
  }
  _removeEvent() {
    window.removeEventListener('keydown', curFigure._event);
    window.removeEventListener('keydown', curFigure._rotateEvent);
    window.removeEventListener('keydown', curFigure._moveHor);
    window.removeEventListener('keydown', curFigure._pause);
  }
  _changeSpeed(index) {
    if (this._interval !== 200) {
      this._interval -= index.length * 10;
      window.clearInterval(this._timer);
      this._initiate();
      this._changeLevelTitle();
    }
  }
  _changeLevelTitle() {
    this._level = Math.round((1000 - this._interval) / 100);
    $$(this._selectors.level).innerHTML = ` ${this._level}`;
  }
  _blockStartGame() {
    if (this._activeGame) {
      $$('#start').style.color = 'grey';
    } else {
      $$('#start').style.color = 'yellow';
    }
  }
}
class Storage {
  constructor() {
    this._savePoint = false;
  }

  getDataFromSave() {
    let storage = localStorage.getItem('savePoint');
    let nextFieldStorage = localStorage.getItem('nextFieldSavePoint');
    if (storage && nextFieldStorage) {
      saveFigure = JSON.parse(storage)[0].curFigure;
      saveField = JSON.parse(storage)[0].gameField;
      saveField._figure = [];
      gameField._figure = [];
      nextField._figure = [];
      curFigure._index = JSON.parse(storage)[0].rotateIndex;
      game._interval = JSON.parse(storage)[0].interval;
      scoreClass._setScoreFromStorage();
      game._changeLevelTitle();
      this._savePoint = true;
      for (let elem of JSON.parse(storage)) {
        let cell = $$('#back').children[elem.rowIndex].children[elem.cellIndex];
        let cube = document.createElement('div');
        cube.className = elem.statusClass;
        for (let j = 0; j < game._selectors.sides.length; j++) {
          let side = document.createElement("div");
          side.className = `${game._selectors.generalClass} ${game._selectors.sides[j]} ${elem.color}`;
          cube.appendChild(side);
        }
        if (/activeCube/.test(cube.className)) {
          gameField._figure.push(cube)
        }
        cell.appendChild(cube);
      }

      for (let elem of JSON.parse(nextFieldStorage)) {
        let cell = $$('.nextFigure').children[elem.rowIndex].children[elem.cellIndex];
        let cube = document.createElement('div');
        cube.className = elem.statusClass;
        for (let j = 0; j < game._selectors.sides.length; j++) {
          let side = document.createElement("div");
          side.className = `${game._selectors.generalClass} ${game._selectors.sides[j]} ${elem.color}`;
          cube.appendChild(side);
        }
        nextField._figure.push(cube)
        cell.appendChild(cube);
      }
    }
  }
  saveGame() {
    window.clearInterval(game._timer);
    let storage = []
    let rows = [...$$('#back .row')]
    rows.forEach((item, i) => {
      [].forEach.call(item.children, ((item, index) => {
        if (item.firstElementChild) {
          storage.push({
            cellIndex: index,
            rowIndex: i,
            score: scoreClass._score,
            interval: game._interval,
            color: item.firstElementChild.firstElementChild.className.slice(-1),
            statusClass: item.firstElementChild.className,
            curFigure: curFigure,
            gameField: gameField,
            rotateIndex: curFigure._index
          })
        }
      }))
    })

    let nextFieldStorage = [];
    let nextRows = [...$$('.nextFigure .row')]
    nextRows.forEach((item, i) => {
      [].forEach.call(item.children, ((item, index) => {
        if (item.firstElementChild) {
          nextFieldStorage.push({
            cellIndex: index,
            rowIndex: i,
            color: item.firstElementChild.firstElementChild.className.slice(-1),
            statusClass: item.firstElementChild.className
          })
        }
      }))
    })

    localStorage.setItem('nextFieldSavePoint', JSON.stringify(nextFieldStorage));
    localStorage.setItem('savePoint', JSON.stringify(storage));
  }
}
class Field {
  constructor(className) {
    this._parent = className;
    this._objectCopy;
    this._rows;
    this._cells;
    this._random;
    this._name;
    this._positions;
    this._currentPosCoords;
    this._generalClass = game._selectors.generalClass;
    this._sides = game._selectors.sides;
    this._colors = ['T', 'Q', 'Z', 'S', 'L', 'J', 'I'];
    this._figure = [];
    this._nextFigure;
  }
  _defineCellsAndRows() {
    this._cells = parseInt(getComputedStyle($$(this._parent)).width) / 30;
    this._rows = parseInt(getComputedStyle($$(this._parent)).height) / 30;
  }
  _createField() {
    for (let i = 0; i < this._rows; i++) {
      let row = document.createElement('div');
      row.classList.add('row');
      for (let j = 0; j < this._cells; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        row.appendChild(cell);
        if (j === 0 || j === 9) {
          cell.setAttribute('data-border', 'border');
        }
      }
      $$(this._parent).appendChild(row);
    }
  }
  _randomNumber() {
    if (nextField._nextFigure === undefined) {
      this._random = Math.floor(Math.random() * game._figures.length);
    } else {
      this._random = nextField._nextFigure;
    }
  }
  _nextRandomNumber() {
    this._nextFigure = Math.floor(Math.random() * game._figures.length);
  }
  _chooseFigure() {
    this._objectCopy = JSON.parse(JSON.stringify(game._figures));
    this._name = this._objectCopy[this._random].name;
    this._positions = [this._objectCopy[this._random].firstPos, this._objectCopy[this._random].secondPos, this._objectCopy[this._random].thirdPos, this._objectCopy[this._random].fourthPos];
  }
  _setInitCoords() {

    this._currentPosCoords = this._positions[curFigure._index];
  }
  _appendFigure() {
    levelClass._clearLevel();
    for (let i in this._currentPosCoords) {
      let cube = document.createElement("div");
      cube.classList.add("cube");
      cube.classList.add("activeCube");
      for (let j = 0; j < this._sides.length; j++) {
        let side = document.createElement("div");
        side.className = `${this._generalClass} ${this._sides[j]}`;
        cube.appendChild(side);
        this._drawSide(side);
      }
      let parent = $$(this._parent).children[this._currentPosCoords[i][1]].children[this._currentPosCoords[i][0]];
      this._figure.push(cube);
      parent.appendChild(cube);
    }
    curFigure._checkConditions();
  }
  _setInitialSettings() {
    this._figure = [];
    curFigure._cubes = [];
    curFigure._cubeIndex = [];
    curFigure._index = 0;
    if (game._isEndGame()) {
      window.clearInterval(game._timer);
      $$("#gameOver").style.display = "block"
    } else {
      this._randomNumber();
      this._chooseFigure();
      this._setInitCoords();
      this._appendFigure();
      game._addEvent();

      nextField._remove();
      nextField._nextRandomNumber();
      nextField._randomNumber();
      nextField._chooseFigure();
      nextField._setInitCoords();
      nextField._appendFigure();
    }
  }
  _drawSide(side) {
    let className;
    switch (this._name) {
      case "figure_T":
        side.classList.add(this._colors[0]);
        break;
      case "figure_Q":
        side.classList.add(this._colors[1]);
        break;
      case "figure_Z":
        side.classList.add(this._colors[2]);
        break;
      case "figure_S":
        side.classList.add(this._colors[3]);
        break;
      case "figure_J":
        side.classList.add(this._colors[4]);
        break;
      case "figure_L":
        side.classList.add(this._colors[5]);
        break;
      case "figure_I":
        side.classList.add(this._colors[6]);
        break;
    }
  }
  _remove() {
    this._figure.map(item => item.parentNode.removeChild(item))
    this._figure = [];
  }
}
class Score {
  constructor(scoreID, highScoreId) {
    this._highScore = 0;
    this._highScoreId = highScoreId;
    this._scoreID = scoreID;
    this._score = 0;

    this._HighScoreFromStorage();
  }

  _setHighScore() {
    localStorage.setItem('highScore', this._score);
    this._highScore = this._score;
    $$(this._highScoreId).innerHTML = this._score;
  }
  _setScoreFromStorage() {
    let storage = localStorage.getItem('savePoint')
    if (storage) {
      this._score = JSON.parse(storage)[0].score;
      $$(this._scoreID).innerHTML = this._score
    }
  }
  _addScore(index) {
    let item = $$(this._scoreID);
    switch (index.length) {
      case 1:
        this._score += 5;
        item.innerHTML = this._score;
        break;
      case 2:
        this._score += 15;
        item.innerHTML = this._score;
        break;
      case 3:
        this._score += 30;
        item.innerHTML = this._score;
        break;
      case 4:
        this._score += 40;
        item.innerHTML = this._score;
        break;
    }
    this._checkHighScore();
  }
  _checkHighScore() {
    if (this._score > this._highScore) {
      this._setHighScore();
    }
  }
  _HighScoreFromStorage() {
    let highScore = localStorage.getItem('highScore');
    if (highScore) {
      this._highScore = highScore;
      $$(this._highScoreId).innerHTML = this._highScore
    }
  }
}
class Level {
  constructor() {

  }
  _clearLevel() {

    let levels = $$('.row');
    let index = [];
    let fullLevel = [...$$('.row')];

    [].map.call(levels, (item) => {
      return [].every.call(item.children, elem => elem.firstElementChild);
    }).filter((item, i) => {
      if (item === true) {
        index.push(i);
      }
    });

    if (index.length > 0) {
      scoreClass._addScore(index);
      game._changeSpeed(index);
      index.forEach(elem => {
        [].forEach.call(fullLevel[elem].children, item => item.firstElementChild.parentNode.removeChild(item.firstElementChild))
      })

      while (index.length > 0) {
        this._moveLevels(index);
        index.shift();
      }
    }
  }
  _moveLevels(indexes) {

    let newArr = [];
    [].map.call($$(gameField._parent).children, (item, index) => {
      if (index < indexes[0]) {
        [].map.call(item.children, (elem) => {
          if (elem.firstElementChild) {
            newArr.push(elem)
          }
        })
      }
    })

    this._staticCubeIndex = newArr.map(item => Array.from(item.parentNode.children).indexOf(item));

    newArr.map((item, index) => {
      if (item.parentNode.nextElementSibling) {
        item.parentNode.nextElementSibling.children[this._staticCubeIndex[index]].appendChild(item.firstElementChild);
      }
    })
  }
}
class Figure {
  constructor(parentClass) {
    this._event;
    this._moveHor;
    this._rotateEvent;
    this._pause;
    this._index;
    this._cubes;
    this._cubeIndex;
    this._cubeAtLeft;
    this._cubeAtRight;
    this._cubeAtDown;
    this._checkBorder;
    this._spaceAround;
    this._spaceAroundForI;
    this._borderForI;
  }

  _checkConditions() {

    this._cubes = Array.from($$('#back .cell')).filter(item => {
      if (item.firstElementChild) {
        if (item.firstElementChild.classList.contains('activeCube')) {
          return item.firstElementChild
        }
      }
    })

    this._cubeIndex = this._cubes.map(item => Array.from(item.parentNode.children).indexOf(item));

    this._cubeAtDown = this._checkCubeDown();
    this._spaceAround = this._checkSpaceAround();
    this._cubeAtLeft = this._checkCubeLeft();
    this._cubeAtRight = this._checkCubeRight();
    this._checkBorder = this._isBorder();
    this._spaceAroundForI = this._checkSpaceAroundforI();
    this._isBorderForI()
  }
  _isBorder() {
    let item = $$(gameField._parent).children[gameField._currentPosCoords[1][1]].children[gameField._currentPosCoords[1][0]];
    return item.getAttribute('data-border');
  }
  _isBorderForI() {

    let item = $$(gameField._parent).children[gameField._currentPosCoords[1][1]].children[gameField._currentPosCoords[1][0]];
    if (item.nextElementSibling) {
      this._borderForI = {
        item1: item.nextElementSibling.getAttribute('data-border'),
        item2: item.getAttribute('data-border')
      }
    }
  }
  _checkCubeDown() {

    return this._cubes.some((item, i) => {
      if (item.parentNode.nextElementSibling) {
        if (item.parentNode.nextElementSibling.children[this._cubeIndex[i]].firstElementChild) {
          return item.parentNode.nextElementSibling.children[this._cubeIndex[i]].firstElementChild.classList.contains('staticCube');
        }
      }
    })
  }
  _checkCubeLeft() {

    return this._cubes.some((item, i) => {
      if (item.nextElementSibling) {
        if (item.nextElementSibling.firstElementChild) {
          return item.nextElementSibling.firstElementChild.classList.contains('staticCube')
        }
      }
    })
  }
  _checkCubeRight() {

    return this._cubes.some((item, i) => {
      if (item.previousElementSibling) {
        if (item.previousElementSibling.firstElementChild) {
          return item.previousElementSibling.firstElementChild.classList.contains('staticCube')
        }
      }
    })
  }
  _checkSpaceAround() {

    if (!this._cubeAtLeft && !this._cubeAtRight) {
      return true;
    }
  }
  _checkSpaceAroundforI() {
    let check1 = this._cubes.some((item, i) => {
      if (item.previousElementSibling) {
        if (item.previousElementSibling.previousElementSibling) {
          if (item.previousElementSibling.previousElementSibling.firstElementChild) {
            return item.previousElementSibling.previousElementSibling.firstElementChild.classList.contains('staticCube')
          }
        }
      }
    })
    let check2 = this._cubes.some((item, i) => {
      if (item.nextElementSibling) {
        if (item.nextElementSibling.nextElementSibling) {
          if (item.nextElementSibling.nextElementSibling.firstElementChild) {
            return item.nextElementSibling.nextElementSibling.firstElementChild.classList.contains('staticCube')
          }
        }
      }
    })
    if (!check1 && !check2) {
      return true;
    }
  }
  _initiiateEvent() {
    this._event = function() {
      if (event.keyCode === 40) {
        this._changeLevel();
        gameField._remove();
        gameField._appendFigure();
      }
    }.bind(this);
    this._moveHor = function() {
      if (event.keyCode === 37 || event.keyCode === 39) {
        this._changeCells(event.keyCode);
        gameField._remove();
        gameField._appendFigure();
      }
    }.bind(this);
    this._rotateEvent = function() {
      if (event.keyCode === 38) {
        this._rotate();
        gameField._remove();
        gameField._appendFigure();
      }
    }.bind(this);
    this._pause = function() {
      if (event.keyCode === 32) {
        game.pauseGame();
      }
    }.bind(this)
  }
  _moveFigure() {
    if (gameField._currentPosCoords.some(item => item[1] === 19)) {
      game._removeEvent();
      gameField._figure.map(item => {
        item.classList.remove('activeCube')
        item.classList.add('staticCube')
      });
      gameField._setInitialSettings()
    } else if (this._cubeAtDown) {
      game._removeEvent();
      gameField._figure.map(item => {
        item.classList.remove('activeCube')
        item.classList.add('staticCube')
      });
      gameField._setInitialSettings();
    } else {
      this._checkConditions();
      this._changeLevel();
      gameField._remove();
      gameField._appendFigure();
    }
  }
  _changeCells(key) {

    if (this._cubeAtLeft || gameField._currentPosCoords.some(item => item[0] > 8)) {
      key === 37 ?
        gameField._positions.forEach(item => item) :
        gameField._positions.forEach(item => item.forEach(elem => elem[0]--))
    } else if (this._cubeAtRight || gameField._currentPosCoords.some(item => item[0] === 0)) {
      key === 37 ?
        gameField._positions.forEach(item => item.forEach(elem => elem[0]++)) :
        gameField._positions.forEach(item => item)
    } else {
      key === 37 ?
        gameField._positions.forEach(item => item.forEach(elem => elem[0]++)) :
        gameField._positions.forEach(item => item.forEach(elem => elem[0]--))
    }
  }
  _changeLevel() {
    if (gameField._currentPosCoords.some(item => item[1] === 19)) {
      gameField._positions.forEach(item => item);
    } else if (this._cubeAtDown) {
      gameField._positions.forEach(item => item);
    } else {
      gameField._positions.forEach(item => item.forEach(elem => elem[1]++));
    }
  }
  _rotate() {
    if (gameField._name === "figure_I") {
      if (this._spaceAroundForI) {
        if (this._borderForI.item1 !== "border" && this._borderForI.item2 !== "border") {
          if (this._index === 3 || this._index === undefined) {
            this._index = 0;
            gameField._currentPosCoords = gameField._positions[this._index];
          } else {
            this._index++;
            gameField._currentPosCoords = gameField._positions[this._index];
          }
        }
      }
    } else {
      if (this._spaceAround) {
        if (!this._checkBorder) {
          if (this._index === 3 || this._index === undefined) {
            this._index = 0;
            gameField._currentPosCoords = gameField._positions[this._index];
          } else {
            this._index++;
            gameField._currentPosCoords = gameField._positions[this._index];
          }
        }
      }
    }
  }
}
let ids = ["textScore", "texthighScore", "textLevel", "next", "reset", "start", "save", "lastSave", "changeLang", "rotate", "left", "right", "down", "space", "gameOver"];
let rus = ["Счет:", "Рекорд:", "Уровень:", "Следующая фигура", "Сброс", "Начать игру", "Сохранить", "Загрузить", "EN", " - Вращение", " - Сдвинуть в лево", " - Сдвинуть в право", " - Сдвинуть в низ", "Пробел - пауза", "Конец Игры"]
let en = ["Score:", "High Score:", "Level:", "Next Figure", "Reset", "Start", "Save", "Load", "RU", " - rotate", " - move left", " - move right", " - move down", "space - pause", "Game Over"]
let selectors = {
  generalClass: "cube_side",
  sides: ["cube_side", "cube_bottom", "cube_top", "cube_front", "cube_back", "cube_left", "cube_right"],
  infoScore: "#score",
  highScore: '#highScore',
  level: "#level"
}
let figures = [{
    name: "figure_T",
    firstPos: [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ],
    secondPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1]
    ],
    thirdPos: [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 0]
    ],
    fourthPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 1]
    ],
  },
  {
    name: "figure_Q",
    firstPos: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 0]
    ],
    secondPos: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 0]
    ],
    thirdPos: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 0]
    ],
    fourthPos: [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 0]
    ]
  },
  {
    name: "figure_Z",
    firstPos: [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0]
    ],
    secondPos: [
      [0, 0],
      [1, 1],
      [0, 1],
      [1, 2]
    ],
    thirdPos: [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0]
    ],
    fourthPos: [
      [0, 0],
      [1, 1],
      [0, 1],
      [1, 2]
    ]
  },
  {
    name: "figure_S",
    firstPos: [
      [0, 0],
      [1, 1],
      [1, 0],
      [2, 1]
    ],
    secondPos: [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 2]
    ],
    thirdPos: [
      [0, 0],
      [1, 1],
      [1, 0],
      [2, 1]
    ],
    fourthPos: [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 2]
    ]
  },
  {
    name: "figure_J",
    firstPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2]
    ],
    secondPos: [
      [0, 2],
      [1, 2],
      [2, 2],
      [2, 1]
    ],
    thirdPos: [
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 0]
    ],
    fourthPos: [
      [0, 1],
      [1, 0],
      [0, 0],
      [2, 0]
    ]
  },
  {
    name: "figure_L",
    firstPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2]
    ],
    secondPos: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2]
    ],
    thirdPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0]
    ],
    fourthPos: [
      [0, 1],
      [1, 1],
      [0, 0],
      [2, 1]
    ]
  },
  {
    name: "figure_I",
    firstPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3]
    ],
    secondPos: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1]
    ],
    thirdPos: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3]
    ],
    fourthPos: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1]
    ]
  }
]
let game = new Game(selectors, figures);
let gameField = new Field('#back');
let scoreClass = new Score(selectors.infoScore, selectors.highScore);
let levelClass = new Level();
let nextField = new Field('.nextFigure');
let curFigure = new Figure('#back');
let nextFigure = new Figure('.nextFigure');
let storage = new Storage();
let saveFigure, saveField, saveNextFigure, saveNextField;
game.createGameField();
let save = localStorage.getItem('savePoint');
if (!save) {
  $$("#lastSave").style.color = 'grey';
}
$$('#reset').addEventListener('click', function() {
  game.resetGame();
})
$$('#start').addEventListener('click', function() {
  if (!game._activeGame) {
    game.startGame();
  }
})
$$('#save').addEventListener('click', function() {
  storage.saveGame();
  $$("#lastSave").style.color = 'yellow';
})
$$('#lastSave').addEventListener('click', function() {
  storage.getDataFromSave();
})
$$('#changeLang').addEventListener('click', function() {
  if ($$('#changeLang').innerHTML === "RU") {
    for (let value in ids) {
      $$("#" + ids[value]).lastChild.textContent = rus[value]
    }
  } else if ($$('#changeLang').innerHTML === "EN") {
    for (let value in ids) {
      $$("#" + ids[value]).lastChild.textContent = en[value]
    }
  }
})
