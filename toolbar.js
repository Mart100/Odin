let selectedTool = 'humanadd'
$(() => {
	

	$('#toolbar .content div').on('click', (event) => {

		let target = $(event.target)

		$('#toolbar .content div').removeClass('selected')
		target.addClass('selected')

		selectedTool = target.attr('id').replace('tool-', '')
	})
})