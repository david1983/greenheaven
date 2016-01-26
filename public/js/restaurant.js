    
// load the timetable datasets from a JSON file
var timetable = $.getJSON("/js/json/timetable.json", function(json) {	    
    var morningTime = $('#morning');
    var eveningTime = $('#evening');
	
    for(var i=0; i<json.length; i++){    	
    	mElem = morningTime.children()[i];
    	eElem = eveningTime.children()[i];
    	mElem.innerHTML = json[i].morning.open + '-' + json[i].morning.close
    	eElem.innerHTML = json[i].evening.open + '-' + json[i].evening.close
    	
    }

    //the checkOpen function cycle the timetable to see if the restaurant is open
    function checkOpen(){
        //I've used moment to handle the date because it offers a more usable interface 
        //than the Date obj in JS
        //the library is made in USA so
        //isoWeekDay is the number of the day in a week,
        //and it starts with sunday == 1
	    var today = moment().isoWeekday();
	    var time = moment().format();   
        //We are in Europe and the week starts on monday,
        //we need to convert the weekday to  monday == 1 
	    var day = json[today-1];
	    var str='', open=false;	    
    	for (var name in day) {   
            if(typeof name=='undefined'){return}
            //open is a spotting variable to check if we already know the state
    		if(open) continue;
			var todayClosingTime = moment().format('YYYY-MM-DD') + " " + day[name].close;
		    var todayOpeningTime = moment().format('YYYY-MM-DD') + " " + day[name].open;
            console.log(todayClosingTime,todayOpeningTime)

		    if(moment(time).isSameOrBefore(todayClosingTime) && moment(time).isSameOrAfter(todayOpeningTime)){
				str = "We are open, but hurry up we are closing in " + moment.duration(moment(todayClosingTime).diff(time)).humanize();
				open=true;
		    }else if(moment(time).isSameOrBefore(todayOpeningTime)){
				str = "We are closed, but we will open in " + moment.duration(moment(time).diff(todayOpeningTime)).humanize();		    	
				open=true
		    }else{
                var tomorrowOpening = moment().add(1,'day').format('YYYY-MM-DD') + " " + morning.open;
                str = "We are closed, but we will open in " + moment.duration(moment(time).diff(todayOpeningTime)).humanize();              
            }

		}		
        
		return str	
    }

    
    $(document).ready(function(){    	
    	$('#statemessage')[0].innerHTML = checkOpen()	
    })
    
    
});

