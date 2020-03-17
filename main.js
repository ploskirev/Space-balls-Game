'use strict';

// инициализируем canvas и счетчик
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const count = document.querySelector('.score');
let message = document.querySelector('h1');
let rules = document.querySelector('.rules');
let music = document.querySelector('audio');
let mute = document.querySelector('.mute');
let onSound = document.querySelector('#sound');


/**
 *@description - функция генерирует случайное число в диапазоне от min до max
 *
 * @param {number} min - минимальное значение
 * @param {nember} max - максимальное значение
 * @returns - возвращает сгенерированное число
 */
function random(min, max) {
  const num = (Math.random() * (max - min)) + min;
  return num;
}


/**
 *@description Функция конструктор. Создает базовую модель. На ее основе создаются
 * конструкторы для шаров и объекта игрока
 *
 * @param {number} x - координата по X
 * @param {number} y - координата по Y
 * @param {number} velX - скорость по X
 * @param {number} velY - скорость по Y
 * @param {boolean} exists - булево значение, говорящее существует ли объект
 */
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

/**
 *@description функция-конструктор, создающая объекты шаров
 *
 * @param {number} x - координата по X
 * @param {number} y - координата по Y
 * @param {number} velX - скорость по X
 * @param {number} velY - скорость по Y
 * @param {string} color - цвет шара
 * @param {number} size - размер шара
 * @param {boolean} [exists=true] булево значение, говорящее существует ли объект
 */
function Ball(x, y, velX, velY, color, size, fillColor, strokeColor, exists = true) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
  this.fillColor = fillColor;
  this.strokeColor = strokeColor;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

/**
 *@description  функция конструктор, создающая объект игрока
 *
 * @param {*} x - координата по X
 * @param {*} y - координата по Y
 * @param {boolean} [exists=true] булево значение, говорящее существует ли объект
 * @param {string} [color='white'] - цвет игрока
 * @param {number} [size=3] - стартовый размер игрока
 */
function EvilCircle(x, y, exists = true, color = 'white', size = 3) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = color;
  this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

/**
 *@description  метод, отрисовывающий шары
 */
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = 1;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

/**
 *@description - метод обновляющий позицию шаров и проверяющий столкновение с границами поля
 *
 */
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
    this.x = width - this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
    this.x = 0 + this.size;
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
    this.y = height - this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
    this.y = 0 + this.size;
  }

  if (this.velX == 0) {
    this.velX = 1;
  }

  if (this.velY == 0) {
    this.velY = 1;
  }

  this.x += this.velX;
  this.y += this.velY;
}

/**
 *@description = метод, определяющий столкновение между шарами
 * при столкновении шары становятся одного цвета и отскакивают друг от друга
 */
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color;
        balls[j].fillColor = this.fillColor;
        balls[j].strokeColor = this.strokeColor;
        this.velX = -this.velX;
        this.velY = -this.velY;
      }
    }
  }
}

/**
 *@description - метод меняет отрисовку шара при приблежении к ним шара игрока
 */
Ball.prototype.stress = function() {
  ctx.beginPath();
  // ctx.fillStyle = 'rgba(255, 255, 255, .4)';
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

/**
 *@description - метод, отрисовывающий щар игрока
 */
EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = this.color;
  ctx.fillStyle = 'rgb(80, 0, 0)';
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

/**
 *@description - метод, проверяющий столкновение шара игрока с границей поля
 */
EvilCircle.prototype.checkBorder = function() {
  if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
}

/**
 *@description - метод устанавливает управление шаром игрока с клавиатуры
 */
EvilCircle.prototype.setControls = function() {
  var keyState = {};
  window.addEventListener('keydown', function(e) {
    keyState[e.keyCode] = true;
  });
  window.addEventListener('keyup', function(e) {
    keyState[e.keyCode] = false;
  });

  /**
   *@description - функция проверяет нажатую кнопку и меняет положение шара игрока
   */
  function checkKey() {
    if (keyState[37]) {
      this.x -= this.velX;
    }
    if (keyState[39]) {
      this.x += this.velX;
    }
    if (keyState[38]) {
      this.y -= this.velY;
    }
    if (keyState[40]) {
      this.y += this.velY;
    }
  }
  setInterval(checkKey.bind(evilCircle1), 70);
}


/**
 *@description - метод меняет отрисовку шара игрока 
 * если на поле осталось 10 непойманных шаров
 */
EvilCircle.prototype.stress = function() {
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgb(80, 0, 0)';
  ctx.fillStyle = 'rgb(30, 30, 30)';
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

/**
 *@description - метод проверяет факт столкновения шаров с шаром игрока
 *если столкновение произошло, убираем столкнувшийся шар, увеличиваем размер шара игрока
 * и меняем цвет обводки шара игрока на цвет столкнувшегося шара
 */
EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {

    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      balls[j].distance = distance;

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        this.size += balls[j].size / 10;
        this.color = balls[j].color;
      }
    }
  }
}

/**
 *@description - метод проверяет сближение шаров с шаро игрока.
 * При сближении шар подсвечивается и удаляется от игрока, набирая скорость
 * При удалении - шар получает свою стартовую скорость
 */
EvilCircle.prototype.oncomingDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].distance < this.size + 150 && balls[j].distance > this.size + 1) {
      balls[j].stress();
      if (this.x > balls[j].x) {
        balls[j].valX -= .07;
      } else {
        balls[j].velX += .07;
      }
      if (this.y > balls[j].y) {
        balls[j].velY -= .07;
      } else {
        balls[j].velY += .07;
      }
      balls[j].update();
    }
    if (balls[j].distance > 200 + this.size && balls[j].distance < 201 + this.size) {
      // balls[j].velX = balls[j].startSpeedX;
      // balls[j].velY = balls[j].startSpeedY;
      balls[j].velX = random(-1.5, 1.5);
      balls[j].velY = random(-1.5, 1.5);
    }
  }
}

/**
 *@description - функция создает массив с объектами для заднего фона (звездное небо)
 * @returns - возвращает массив с объектами фона
 */
function createMap() {
  let stars = [];
  let stars2 = [];
  let stars3 = [];
  let starsQuantity = 150;
  while (stars.length < starsQuantity) {
    let star = {
      'x': random(0, width),
      'y': random(0, height),
      'size': random(0.5, 1.5),
      // 'color': 'rgba(255, 255, 255, ' + random(0.01, 0.3) + ')'
      'color': 'rgba(' + random(220, 255) + ', ' + random(250, 235) + ', ' + random(254, 255) + ', ' + random(0.01, 0.4) + ')',
      'strokeColor': 'rgba(255, 255, 255, .032)',
      'lineWidth' : random(1, 7)
    }
    stars.push(star);
  }
  return stars;
}

/**
 *@description - функция отрисовывает задний фон н канвасе
 * @param {array} stars - массив с обектами фона (звезды на зведном небе)
 */
function mapDraw(stars) {
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.fillStyle = star.color;
    ctx.strokeStyle = star.strokeColor;
    ctx.lineWidth = star.lineWidth;
    ctx.ellipse(star.x, star.y, star.size, star.size, Math.PI / 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  });
}

/**
 *@description - функция оживляет задний фон (звезды мерцают и немного перемещаются)
 */
function updateMap() {
  stars.forEach((star) => {
    star.color = 'rgba(' + random(180, 190) + ', ' + random(180, 190) + ', ' + random(254, 255) + ', ' + random(0.01, 0.4) + ')';
    star.x += random(-0.1, 0.1);
    star.y += random(-0.05, 0.05);
  });
}


/**
 *@description - функция создает массив объектов с шарами
 * @param {number} quantity -  количество шаров
 * @returns - возвращает массив объектов с шарами
 */
function createBalls(quantity) {
  let balls = [];
  while (balls.length < quantity) {
    let color = 'rgba(' + random(100, 255) + ',' + random(100, 255) + ',' + random(100, 255);
    var ball = new Ball(
      random(30, width - 30),
      random(30, height - 30),
      random(-1.5, 1.5),
      random(-1.5, 1.5),
      color + ', ' + '.3)',
      random(10, 30),
      color + ', ' + '.04)',
      color + ', ' + '1)',
    );
    ball.startSpeedX = ball.velX;
    ball.startSpeedY = ball.velY;
    balls.push(ball);
  }
  return balls;
}

/**
 *@description - функция проверяет не съедены ли шары (свойство exists).
 * Если не съедены, отрисовывает их
 * @param {array} balls - массив объектов с шарами
 */
function checkBall(balls) {
  balls.forEach((ball, index) => {
    if (ball.exists) {
      ball.collisionDetect();
      ball.draw();
      ball.update();
    } else {
      balls.splice(index, 1);
    }
  });
}

/**
 *@description - функция проверяет на условие поражения и выводит соответствующее сообщение
 * создает новый массив из отфильтрованных элементов массива с шарами сравнивая цвет шаров
 * если длина отфильтрованного массива равна длине массива с шарами, 
 * значит они одинакового цвета, значит это поражение
 * @param {array} balls - массив с объектами шаров
 */
function checkLoose(balls) {
  let colorCounter = balls.filter(function(elem) {
    return (elem.color == balls[0].color);
  });
  console.dir(`ColorCounter: ${colorCounter.length}`);

  if (colorCounter.length == balls.length && balls.length > 1) {
    canvas.style.filter = "blur(20px)"
    message.textContent = `YOU LOOSE!`;
  }
}

/**
 *@description функция проверяет на условие победы и выводит соответствующее сообщение.
 * Если длина масива с шарами = 0, значит все шары съедены. Значит победа.
 *
 * @param {array} balls - массив с объектами шаров
 */
function checlWin(balls) {
  if (balls.length == 0) {
    canvas.style.filter = "blur(20px)"
    message.textContent = `YOU WIN!`;
  }
}

/**
 *@description - функция считает текущее количество съеденных шаров
 * @param {array} balls - массив с объектами шаров
 * @param {number} quantity - исходное число шаров
 * @returns {number} возвращает текущее число съеденных шаров
 */
function getCount(balls, quantity) {
  return (quantity - balls.length);
}

/**
 *@description - функция включает, выключает звук по чекбоксу (нужно исправить, объединить с muteSound)
 */
function checkSound() {
  if (sound.checked) {
    music.muted = false;
    mute.style.backgroundImage = "url('speakerMuted.png')";
  } else {
    music.muted = true;
    mute.style.backgroundImage = "url('speaker.png')";
  }
}

sound.addEventListener('change', checkSound);


/**
 *@description - функция выключает/включает громкость фоновой музыки
 */
function muteSound() {
  if (music.muted == true) {
    music.muted = false;
    mute.style.backgroundImage = "url('speakerMuted.png')";
  } else {
    music.muted = true;
    mute.style.backgroundImage = "url('speaker.png')";
  }
  
}

let stars = createMap();



// Инициализируем массив для хранения шаров, их количество, 
let ballsQuantity = 25;
let balls = createBalls(ballsQuantity);

// создаем шар игрока
let evilCircle1 = new EvilCircle(random(0, canvas.width), random(0, canvas.height));

//устанавливаем контроль с клвиатуры
evilCircle1.setControls();

mute.addEventListener('click', muteSound);

/**
 *@description - функция запускает цикл игры (отрисовка и обновление поля, шаров, игрока,
 * проверка на столкновения, на поражение и победу, вывод счетчика)
 */
function loop() {
  rules.classList.add('hidden');
  mute.classList.remove('hidden');
  music.play();
  music.volume = 0.4;
  if (balls.length > 5) {
    ctx.fillStyle = 'rgba(0, 0, 0, .25)';
    ctx.fillRect(0, 0, width, height);
    mapDraw(stars);
    updateMap();
    evilCircle1.draw();
    evilCircle1.checkBorder();
  } else {
    document.body.style.backgroundColor = 'rgb(135, 0, 0)';
    ctx.fillStyle = 'rgba(135, 0, 0, .25)';
    ctx.fillRect(0, 0, width, height);
    evilCircle1.stress();
    evilCircle1.checkBorder();
  }

  evilCircle1.collisionDetect();
  evilCircle1.oncomingDetect();

  checkBall(balls);

  count.textContent = `Score: ${getCount(balls, ballsQuantity)}`;
  checkLoose(balls);
  checlWin(balls);

  requestAnimationFrame(loop);
}