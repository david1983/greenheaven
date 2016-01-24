var originalProducts = [
	{
		id: 1,
		img : '/images/bostonlettuce.jpg',
		title: 'Boston lettuce',
		price: 0.5,
		description: ' It\'s got as complex a flavor as you\'ll find in any lettuce. It has a pronounced crisp garden freshness balanced by just a touch of bitterness. The velvety texture that sets Boston apart from its coarser lettuce cousins earns its entry into the "butterhead" lettuce category.',
		category: 'vegetables'
	},
	{
		id: 2,
		img : '/images/spinach.jpg',
		title: 'Spinach',
		price: 0.2,
		description: 'Fresh spinach has a clean, crisp taste with a light sharpness that fits beautifully in rich dishes made with eggs and cheeses.',
		category: 'vegetables'
	},
	{
		id: 3,
		img : '/images/tomatoes.jpg',
		title: 'Beefsteak Tomatoes',
		price: 0.56,
		description: 'Heavy, fleshy, and versatile, we can bring you these tangy, sturdy, almost smoky-flavored tomatoes all through the year. In Italy they serve layers of sliced beefsteaks, fresh mozzarella, and whole basil leaves, with a drizzle of good olive oil and a little balsamic vinegar',
		category: 'vegetables'
	},
	{
		id: 4,
		img : '/images/plumtomatoes.jpg',
		title: 'Plum tomatoes',
		price: 2,
		description: 'Roma tomatoes are the ultimate Italian variety plum tomato. They\'re bright red in color, smooth skinned and oval shaped. ',
		category: 'vegetables'
	},
	{
		id: 5,
		img : '/images/grape.jpg',
		title: 'Green seedless grape',
		price: 1.5,
		description: 'Juicy and snappy, with a beautiful balance of sweet and tart. This is the grape that all others are compared to. ',
		category: 'fruit'
	},
	{
		id: 6,
		img : '/images/applefuji.jpg',
		title: 'Fuji Apples',
		price: 1,
		description: 'There\'s a hint of sweet vanilla in this baseball-sized apple. Originally grown in Japan, the Fuji ripens slowly and is a challenge to pick.',
		category: 'fruit'
	},
	{
		id: 7,
		img : '/images/orange1.jpg',
		title: 'Oranges',
		price: 1,
		description: 'This grapefruit\'s watermelon-colored flesh is tart and sweet, with a big flavor. It is full of juice, with barely any bitterness.',
		category: 'fruit'
	},
	{
		id: 8,
		img : '/images/blueberry.jpg',
		title: 'Blueberries',
		price: 1,
		description: 'Smooth-skinned, perfect little globes of fresh, juicy flavor, mostly sweet and a little tart. ',
		category: 'fruit'
	},
	{
		id: 9,
		img : '/images/gorgonzola.jpg',
		title: 'Gorgonzola Dolce',
		price: 1,
		description: 'A rich and creamy version of the northern Italian classic blue. Gorgonzola Dolce is young and sweet (as the name suggests).',
		category: 'cheese'
	}
]


/**
*	The ready block loads the products in the view		
**/

$(document).ready(function(){
	renderProducts();
	if(Storage){
		checkTotal();
	}
});



var products = [];
cloneArray(originalProducts, products)
function cloneArray(arraySrc, arrayDst){	
	arraySrc.forEach(function(p){ arrayDst.push(p)})	
}




/**
*	renderProducts cycle the product and append a the productTemplate to the
* 	product list.
**/

function renderProducts(){
	var list = $('#product-list');
	list.html('');
	for(var i = 0 ; i<products.length; i++){
		var product = products[i];
		var productTemplate = '<div class="col-3">\
								<div class="box product-box" onclick="revealProductModal('+product.id+')">\
									<div class="col-sm-3 product-desc hide-medium hide-large">\
									<h4>'+product.title+'</h4>'
										+product.description+
									'</div>\
									<div class="col-sm-1">\
										<img src="'+product.img+'" alt="vegetables from our fields">\
										<div class="overlay"></div>\
										<div class="product-name hide-small"><span>' + product.title+ '</span></div>\
									</div>\
								</div>\
							</div>';
		

		list.append(productTemplate);
	}
}


function closeProductModal(){
	$('#openModal').toggleClass('openModal')
}

//a regExp is used to handle currency notation
function currency(val){
 	return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
}


/**
*	revealProductModal write the product data into the view and then show the modal
**/
function revealProductModal(id){	
	for(var i=0;i<products.length;i++){
		var product = products[i]
		if(product.id == id){
			//checking if the propery name is equal to an ID in the view, if so write the value in the DOM 
			for(var name in product){
				
				if(name=='price' && typeof product[name].toFixed == 'function') { product[name] = currency(product[name]) }
				$('#product-' + name).html(product[name])
			}
			$('#product-img').attr('src',product.img)
			$('#product_id').val(id);
			$('#quantity').val(0);			
			var qty = (typeof checkCartQty(id) == 'undefined') ? 0 : checkCartQty(id);
			$('#inCart').html(qty);
			$('#openModal').addClass('openModal')
		}
	};
}

/**
*	revealProductModal write the product data into the view and then show the modal
**/

function selectCategory(categoryName){

	if(typeof categoryName == 'undefined' || categoryName == null) { console.warn('categoryName is required');}
	products = []
	cloneArray(originalProducts, products)

	if(categoryName=='all'){ return renderProducts()}
	var newProducts=[];

	for(var i=0;i<originalProducts.length;i++){
		var product = products[i];

		if(typeof product!='undefined' && product.category==categoryName){ newProducts.push(product); }		
	}
	products = newProducts;
	renderProducts();
}

function openCart(){
	var tbody = $('#cartModal #tableBody')
	tbody.html('');
	var cart = JSON.parse(localStorage.getItem('cart'));    	
	if(typeof cart == 'undefined' || cart == null) return 0;
	for(var i=0; i<cart.length; i++){
		var cartProduct = cart[i]
		var trow = "<tr><td>" + cartProduct.product.title + "</td><td>" + cartProduct.qty + "</td><td>" + cartProduct.product.price + "</td></tr>"
		tbody.append(trow)
	}
	$('#cartModal').addClass('openModal')
}

function closeCartModal(){
	$('#cartModal').removeClass('openModal')	
}


// this section handle the shopping cart

if(typeof(Storage) !== "undefined") {

	/**
	* checkCartQty returns the quantity ordered for a specified product
	*	@params {id} number
	*	@return {number}
	**/
	function checkCartQty(id){		
		if(typeof id == 'undefined' || id == null) { console.warn('ID is required');}
    	var cart = JSON.parse(localStorage.getItem('cart'));    	
    	if(typeof cart == 'undefined' || cart == null) return 0;
    	for(var i=0; i<cart.length; i++){
    		if(cart[i].product.id==id){ 
    			if(typeof cart[i].qty == 'undefined') return 0;
    			console.log(cart[i])
    			return cart[i].qty
    		}
    	}
	}

	/**
	* findProduct returns a specified product from the productList
	*	@params {id} number
	*	@return {product}
	**/
	function findProduct(id){
		//checking if the ID is correct
		if(typeof(id) == "undefined" || id==null) { return console.warn('ID is required');}		
		for(var i =0; i<products.length;i++){
			if(products[i].id==id) return products[i];
		}
	}


	/**
	* addToCart add the product currently shown in the view it does not
	*	take any paramenter because it loads the data from the DOM.
	*	we use the localStorage to store cart data in a string variable that is
	* 	essentially a JSON stringified object.
	*	@return {number}
	**/
	function addToCart(){
		//loading the data from the the DOM
		var qty = parseFloat($('#quantity').val())
		var id = $('#product_id').val()
		
		//checking if the ID is correct
		if(typeof(id) == "undefined" || id==null) { return console.warn('ID is required');}		
			var cart;
			//checking if a cart is already stored in the localStorage. If not crate an empty cart
		    if(typeof localStorage.getItem('cart') == 'undefined' || localStorage.getItem('cart')==null) { 
		    	cart = []
	    	}else{
	    		cart = localStorage.getItem('cart');
	    		//the try catch block helps to handle an error in case of malformed cart
	    		try{
	    			cart = JSON.parse(cart)
	    		}catch(e){
					console.warn(e)					
	    		}
	    	}	   	    
			
			//searching the product	    	  	   
	        var product = findProduct(id);
		    if(typeof product == 'undefined') {return console.warn('ERROR no product found');}
		   //building the object for the cart		   
		    var cartProduct = {
		    	product: product,
		    	qty: qty
		    }

		    //we use a spotting variable to see if the product is already in the cart.
			var found = false;			
			for(var i=0; i<cart.length; i++){
				if(found==true) continue;
				if(cart[i].product.id == id){
					cartProduct = cart[i];
					cart[i].qty = parseFloat(cart[i].qty) + parseFloat(qty);
					found = true;					
				}
			}

			//if the spotting variable is false we don't have the item so we push one
			if(!found){ cart.push(cartProduct) }

			//we update the view and we save the updated cart in the localStorage
			$('#inCart').html(cartProduct.qty)
			localStorage.setItem('cart', JSON.stringify(cart));
			checkTotal();
	}


	/**
	* 	cartReset remove all the products from the cart
	**/
	function cartReset(){
		localStorage.setItem('cart', JSON.stringify([]));
		checkTotal();
	}

	function checkTotal(){
		var cart = localStorage.getItem('cart');
		if(typeof cart == 'undefined' || cart == null){ return 0;}
		try{
			cart = JSON.parse(cart)
		}catch(e){
			console.warn(e)
		}
		var cartTotal = 0;
		for(var i=0;i<cart.length;i++){
			var cartItem = cart[i];
			cartTotal += (cartItem.qty*cartItem.product.price);
		}
		console.log(cartTotal)
		$('#cartTotal').html(currency(cartTotal))
		$('#tableTotal').html(currency(cartTotal))
	}	

} else {
    console.warn('Sorry your browser doesn\'t support localStorage' );
}
