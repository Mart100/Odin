class WheatFarm extends Building {
	constructor(tile, nation) {
		super(tile, nation)
		this.type = 'wheatfarm'
		this.cost = { wood: 5, stone: 5 }
		this.growth = 0 // 0 - 100
		this.maxGrowth = 100
		this.growSpeed = 0.1
		this.image = assets.images['wheatfarm_growing']
	}

	grow() {
		if(this.growth < this.maxGrowth) this.growth += this.growSpeed
		else this.image = assets.images['wheatfarm_grown']
	}
	isFarmable() {
		this.image = assets.images['wheatfarm_growing']
		return this.growth > this.maxGrowth
	}
	farm() {
		this.growth = 0
		this.job = null
	}
}