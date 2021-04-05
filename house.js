class House extends Building {
	constructor(pos, nation) {
		super(pos, nation)
		this.type = 'house'
		this.level = 1
		this.size = 4
		this.cost = { wood: 5 }
		this.inhabitants = []

		nation.houses.push(this)
	}

	addHuman(human) {
		this.inhabitants.push(human)
	}
}