class Process {
	constructor() {
		this.interval
		this.tickRate = 1000/50

	}

	start() {

		this.interval = setInterval(() => {
			this.tick()
		}, this.tickRate)
	}

	tick() {
		this.cameraMovement()

		for(let human of game.humans) human.tick()
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