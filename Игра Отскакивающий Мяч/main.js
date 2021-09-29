const par = document.querySelector('p');
let count = 0;
let timestarter = 60;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ','
                    + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
};

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'red';
    this.size = 15;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
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
};

EvilCircle.prototype.setControls = function () {
    var _this = this;
    window.onkeydown = function (e) {
        if (e.keyCode === 65 || e.keyCode === 37 || e.keyCode === 100) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68 || e.keyCode === 39 || e.keyCode === 102) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87 || e.keyCode === 38 || e.keyCode === 104) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83 || e.keyCode === 40 || e.keyCode === 98) {
            _this.y += _this.velY;
        }
    }
};

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                par.textContent = 'Кол-во мячей: ' + count;
            }
            if (count == 0) {
                alert('You are winner!');
                window.location.reload();
            }
        }
    }
};

let balls = [];
while (balls.length < 20) {
    const size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-10, 10),
        random(-10, 10),
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );
    balls.push(ball);
    count++;
    par.textContent = 'Кол-во мячей: ' + count;
}

let evilball = new EvilCircle(random(0, width), random(0, height), true);
evilball.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evilball.draw();
    evilball.checkBounds();
    evilball.collisionDetect();

    requestAnimationFrame(loop);
}

function countdown() {
    let timer;
    document.getElementById('timer').innerHTML = 'Осталось времени: ' + timestarter;
    timestarter--;
    if (timestarter < -1) {
        clearTimeout(timer);
        alert("Вы проиграли. Попробуйте заново.");
        window.location.reload();
    }
    else {
        timer = setTimeout(countdown, 1000);
    }
}

alert('У вас есть 1 минута!\nВам необходимо уничтожить все шарики.\nУправление: \n-W A S D\n-Num 2 Num 4 Num 6 Num 8\n-стрелочками.');
countdown();
loop();