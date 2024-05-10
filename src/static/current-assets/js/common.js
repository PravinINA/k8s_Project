var IsMemberLoggedIn = false;
var arrPageDetails = "";
var offerPageName = "";
var offerHotelCode = "";
var safetyHygieneClosed = true;
var currenturlpathnamewithoutlanguage = document.location.pathname.toLocaleLowerCase().replace(/\/en/g, '').replace(/\/es/g, '').replace(/\/ru/g, '').replace(/\/zh-cn/g, '');


function convertTextToTitleCase(inStr) {
    if (typeof inStr != "undefined") {
        return inStr.replace(/\w\S*/g, function (tStr) {
            return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase();
        });
    }
    else {
        return inStr;
    }
}

function fnGlblSortNumber(a, b) {
    return a - b;
}
$(document).ready(function(){
  fnWellnesBoxLabel();

  if($("#header").hasClass("global-header-pages")){
    $(".top-nav").hide();
}

$(window).scroll(function () {
        // if ($(window).scroll(20)) {
        //     $(".cookie-box-wrapper").hide();
        // }
    });
    if($(window).width() < 767){
        $(".christmasOfferCopyWrapper .close-cny-pop-up").click();
    }
    
});


 function fnWellnesBoxLabel() {

    $(".wellness-form-field-box input").focusout(function () {

        var value = $(this).val();

        if (value.length > 0) {
            $(this).next(".label-wellness-box").addClass("active-label");
        }
        else {
            $(this).next(".label-wellness-box").removeClass("active-label");
        }


    });



    setTimeout(function () {

        $(".wellness-form-field-box input").each(function () {
            var value = $(this).val();

            if (value.length > 0) {
                $(this).next(".label-wellness-box").addClass("active-label");
            }

            else {
                $(this).next(".label-wellness-box").removeClass("active-label");
            }
        });


    }, 10);

}




//get CountryCode From Country Name
function fnGlblGetCountryCodeFromName(countryName) {

    if (typeof countryName != "undefined" && countryName != "") {

        var countryCode = glblMasterCountryCodes.filter(function (item) {
            if (item.Country.toLowerCase().trim() == countryName.toLowerCase().trim()) {
                return item;
            }
        })[0];

        if (typeof countryCode != "undefined") {
            return countryCode.Codes;
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
}

function fnGlblGetCountryNameFromCode(countryCode) {
   
    if (typeof countryCode != "undefined" && countryCode != "") {
        var countryName = glblMasterCountryCodes.filter(function (item) {
            if (item.Codes == countryCode) {
                return item;
            }
        })[0];

        if (typeof countryName != "undefined") {
            return countryName.Country;
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
   
}


//check whether user is logeed in or not
function fnGlblIsMemberLoggedIn() {

    if (readCookie("OberoiOneUserLoggedInStatus") != "") {
        return true;
    }
    else {
        return false;
    }
}

try {
    arrPageDetails = PageName.split('-');
    offerPageName = arrPageDetails[0] != undefined && arrPageDetails[0] != "" ? arrPageDetails[0].toLocaleLowerCase().trim() : "";
    offerHotelCode = arrPageDetails[1] != undefined && arrPageDetails[1] != "" ? arrPageDetails[1].trim() : "";
}
catch (exx) {

}


$(window).load(function () {

/* add class for third party zopim Chat in mobile devices start*/

  /*  if($(window).width() <= 1100){

        setTimeout(function(){
            $(".zopim").addClass("actv");
        }, 1000);

    }*/
/* add class for third party zopim Chat in mobile devices End*/

    
	
		/*page scroll to hash value*/
		if(window.location.hash) {
		  var hash = window.location.hash;
          if($(hash).length > 0)
          {
             $('html, body').animate({

                scrollTop: $(hash).offset().top - 100
              }, 1500, 'swing'); 
          }
		  
		}
	/*page scroll to hash value*/

/*-----marketing assets toggle function------*/
$(".marketing-asset-text").addClass("mAssetsactive");

   setTimeout(function(){
     $(".marketing-asset-text").removeClass("mAssetsactive");
   },7000);
   //fnToggleMarketingAssets();
//    $(".marketing-asset-text").css("right","29px");
//    setTimeout(function(){
//     $(".marketing-asset-text").css("right","-360px");
//   },5000);

});


Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

/*get booking Engine dropdown get height and set height start */

function beAllHotelListHeight()
{
	/*booking engine dropdown height css*/
	
	var wHeight = $(window).innerHeight();
	var allHotelListHeight = wHeight - 150;
	
	if(wHeight < 630 && $(window).width()>991)
		{
			$('.allHotels').css({'height':allHotelListHeight});
		}
	else{
		$('.allHotels').css({'height':'auto'});
	}
	
	/*booking engine dropdown height css end */
}
/*get booking Engine dropdown get height and set height start */


$(window).resize(function(){

	beAllHotelListHeight();
});

$(document).ready(function () {
    fnBwSetHorizontalBookingWidgetOffsetEvaluation();

    /*Dining Tracking Start*/
    if (window.location.href.toLocaleLowerCase().indexOf("/restaurants/") != -1) {

        /*Common Hotel Title */
        var tempHotelTitle = getHotelTitleByHotelCode(glblCurrentPageHotelCode);

        /*Tracking for listing page*/
        $(".dining-page .text-colm .btns-list li .btn-style2").click(function () {
            var tempRestaurantName = $(this).parents(".text-colm").find("h2").text();
            glblDiningViewMenuTracking(tempHotelTitle, tempRestaurantName);
        });

        /*Tracking for detail page*/
        $(".description-col .btn-wrap .btn-style1").click(function () {
            var tempRestaurantName = $(".heading-component").find("h1").text();
            glblDiningViewMenuTracking(tempHotelTitle, tempRestaurantName);
        });


        function glblDiningViewMenuTracking(HotelTitle, RestaurantName) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'menumodo_viewmenu_clicked': HotelTitle + '~~' + RestaurantName
            });
        }
    }

/*Dining Tracking End*/
	
	beAllHotelListHeight();

/* set anchor on phone number */
    if($(window).width() <= 1100){
        $(".text-colm .phn-time li .phn, .description-col .d-details-wrap .phn").each(function(){ $(this).children("a").attr("href", "tel:"+$(this).children("a").text()) });
    }
/* set anchor on phone number */

/* when user click on promo code start*/
    $(".promo-txt").click(function(){
        $(this).children(".promotext-copied").toggleClass("actv");

        $(this).children("input").select();
        document.execCommand('copy');

        setTimeout(function(){ $(".promotext-copied").removeClass("actv") }, 2000);

    });
 /* when user click on promo code end*/
	
	$(window).scroll(function(){

   /* scroll to top arrow component */     
	var	scrTop = $(window).scrollTop();
		
		if(scrTop >= 500 )
			{
				$('#scrollToTop').addClass('active');
				
			}
		else
			{
				$('#scrollToTop').removeClass('active');
			}
		
	});

	$('#scrollToTop').click(function(){
	
		if($(this).hasClass('active'))
			{
				$('html, body').animate({scrollTop: 0  }, 800);
			}
		 
		
	});
	/* scroll to top arrow component */ 
	
	
    /* chat window show or hide start*/
    $(".mobile-cta .chat-btn, #chat-btn").click(function(){
        $('<script type="text/javascript" src="/Scripts/OberoiHotels/plugin/zopim-plugin.js"></script>').insertAfter('.hotelChooseChildInfoWrap');
        setTimeout(function(){
            //$zopim.livechat.button.hide();
            $zopim.livechat.window.show();
        },50);
    });
    /* chat window show or hide  end*/
    

/* web Exclusive popup open in header */
	
	 $(".webExclusiveTriger a").on("click", function(ev) {
    	$(this).parent('.webExclusiveTriger').toggleClass('active');
		 ev.stopPropagation()
  });
  $(document).on("click", function(ev) {
    if ($(ev.target).is(".webExclusiveTriger, .webExclusivesPopup, .webExclusivesPopup input") === false) {
      $(".webExclusiveTriger").removeClass("active");
    }
  });
/* web Exclusive popup open in header */
    setTimeout(function () {
        if (IsMemberLoggedIn) {
            $(".webExclusiveSignIn").hide();
        }

        if ($(".webExclusiveSignIn").length > 0) {
            var winWidth = $(window).width();
            if (winWidth <= 991) {
                if (!(document.URL.toLowerCase().indexOf("/special-offers/unforgettable-holidays") != -1
                    || document.URL.toLowerCase().indexOf("/hotels-in-jaipur-rajvilas-resort/special-offers/unforgettable-holidays") != -1
                    || document.URL.toLowerCase().indexOf("/hotels-in-udaipur-udaivilas-resort/special-offers/unforgettable-holidays") != -1
                    || document.URL.toLowerCase().indexOf("/hotels-in-ranthambhore-vanyavilas-resort/special-offers/unforgettable-holidays") != -1)) {
                    $(".webExclusiveSignIn a").attr("href", "/web-exclusive-rate/");
                    $(".webExclusiveSignIn").removeClass("webExclusiveSignIn");
                }
            }
        }

    }, 100);

    $(".webExclusiveSignIn").click(function () {
        try {
            
            setTimeout(function () {
                $(".webExclusiveTriger a").trigger("click");
            }, 100);
          
        }
        catch (Exx) {/**/ }
    });

	
    $(".description-arrow-button").click(function(){
        $(this).children(".down-arrow").toggleClass("active");
        $(this).prev(".description-content").toggleClass("active");
    });

    if ($(".description-content").height() < 405){
        $(".description-arrow-button").hide();
    } else {
        $(".description-arrow-button").show();
    }

	/*login page back button start*/
	$("#bck-btn a").click(function() {
		$(".formForgotPassword").hide();
		$(".formLogin").show();
	});


	
	$(".wish-icon").click(function(){
	  $(this).find("i").toggleClass("fa-heart-o");
	  $(this).find("i").toggleClass("fa-heart");
	});
	
	
	
	$('.booking-engine .hotelList .list ul li').click(function(){
		var dembka = $(this).attr('data-embarkationname');
        if (dembka != undefined) {
            $('.booking-engine .checkInDate').addClass('dateDisabled');
            $('.booking-engine .checkOutDate').addClass('dateDisabled');
        }
        else {
            $('.booking-engine .checkInDate').removeClass('dateDisabled');
            $('.booking-engine .checkOutDate').removeClass('dateDisabled');
        }
		
		
	});
	$('.booking-engine.bkhOffset .hotelList .list ul li').click(function(){
		var dembk = $(this).attr('data-embarkationname');
		
        if (dembk != undefined) {
            if ($(window).width <= 990) {



            }
            else {
                fnShowCruisePopupScreen();
            }
        }
        else {

            $(".availability-cta .boxColumn").removeClass('bEnginepopUp');


        }
	});
	
    //marketing assets limited period offer for open
	$(".marketing-asset-offer-tab").click(function(){
     $(".marketing-asset-text").toggleClass("active");
    });

    //marketing assets limited period offer  for close btn

	$(".close-btn").click(function(){
     $(".marketing-asset-text").removeClass("active");
    });

	$(".mo-pop-up-close-btn").click(function(){
	  $(".mo-black-overlay").fadeOut();
    });
    
    if (window.location.href.toLocaleLowerCase().indexOf("/christmas-and-new-year") != -1) {
        $(".christmasBox, .christmasBoxWrapper").hide();
    }

    if (window.location.href.toLocaleLowerCase().indexOf("/hotels-in-mumbai/christmas-and-new-year") != -1) {
        $(".christmasOffers .offersTabWrapper .tab-2").hide();
        setTimeout(function(){
            $(".christmasOffers .offersTabWrapper .tab-1").click();
        },50)
        
        
    }
    
$(".omo-banner-slider").slick({
dots: false,
arrows: true,
infinite: false,
slidesToShow: 1,
slidesToScroll: 1,  
});



$(".covid-band.new-info-slides").slick({
dots: false,
arrows: true,
infinite: false,
slidesToShow: 1,
slidesToScroll: 1,  
});
    
   $(".awards-new-info-slides").slick({
dots: false,
arrows: true,
infinite: false,
slidesToShow: 1,
slidesToScroll: 1,  
});


$(".awards-band-box").click(function(){
        $(".awards-new-info-slides").addClass("active-label");
        $(".new-awards-box-wrapper .awards-wrapper-box .close-awards-band").fadeIn();
        $(".awards-update-info-wrapper").addClass("active-awards-info");
    });
 


$(".new-awards-box-wrapper .awards-wrapper-box .close-awards-band").click(function(){
    $(".awards-new-info-slides").removeClass("active-label");
    $(".awards-update-info-wrapper").removeClass("active-awards-info");
    $(this).fadeOut();
});


    

      $(".information-label").click(function(){
      var id = $(this).attr("id");  
     //$(".covid-update-info-wrapper").toggleClass("activeInfo");
     $("."+id).toggleClass("activeInfo");
     $(".covid-band").toggleClass("covid-band-active");
     });

     $(".covid-band.new-info-slides button.slick-prev.slick-arrow, .covid-band.new-info-slides button.slick-next.slick-arrow").click(function(){
    $(".covid-update-info-wrapper").removeClass("activeInfo");
    $(".covid-band").removeClass("covid-band-active");
    });    

    $(".close-info-btn").click(function(){
    $(".covid-update-info-wrapper").removeClass("activeInfo");
    })


  

    



    setTimeout(function () {
        //$(".covid-band").show();
        //$(".covid-update-info-wrapper").show();
        //$(".covid-update-info-wrapper").addClass("activeInfo");
        if (typeof glblCurrentPageHotelCode != "undefined") {
        //     if (glblCurrentPageHotelCode  != "HBAGROB" || glblCurrentPageHotelCode  == "") {
        //     $(".covid-band, .covid-update-info-wrapper").show();
        // }
    }
       if (typeof glblPageTemplate != "undefined") {
           if (glblPageTemplate == "home-page" || glblPageTemplate == "overview-details") {
            //$(".covid-band").show();
            //$(".covid-update-info-wrapper").show();
            if($(window).width() > 767 ){
            //$(".covid-update-info-wrapper").addClass("activeInfo");
            //$(".covid-band").addClass("covid-band-active");
            }
            //    if (glblBwIsMobile) {
                 
            //    }
           }
           }
   }, 100);

   if (window.location.href.toLocaleLowerCase().indexOf("/hotels-in-chandigarh-sukhvilas-resort/") != -1) {
    if($(window).width()>1025){
  $("header .header-right-unit .right-side-menu ul li.destination-link").html("<a href='/hotels-in-chandigarh-sukhvilas-resort/weddings/'>Weddings</a>");
    }
  if($(window).width()<1025){
    
  $("<li><a href='/hotels-in-chandigarh-sukhvilas-resort/weddings/'>Weddings</a></li>").insertBefore(".destination-link");
}
} 


if (window.location.href.toLocaleLowerCase().indexOf("/in-the-news/") != -1) {
    setTimeout(function(){
    $( '<span class="video-btn"><img src="/images/oberoihotels/play.png" alt="Play"></span>' ).appendTo( $(".InTheNewsPopupVideo") );
},200);
}  



	$('.banner-barrow').click(function(){
$("html, body").animate({ scrollTop: 450 });
});
	
});

function popupBookingEngineClose()
	{
		 $(".availability-cta .booking-engine").hide();
		$('body').css('overflow','inherit');
		 $(".availability-cta .boxColumn").removeClass('bEnginepopUp');
		  $('.bookingEnginePopOverlay').removeClass('active');
	}


function fnGetParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function fnGetParameterByNameFromUrl(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*Date format Example: YYYY-MM-DD */
function getDateDifference(from, to, dateformat) {
    var momentDays = 0;
    try {
        var momentFromDate = moment(from, dateformat);
        var momentEndDate = moment(to, dateformat);
        momentDays = momentEndDate.diff(momentFromDate, 'days');

    }
    catch (ex) {

    }

    return parseInt(momentDays);
}

/*Check whether date lies between the two dates.*/
function isValidDateForStay(from, to, check, dateformat) {
    var isvalidDate = false;

    try {

        var momentcheck = moment(check, dateformat); //Dateformat for moment
        var momentFromDate = moment(from, dateformat); //Dateformat for moment
        var momentToDate = moment(to, dateformat); //Dateformat for moment
        if (momentcheck >= momentFromDate && momentcheck <= momentToDate) {
            isvalidDate = true;
        }
        else {
            isvalidDate = false;
        }
    }

    catch (exx) {

    }

    return isvalidDate;
}



function strip_html_tags(str) {
    if ((str === null) || (str === ''))
        return "";
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

function fnShowAQInex(air_number, location) {
    if ($(".air-list").length > 0) {
        $(".air-list").append(TemplateAQIndex(air_number, location));
    }
}

function TemplateAQIndex(air_number, location) {
    var doubleAvailableSpace = 0;
    var doubleTotalSpacePer;
    var doubleAvailableSpaceDisplay = "";
    doubleAvailableSpace = parseInt(air_number);

    doubleAvailableSpaceDisplay = doubleAvailableSpace < 10 ? "0" + air_number : air_number;

    doubleTotalSpacePer = parseFloat(air_number / 100 * 100);

    var doubleTotalSpacePerDecremented = 100;
    if (air_number > 20) {
        doubleTotalSpacePerDecremented = 100 - doubleTotalSpacePer;
    }

    return "<li class='clearfix'> <span class='air-numbr'>" + doubleAvailableSpaceDisplay + "</span> <span class='air-location'>" + location + "</span> <div class='air-bg' style='background: #789300;background: -moz-linear-gradient(90deg, #37b44c " + doubleTotalSpacePerDecremented + "%, #789300 100%);background: -webkit-linear-gradient(90deg, #37b44c " + doubleTotalSpacePerDecremented + "%,#789300 100%); background: linear-gradient(90deg, #37b44c " + doubleTotalSpacePerDecremented + "%,#789300 100%); width: " + doubleTotalSpacePer + "%'></div> </li>";

}


function fnGetParameterByNameNew(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getNumber(s) {

    var numRegex = /\d+/g;
    s = s.toString();
    if (s != undefined || s != "undefined") {
        s.match(numRegex) ? s = parseInt(s.match(numRegex).join([])) : s = "";
    } else {
        s = "";
    }
    return s;
}


/*If array containg hotelcode then these hotels willwill be visible in booking widget else all*/
function showSpecificHotelsInBookingWidget(arrHotelsToShowInDropdown, defaultSelectedHotel) {

    console.log("showSpecificHotelsInBookingWidget arrHotelsToShowInDropdown" + arrHotelsToShowInDropdown);
    if (arrHotelsToShowInDropdown.length > 0) {

        /*Remove all hotel li tag that are not in array arrHotelsToShowInDropdown*/
        $('.booking-engine').each(function () {
            var data_index = $(this).attr("data-index");
            if ($('.booking-engine:eq(' + data_index + ')').length > 0) {
                $('.booking-engine:eq(' + data_index + ') .allHotels li').each(function () {
                    $(this).removeClass('active');
                    if (arrHotelsToShowInDropdown.indexOf($(this).attr('data-hotelcode')) == -1) {                        
                        $(this).remove();
                    }
                   
                });
            }
        });

    //    /*Remove all hotel ul tag that have no li tag*/
    //    $('.booking-engine').each(function () {
    //        var data_index = $(this).attr("data-index");
    //        if ($('.booking-engine:eq(' + data_index + ')').length > 0) {
    //            $('.booking-engine:eq(' + data_index + ') .allHotels ul').each(function () {
    //                if ($(this).html().trim() == "") {	
				//		  $(this).parents(".hotelList").parents(".allHotels").parents(".hotelListDropDown").addClass('singleHotelList');
    //                      $(this).parents(".hotelBlock").remove();					
    //                }
    //            });				
				
				//var hotelListCount = $('.booking-engine:eq(' + data_index + ') .allHotels ul li').length;
    //            if (hotelListCount == 1) {
    //                $('.hotelName').addClass('NoClick');
    //            }				
    //        }
    //    });
		
	

        /*Select hotel in dropdown*/
        setHotelSelectedByHotelCode(defaultSelectedHotel);
    }
}

var enumerateDateBetweenDates = function (startDate, endDate, datearray) {
    var dates = [];

    var currDate = moment(startDate, "YYYY-MM-DD").startOf('day');
    var lastDate = moment(endDate, "YYYY-MM-DD").startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
        // console.log(currDate.toDate());
        var tempDate = moment(currDate.clone().toDate()).format("YYYY-MM-DD");
        //console.log(datearray.length);
        if (datearray.length > 0) {


            if (datearray.indexOf(tempDate) == -1) {
                dates.push(tempDate);
            }

        } else {
            dates.push(tempDate);

        }

    }
    return dates;
};

var enumerateDateFromStartAndEndDate = function (startDate, endDate, datearrayToExclude) {

    var arr = [];
    var dt = new Date(startDate);
    while (dt <= new Date(endDate)) {
        if (datearrayToExclude.length > 0) {
            if (datearrayToExclude.indexOf(moment(new Date(dt)).clone().format("YYYY-MM-DD")) == -1) {
                arr.push(moment(new Date(dt)).clone().format("YYYY-MM-DD"));
            }
        }
        else {
            arr.push(moment(new Date(dt)).clone().format("YYYY-MM-DD"));
        }

        dt.setDate(dt.getDate() + 1);
    }
    return arr;
};


function getClosestWeek(start, end, arrValidWeeksNumber) {
    var vWeek = "";
    try {
       
        var dateArray = enumerateDateFromStartAndEndDate(start, end, 0);
        var arrWeehdays = ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        var arrValidWeeks = [];

        for (var i = 0; i < arrValidWeeksNumber.length; i++) {
            arrValidWeeks.push(arrWeehdays[arrValidWeeksNumber[i]]);
        }


        if (arrValidWeeks.length > 0) {
            for (var i = 0; i < dateArray.length; i++) {
                if (arrValidWeeks.indexOf(moment(dateArray[i]).clone().format('dddd').toLowerCase()) != -1) {
                    vWeek = moment(dateArray[i]).clone().format('YYYY-MM-DD');
                    break;
                }
            }
        }

    }
    catch (Exx) { }
    return vWeek;
}


function pageScrollTo(id)
{
    $('html,body').animate({
    scrollTop: $("#"+id).offset().top - 120
  }, 600);
}


/* Load more function that accepts 3 parameters such as
 * elementItem (id or class of selecter that are repearing),
 * shown (to show number of item on page load, load (show number of items after clicking load more))  */
function fnLazyLoadRecords(elementItem, shown, load) {
    try {
        var items = elementItem.length;
        $(elementItem.selector + ':lt(' + shown + ')').show();
        $('#loadMoreRecords').click(function () {
            shown = $(elementItem.selector + ':visible').size() + load;
            if (shown < items) { $(elementItem.selector + ':lt(' + shown + ')').show(); }
            else {
                $(elementItem.selector + ':lt(' + items + ')').show();
                $('#loadMoreRecords').hide();
            }
        });
    }
    catch (Exx) { }
}


/* get hotel title from from JSON data*/
function getHotelTitleByHotelCode(hotelcodetext) {
    var hoteltitle = "";
    try {
        for (var i = 0; i < arrHotelLatLongDetails.length; i++) {
            if (arrHotelLatLongDetails[i].hotelcode.toLowerCase() == hotelcodetext.toLowerCase()) {
                hoteltitle = arrHotelLatLongDetails[i].hoteltitle;
                break;
            }
        }
    }
    catch (Exx) { }
    return hoteltitle;

}

/* get hotel image from from JSON data*/
function getHotelImageByHotelCode(hotelcodetext) {
    var hoteltitle = "";
    try {
        for (var i = 0; i < arrHotelLatLongDetails.length; i++) {
            if (arrHotelLatLongDetails[i].hotelcode.toLowerCase() == hotelcodetext.toLowerCase()) {
                hoteltitle = arrHotelLatLongDetails[i].image;
                break;
            }
        }
    }
    catch (Exx) { }
    return hoteltitle;

}

function sumArray(arrString, separater) {
    var arr = arrString.split(separater);
    var sum = 0;
    try {
        for (var i = 0; i < arr.length; i++) {
            sum += parseInt(arr[i]);
        }
    }
    catch (Exx) {
    }

    return sum;
}


/* Get closet available date from array of Dates */
function getClosetDate(datearray) {
    var now = new Date();
    var closest = new Date(moment(defaultEnddateRP).clone().add(1, "days").format("YYYY-MM-DD"));

    datearray.forEach(function (d) {
        var date = new Date(moment(d, "YYYY-MM-DD").format("M/D/YYYY"));
        if (date >= now && date < closest) {
            closest = d;
        }
    });

    return closest;
}

/* Get closet available date from array of Dates */
function getClosetDateByDate(datearray, inputdate) {
    var now = new Date(inputdate);
    var closest = new Date(moment(defaultEndDate).clone().add(1, "days").format("YYYY-MM-DD"));
    var counter = 0;
    datearray.forEach(function (d) {
        var isDateFound = false;
        var date = new Date(d);
        if (date >= now && date <= closest) { 
            counter++;
            closest = d;
            
        }
    });
    
    return closest;
}

function createCookieByDate(cookiname, cookivalue, cookieexpirydate) {   
   
    expires = "; expires=" + moment.utc(moment(cookieexpirydate, "YYYY-MM-DD").format("YYYY-MM-DD")).toString();   
    document.cookie = cookiname + "=" + cookivalue + expires + "; path=/";
}
function openSignInWidget() {
    try {
       
        setTimeout(function () {
            $(".webExclusiveTriger a").trigger("click");
        }, 100);

    }
    catch (Exx) {/**/ }
}

function fnOpenBookingWidgetByRoomType(hotelCode, hotelTypeCode) {
    var pageType = "";
    if (typeof $(".pageType").val() != "undefined") {
        pageType = $(".pageType").val();

        if (pageType == "room-and-suits-listing") {
            if (hotelCode != "" && hotelTypeCode != "") {
                fnSetHotelSoldOutDatesForSpecificRoom(hotelCode, hotelTypeCode);
            }

        }

    }
    openBookingEngine();
}
/* exotic vacation page js*/
	

function fnOpenBookingEngineByHotelCode(_hotelCode) {
    if (typeof fnBwSetupBookingWidget != "undefined") {
        fnBwSetupBookingWidget(_hotelCode);
        openBookingEngine();
    }
}

$("<div class='best-rate-guarantee-link'><a href='/best-rate-guarantee/' target='_blank'><img src='https://www.oberoihotels.com/images/best-rate-guaranteed-icon2.png?v=5'> <span>BEST RATE GUARANTEE </span> </a></div>").insertAfter(".booking-engine .c-main-wrap");

 

 


$(".wellness-pop-up-Bg .close-btn-wellness-pop-up").click(function () {
    $(".error-msg-wellness-form").html("");
    $("#data-photo-comp-comp-spa").find("input").val("");
    $("#data-photo-comp-comp-spa").find("select").val("Select");
    $(".black-overlay-wellness-pop-up").fadeOut();
    $(".wellness-pop-up-main-wrapper").fadeOut();
});


$(".black-overlay-wellness-pop-up").click(function () {
    $(this).fadeOut();
    $(".wellness-pop-up-main-wrapper").fadeOut();
});


$(".wellnes-book-now-button").click(function () {
    $(".black-overlay-wellness-pop-up").fadeIn();
    $(".wellness-pop-up-main-wrapper").fadeIn();
});

$(document).ready(function() {
    if (window.location.href.toLocaleLowerCase().indexOf("/hotels-in-agra-amarvilas-resort/") != -1 || window.location.href.toLocaleLowerCase().indexOf("/hotels-in-kolkata/") != -1) {
      setTimeout(function(){
    $(".safety-hygeine-box-default").click();
},20);
}
    $("<li>Others</li>").insertAfter($(".footer-container .column:nth-child(2) ul li:nth-child(4)"));
    $(".fx-hight-int-hotels").mCustomScrollbar();
});

 $(".christmasBandIcon").click(function(){
        $(".christmasOfferCopyWrapper").addClass("activeOffer");
    });

    $(".christmasOfferCopyWrapper .close-cny-pop-up").click(function(){
        $(".christmasOfferCopyWrapper").removeClass("activeOffer");
    });

if (window.location.href.toLocaleLowerCase().indexOf("/hotels-in-bengaluru/") != -1 || window.location.href.toLocaleLowerCase().indexOf("/india/bengaluru/") != -1 || window.location.href.toLocaleLowerCase().indexOf("/hotels-in-jaipur-rajvilas-resort/") != -1 || window.location.href.toLocaleLowerCase().indexOf("/global-wellness-day/") != -1 || window.location.href.toLocaleLowerCase().indexOf("/hotels-in-al-zorah-ajman/") != -1) {
    $('.close-covid-band').hide();
    $('.safety-hygeine-box-default').hide();
    $('.covid-band').hide();
} 

var urlPath = "";
let paramUrl = (new URL(document.location)).pathname;
urlPath = paramUrl;
if (urlPath.toLowerCase().match("/hotels-in-al-zorah-ajman/")) {
    $('.close-covid-band').hide();
    $('.safety-hygeine-box-default').hide();
    $('.covid-band').hide();
}
else {
    $('.close-covid-band').hide();
    $('.safety-hygeine-box-default').hide();
    $('.covid-band').hide();
    $('.close-covid-band').hide();
    $('.covid-band-main-wrapper-box').hide();
    setTimeout(function () {
        $('.close-covid-band').hide();
        $('.covid-band-main-wrapper-box').hide();
    }, 1000);
}

$(".cookie-buttons-wrapper .button-box-1").click(function () {
        $(".cookie-black-popup-overlay, .cookie-settings-wrapper").show();
    });
    $(".cookie-settings-wrapper .close-settings").click(function () {
        $(".cookie-black-popup-overlay , .cookie-settings-wrapper").hide();
    });

 

    $(window).scroll(function () {
        // if ($(window).scroll(20)) {
        //     // $(".cookie-box-wrapper").show();
        // }
    });

 

    $("#acceptcookie").click(function () {
        $('.cookie-box-wrapper').hide();
        createCookie("cookieacceptclose", "yes");
    });
    $(".cookies-submit-request").click(function () {
        $('.cookie-box-wrapper').hide();
        createCookie("cookieacceptclose", "yes");
    });
    $(".button-box-2").click(function () {
        $('.cookie-box-wrapper').hide();
        createCookie("cookieacceptclose", "yes");
    });

    $(document).ready(function () {
        setTimeout(function () {
        $('.cookie-box-wrapper').hide();
        var acceptcookieid = readCookie("cookieacceptclose");
        if (acceptcookieid == "yes") {
            $('.cookie-box-wrapper').hide();
        }
            else { $('.cookie-box-wrapper').show(); }
        }, 100);
    });
$(".close-cny-pop-up").click(function () {
    createCookie("cookiechrisacceptclose", "yes", "365");

});
$(".christmasBandIcon").click(function () {
    deleteCookie("cookiechrisacceptclose");
    var acceptcookiechrisids = readCookie("cookiechrisacceptclose");
    if (acceptcookiechrisids == "yes") {
        $('.christmasOfferCopy').hide();
        $('.close-cny-pop-up').hide();
    }
    else { $('.christmasOfferCopy').show(); $('.close-cny-pop-up').show(); }
});

$(document).ready(function () {
    $('.christmasOfferCopy').hide();
    var acceptcookiechrisid = readCookie("cookiechrisacceptclose");
    if (acceptcookiechrisid == "yes") {
        $('.christmasOfferCopy').hide();
        $('.close-cny-pop-up').hide();
    }
    else { $('.christmasOfferCopy').show(); $('.close-cny-pop-up').show(); }
});