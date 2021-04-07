class Job {
	constructor(human, action, path) {

		this.human = human
		this.nation = human.nation
		this.action = action
		this.path = path
		this.tile = null

		this.nation.jobs.push(this)
	}

	setTile(tile) {
		this.tile = tile

	}

	finished() {
		let idx = this.nation.jobs.indexOf(this)
    this.nation.jobs.splice(idx, 1)

		let idx1 = this.tile.jobs.indexOf(this)
    this.tile.jobs.splice(idx1, 1)

		this.human.job = null
		
		delete this
	}
}