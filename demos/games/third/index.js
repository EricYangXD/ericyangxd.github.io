/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 900);

const numOfEnemies = 30;
const enemyArray = [];

// const enemyImg = new Image();
// enemyImg.src = "../assets/enemy_bat_1.png";

let gameFrame = 0;

class Enemy {
	constructor() {
		this.image = new Image();
		this.image.src = "../assets/enemy_bat_1.png";
		this.speed = Math.random() * 4 + 1;
		// this.spriteWidth = 266;
		// this.spriteHeight = 188;
		this.spriteWidth = 83;
		this.spriteHeight = 46;

		this.width = this.spriteWidth;
		this.height = this.spriteHeight;
		this.x = Math.random() * (canvas.width - this.width);
		this.y = Math.random() * (canvas.height - this.height);
		this.newX = Math.random() * (canvas.width - this.width);
		this.newY = Math.random() * (canvas.height - this.height);
		this.frame = 0;
		this.flapSpeed = Math.floor(Math.random() * 3 + 1);
		// this.angle = Math.random() * 2;
		// this.angle = 0;
		// // this.angleSpeed = Math.random() * 0.2;
		// this.angleSpeed = Math.random() * 2 + 0.5;
		// // this.curve = Math.random() * 7;
		// this.curve = Math.random() * 200 + 50;

		this.interval = Math.floor(Math.random() * 200 + 50);
	}

	update() {
		// this.x += this.speed;
		// this.x += Math.random() * 4 - 2;
		// this.y += Math.random() * 4 - 2;

		// this.y += this.speed;
		// this.x -= this.speed;
		// this.y += Math.sin(this.angle) * this.curve;
		// this.x =
		// 	(canvas.width / 2) * Math.sin((this.angle * Math.PI) / 90) +
		// 	(canvas.width / 2 - this.width / 2);
		// this.y =
		// 	(canvas.height / 2) * Math.cos((this.angle * Math.PI) / 270) +
		// 	(canvas.height / 2 - this.height / 2);

		// this.angle += this.angleSpeed;
		// this.x = 0;
		// this.y = 0;

		if (gameFrame % this.interval === 0) {
			this.newX = Math.random() * (canvas.width - this.width);
			this.newY = Math.random() * (canvas.height - this.height);
		}

		let dx = this.x - this.newX;
		let dy = this.y - this.newY;
		this.x -= dx / 60;
		this.y -= dy / 80;
		if (this.x + this.width < 0) {
			this.x = canvas.width;
		}

		if (gameFrame % this.flapSpeed === 0) {
			// 怪物动画有5格，循环播放
			this.frame > 4 ? (this.frame = 0) : this.frame++;
		}
	}

	draw() {
		// ctx.strokeRect(this.x, this.y, this.width, this.height);
		// ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			// 0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
}

for (let i = 0; i < numOfEnemies; i++) {
	enemyArray.push(new Enemy());
}

function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	enemyArray.forEach((enemy) => {
		enemy.update();
		enemy.draw();
	});
	gameFrame++;
	requestAnimationFrame(animate);
}
// animate();

// 碰撞检测：只用最基本的矩形碰撞

const rect1 = { x: 5, y: 5, width: 50, height: 50 };
const rect2 = { x: 20, y: 100, width: 20, height: 30 };
function isCollision(rect1, rect2) {
	if (
		rect1.x > rect2.x + rect2.width ||
		rect1.x + rect1.width < rect2.x ||
		rect1.y > rect2.y + rect2.height ||
		rect1.y + rect1.height < rect2.y
	) {
		console.log("no collision");
	} else {
		console.log("collisioned");
	}
}

// 圆

const circle1 = { x: 10, y: 10, radius: 10 };
const circle2 = { x: 50, y: 100, radius: 20 };

function collision(circle1, circle2) {
	if (
		circle.radius + circle1.radius >
		Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2)
	) {
		console.log("no collision");
	} else {
		console.log("collisioned");
	}
}
