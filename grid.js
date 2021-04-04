class Grid {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.data = []

		this.createData(width, height)
	}

	createData(width, height) {
		for(let x=0;x<width;x++) {
			this.data[x] = []
			for(let y=0;y<height;y++) {
				this.data[x][y] = new Tile(new Vector(x, y))
			}
		}
	}
}