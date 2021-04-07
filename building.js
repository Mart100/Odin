class Building {
	constructor(tile, nation) {
		this.type = 'hut'
		this.level = 1
		this.size = 4
		this.inhabitants = []
		this.pos = tile.pos.clone()
		this.tile = tile
		this.nation = nation

		nation.buildings.push(this)


	}

}