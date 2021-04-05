class Building {
	constructor(pos, nation) {
		this.type = 'hut'
		this.level = 1
		this.size = 4
		this.inhabitants = []
		this.pos = pos.clone()
		this.nation = nation

		nation.buildings.push(this)


	}
}