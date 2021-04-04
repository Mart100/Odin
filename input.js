$(() => {
	// keyboard
	$(document).on('keydown', (event) => { game.input.keys[event.keyCode] = true })
	$(document).on('keyup', (event) => { game.input.keys[event.keyCode] = false })


	// mouse
	$(document).on('mousemove', (event) => {
		let mousePos = new Vector(event.clientX, event.clientY)

		game.input.mousePos = mousePos


		let camera = game.renderer.camera
		let zoom = camera.zoomValue
		
		let xPos = (mousePos.x/zoom) + camera.pos.x
		let yPos = (mousePos.y/zoom) + camera.pos.y
		let mouseTileHover = new Vector(xPos, yPos)
		game.input.mouseTileHover = mouseTileHover

		infoPanel.add('mouseTileX', Math.floor(mouseTileHover.x))
    infoPanel.add('mouseTileY', Math.floor(mouseTileHover.y))
	})
	
	// click
	$(document).on('mousedown', (event) => {

	})



	// listen for zooming
	$(document).on('DOMMouseScroll mousewheel', (event) => {

		let camera = game.renderer.camera

		// zoom out
		if(event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
			camera.zoom(-0.1, game.input.mouseTileHover)
		} 
		
		// zoom in
		else {
			camera.zoom(0.1, game.input.mouseTileHover)
		}
	})
})
