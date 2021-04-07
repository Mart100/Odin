$(() => {
	// keyboard
	$(document).on('keydown', (event) => { game.input.keys[event.keyCode] = true })
	$(document).on('keyup', (event) => { game.input.keys[event.keyCode] = false })

	$(document).on('keypress', (event) => {

		// P - pause
		if(event.key == 'p') {
			game.paused = !game.paused
		}
	})


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


		let inHumanBounds = (human) => {
			let humanPos = game.renderer.gridToWindowPos(human.pos.clone())
			let zoom = game.renderer.camera.zoomValue

			if(humanPos.x+zoom/3 > mousePos.x
				&& humanPos.x-zoom/3 < mousePos.x
				&& humanPos.y+zoom/3 > mousePos.y
				&& humanPos.y-zoom/3 < mousePos.y) {
					// yes, hovering over human
					return true
				}

			// not hovering over human
			return false
		}


		// if hover over human. Check if still applies
		if(game.input.mouseHumanHover) {

			let human = game.input.mouseHumanHover
			if(!inHumanBounds(human)) game.input.mouseHumanHover = null
				
		}

		else {
			
			// check if hovering over human
			for(let human of game.humans) {
				if(inHumanBounds(human)) game.input.mouseHumanHover = human
			}
		}


		infoPanel.add('mouseTileX', Math.floor(mouseTileHover.x))
    infoPanel.add('mouseTileY', Math.floor(mouseTileHover.y))
	})
	
	// click
	$('#canvas').on('mousedown', (event) => {


		if(event.which == 1) {

			infoBoxes.forEach(ib => ib.destroy())

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
	
					infoBox.setUpdater(() => `
					<div>Population: ${nation.citizens.length}</div>
					<div>Chunks: ${nation.chunks.length}</div>
					<div>Wheatfarms: ${nation.buildingAmountType('wheatfarm')}</div>
					<div>Houses: ${nation.buildingAmountType('house')}</div>
					<div>Inventory:</div>
					<div>Stone: ${nation.resources.stone}</div>
					<div>Wood: ${nation.resources.wood}</div>
					<div>Food: ${Math.round(nation.resources.food*100)/100}</div>
					`)
	
					infoBox.show()

				}

				// small view - show human info
				if(game.renderer.camera.zoomValue > game.renderer.viewChange && game.input.mouseHumanHover) {

					let human = game.input.mouseHumanHover

					let infoBox = new Infobox()
	
					infoBox.setTitle(human.name)

					infoBox.setPosition(game.input.mousePos, false)
	
					infoBox.setUpdater(() => `
					<div>Nation: ${human.nation.name}</div>
					<div>Saturation: ${Math.round(human.saturation*10)/10}</div>
					<div>Status: ${human.status}</div>
					${human.status == 'walking' ? `<div>Goal: ${human.walking.designationGoal}</div>` : ''}
					${human.walking.path ? `<div>PathLength: ${human.walking.path.length}</div>` : ''}
					<div>mateReady: ${human.mating.mateReady}</div>
					${!human.mating.mateReady ? `<div>Mate Cooldown: ${Math.round(human.mating.mateCooldown)}</div>` : ''}
					${human.mating.partner ? `<div>Partner: ${human.mating.partner.name}</div>` : ''}
					<div>Home: ${human.home ? human.home.pos.string() : 'homeless'}</div>
					`)

					infoBox.addContent('<button class="consoleHuman">Console log human</button>')
					infoBox.element.find('.consoleHuman').on('click', () => { console.log(human) })
	
					infoBox.show()
				}


				// small view - show tile info
				else if(game.renderer.camera.zoomValue > game.renderer.viewChange && game.input.mouseTileHover) {

					let tile = game.grid.getTile(game.input.mouseTileHover.clone().floor())

					if(tile.building == null && tile.resource == null) return

					let infoBox = new Infobox()
					infoBox.setTitle(`Tile (${tile.pos.string()})`)

					infoBox.setPosition(game.renderer.gridToWindowPos(tile.pos.clone().add(new Vector(1, 1))), false)
	
					infoBox.setUpdater(() => `
					<div>Resource: ${tile.resource}</div>
					<div>Jobs: ${tile.jobs.length}</div>
					${tile.building ? 
						`<div>Type: ${tile.building.type}</div>
						${tile.building.type == 'house' ? `<div>Inhabitants: ${tile.building.inhabitants.length}</div>` : ''}
						${tile.building.type == 'wheatfarm' ? `<div>Growth: ${tile.building.growth}</div>` : ''}`
					: ''}

					`)

					infoBox.addContent('<button class="consoleTile">Console log tile</button>')
					infoBox.element.find('.consoleTile').on('click', () => { console.log(tile) })
	
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
