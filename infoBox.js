class Infobox {
	constructor() {

		this.element = null

		this.createBaseHTML()

		$('body').prepend(this.element)
	}

	createBaseHTML() {
		this.element = 
		$(`
<div class="infobox" style="display: none;">
		<div class="title"></div>
		<div class="content">
		</div>
</div>
		`)
	}

	setTitle(title) {
		this.element.find('.title').html(title)
	}

	setContent(content) {
		this.element.find('.content').html(content)
	}

	show() {
		this.element.fadeIn()
	}
	hide() {
		this.element.fadeOut()
	}
}