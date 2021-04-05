class House extends Building {
	constructor(pos, nation) {
		super(pos, nation)
		this.type = 'house'
		this.type = 'hut'
		this.level = 1
		this.size = 4
		this.inhabitants = []
		this.pos = pos.clone()
		this.nation = nation

		nation.houses.push(this)
	}

	addHuman(human) {
		this.inhabitants.push(human)
	}
}