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
	$('#canvas').on('mousedown', (event) => {


		if(event.which == 1) {

			let infoboxes = $('.infobox')

			if(infoboxes.length > 0) $('.infobox')[0].remove()

			if(selectedTool == 'humanadd') {
				let pos = game.input.mouseTileHover.clone().floor()

				let human = new Human(pos)
			}

			else if(selectedTool == 'info') {

				// big view -- show nation info
				if(game.renderer.camera.zoomValue < game.renderer.viewChange) {

					let nation = game.getNationOnPosition(game.input.mouseTileHover.clone().floor())

					if(!nation) return
	
					let infoBox = new Infobox()
	
					infoBox.setTitle(nation.name)
	
					infoBox.setContent(`
					<div>Population: ${nation.citizens.length}</div>
					<div>Chunks: ${nation.chunks.length}</div>
					<div>Wheatfarms: ${nation.buildings.map(b => b.type=='wheatfarm').reduce((a, b) => a+b)}</div>
					<div>Houses: ${nation.buildings.map(b => b.type=='house').reduce((a, b) => a+b)}</div>
					<div>Inventory:</div>
					<div>Stone: ${nation.resources.stone}</div>
					<div>Wood: ${nation.resources.wood}</div>
					<div>Food: ${Math.round(nation.resources.food*100)/100}</div>
					`)
	
					infoBox.show()

				}


			}

		}




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
