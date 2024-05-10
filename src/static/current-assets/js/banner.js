// JavaScript Document


$(window).load(function () {
    $(".banner-and-booking-widget .banner-image").height($(".banner-image > img").height());
    $(window).resize(function () {
        $(".banner-and-booking-widget .banner-image").height($(".banner-image > img").height());
    });
  //  $("html, body").scrollTop(0);


    if ($(window).width() > 767) {
        if (fnGetParameterByName("novideo") != "1") {
            setTimeout(function () {
                $("#videoPlayer").YTPlayer();
            }, 500);
        }



        $('#muteUnMute').click(function () {
            $(this).toggleClass('active');
            $("#videoPlayer").YTPToggleVolume()
        });
    }

});


$(document).ready(function(){

	
	
	
	$('.expand-video a').click(function(){
		
		var vUrl= $('.expand-video a').attr('data-videoUrl');
		
		$('#videoPlayer').YTPPause();
		
		$('#videoPopup').html('<button class="fullvideoClose"><img src="/images/oberoihotels/exotic-vacations/closeicon-white.svg"></button><iframe width="" height="" src="'+vUrl+'" frameborder="0" allow="autoplay" allowfullscreen allownetworking="internal"></iframe><div class="top-popup"><img src="/images/oberoihotels/common/Oberoi-HotelsResorts-white-logo.png" alt="" /></div>');
		$('#videoPopup').addClass('active');
							  
	});
	
	$(document).on('click', '.fullvideoClose', function () { 
 
		$('#videoPlayer').YTPPlay();
		
		$('#videoPopup').html('');
		
		$('#videoPopup').removeClass('active');
		
		
	});
	

	
});





$(window).scroll(function() {
 
	if($('#videoPlayer').length)
		{
	if( $(window).scrollTop() >  bookingEnginePos ) {
		$('#videoPlayer').YTPPause();
		console.log('video pause');
	}
	else
		{
			$('#videoPlayer').YTPPlay();
			console.log('video play');
		}
	}
});



$(window).load(function(){
	if ( window.location.href.indexOf('?film') > 0 || currenturlpathnamewithoutlanguage == '/film'  || currenturlpathnamewithoutlanguage == '/film/') 
	{
		$('.expand-video a').click();
		$('#videoPopup iframe').attr('src',"https://www.youtube.com/embed/ZvAHk0Tojao?autoplay=1&loop=1&rel=0&showinfo=0");
		
		if($(window).width()<= 991)
			{
				$('.video-btn').click()
			}
	}
	
	setTimeout(function(){
		$(window).resize();
	}, 300);
	setTimeout(function(){
		if( $(window).width() > 768 ) {
			$(".banner-image").addClass("disable");
			$(".banner-slide").addClass("disable");
		}
	}, 2000);
		setTimeout(function(){
				if ( window.location.href.indexOf('?film') > 0 || currenturlpathnamewithoutlanguage == '/film'  || currenturlpathnamewithoutlanguage == '/film/') {
					console.log('click again');
						$('.expand-video a').click();
							$('#videoPopup iframe').attr('src',"https://www.youtube.com/embed/ZvAHk0Tojao?autoplay=1&loop=1&rel=0&showinfo=0");
					if($(window).width()<= 991)
			{
				$('.video-btn').click()
			}

				}
			}, 2000);

	
});

var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }






function homePageBanner() {
	$(".udaivilas-banner").css({ 'overflow' : 'inherit'});
	$('.banner').slick({
		arrows:true,
		autoplay: false,
		dots: false,
		// fade: true,
		// speed: 2500,
    customPaging: function(slick,index) {
        return '<a href="javaScript:;">' + (index + 1) + '</a>';
    },
    responsive: [
		    {
		      breakpoint: 767,
		      settings: {
		        dots: false,
		        }
		    }
		    // You can unslick at a given breakpoint now by adding:
		    // settings: "unslick"
		    // instead of a settings object
		  ]

    
	});
}




/*    when you run this component indivisual uncomment below mnetion code

$(document).ready(function(){
	homePageBanner();
});

*/
