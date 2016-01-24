var currentIndex = 0, 
oldIndex = 0, 
activeCycle = false, 
items = $('.container .image'),
itemAmt = items.length;

function cycleItems() {
	if(activeCycle)return;
	activeCycle=true;
  var item = $('.container .image').eq(currentIndex);
  var old = $('.container .image').eq(oldIndex);
  old.fadeOut(500,function(){
	  items.hide();
    items.removeClass('zoom')
	  item.css('display','inline-block');  	
	  item.css('opacity', 0);  	

	  item.animate({opacity:1},500,function(){
      item.addClass('zoom')
	  	activeCycle=false
      
	  })  
  })
  
}

var autoSlide = setInterval(function() {
  currentIndex += 1;
  if (currentIndex > itemAmt - 1) {
    currentIndex = 0;
  }
  cycleItems();
}, 6000);

$(document).ready(function(){


	items = $('.container .image'),
  itemAmt = items.length;
  items.eq(currentIndex).addClass('zoom')


$('.next').click(next);

$('.prev').click(prev)

})


function next() {
  oldIndex = currentIndex;
  clearInterval(autoSlide);
  currentIndex += 1;
  if (currentIndex > itemAmt - 1) {
    currentIndex = 0;
  }
  cycleItems();
}

function prev() {
    oldIndex = currentIndex;
    clearInterval(autoSlide);
    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = itemAmt - 1;
    }
    cycleItems();  
}


var length=0, move=0, xstartPos=0;

document.addEventListener('touchstart', function(e) {    
    
    var touch = e.touches[0];      
    length = touch.pageX;
}, false);

document.addEventListener('touchmove', function(e) {
    
    var touch = e.touches[0];
    move = touch.pageX
      
}, false);

document.addEventListener('touchend', function(e) {    
    if(Math.abs(length-move)<100 || move==  0) {             
      return 
    }

    if(length - move>0){
      prev();
    }else{
      next();          
    }
    length=0, xstartPos=0,move=0;
    
}, false);