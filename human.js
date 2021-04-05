class Human {
	constructor(pos) {
		this.pos = pos
		this.age = 0
		this.status = 'wandering'
		this.name = this.randomName()
		this.maxSpeed = 0.05
		this.id = this.name.hashCode()
		
		this.wandering = {
			velocity: new Vector(1, 1).rotate(Math.random()*Math.PI*2),
			center: this.pos.clone()
		}
		this.walking = {
			path: [],
			designation: new Vector(),
			designationGoal: ''
		}
		this.mating = {
			partner: null,
			mateReady: false,
			mateCooldownMax: 2*50*(Math.random()*2),
			mateCooldown: 4*50*(Math.random()*2)
		}
		this.home = null
		this.building = {
			what: '',
			location: new Vector()
		}
		this.statusProgress = 0
		this.nation = null
		this.saturation = 100

		game.humans.push(this)
	}

	createNation() {
		let nation = new Nation(this.pos.clone().multiply(0.1).floor())
		this.nation = nation
		nation.addHuman(this)
	}

	randomName() {
		let name = ''
		let vowels = 'aeiouy'
		let consonant = 'bcdfghjklmnpqrstvwxz'
		
		name += consonant[Math.floor(Math.random()*consonant.length)]
		name += vowels[Math.floor(Math.random()*vowels.length)]
		name += consonant[Math.floor(Math.random()*consonant.length)]
		name += vowels[Math.floor(Math.random()*vowels.length)]
		name += consonant[Math.floor(Math.random()*consonant.length)]

		return name

	}

	die() {

		// remove from partner
		if(this.mating.partner) this.mating.partner.mating.partner = null

		// remove from house inhabitants
		if(this.home) {
			let idx = this.home.inhabitants.indexOf(this)
			this.home.inhabitants.splice(idx, 1)
		}

		// remove from nation
		if(this.nation) {
			let idx = this.nation.citizens.indexOf(this)
			this.nation.citizens.splice(idx, 1)
		}

		// remove from game
		let idx = game.humans.indexOf(this)
		game.humans.splice(idx, 1)


		delete this


	}

	async tick() {
		this.age += 1

		this.mating.mateCooldown -= 1

		this.saturation -= 0.1

		if(this.saturation < 100) {
			if(this.nation && this.nation.resources.food > 5) {
				this.saturation += 1
				this.nation.resources.food -= 0.02
			}

			if(this.saturation < 0) this.die()
		}



		if(this.status == null) this.status = 'wandering'

		if(this.nation == null) {

			// check if inside nation. If so join it.
			let playerChunkPos = this.pos.clone().multiply(0.1).floor()
			let joinedNation = false
			for(let nation of game.nations) {
				if(joinedNation) break
				for(let chunk of nation.chunks) {
					if(joinedNation) break

					if(playerChunkPos.x == chunk.x && playerChunkPos.y == chunk.y) {
						this.nation = nation
						this.nation.addHuman(this)
						joinedNation = true
					}

				}
			}
			if(joinedNation) return


			// otherwise create new nation
			this.createNation()

		}
		
		if(this.status == 'wandering') {

			// no house :(
			if(this.home == null && Math.random() > 0.9) {

				let availableHouse = null

				for(let house of this.nation.houses) {
					if(house.inhabitants.length >= house.size) continue
					availableHouse = house
				}

				// if not full house found. Join house
				if(availableHouse) {
					this.home = availableHouse
					this.home.addHuman(this)
				}
				

				// if no home found, and enough wood. Build new house
				else if(!availableHouse && this.nation.resources.wood > 10) {
					let result = await game.grid.findClosestEmptyTile(this.pos.clone().floor())
					this.status = 'walking'
					this.walking.designationGoal = 'building'
					this.walking.designation = result.target
					this.walking.path = result.path
				}

			}


			// mate
			else if(this.mating.mateCooldown < 0 && (Math.random() > 0.9 || (this.mating.partner && this.mating.partner.status == 'mating')) && this.home != null) {

				this.mating.mateReady = true
				
				
				// see if other home inhabitant is also mateReady
				for(let human of this.home.inhabitants) {
					if(human.id == this.id) continue
					if(human.mating.mateReady) {
						this.mating.partner = human
						human.mating.partner = this
					}
				}

				if(this.mating.partner) {
					let result = await game.grid.findPathToTarget(this.pos.clone().floor(), this.home.pos.clone())
					this.status = 'walking'
					this.walking.designationGoal = 'mating'
					this.walking.designation = result.target
					this.walking.path = result.path
				}

			}

			// get resources
			else if(Math.random() > 0.99) {

				this.status = 'walking'
				let pathFindingResult
				
				// get a tree
				if(Math.random() > 2/3) {
					pathFindingResult = await game.grid.findClosestResource(this.pos.clone().floor(), 'tree')
					this.walking.designationGoal = 'chopping'

				}

				// get wheat
				else if(Math.random() > 1/3) {
					pathFindingResult = await game.grid.findClosestResource(this.pos.clone().floor(), 'wheat')
					this.walking.designationGoal = 'farming'

				}

				// get a stone
				else {
					pathFindingResult = await game.grid.findClosestResource(this.pos.clone().floor(), 'rock')
					this.walking.designationGoal = 'mining'
				}

				this.walking.designation = pathFindingResult.target
				this.walking.path = pathFindingResult.path
			}
		}

		if(this.status == 'wandering') {
			
			
			noise.seed(this.id/116425210)
			
			let velocity = this.wandering.velocity

			let center = this.wandering.center
			if(this.home) center = this.home.pos
			
			let acceleration = new Vector(noise.simplex2(this.age/100, -100), noise.simplex2(this.age/100, 100))
			acceleration.add(this.pos.clone().subtract(center).multiply(-0.1))
			velocity.add(acceleration.multiply(0.05))
			if(velocity.getMagnitude() > this.maxSpeed) velocity.setMagnitude(this.maxSpeed)
			this.pos.add(velocity)


			/*velocity.rotate(noise.simplex2(this.age/100, -100)*0.1)
			velocity.add(this.pos.clone().subtract(this.wandering.center).multiply(-0.0005))
			if(velocity.getMagnitude() > this.maxSpeed) velocity.setMagnitude(this.maxSpeed)
			this.pos.add(velocity)*/
			
		}

		if(this.status == 'walking') {

			let path = this.walking.path

			if(path == null || path.length == 0) {
				this.status = this.walking.designationGoal
				this.statusProgress = 0
				return
			}


			let designation = this.walking.designation.clone().add(new Vector(0.5, 0.5))
			let enemyToDesignationVec = this.pos.clone().subtract(designation)
			let totalDistance = enemyToDesignationVec.getMagnitude()
			let movement = new Vector(0, 0)


			let segment = path[0]
			if(!segment) return path = null
			let targetToPlayerVec = this.pos.clone().subtract(this.pos)
			movement = new Vector(segment.x, segment.y).subtract(this.pos).add(targetToPlayerVec.setMagnitude(0.1))
			let magnitude = movement.getMagnitude()
			if(magnitude > this.maxSpeed) movement.setMagnitude(this.maxSpeed)
			if(magnitude < 0.2) {

				if(path.length > 1) path.shift()

			}

			if(path.length == 1) {
				//if(Math.random() > 0.99) console.log('yes', totalDistance)
				movement = enemyToDesignationVec.clone().setMagnitude(-1)
				if(movement.getMagnitude() > this.maxSpeed) movement.setMagnitude(this.maxSpeed)
				if(totalDistance < 0.05) return this.walking.path = null
			}
		
			//console.log(movement)
			this.pos.x += movement.x
			this.pos.y += movement.y
		}

		if(this.status == 'chopping') {
			this.statusProgress += 1

			let gridPos = this.pos.clone().floor()
			
			if(gridPos.x < 0) return this.status = null
			if(gridPos.x >= game.grid.width) return this.status = null
			if(gridPos.y < 0) return this.status = null
			if(gridPos.y >= game.grid.height) return this.status = null


			let treeTile = game.grid.data[gridPos.x][gridPos.y]

			if(!treeTile) return this.status = null

			if(treeTile.resource != 'tree') { // this isn't supposed to happen, but incase it does
				this.status = null
			}

			if(this.statusProgress > 100) {
				treeTile.resource = null
				this.nation.resources.wood += 5
				this.status = null
			}
		}

		if(this.status == 'mining') {
			this.statusProgress += 1
			
			let gridPos = this.pos.clone().floor()
			
			if(gridPos.x < 0) return this.status = null
			if(gridPos.x >= game.grid.width) return this.status = null
			if(gridPos.y < 0) return this.status = null
			if(gridPos.y >= game.grid.height) return this.status = null

			let rockTile = game.grid.data[gridPos.x][gridPos.y]

			if(!rockTile) return this.status = null

			if(rockTile.resource != 'rock') { // this isn't supposed to happen, but incase it does
				this.status = null
			}

			if(this.statusProgress > 100) {
				rockTile.resource = null
				this.nation.resources.stone += 5
				this.status = null
			}
		}

		if(this.status == 'farming') {
			this.statusProgress += 1
			
			let gridPos = this.pos.clone().floor()
			
			if(gridPos.x < 0) return this.status = null
			if(gridPos.x >= game.grid.width) return this.status = null
			if(gridPos.y < 0) return this.status = null
			if(gridPos.y >= game.grid.height) return this.status = null

			let farmTile = game.grid.data[gridPos.x][gridPos.y]

			if(!farmTile) return this.status = null

			if(farmTile.resource != 'wheat') this.status = null

			if(this.statusProgress > 100) {
				farmTile.resource = null
				this.nation.resources.food += 10
				this.status = null
			}
		}

		if(this.status == 'building') {
			this.statusProgress += 1

			let gridPos = this.pos.clone().floor()
			
			if(gridPos.x < 0) return this.status = null
			if(gridPos.x >= game.grid.width) return this.status = null
			if(gridPos.y < 0) return this.status = null
			if(gridPos.y >= game.grid.height) return this.status = null

			let buildingTile = game.grid.data[gridPos.x][gridPos.y]

			if(!buildingTile) return this.status = null

			if(buildingTile.resource != null || buildingTile.building != null || this.nation.resources.wood < 10) { // cancel building
				this.status = null
			}

			if(this.statusProgress > 100) {
				buildingTile.building = new House(buildingTile.pos, this.nation)
				this.nation.resources.wood -= 10
				this.status = null
				this.home = buildingTile.building
				buildingTile.building.inhabitants.push(this)

				// if in new chunk, add chunk to nation
				let nation = game.getNationOnPosition(buildingTile.pos)
				if(!nation) {
					let playerChunkPos = this.pos.clone().multiply(0.1).floor()
					this.nation.addChunk(playerChunkPos)
				}
			}

		}

		if(this.status == 'mating') {
			if(!this.mating.partner) return this.status = null

			let partner = this.mating.partner

			if(!this.mating.mateReady || !partner.mating.mateReady) return this.status = null
			
			if(this.pos.clone().subtract(partner.pos).getMagnitude() > 0.5) return

			else {

				// new kiddos
				/*for(let i=0; i<Math.random()*5; i++) {
					let human = new Human(this.pos.clone())
				}*/

				let human = new Human(this.pos.clone())

				
				this.mateReady = false
				partner.mating.mateReady = false

				this.status = null 
				partner.status = null

				this.mating.mateCooldown = this.mating.mateCooldownMax
				partner.mating.mateCooldown = this.mating.partner.mating.mateCooldownMax
			}
		}


	}


}