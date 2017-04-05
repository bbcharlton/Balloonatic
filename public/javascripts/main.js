$('#nav-hamburger').click(function() {
	if ($(this).hasClass('fa-bars')) {
		$(this).removeClass('fa-bars');
		$(this).addClass('fa-times');
		$('.navbar-dropdown').slideDown(200);
	} else if($(this).hasClass('fa-times')) {
		$(this).removeClass('fa-times');
		$(this).addClass('fa-bars');
		$('.navbar-dropdown').slideUp(200);
	}
});

$("a").on('click', function(event) {
	if (this.hash !== "") {

		var hash = this.hash;

		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 800, function(){
			window.location.hash = hash;
		});
	}
});