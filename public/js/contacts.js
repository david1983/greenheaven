
$(document).ready(function(){


	var submitting = false;
	$("#contactForm").on("submit", function(e) {
		e.preventDefault();
		$('#success').css('opacity',0);
		$('#error-msg').css('opacity',0);
		submitting = true;
		$.post(this.action, $(this).serialize()).then(function(result){			
			if(typeof result.code != 'undefined'){				
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
		})		
	});	

	setInterval(function(){
		if(submitting){			
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



	var map;
	function initMap() {
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 51.5956284, lng: -0.0955005},
	    zoom: 15
	  });

	  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Green Heaven</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Green Heaven</b> is one of London\'s largest and longest established city farms.</p>'+      
      '</div>'+
      '</div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });

	   var marker = new google.maps.Marker({
	    position: map.center,
	    map: map,
	    title: 'Green Heaven Farm'
	  });

	 marker.addListener('click', function() {
	    infowindow.open(map, marker);
	  });

	}