  // JavaScript Document


var y, speed, pos, maxPos;

function headerScroll()
{
     console.log("function headerScroll time start");
console.time();
	
	 var $navi = $("#header"), scrollTop = 0;
    $(window).scroll(function () {
		
        y = $(this).scrollTop();
        speed = 0.05;
        pos = y * speed;
        maxPos = 100;
		
        if (y > scrollTop) {
            pos = maxPos;

        } else {
            pos = 0;



        }
        
        scrollTop = y;
	//	console.log("y = "+y + "pos = "+ pos); 
		if(y>=100){
      $(".search-box").fadeOut(300);
      $(".search-btn i").removeClass("fa-times");
      $(".search-btn i").addClass("fa-search");
        if(y>=640){
			//$('.header-right-unit').addClass('pageScroll');

			}
			 $navi.css({
           // "-webkit-transform": "translateY(-" + pos + "%)",
            //"-moz-transform": "translateY(-" + pos + "%)",
            //"-o-transform": "translateY(-" + pos + "%)",
            //"transform": "translateY(-" + pos + "%)"
        });
			
		}else
    {
       //$('.header-right-unit').removeClass('pageScroll');
    }
    if(pos == 0){
     // $(".destination-link").css("display", "none");
    }

    if( $(window).scrollTop() <= 100 ) {
     // $(".destination-link").css("display", "block");
    }

		
if( $(window).scrollTop() >  bookingEnginePos ) {
	//$(".destination-link").addClass("deActive");
	$(".buttonResize").css({"opacity": "1", "z-index":"2", "width":"142"} );
  $(".home-header").css({ "width":"142"} );
  if (typeof glblPageTemplate != "undefined") {
  if (glblPageTemplate == "home-page" || glblPageTemplate == "overview-details") {
    if(safetyHygieneClosed == true){
      if($(window).width() > 767 ){ 
    $(".covid-update-info-wrapper").removeClass("activeInfo");
    $(".covid-band").removeClass("covid-band-active");
      }
    }
    }
  }
  } else
	{
    $(".buttonResize").css({"opacity": "0", "z-index":"-1" , "width":"0"} );
	$(".home-header").css({"width":"0"} );
    $(".availability-cta .booking-engine").hide();
    if (typeof glblPageTemplate != "undefined") {
    if (glblPageTemplate == "home-page" || glblPageTemplate == "overview-details") {
      if(safetyHygieneClosed == true){
        if($(window).width() > 767 ){
      //$(".covid-update-info-wrapper").addClass("activeInfo");
      //$(".covid-band").addClass("covid-band-active");
        }
      }
      }
    }
	}
		
      
    });



//Your code and orr loops
console.timeEnd();
  console.log("function headerScroll time End");

}




function menuAcoor()
{
    $('.ac-list > li.expanded > a').on('click', function(e) {
      e.preventDefault();
      if($(this).next('ul.sub-menu').is(':visible')) {
          $(this).removeClass('open');
          $(this).next('ul.sub-menu').slideUp();
      } else {
          $('.ac-list > li.expanded > a').removeClass('open');
          $(this).addClass('open');
          $('.ac-list > li.expanded > a').next('ul.sub-menu').slideUp();
          $(this).next('ul.sub-menu').slideToggle();
      }
    }); 
}

// $(document).ready(function(){
//   setTimeout(function(){
//     $(".banner-arrow-bottom").click(function(){
//       $("html, body").animate({ scrollTop: $("#intro-secn").offset().top - 100 + "px"}, 800);
//     });
//   }, 500);
    
// });

var freezeVp = function(e) {
  //  e.preventDefault();
};
function stopBodyScrolling (bool) {
    //if (bool === true) {
    //    document.body.addEventListener("touchmove", freezeVp, false);
	
    //} else {
    //    document.body.removeEventListener("touchmove", freezeVp, false);
	
    //}
}


var isOpenBookingWidgetClicked = false;
/*This function opens booking widget */
function openBookingEngine() {
    openReservationBookingWidget();
}

/*This function opens booking widget with Philae and Zahra calendar */
function openBookingEngineCruise() {
   
    fnBwSetHotelSelectedByHotelCode(glblCurrentPageHotelCode);
    openBookingEngine();

}



function openReservationBookingWidget() {

    if (!isOpenBookingWidgetClicked) {
        isOpenBookingWidgetClicked = true;
        // temp comment fnInitialiseCalanderAndConfigure();
        // temp added fnInitializeCruiseCalander();
        //temp comment  fnSetDefaulCODate();

    }

    // temp commenthowGenericMessageOnBookNow();

    if ($(window).width() <= 990) {
        // $("body, html").addClass("overflowHidden");

        $(".availability-cta .booking-engine").toggle();

        if ($(window).width() <= 767) {
            stopBodyScrolling(true);
        }


    }
    else {
        $(".availability-cta .booking-engine").toggle();

    }
    
}



function closeBookingEngine()
{
	if($(window).width()<= 990)
		 {
		  	//$("body, html").removeClass("overflowHidden"); 
			 stopBodyScrolling(false);
      		$(".availability-cta .booking-engine").toggle();
			 
		 }
	  else
		  {
			  $(".availability-cta .booking-engine").toggle();
	  
		  }
}

  var bookingEnginePos;
  $(window).load(function(){
    if ($('.bkhOffset').length){
      bookingEnginePos = $('.bkhOffset').offset().top;
    }
   // console.log(bookingEnginePos);
  });

$(document).ready(function(){

  var hotelMenuTab = $(".main-menu .hotel-menu-tab > a");
  var overviewLinkText = $(".main-menu > li.htl-tab a");

  if(window.location.href.indexOf("agra") > -1) {
    hotelMenuTab.text("Agra - The Oberoi Amarvilas");
    overviewLinkText.text("Resort Overview");

  }
  if(window.location.href.indexOf("bengaluru") > -1) {
    hotelMenuTab.text("Bengaluru - The Oberoi, Bengaluru");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("gurgaon") > -1) {
    hotelMenuTab.text("Gurgaon - The Oberoi, Gurgaon");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("jaipur") > -1) {
    hotelMenuTab.text("Jaipur - The Oberoi Rajvilas");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("kerala") > -1) {
    hotelMenuTab.text("Kerala - The Oberoi Vrinda, Luxury Kerala Cruiser");
    overviewLinkText.text("Cruiser Overview");
  }
  if(window.location.href.indexOf("kolkata") > -1) {
    hotelMenuTab.text("Kolkata - The Oberoi Grand");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("mumbai") > -1) {
    hotelMenuTab.text("Mumbai - The Oberoi, Mumbai");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("chandigarh") > -1) {
    hotelMenuTab.text("New Chandigarh - The Oberoi Sukhvilas Spa Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("delhi") > -1) {
    hotelMenuTab.text("New Delhi - The Oberoi, New Delhi");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("ranthambhore") > -1) {
    hotelMenuTab.text("Ranthambhore - The Oberoi Vanyavilas Wildlife Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("wfh") > -1) {
    hotelMenuTab.text("Shimla in the Himalayas - The Oberoi Wildflower Hall");
    overviewLinkText.text("Resort Overview");

  }
  if(window.location.href.indexOf("cecil") > -1) {
    hotelMenuTab.text("Shimla - The Oberoi Cecil");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("udaipur") > -1) {
    hotelMenuTab.text("Udaipur - The Oberoi Udaivilas");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("hasheesh") > -1) {
    hotelMenuTab.text("Sahl Hasheesh - The Oberoi Beach Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("zahra") > -1) {
    hotelMenuTab.text("The Oberoi Zahra, Luxury Nile Cruiser");
    overviewLinkText.text("Cruiser Overview");
  }
  if(window.location.href.indexOf("philae") > -1) {
    hotelMenuTab.text("The Oberoi Philae, Luxury Nile Cruiser");
    overviewLinkText.text("Cruiser Overview");
  }
  if(window.location.href.indexOf("bali") > -1) {
    hotelMenuTab.text("Bali - The Oberoi Beach Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("lombok") > -1) {
    hotelMenuTab.text("Lombok - The Oberoi Beach Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("mauritius") > -1) {
    hotelMenuTab.text("Mauritius - The Oberoi Beach Resort");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("madina") > -1) {
    hotelMenuTab.text("Madina - The Oberoi, Madina");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("zorah") > -1) {
    hotelMenuTab.text("Dubai - The Oberoi Beach Resort, Al Zorah");
    overviewLinkText.text("Resort Overview");
  }
  if(window.location.href.indexOf("dubai") > -1) {
    hotelMenuTab.text("Dubai - The Oberoi, Dubai");
    overviewLinkText.text("Hotel Overview");
  }
  if(window.location.href.indexOf("marrakech") > -1) {
    hotelMenuTab.text("Morocco - The Oberoi, Marrakech");
    overviewLinkText.text("Hotel Overview");
  }

  

  var overViewLink2 = $(".header-logo-unit > a").attr("href");
  $(".main-menu > li.htl-tab a").attr("href", overViewLink2);


  $("#menu, #nav-icon").click(function(event){
      event.stopPropagation();
  });
/*---- code for language change start-----------------------*/
$('.language-component').click(function(){

  if(!$(this).hasClass('active'))
  {
    $(this).addClass('active');
    $('.language-menu').show();
  }
  else{
      $(this).removeClass('active');
      $('.language-menu').hide();
  }

});

    $('.language-menu ul li').click(function () {
        //  $('.language-menu ul li').removeClass('active');
        //  $(this).addClass('active');
        //var lan = $(this).attr('data-value');
        //$('.selected-language').text(lan);

        var tempLocationName = document.location.pathname + location.search;
        var thisLilanguage = $(this).data("value").toLowerCase();

        if ($(this).data("value").toLowerCase() == "en") {
            tempLocationName = tempLocationName.replace("/" + glblCurrentPageLanguageName + "/", "/");
        }
        else {
            var isLangageFoundInUrl = false;
            var allAvailablelanguage = [];
            $(".language-component .language-menu ul li").each(function () {
                allAvailablelanguage.push("/" + thisLilanguage+"/");
            });

            for (var i = 0; i < allAvailablelanguage.length; i++) {
                tempLocationName = tempLocationName.replace("/" + allAvailablelanguage[i] + "/", "/" + thisLilanguage + "/");

                if (tempLocationName.indexOf(allAvailablelanguage[i]) != -1) {
                    isLangageFoundInUrl = true;
                }
            }

            if (!isLangageFoundInUrl) {

                tempLocationName = "/" + thisLilanguage + tempLocationName.replace("//","");
            }
            
        }


        window.location = tempLocationName.replace("/en/", "/")
            .replace("/hotels-au-maroc-marrakech", "/hotels-in-morocco-marrakech")
            .replace("chambres-suites", "rooms-suites")
            .replace("fitness-au-spa", "spa-fitness")
            .replace("evenements", "events");

    });

$(document).mouseup(function (e) {
  var container = $(".language-component .language-menu"),
        containerParent = $('.language-component');
    if (!container.is(e.target) && container.has(e.target).length === 0 && !containerParent.is(e.target) && containerParent.has(e.target).length === 0) {
        container.hide();
        containerParent.removeClass('active');
    }
});


    $(function () {
        $(".language-component .language-menu ul li").each(function () {
            $(this).removeClass("active");
            $(".language-component .language-menu").hide();
            $(".language-component").removeClass("active");
            if (glblCurrentPageLanguageName.toLowerCase() == $(this).data("value").toLowerCase()) {
                console.log("data-value" + $(this).data("value").toLowerCase());
                $(this).addClass("active");
                $(".language-component .selected-language").html($(this).data("text"));
            }
        });
    });

/*---- code for language change end------------------------*/



  $(document).click(function(){
    $(".menu-container").removeClass("open");
  });

  $(".search-btn").click(function(){
    $(".search-box").fadeToggle(300);
$('.searchOverlay').toggleClass('active');
    $(this).find("i").toggleClass("fa-search");
    $(this).find("i").toggleClass("fa-times");
	  $('#desktopSearch').focus();
  });

  $(".close-search").click(function(){
    $(this).parents(".search-box").fadeOut(300);
$('.searchOverlay').toggleClass('active');
    $(".search-btn i").removeClass("fa-times");
    $(".search-btn i").addClass("fa-search");
  });

  if( $(window).width() <= 1024 ) {
   
    var leftMenu = $(".left-side-menu ul").html();
    var rightMenu = $(".right-side-menu ul").html();
    var rightMenuTop = $(".right-nav ul").html();
    var overViewLink = $(".header-logo-unit > a").attr("href");


    $(".hotel-menu-list").prepend("<li id='overview-link'><a href='javascript:;'>Overview</a></li>" + leftMenu + rightMenu + rightMenuTop);
    $("#overview-link a").attr("href", overViewLink);
    
    $(".hotel-menu-list .o-one-menu-wrap.o-one-menu-nodisplay-desktop").remove();

    $(".main-menu .hotel-menu-tab > a").click(function(){
      $(this).next(".hotel-menu-list").slideToggle();
      $(this).toggleClass("active");
    });
   
  

  

 



  $(".menu-hdng").click(function(){
    $(this).next(".menu-list").addClass("actv");
    //$(".backto-menu").show();
    $(".backto-menu span").addClass("actv2");
    $(".backto-menu span").removeClass("actv");
  });

  $(".menu-list > li > a").click(function(){
    $(this).next(".sub-menu-list").addClass("actv");
    $(".backto-menu span").addClass("actv3");
    $(".backto-menu span").removeClass("actv2");
    $(".backto-menu span").removeClass("actv");
  });

  $(".menu-close").click(function(){
    $(".menu-level-1, .menu-list, .sub-menu-list").removeClass("actv");
    $("body").removeClass("overflowHidden");
    $(".backto-menu").hide();
  });

  


  $(".menu-container").on('click', '.backto-menu span.actv', function() {
    if( $(".menu-level-1").hasClass("actv") ) {
        $(".hotel-menu-tab, .home-tab").show();
        $(".menu-level-1").removeClass("actv");

        $(".backto-menu span").removeClass("actv");

        $(".backto-menu").hide();
      }
  });

  $(".menu-container").on('click', '.backto-menu span.actv2', function() {
      $(".menu-list").removeClass("actv");

      $(".backto-menu span").removeClass("actv2");
      $(".backto-menu span").addClass("actv");
      
  });

  $(".menu-container").on('click', '.backto-menu span.actv3', function() {
      $(".sub-menu-list").removeClass("actv");

      $(".backto-menu span").removeClass("actv3");
      $(".backto-menu span").addClass("actv2");

  });
	  
//mobile main menu anchor set code for mobile	  
	  
//$(".mobLink").attr("href", "javascript:;");	  
	  
}

if( $(window).width() <= 1024 && $(window).width() > 991  ) {
  $(".main-menu > li.has-submenu:not(.type2) > a").click(function(){
    $(this).next(".menu-level-1").addClass("actv");
    $(".backto-menu").show();
    $(".backto-menu span").addClass("actv");
  });

   $(".main-menu > li.has-submenu:not(.type2)").click(function(){
    $(".hotel-menu-tab, .home-tab").hide();
  });

  

}

if( $(window).width() < 991 ) {
  $(".main-menu > li.has-submenu:not(.type2) > a").click(function(){

    $(this).next(".menu-level-1").toggleClass("actv");
    $(this).toggleClass("active");

  });

  $(".menu-hdng").click(function(){
    $(".backto-menu").show();
  });

  $(".menu-close").click(function(){
    $(".menu-container.mo-menu-conatiner .main-menu li.has-submenu>a").removeClass("active");
  });

  $(".menu-container").on('click', '.backto-menu span.actv2', function() {
    $(".backto-menu").hide();	
    $(".menu-container .main-menu>li:not(.has-submenu), .menu-container .social-menu, .menu-container .main-menu>li.type2").css("opacity","1");
  });

}
	

	
$(document).mouseup(function (e) {
  var container = $(".header-view-availability");
  if (!container.is(e.target) && container.has(e.target).length === 0 ) {
    container.find('.booking-engine').hide();
  }
});
	
	
});




function HamburgerOpen()
{
	var element = document.getElementById("nav-icon");
    var menu = document.getElementById("menu");
  //  var overlay = document.getElementById("overlay");
    element.classList.toggle("open");
    menu.classList.toggle("open");
   // overlay.classList.toggle("open");

    setTimeout(function(){
      $("body").addClass("overflowHidden");
    }, 800);

    
}

function MenuClose()
{
    var element = document.getElementById("nav-icon");
    var menu = document.getElementById("menu");
   // var overlay = document.getElementById("overlay");
    element.classList.toggle("open");
    menu.classList.toggle("open");
  //   overlay.classList.toggle("open");
}

function SecondLabelOpen()
{
     var sl = document.getElementById("second-label");
     sl.classList.toggle("open");
}
function backToFirst()
{
    var sl = document.getElementById("second-label");
     sl.classList.toggle("open"); 
}



//$(document).ready(function(){
//  
//  $(".banner-arrow-bottom").on('click', function(event) { 
//    if (this.hash !== "") {
//      event.preventDefault();
//      var hash = this.hash;
//     $('html, body').animate({
//        scrollTop: $(hash).offset().top-200
//      }, 500, function(){
//        window.location.hash = hash;
//      });
//    } 
//  });
//});

