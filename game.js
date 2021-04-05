class Game {
	constructor() {
		this.grid = new Grid(100, 100)
		this.renderer = new Renderer()
		this.process = new Process()
		this.humans = []
		this.nations = []
		this.pathFinders = []

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

	getNationOnPosition(pos) {


		let playerChunkPos = pos.clone().multiply(0.1).floor()
		for(let nation of game.nations) {
			for(let chunk of nation.chunks) {
				if(playerChunkPos.x == chunk.x && playerChunkPos.y == chunk.y) return nation
			}
		}
	}
}