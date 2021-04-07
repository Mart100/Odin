class House extends Building {
	constructor(tile, nation) {
		super(tile, nation)
		this.type = 'house'
		this.level = 1
		this.size = 4
		this.cost = { wood: 5 }
		this.inhabitants = []
		this.image = assets.images.hut

		nation.houses.push(this)
	}

	addHuman(human) {
		this.inhabitants.push(human)
	}
}