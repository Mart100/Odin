class Grid {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.data = []

		this.createData(width, height)

		this.spawnResources()
	}

	createData(width, height) {
		for(let x=0;x<width;x++) {
			this.data[x] = []
			for(let y=0;y<height;y++) {
				this.data[x][y] = new Tile(new Vector(x, y))
			}
		}
	}

	spawnResources() {

		noise.seed(Math.random())
		for(let x=0;x<this.width;x++) {

			for(let y=0;y<this.height;y++) {
				let tile = this.data[x][y]

				let noiseSize = 15
				let treshold = 2.9

				if(noise.simplex2(x/noiseSize, y/noiseSize)+Math.random()*3 > treshold) tile.resource = 'tree'

				if(noise.simplex2((x/noiseSize)+1e4, (y/noiseSize)+1e4)+Math.random()*3 > treshold) tile.resource = 'rock'

				if(noise.simplex2((x/noiseSize)+2e4, (y/noiseSize)+2e4)+Math.random()*3 > treshold) tile.resource = 'wheat'
			}
		}
		
	}

	isOutOfRange(pos) {
		if(pos.x < 0) return true
		if(pos.x >= this.width) return true
		if(pos.y < 0) return true
		if(pos.y >= this.height) return true

		return false
	}

	async find(center, qualifyFunction) {
		let pathFinder = new Pathfinder()
		let result = await pathFinder.find(center.clone(), qualifyFunction)
		pathFinder.destroy()

		let fastPath = await this.findPathToTarget(center.clone(), result.target)

		return fastPath
	} 

	async findClosestResource(center, resourceType) {
		let pathFinder = new Pathfinder()
		let result = await pathFinder.findResource(center.clone(), resourceType)
		pathFinder.destroy()

		let fastPath = await this.findPathToTarget(center.clone(), result.target)

		return fastPath
	}

	async findClosestEmptyTile(center) {
		let pathFinder = new Pathfinder()
		let result = await pathFinder.findEmptyTile(center.clone())
		pathFinder.destroy()
		return result
	}

	async findPathToTarget(from, to) {
		let pathFinder = new Pathfinder()
		let result = await pathFinder.findPath(from.clone(), to.clone())
		pathFinder.destroy()
		return result
	}
	
}