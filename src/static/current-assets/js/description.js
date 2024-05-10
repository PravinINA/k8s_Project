// JavaScript Document



// JavaScript Document
function descriptionSlider() {
	$('.descriptionImageSlider').slick({
		arrows:true,
		lazyLoad: 'progressive',
		responsive: [
		    {
		      breakpoint: 991,
		      settings: {
				arrows:false,
				dots: true,
				 centerMode: false,
		        }
		    }
		    // You can unslick at a given breakpoint now by adding:
		    // settings: "unslick"
		    // instead of a settings object
		  ]
		
	});
}

$(document).ready(function(){
	$(".air-txt span").click(function(){
  		$(this).parent().toggleClass("active");

  		$(".aq-overlay").toggleClass("active");
	});

	$(".aq-overlay").click(function(){
		$(this).removeClass("active");
		$(".air-txt").removeClass("active");

	});

	$(".air-txt").prepend($(".air-group").html());
	$("#showMap").click(function(){
		$(this).toggleClass("map-opened");
		$("#mapArea").slideToggle(300);
	});
	
	$('.travel-notes ul.travelcity li').click(function(){
		$('.travel-notes ul.travelcity li').removeClass('active');
		$(this).addClass('active');
		var sel = $(this).attr('data-rel');
		$('.tabc').hide();
		$('#'+sel).show();
	});
	
});





/*    when you run this component indivisual uncomment below mnetion code

$(document).ready(function(){
	giftCardBanner();
});

*/
