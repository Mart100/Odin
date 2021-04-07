class Tile {
	constructor(pos) {
		this.pos = pos.clone()

		this.building = null
		this.resource = null

		this.jobs = []
	}

	addJob(job) {
		job.setTile(this)
		this.jobs.push(job)
	}
}