class Game {
	constructor() {
		this.grid = new Grid(20, 20)
		this.renderer = new Renderer()
		this.process = new Process()

		this.input = {
			keys: {},
			mousePos: new Vector(),
			mouseTileHover: new Vector()
		}

	}

	start() {

		this.renderer.start()
		this.process.start()
	}
}