let infoBoxes = []

class Infobox {
	constructor() {

		this.element = null
		this.updater = null

		this.createBaseHTML()

		$('body').prepend(this.element)

		infoBoxes.push(this)
	}

	createBaseHTML() {
		this.element = 
		$(`
<div class="infobox" style="display: none;">
		<div class="title"></div>
		<div class="content">
		<div class="updating"></div>
		</div>
</div>
		`)
	}

	setUpdater(func) {
		this.updater = func
	}

	update() {
		this.element.find('.updating').html(this.updater())
	}

	setTitle(title) {
		this.element.find('.title').html(title)
	}

	addContent(content) {
		this.element.find('.content').append(content)
	}

	show() {
		this.element.fadeIn()
	}

	setPosition(pos, middle=true) {
		this.element.css({'left': `${pos.x}px`, 'top': `${pos.y}px`})
		if(middle) this.element.css('transform', 'translate(-50%, -50%)')
		else this.element.css('transform', 'translate(0%, 0%)')
	}

	destroy() {
		this.element.remove()
		let idx = infoBoxes.indexOf(this)
		infoBoxes.splice(idx, 1)
	}
	hide() {
		this.element.fadeOut()
	}
}