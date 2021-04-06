class Pathfinder {
	constructor() {
		this.foundEnd = true
		this.exploredTiles = []
		this.exploredTilesVal = []
		this.iterations = 0
		this.target = null
		this.targetPosition = null
		this.targetType = null
		this.qualifyFunction = null

		game.pathFinders.push(this)

	}
	destroy() {
		let idx = game.pathFinders.indexOf(this)
    game.pathFinders.splice(idx, 1)
	}
	async find(from, qualifyFunction) {

		this.qualifyFunction = qualifyFunction
		this.foundEnd = false
		this.targetType = 'function'
		this.exploredTiles = []
		this.exploredTilesVal = []
		this.iterations = 0
		this.pathFindStart = Date.now()
		let path = await this.checkNeighborsRecursion(from.clone(), 0)
		if(!path) return {path: [], target: from}
		let reversedPath = path.reverse()
		this.foundEnd = true
		return {path: reversedPath, target: this.targetPosition}

	}
	async findResource(from, resourceType) {
		//console.log('FindPath: ', from, to)
		this.foundEnd = false
		this.qualifyFunction = null
		this.exploredTiles = []
		this.exploredTilesVal = []
		this.target = resourceType
		this.targetType = 'resource'
		this.iterations = 0
		this.pathFindStart = Date.now()
		let path = await this.checkNeighborsRecursion(from.clone(), 0)
		if(!path) return {path: [], target: from}
		let reversedPath = path.reverse()
		//console.log(`Found Path between`, from, 'and', to, `. within ${Date.now()-this.pathFindStart} ms. Path length: ${path.length}. Tiles: ${this.exploredTiles.length}`)
		this.foundEnd = true
		return {path: reversedPath, target: this.targetPosition}
	}
	async findEmptyTile(from) {
		//console.log('FindPath: ', from, to)
		this.foundEnd = false
		this.qualifyFunction = null
		this.exploredTiles = []
		this.exploredTilesVal = []
		this.targetType = 'empty'
		this.iterations = 0
		this.pathFindStart = Date.now()
		let path = await this.checkNeighborsRecursion(from.clone(), 0)
		if(!path) return {path: [], target: from}
		let reversedPath = path.reverse()
		//console.log(`Found Path between`, from, 'and', to, `. within ${Date.now()-this.pathFindStart} ms. Path length: ${path.length}. Tiles: ${this.exploredTiles.length}`)
		this.foundEnd = true
		return {path: reversedPath, target: this.targetPosition}
	}
	async findPath(from, to) {
		//console.log('FindPath: ', from, to)
		this.foundEnd = false
		this.qualifyFunction = null
		this.exploredTiles = []
		this.exploredTilesVal = []
		this.target = to.clone()
		this.targetType = 'position'
		this.iterations = 0
		this.pathFindStart = Date.now()
		let path = await this.checkNeighborsRecursion(from.clone(), 0)
		if(!path) return {path: [], target: from}
		let reversedPath = path.reverse()
		//console.log(`Found Path between`, from, 'and', to, `. within ${Date.now()-this.pathFindStart} ms. Path length: ${path.length}. Tiles: ${this.exploredTiles.length}`)
		this.foundEnd = true
		return {path: reversedPath, target: this.targetPosition}
	}
	checkNeighborsRecursion(tilePos, iter) {
		return new Promise((resolve, reject) => {
			if(this.foundEnd) return resolve(false)
			this.iterations = iter
			if(this.exploredTiles.length > 200) return resolve(false)
			if(!game.grid.data[tilePos.x]) return resolve(false)
			let tile = game.grid.data[tilePos.x][tilePos.y]
			if(!tile) return resolve(false)
			//console.log(tile)
			this.exploredTiles.push(`${tile.pos.x}=${tile.pos.y}`)
	
			this.exploredTilesVal[`${tile.pos.x}=${tile.pos.y}`] = iter

			// get tile neighbors
			let neighbors = this.getTileNeighbors(tilePos)
			if(neighbors == null) return resolve(false)

			if(this.targetType == 'position') {
				neighbors.sort((a, b) => {
					let distA = new Vector(a.pos.x, a.pos.y).subtract(this.target).getMagnitude()
					let distB = new Vector(b.pos.x, b.pos.y).subtract(this.target).getMagnitude()
					//console.log(a, distA, b, distB)
					return distA-distB
				})		
			}

			else {
				neighbors = shuffle(neighbors)
			}
			
			// check if reached position target
			if(this.targetType == 'position') {

				// if wanted destination. Retrace
				if(tile.pos.x == this.target.x && tile.pos.y == this.target.y) {
					this.foundEnd = true
					this.targetPosition = tile.pos.clone()
					return resolve([tile.pos.clone()])
				}
			}

			// check if reached resource target
			else if(this.targetType == 'resource') {

				// if tile has resource. Retrace
				if(tile.resource == this.target) {
					this.foundEnd = true
					this.targetPosition = tile.pos.clone()
					return resolve([tile.pos.clone()])
				}
			}

			// check if reached resource target
			else if(this.targetType == 'empty') {

				// check if reached tile is empty. Retrace
				if(tile.resource == null && tile.building == null) {
					this.foundEnd = true
					this.targetPosition = tile.pos.clone()
					return resolve([tile.pos.clone()])
				}
			}

			else if(this.targetType == 'function' && this.qualifyFunction) {
				if(this.qualifyFunction(tile, neighbors)) {
					this.foundEnd = true
					this.targetPosition = tile.pos.clone()
					return resolve([tile.pos.clone()])
				}
			}


			//console.log(neighbors)
			
			//await sleep(1)
			for(let i=0;i<neighbors.length;i++) {
				let n = neighbors[i]
				if(!n) continue
				
				let nPos = n.pos.clone()
				if(this.exploredTiles.includes(`${nPos.x}=${nPos.y}`)) continue
				//console.log(n, nPos)
				this.checkNeighborsRecursion(nPos, iter+1).then((response) => {
					if(response) {
						let leastIterVal = 1e9
						let leastIterPos = nPos
						for(let j=0;j<neighbors.length;j++) {
							let n1 = neighbors[i]
							let iterValN = this.exploredTilesVal[`${n1.x}=${n1.y}`]
							if(iterValN < leastIterVal) {
								leastIterVal = iterValN
								leastIterPos = {x: n1.pos.x, y: n1.pos.y}
							}
						}
						response.push(leastIterPos)
						return resolve(response)
					}
				})
			}
		})
	}
	getTileNeighbors(pos) {
		let arr = []
		let gData = game.grid.data
		let posArr = [[-1, 0], [0, -1], [1, 0], [0, 1]]
		//let posArr = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]]
		//let posArr = [[-1, -1], [1, -1], [1, 1],  [-1, 1]]
		let x = pos.x
		let y = pos.y
		for(let i=0;i<4;i++) {
			let b = posArr[i]
			let bx = b[0]+x
			let by = b[1]+y
			if(gData[bx] && gData[bx][by]) arr[i] = gData[bx][by]
			else continue
		}
		return arr
	}
}