/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

const explosions = [];
const canvasPosition = canvas.getBoundingClientRect();

class Explosion {
	constructor(x, y) {
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.width = this.spriteWidth * 0.7;
		this.height = this.spriteHeight * 0.7;
		this.x = x;
		this.y = y;
		this.image = new Image();
		this.image.src = "../assets/boom.png";
		this.frame = 0;
		this.timer = 0;
		this.angle = Math.random() * 6.2;
		this.sound = new Audio();
		this.sound.src = "../assets/Fireimpact1.wav";
	}

	update() {
		if (this.frame === 0) {
			this.sound.play();
		}
		this.timer++;
		if (this.timer % 10 === 0) {
			this.frame++;
		}
	}

	draw() {
		// 目的是为了防止影响下一次的对象
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		// ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
		ctx.drawImage(
			this.image,
			this.spriteWidth * this.frame,
			0,
			this.spriteWidth,
			this.spriteHeight,
			// this.x,
			// this.y,
			0 - this.width / 2,
			0 - this.height / 2,
			this.width,
			this.height
		);
		ctx.restore();
	}
}

window.addEventListener("click", (e) => {
	// ctx.fillRect(
	// 	e.x - canvasPosition.left - 25,
	// 	e.y - canvasPosition.top - 25,
	// 	50,
	// 	50
	// );
	createAnimation(e, canvasPosition);
});
// window.addEventListener("mousemove", (e) => {
// 	createAnimation(e, canvasPosition);
// });

function createAnimation(e, canvasPosition) {
	// console.log(e);
	// console.log(canvasPosition);
	const positionX = e.x - canvasPosition.left;
	const positionY = e.y - canvasPosition.top;
	explosions.push(new Explosion(positionX, positionY));
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < explosions.length; i++) {
		explosions[i].update();
		explosions[i].draw();
		if (explosions[i].frame > 5) {
			explosions.splice(i, 1);
			i--;
		}
	}

	requestAnimationFrame(animate);
}

animate();
