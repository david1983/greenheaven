
$(document).ready(function(){


	var submitting = false;
	$("#contactForm").on("submit", function(e) {
		e.preventDefault();
		submitting = true;
		$.post(this.action, $(this).serialize()).then(function(result){
			console.log(result)
			submitting=false;
		},function(err){
			submitting=false;
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
})
