
$(document).ready(function(){


	var submitting = false;
	$("#contactForm").on("submit", function(e) {
		e.preventDefault();
		$('#success').css('opacity',0);
		$('#error-msg').css('opacity',0);
		submitting = true;
		$.post(this.action, $(this).serialize()).then(function(result){
			console.log(result)
			if(typeof result.code != 'undefined'){
				console.log($('#error-msg'))
				$('#error-msg').html("We received an error: " + result.response + "<br>Contact our team for more information at <a href='help@greenheaven.com'>help@greenheaven.com</a>")
				$('#error-msg').css('opacity',1);	
			}else{
				$('#success').css('opacity',1);
			}
			
			submitting=false;
		},function(err){
			submitting=false;
			$('#error-msg').html("We received an error: " + err.response + "<br>Contact our team for more information at <a href='help@greenheaven.com'>help@greenheaven.com</a>")
			$('#error-msg').fadeIn();
			
			console.log(err)
			//err.response
		})		
	});	

	setInterval(function(){
		if(submitting){
			console.log('dsadsa')
			$('#spinner').show();
			
		}else{
			$('#spinner').hide();
		}
	},100)

	$("#contactForm").on("reset", function(e) {		
		$('#success').css('opacity',0);
		$('#error-msg').css('opacity',0);
	})
})
