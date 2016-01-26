//at the beginning we set the index=0 this is going to be the first element of the array of .container
var currentIndex = 0, 
oldIndex = 0, 
//we set a spotting variable to know when the animation is ongoing 
//and avoid the user to click twice
activeCycle = false, 
items = $('.container .image'),
itemAmt = items.length;

function cycleItems() {
  //if the animation is on going return
	if(activeCycle)return;
  //else set the animation as active
	activeCycle=true;
  var item = $('.container .image').eq(currentIndex);
  var old = $('.container .image').eq(oldIndex);
  //fadeout the old image in 500ms
  old.fadeOut(500,function(){
    //this callback is called at the end of the first animation
    //we hide all the items to be sure that only one will be shown
	  items.hide();
    items.removeClass('zoom')
    //the new image is set as visible but with opacity 0
    //we will use the opacity to fade in the image
	  item.css('display','inline-block');  	
	  item.css('opacity', 0);  	

    //we launch the animation to show the new image
	  item.animate({opacity:1},500,function(){
      //when the image is visible we set the animation as finished
      //and we add a nice zoom animation
      item.addClass('zoom')
	  	activeCycle=false      
	  })  
  })
  
}

//autoSlide is used to cycle the images automatically
var autoSlide = setInterval(function() {
  currentIndex += 1;
  if (currentIndex > itemAmt - 1) {
    currentIndex = 0;
  }
  cycleItems();
}, 6000);


//this block is called when the DOM is rendered
$(document).ready(function(){
	items = $('.container .image'),
  itemAmt = items.length;
  items.eq(currentIndex).addClass('zoom');

  //add click event to next and prev button
  $('.next').click(next);
  $('.prev').click(prev)
})


//set the currentIndex to currentIndex++
//and call the cycleItems that run the animation to change image

function next() {
  oldIndex = currentIndex;
  clearInterval(autoSlide);
  currentIndex++;
  if (currentIndex > itemAmt - 1) {
    currentIndex = 0;
  }
  cycleItems();
}

function prev() {
    oldIndex = currentIndex;
    clearInterval(autoSlide);
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = itemAmt - 1;
    }
    cycleItems();  
}



//in this section we implemented the touch event that is missing in the
//jquery library.
//at the beginning we set the starting vars to 0
var length=0, move=0, xstartPos=0;

document.addEventListener('touchstart', function(e) {    
    //touchstart handle when the touch event starts and
    //store the position of the first touch    
    var touch = e.touches[0];      
    length = touch.pageX;
}, false);

document.addEventListener('touchmove', function(e) {
    //touchmove handle when the touch move on te screen and 
    //continuosly store the position of the touch
    var touch = e.touches[0];
    move = touch.pageX
      
}, false);

document.addEventListener('touchend', function(e) {    
    //this is a threshold used to avoid small touch to be triggered
    //and also allow the user to press the buttons because we
    //bubble the event to all over the dom
    if(Math.abs(length-move)<100 || move==  0) {             
      return 
    }

    //using cartesian calculation we know that if the 
    // starting_point - end_point > 0 ---> the user swiped left
    // starting_point - end_point < 0 ---> the user swiped right
    //because the coordinate system of the HTML document start with
    //{x:0,y:0} on the top left corner
    if(length - move>0){
      prev();
    }else{
      next();          
    }

    //finally we reset the vars to the original state
    length=0, xstartPos=0,move=0;
    
}, false);