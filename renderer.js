class Renderer {
	constructor() {

		this.canvas = document.getElementById('canvas')
		this.ctx = this.canvas.getContext('2d')
	
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		this.camera = new Camera()

	}
	start() {
		this.frame()
	}
	frame() {

		let ctx = this.ctx
		let canvas = this.canvas

		// rerun frame
		window.requestAnimationFrame(() => { this.frame() })

		// clear screen
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// call draw functions
		this.drawLand()
		this.drawGridLines()
		this.drawMouseHover()

	}

	drawGridLines() {

		let ctx = this.ctx
		let canvas = this.canvas
		let camera = this.camera
		let zoom = camera.zoomValue

		let ch = canvas.height
		let cw = canvas.width
		let grid = game.grid

		let cameraOffset = new Vector(camera.pos.x%1, camera.pos.y%1)
	

		// draw horizontal lines
		ctx.strokeStyle = 'rgb(255,255,255)'
		ctx.lineWidth = 2

		for(let y=-1;y<(ch/zoom)+1;y++) {

			let yPos = (y*zoom) - cameraOffset.y*zoom
			let xPos = cameraOffset.x*zoom - zoom

			ctx.beginPath()
			ctx.moveTo(xPos,    yPos)
			ctx.lineTo(cw-xPos+zoom, yPos)
			ctx.stroke()
		}

		// draw vertical lines
		ctx.strokeStyle = 'rgb(255,255,255)'

		for(let x=-1;x<(cw/zoom)+1;x++) {

			let xPos = (x*zoom) - cameraOffset.x*zoom
			let yPos = cameraOffset.y*zoom - zoom

			ctx.beginPath()
			ctx.moveTo(xPos, yPos)
			ctx.lineTo(xPos, ch-yPos+zoom)
			ctx.stroke()
		}
	}

	drawLand() {

		let ctx = this.ctx
		let canvas = this.canvas
		let camera = this.camera
		let zoom = camera.zoomValue
		let cameraPos = camera.pos
		let grid = game.grid

		let xPos = 0 - cameraPos.x*zoom
		let yPos = 0 - cameraPos.y*zoom

		ctx.beginPath()
		ctx.fillStyle = 'rgb(0, 255, 0)'
		ctx.rect(xPos, yPos, grid.width*zoom, grid.height*zoom)
		ctx.fill()
	}

	drawMouseHover() {

		let mousePos = game.input.mousePos
		let ctx = this.ctx
		let canvas = this.canvas
		let camera = this.camera
		let zoom = camera.zoomValue
		let cameraPos = camera.pos
		let grid = game.grid
		let cameraOffset = new Vector(camera.pos.x%1, camera.pos.y%1)

		let xPos = 0 - cameraOffset.x*zoom + Math.floor((mousePos.x/zoom) + cameraOffset.x)*zoom
		let yPos = 0 - cameraOffset.y*zoom + Math.floor((mousePos.y/zoom) + cameraOffset.y)*zoom

		ctx.beginPath()
		ctx.strokeStyle = 'rgb(0, 0, 0)'
		ctx.lineWidth = 4
		ctx.rect(xPos, yPos, zoom, zoom)
		ctx.stroke()

	}
}