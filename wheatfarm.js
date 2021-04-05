class WheatFarm extends Building {
	constructor(pos, nation) {
		super(pos, nation)
		this.type = 'wheatfarm'
		this.cost = { wood: 5, stone: 5 }
	}
}