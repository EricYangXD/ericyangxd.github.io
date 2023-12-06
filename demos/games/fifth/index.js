/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const collisionCanvas = document.getElementById("collision");
const collisionCtx = collisionCanvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let score = 0;
ctx.font = "50px Impact";

let explosions = [];
let gameover = false;

let particles = [];
class Particle {
	constructor(x, y, size, color) {
		this.size = size;
		this.x = x + this.size / 2 + Math.random() * 50 - 25;
		this.y = y + this.size / 3 + Math.random() * 50 - 25;
		this.radius = (Math.random() * this.size) / 10;
		this.maxRadius = Math.random() * 20 + 35;
		this.markForDeletion = false;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
	}
	update() {
		this.x += this.speedX;
		this.radius += 0.3;
		if (this.radius > this.maxRadius) {
			this.markForDeletion = true;
		}
	}
	draw() {
		ctx.save();
		ctx.globalAlpha = 1 - this.radius / this.maxRadius;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

class Explosion {
	constructor(x, y, size) {
		this.image = new Image();
		this.image.src = "../assets/boom.png";
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.sound = new Audio();
		this.sound.src = "../assets/Fireimpact1.wav";
		this.timeSinceLastFrame = 0;
		this.frameInterval = 200;
		this.markForDeletion = false;
	}

	update(deltatime) {
		if (this.frame === 0) {
			this.sound.play();
		}
		this.timeSinceLastFrame += deltatime;
		if (this.timeSinceLastFrame > this.frameInterval) {
			this.frame++;
			this.timeSinceLastFrame = 0;
			if (this.frame > 5) {
				this.markForDeletion = true;
			}
		}
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y - this.size / 4,
			this.size,
			this.size
		);
	}
}

let ravens = [];
class Raven {
	constructor() {
		this.spriteWidth = 271;
		this.spriteHeight = 194;
		this.sizeModifer = Math.random() * 0.6 + 0.4;
		this.width = this.spriteWidth * this.sizeModifer;
		this.height = this.spriteHeight * this.sizeModifer;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.directionX = Math.random() * 5 + 3;
		this.directionY = Math.random() * 5 - 2.5;
		this.markForDeletion = false;
		this.image = new Image();
		this.image.src = "../assets/enemy_raven.png";
		this.frame = 0;
		this.maxFrame = 4;
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 60 + 60;
		this.randomColors = [
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
		];
		this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
		this.hasTrial = Math.random() > 0.5;
	}
	update(deltatime) {
		if (this.y < 0 || this.y > canvas.height - this.height) {
			this.directionY *= -1;
		}
		this.x -= this.directionX;
		this.y += this.directionY;
		if (this.x < 0 - this.width) {
			this.markForDeletion = true;
		}
		this.timeSinceFlap += deltatime;
		if (this.timeSinceFlap > this.flapInterval) {
			if (this.frame > this.maxFrame) {
				this.frame = 0;
			} else {
				this.frame++;
			}
			this.timeSinceFlap = 0;
			if (this.hasTrial) {
				for (let i = 0; i < 5; i++) {
					particles.push(new Particle(this.x, this.y, this.width, this.color));
				}
			}
		}
		if (this.x < 0 - this.width) gameover = true;
	}

	draw() {
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.width, this.height);
		// ctx.strokeRect(this.x, this.y, this.width, this.height);
		collisionCtx.fillStyle = this.color;
		collisionCtx.fillRect(this.x, this.y, this.width, this.height);
		// collisionCtx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
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

function drawScore() {
	// ctx.zIndex = "99999";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + score, 50, 75);
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + score, 55, 80);
}

window.addEventListener("click", function (e) {
	const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
	// console.log(detectPixelColor);

	const pc = detectPixelColor.data;
	ravens.forEach((raven) => {
		if (
			raven.randomColors[0] === pc[0] &&
			raven.randomColors[1] === pc[1] &&
			raven.randomColors[2] === pc[2]
		) {
			raven.markForDeletion = true;
			score++;
			explosions.push(new Explosion(raven.x, raven.y, raven.width));
		}
	});
});

function animate(timestamp = 0) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
	const deltatime = timestamp - lastTime;
	lastTime = timestamp;
	timeToNextRaven += deltatime;
	if (timeToNextRaven > ravenInterval) {
		ravens.push(new Raven());
		timeToNextRaven = 0;
		// 先画大的，后画小的
		ravens.sort(function (a, b) {
			return a.width - b.width;
		});
	}
	drawScore();
	// 加入每帧时间，控制翅膀扇动频率，先画的在下面，后画的在上面。
	[...particles, ...ravens, ...explosions].forEach((raven) =>
		raven.update(deltatime)
	);
	[...particles, ...ravens, ...explosions].forEach((raven) => raven.draw());
	ravens = ravens.filter((raven) => !raven.markForDeletion);
	explosions = explosions.filter((explosion) => !explosion.markForDeletion);
	particles = particles.filter((explosion) => !explosion.markForDeletion);
	// console.log(ravens);
	// console.log("test", timestamp);
	if (!gameover) {
		requestAnimationFrame(animate);
	} else {
		drawGameOver();
	}
}

animate();

function drawGameOver() {
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
	// ctx.fillStyle = "black";
	ctx.fillText(
		`Your Score is ${score}`,
		canvas.width / 2,
		canvas.height / 2 - 50
	);
}
window.onload = function () {
	const resetBtn = document.getElementById("reset");
	console.log(resetBtn);
	resetBtn.onclick = function () {
		gameover = false;
		resetBtn.style.display = "none";
		console.log("reset");
		animate();
	};
};

// function onclick() {
// 	gameover = false;
// 	resetBtn.style.display = "none";
// 	console.log("reset");
// 	animate();
// }
