var timetable = $.getJSON("/js/json/timetable.json", function(json) {	
    console.log(json); // this will show the info it in firebug console
    var morningTime = $('#morning');
    var eveningTime = $('#evening');
	
    for(var i=0; i<json.length; i++){
    	
    	mElem = morningTime.children()[i];
    	eElem = eveningTime.children()[i];
    	mElem.innerHTML = json[i].morning.open + '-' + json[i].morning.close
    	eElem.innerHTML = json[i].evening.open + '-' + json[i].evening.close
    	
    }

    

    function checkOpen(){
	    var today = moment().isoWeekday();
	    var time = moment().format();    
	    var day = json[today-1];
	    var str, open;	    
    	for (var name in day) {    	
    		if(open) continue;
			var todayClosingTime = moment().format('YYYY-MM-DD') + " " + day[name].close;
		    var todayOpeningTime = moment().format('YYYY-MM-DD') + " " + day[name].open;
		    if(moment(time).isSameOrBefore(todayClosingTime) && moment(time).isSameOrAfter(todayOpeningTime)){
				str = "We are open, but hurry up we are closing in " + moment.duration(moment(todayClosingTime).diff(time)).humanize();
				open=true;
		    }else if(moment(time).isSameOrBefore(todayOpeningTime)){
				str = "We are closed, but we will open in " + moment.duration(moment(time).diff(todayOpeningTime)).humanize();		    	
				open=true
		    }

		}
		console.log(str)
		return str	
    }

    
    $(document).ready(function(){
    	console.log(checkOpen())
    	console.log($('#statemessage'))
    	$('#statemessage')[0].innerHTML = checkOpen()	
    })
    
    
});

