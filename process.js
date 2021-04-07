class Process {
	constructor() {
		this.interval
		this.ticksPerSecond = 50
		this.tickRate = 1000/this.ticksPerSecond
		this.tickCount = 0

		this.averageTickDuration = 0

	}

	start() {

		this.interval = setInterval(() => {
			this.tick()
		}, this.tickRate)
	}

	tick() {

		if(game.paused) return

		let timeStart = performance.now()

		this.tickRate += 1

		this.cameraMovement()

		for(let human of game.humans) human.tick()

		for(let nation of game.nations) nation.tick()

		if(this.tickRate % 10) infoBoxes.forEach(ib => { if(ib.updater) ib.update() })

		let tickDuration = performance.now()-timeStart
		this.averageTickDuration = (tickDuration+this.averageTickDuration*9)/10
		infoPanel.add('tickDur', `${this.averageTickDuration}ms`)
	}

	cameraMovement() {
		let speed = 20/game.renderer.camera.zoomValue //(settings.playerSpeed/150)*(world.deltaTick/10)

		let keys = game.input.keys
	
		let movement = new Vector(0, 0)
	
		if(keys[87] || keys[38]) { // north
			movement.add(new Vector(0, speed))
		}
		if(keys[68] || keys[39]) { // east
			movement.add(new Vector(-speed, 0))
		}
		if(keys[83] || keys[40]) { // south
			movement.add(new Vector(0, -speed))
		}
		if(keys[65] || keys[37]) { // west
			movement.add(new Vector(speed, 0))
		}
	
		// moved
		if(movement.getMagnitude() > 0) {
			//console.log('Yes', movement)
			game.renderer.camera.move(movement)
		}
	}
}