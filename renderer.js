class Renderer {
	constructor() {

		this.canvas = document.getElementById('canvas')
		this.ctx = this.canvas.getContext('2d')
	
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		this.ctx.mozImageSmoothingEnabled = false
		this.ctx.imageSmoothingEnabled = false

		this.viewChange = 25

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
		if(this.camera.zoomValue > this.viewChange) this.drawGridLines()
		

		
		// draw grid tiles
		let grid = game.grid
		for(let x=0;x<grid.width;x++) {

			for(let y=0;y<grid.height;y++) {
				this.drawTile(game.grid.data[x][y])
			}
		}

		// draw humans
		for(let human of game.humans) this.drawHuman(human)

		// draw nations
		if(this.camera.zoomValue < this.viewChange) for(let nation of game.nations) this.drawNation(nation)



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
		ctx.strokeStyle = 'rgb(0,0,0)'
		ctx.lineWidth = 1

		for(let y=-1;y<(ch/zoom)+1;y++) {

			let yPos = (y*zoom) - cameraOffset.y*zoom
			let xPos = cameraOffset.x*zoom - zoom

			ctx.beginPath()
			ctx.moveTo(xPos,    yPos)
			ctx.lineTo(cw-xPos+zoom, yPos)
			ctx.stroke()
		}

		// draw vertical lines
		ctx.strokeStyle = 'rgb(0,0,0)'

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
		ctx.fillStyle = 'rgb(0, 150, 0)'
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
	drawHuman(human) {
		let asset = assets.images.human

		let ctx = this.ctx
		let camera = this.camera
		let zoomValue = camera.zoomValue

		let humanCanvasPos = human.pos.clone().subtract(camera.pos).multiply(zoomValue)

		if(humanCanvasPos.x > this.canvas.width) return
		if(humanCanvasPos.x < 0) return
		if(humanCanvasPos.y > this.canvas.height) return
		if(humanCanvasPos.y < 0) return

		this.ctx.drawImage(asset, humanCanvasPos.x-zoomValue/(4*2), humanCanvasPos.y-zoomValue/(4*2), zoomValue/4, zoomValue/4)

		if(human.walking.path && this.camera.zoomValue > this.viewChange && human.nation && human.nation.citizens.length < 100) {
			let path = human.walking.path
			this.ctx.strokeStyle = 'rgb(0, 0, 255)'
			this.ctx.beginPath()
			this.ctx.lineWidth = 2
			for(let i in path) {
				let seg = path[i]
				let screenPos = this.gridToWindowPos(new Vector(seg.x, seg.y).add(new Vector(0.5, 0.5)))
				if(i == 0) this.ctx.moveTo(screenPos.x, screenPos.y)
				else this.ctx.lineTo(screenPos.x, screenPos.y)
			}
			this.ctx.stroke()
		}
		
	}

	drawTile(tile) {

		let ctx = this.ctx
		let canvas = this.canvas
		let camera = this.camera
		let zoomValue = camera.zoomValue
		let grid = game.grid

		// draw resource
		if(tile.resource) {
			let asset = assets.images[tile.resource]

			let resourceCanvasPos = tile.pos.clone().subtract(camera.pos).multiply(zoomValue)
			ctx.drawImage(asset, resourceCanvasPos.x, resourceCanvasPos.y, zoomValue, zoomValue)
		}

		// draw building
		if(tile.building) {
			let asset = assets.images[tile.building.type]

			if(tile.building.type == 'house' && tile.building.level == 1) asset = assets.images['hut']

			let buildingCanvasPos = tile.pos.clone().subtract(camera.pos).multiply(zoomValue)
			ctx.drawImage(asset, buildingCanvasPos.x, buildingCanvasPos.y, zoomValue, zoomValue)
		}
	}

	drawNation(nation) {

		let ctx = this.ctx
		let canvas = this.canvas
		let camera = this.camera
		let zoomValue = camera.zoomValue
		let grid = game.grid

		// draw chunks
		for(let chunk of nation.chunks) {
			let nationCanvasPos = chunk.clone().multiply(10).subtract(camera.pos).multiply(zoomValue)
			
			ctx.beginPath()
			ctx.rect(nationCanvasPos.x, nationCanvasPos.y, 10*zoomValue, 10*zoomValue)
	
			ctx.fillStyle = nation.color
			ctx.strokeStyle = nation.color
			ctx.globalAlpha = 0.4
			ctx.fill()
			ctx.globalAlpha = 1
			ctx.stroke()
		}


		// draw name
		let nationNameCanvasPos = nation.startChunk.clone().multiply(10).subtract(camera.pos).multiply(zoomValue)

		
		let textHeight = zoomValue*1.5
		if(textHeight < 15) textHeight = 15
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.font = `${textHeight}px Arial`

		ctx.fillStyle = 'rgb(0, 0, 0)'
		let nationText = `${nation.name}: ${nation.citizens.length}`
		let nationNameWidth = ctx.measureText(nationText).width
		ctx.beginPath()
		let textRectX = nationNameCanvasPos.x+(zoomValue*5)-nationNameWidth/2
		let textRectY = nationNameCanvasPos.y+(zoomValue*5)-textHeight/2
		ctx.rect(textRectX-5, textRectY-5, nationNameWidth+10, textHeight+10)
		//if(Math.random() > 0.99) console.log(nationNameCanvasPos.x+(zoomValue*5)-nationNameWidth/2, nationNameCanvasPos.y+(zoomValue*5), nationNameWidth, zoomValue)
		ctx.fill()

		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.fillText(`${nationText}`, nationNameCanvasPos.x+zoomValue*5, nationNameCanvasPos.y+zoomValue*5)

		
	}


	gridToWindowPos(p) {
		let pos = new Vector(0, 0)
		let camera = this.camera
		pos.x = ((p.x-camera.pos.x)*camera.zoomValue)
		pos.y = ((p.y-camera.pos.y)*camera.zoomValue)
		return pos
	}
	windowToGridPos(p) {
		let pos = new Vector(0, 0)
		let camera = this.camera
		pos.x = p.x/camera.zoomValue + camera.pos.x
		pos.y = p.y/camera.zoomValue + camera.pos.y
		return pos
	}


}