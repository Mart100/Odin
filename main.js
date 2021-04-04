let canvas, ctx
let game
let infoPanel


$(() => {

	infoPanel = new InfoPanel()
	game = new Game()
	game.start()

})