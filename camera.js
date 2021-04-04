class Camera {
	constructor() {
		this.pos = new Vector()
		this.zoomValue = 100
	}

	move(movement) {

		this.pos.subtract(movement)

		infoPanel.add('camX', this.pos.x)
    infoPanel.add('camY', this.pos.y)
	}
	zoom(zoom, mouseGridPos) {

		let zoomChange = zoom
		let oldZoomValue = this.zoomValue+0
		this.zoomValue *= zoomChange+1

    if(this.zoomValue <= 5 && zoom < 0) return this.zoomValue = oldZoomValue
    if(this.zoomValue >= 150) { this.zoomValue = 150; zoomChange = (150-oldZoomValue)/150 }
    
		let mousePos = game.input.mousePos
		let width = game.renderer.canvas.width
		let height = game.renderer.canvas.height


		this.pos.x += ((width*zoomChange)*(mousePos.x/width))/this.zoomValue
		this.pos.y += ((height*zoomChange)*(mousePos.y/height))/this.zoomValue
		
    infoPanel.add('camX', this.pos.x)
    infoPanel.add('camY', this.pos.y)
    infoPanel.add('zoom', this.zoomValue)
	}
}