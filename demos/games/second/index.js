const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

let gameSpeed = 5;

const bgl1 = new Image();
bgl1.src = "../assets/layer-1.png";
const bgl2 = new Image();
bgl2.src = "../assets/layer-2.png";
const bgl3 = new Image();
bgl3.src = "../assets/layer-3.png";
const bgl4 = new Image();
bgl4.src = "../assets/layer-4.png";
const bgl5 = new Image();
bgl5.src = "../assets/layer-5.png";

window.addEventListener("load", () => {
	let x = 0;
	let x2 = 2400;
	// let gameFrame = 0;
	class Layer {
		constructor(image, speedModifier) {
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 700;
			// this.x2 = this.width;
			this.image = image;
			this.speedModifier = speedModifier;
			this.speed = gameSpeed * this.speedModifier;
		}

		update() {
			this.speed = this.speedModifier * gameSpeed;
			if (this.x <= -this.width) {
				this.x = 0;
				// this.x = this.width + this.x2 - this.speed;
			}
			// if (this.x2 <= -this.width) {
			// 	this.x2 = this.width + this.x - this.speed;
			// }

			this.x = Math.floor(this.x - this.speed);
			// this.x2 = Math.floor(this.x2 - this.speed);

			// this.x = (gameFrame * this.speed) % this.width;
		}

		draw() {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.drawImage(
				this.image,
				this.x + this.width,
				// this.x2,
				this.y,
				this.width,
				this.height
			);
		}
	}

	const layer1 = new Layer(bgl1, 0.5);
	const layer2 = new Layer(bgl2, 0.5);
	const layer3 = new Layer(bgl3, 0.5);
	const layer4 = new Layer(bgl4, 0.5);
	const layer5 = new Layer(bgl5, 1);

	const layers = [layer1, layer2, layer3, layer4, layer5];

	function animate() {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		layers.forEach(function (layer) {
			layer.update();
			layer.draw();
		});
		// gameFrame--;
		requestAnimationFrame(animate);
	}

	const speedSpan = document.getElementById("showGameSpeed");
	speedSpan.innerText = gameSpeed;

	const sliders = document.getElementById("slider");
	sliders.value = gameSpeed;

	sliders.addEventListener("change", function (e) {
		gameSpeed = e.target.value;
		speedSpan.innerHTML = e.target.value;
	});

	animate();
});
