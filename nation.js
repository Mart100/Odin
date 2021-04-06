class Nation {
	constructor(pos) {

		this.name = this.randomName()
		this.color = this.randomColor()
		this.startChunk = pos.clone()
		this.chunks = [pos.clone()]
		this.buildings = []
		this.houses = []
		this.citizens = []
		this.resources = {
			stone: 0,
			wood: 0,
			food: 0
		}

		game.nations.push(this)
	}

	get population() {
		return this.citizens.length
	}

	addHuman(human) {
		this.citizens.push(human)
	}

	tick() {


		// grow farms
		this.buildings.filter(b => b.type == 'wheatfarm').forEach(b => b.grow())
	}

	buildingAmountType(type) {

		let map = this.buildings.map(b => b.type==type)

		if(map.length == 0) return 0

		let amount = map.reduce((a, b) => a+b)
		return amount
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
	addChunk(chunkPos) {
		this.chunks.push(chunkPos.clone())
	}
	randomColor() {
		let rgb = []
		rgb[0] = Math.floor(Math.random()*256)
		rgb[1] = Math.floor(Math.random()*256)
		rgb[2] = Math.floor(Math.random()*256)
		
		return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
		
	}
}