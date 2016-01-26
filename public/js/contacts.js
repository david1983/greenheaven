
//the code is loaded after that the DOM is fully rendered
$(document).ready(function(){

	//we set a spotting variable to know when the AJAX request is running
	var submitting = false;
	$("#contactForm").on("submit", function(e) {
		//preventDefault is used to avoid event bubbling
		e.preventDefault();

		$('#success').css('opacity',0);
		$('#error-msg').css('opacity',0);
		//AJAX request running 
		submitting = true;
		//send a post using jquery to the "action" of the form
		$.post(this.action, $(this).serialize()).then(function(result){			
			if(typeof result.code != 'undefined'){				
				$('#error-msg').html("We received an error: " + result.response + "<br>Contact our team for more information at <a href='help@greenheaven.com'>help@greenheaven.com</a>")
				$('#error-msg').css('opacity',1);	
			}else{
				$('#success').css('opacity',1);
			}
			//AJAX request finished
			submitting=false;
		},function(err){
			//AJAX request finished
			submitting=false;
			$('#error-msg').html("We received an error: " + err.response + "<br>Contact our team for more information at <a href='help@greenheaven.com'>help@greenheaven.com</a>")
			$('#error-msg').fadeIn();
		})		
	});	

	//This is a sort of observable pattern, when the request is running shows a spinner near the buttons
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


//this code handle the rendering of the map through google maps API
//initMap is called when the library is completely loaded.
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5956284, lng: -0.0955005},
    zoom: 15
  });

// contentString allow us to create a infoBox visible when the marker is clicked

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

  //marker declaration
   var marker = new google.maps.Marker({
    position: map.center,
    map: map,
    title: 'Green Heaven Farm'
  });

   //add a click event to the marker, show the infoBox when the marker is clicked
 marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}