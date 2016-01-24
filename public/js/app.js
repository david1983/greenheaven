

// All the code inside the ready callback is called when the DOM is rendered
$(document).ready(function(){

	// handle of the menu button in the mobile navigation
	$('#hamburger-icon').click(function(){
        $(this).toggleClass('open');
        $('.mobile-menu').toggleClass('open');
    });


	/*
	 * 	Here we handle the behaviour of the navigation bar
	 *	when the scrollTop value is higer than the height of the 
	 *	herobox element
	 */	 
	$(document).scroll(function(e){
		if(window.location.pathname!="/index.html"  && window.location.pathname!="/") { 	
			return; 
		}
		var heroHeight = $('.herobox').height();
		var scrollVal = $(document).scrollTop()	
		
		if(scrollVal>heroHeight){
			console.log(scrollVal)
			$('#nav-title').addClass('open');
			$('#navigation').addClass('fixed-nav');
			$('#wrapper-960').addClass('fixed-page');
		}else{
			$('#nav-title').removeClass('open')
			$('#navigation').removeClass('fixed-nav');
			$('#wrapper-960').removeClass('fixed-page');
		}
	})

	// if the location path is not the homepage force the navigation to be fixed
	if(window.location.pathname!="/index.html" && window.location.pathname!="/") { 
			$('#nav-title').animate({opacity:1},200);
			$('#navigation').addClass('fixed-nav');
			$('#wrapper-960').addClass('fixed-page');		
	}	
})
