
var originalProducts,products;
var consent = false;

setInterval(function(){
	consent = /consent=true/.test(document.cookie);
	if(!consent){
		$('#addToCartButton').css('background','lightgrey');
		$('.cookie-message').addClass('cookie-message-open')
	}
},500) 
//we load the productdatasets from a JSON file
$.getJSON("/js/json/products.json", function(json) {
		originalProducts = json
		products = [];
		cloneArray(originalProducts, products)	
		
		/**
		*	The ready block loads the products in the view		
		**/

		$(document).ready(function(){
			renderProducts();
			renderReapeningTable();			
			if(Storage){
				checkTotal();
			}

		});
});

		// cloneArray create a deepcopy of a source array		
		function cloneArray(arraySrc, arrayDst){	
			for(var i=0;i<arraySrc.length;i++){
					arrayDst.push(arraySrc[i])
			}
				
		}


		function renderReapeningTable(){
			var table = $('#tbody');	
			for(var i = 0 ; i<products.length; i++){
				var product = products[i];

				var row = '<tr><td>'+product.title+'</td>';
				for(var n=0;n<product.season.length;n++){
					if(product.season[n]==1){
						row += '<td class="available">Available</td>'
					}else{
						row += '<td class="not-available">Not available</td>'
					}				
				}
				
				table.append(row + '</tr>')	
			}
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
		if(!consent){ 			
			return 
		}
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
		$('#cartTotal').html(currency(cartTotal))
		$('#tableTotal').html(currency(cartTotal))
	}	

} else {
    console.warn('Sorry your browser doesn\'t support localStorage' );
}







