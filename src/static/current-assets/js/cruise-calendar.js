var calenderYear = ["2022", "2023", "2024"];//store calender year array
var currentYear = moment().format("YYYY");//store current year
var todayDate = moment().format('DD/MMM/YYYY');//store today date
var isCruiseCalanderInitialised = false;
var dynamicCruiseCalendarData = "";
var tempCARRAY;

var cruiseParentClass = ".booking-engine";
if(document.location.href.indexOf("/oberoi-one") != -1 ){
    cruiseParentClass =  ".booking-engine-oberoi-one";

    $(".dashboard .offer-book-now-btn a.style2 ").click(function(){
        cruiseParentClass =  ".booking-engine";
    });
}



/*function for bind calender year*/
function fnBindYears() {
    var html = "";
    fnRemoveBlankColumns(calenderYear[indexOfYearToInitialise]);
    html = "<li  class= 'c-current-year' class='actv " + "year" + "-" + calenderYear[indexOfYearToInitialise] + "'>" + calenderYear[indexOfYearToInitialise] + "</li>";
    $(cruiseParentClass+" .c-year-list").html(html);
}

function disableNextPrevIfNoDateAvailable(year) {

    var nextYear = moment(year, "YYYY").clone().add(1, "y").format("YYYY");
    var prevYear = moment(year, "YYYY").clone().add(-1, "y").format("YYYY");

    $(cruiseParentClass+" .c-prv").removeClass("c-btn-deactive");
    $(cruiseParentClass+" .c-nxt").removeClass("c-btn-deactive");

    if (calenderYear.indexOf(prevYear) == -1) {
        $(cruiseParentClass+" .c-prv").addClass("c-btn-deactive");
    }

    if (calenderYear.indexOf(nextYear) == -1) {
        $(cruiseParentClass+" .c-nxt").addClass("c-btn-deactive");
    }
}

/* Set Zahra Philae Nights header such as Four Nights, Five Nights etc */
function fnSetCruiseHeader(hotelCode) {
    var htmlLuxorHeading = "";
    var htmlAswanHeading = "";
    $(cruiseParentClass+" .c-colmn-heading-luxor").html("");
    $(cruiseParentClass+" .c-colmn-heading-aswan").html("");

    /*Get Word from Number */
    var arrNumberToWord = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

    for (var i = 0; i < cruiseCalendarSettings.length; i++) {

        if (cruiseCalendarSettings[i].hotelCode == hotelCode) {
            for (var j = 0; j < cruiseCalendarSettings[i].settings.showLuxorNights.length; j++) {
                htmlLuxorHeading += "<div class='c-offer-night-col n44 c-col-night-heading col-luxor-" + j + "' data-column='luxor-" + j + "'><span class='c-col-txt'>" + arrNumberToWord[cruiseCalendarSettings[i].settings.showLuxorNights[j]] + "</span></div>";
            }

        }

        if (cruiseCalendarSettings[i].hotelCode == hotelCode) {
            for (var j = 0; j < cruiseCalendarSettings[i].settings.showAswanNights.length; j++) {
                htmlAswanHeading += "<div class='c-offer-night-col n44 c-col-night-heading col-aswan-" + j + "' data-column='aswan-" + j + "'><span class='c-col-txt'>" + arrNumberToWord[cruiseCalendarSettings[i].settings.showAswanNights[j]] + "</span></div>";
            }

        }
    }

    $(cruiseParentClass+" .c-colmn-heading-luxor").html(htmlLuxorHeading);
    $(cruiseParentClass+" .c-colmn-heading-aswan").html(htmlAswanHeading);
}

//create calender structure function
function fnCreateCruiseCalenderStructure(hotelCode) {
    $(cruiseParentClass+" .dynamic-cruise-calendar-data").html("");
    $(cruiseParentClass+" .c-colmn-heading-luxor").html("");
    $(cruiseParentClass+" .c-colmn-heading-aswan").html("");
    $(cruiseParentClass+" .c-prv").addClass("c-btn-deactive");

    //Temporary added on 03-01-2020
    //$(cruiseParentClass+" .c-nxt").addClass("c-btn-deactive");

    //Temporary comented on 03-01-2020
    $(cruiseParentClass+" .c-nxt").removeClass("c-btn-deactive");

    var data = "";
    indexOfYearToInitialise = 0;
    fnSetCruiseHeader(hotelCode);

    if (calenderYear.indexOf(moment().format("YYYY")) != -1) {
        indexOfYearToInitialise = calenderYear.indexOf(moment().format("YYYY"));
    }

    var pageSailingDateTab = "";
    for (var i = indexOfYearToInitialise; i < calenderYear.length; i++) {

        pageSailingDateTab += "<li data-itnermaintab = '" + calenderYear[i] + "'>" + calenderYear[i] + "</li>";


        for (var month = 1; month <= 12; month++) {
            data += '<div class="c-row  ' + 'row' + '-' + calenderYear[i] + '" data-id="' + month + '-' + calenderYear[i] + '">';
            data += '<div class="c-col c-month-col"><span class="c-col-txt">' + moment(month, "MM").clone().format("MMMM") + '</span></div>';
            data += '<div class="c-col c-offer-col">';
            data += '<div class="c-date-row">';


            for (var j = 0; j < cruiseCalendarSettings.length; j++) {

                if (cruiseCalendarSettings[j].hotelCode == hotelCode) {
                    for (var k = 0; k < cruiseCalendarSettings[j].settings.showLuxorNights.length; k++) {

                        data += '<div class="c-date-col-2 col-luxor-' + k + '"  data-column="luxor-' + k + '">';
                        data += fnPrintArrayDates(fnGetCruiseEmbarkationDateArray(hotelCode, "LUXOR", cruiseCalendarSettings[j].settings.showLuxorNights[k]), calenderYear[i], month, "LUXOR", cruiseCalendarSettings[j].settings.showLuxorNights[k]);
                        data += '</div>';
                    }
                }
            }

            data += '</div>';
            data += '</div>';
            data += '<div class="c-col c-offer-col">';
            data += '<div class="c-date-row">';

            for (var j = 0; j < cruiseCalendarSettings.length; j++) {

                if (cruiseCalendarSettings[j].hotelCode == hotelCode) {
                    for (var k = 0; k < cruiseCalendarSettings[j].settings.showAswanNights.length; k++) {

                        data += '<div class="c-date-col-2 col-aswan-' + k + '"  data-column="aswan-' + k + '">';
                        data += fnPrintArrayDates(fnGetCruiseEmbarkationDateArray(hotelCode, "aswan", cruiseCalendarSettings[j].settings.showAswanNights[k]), calenderYear[i], month, "ASWAN", cruiseCalendarSettings[j].settings.showAswanNights[k]);
                        data += '</div>';
                    }
                }
            }

            data += '</div>';
            data += '</div>';
            data += '</div>';
            data += '</div>';

        }




        $(cruiseParentClass+" .dynamic-cruise-calendar-data").html(data);
        fnPrintBlankDate();
    }

    if (!isCruiseCalanderInitialised) {
        $(".itiner-main-tabs").html(pageSailingDateTab);
        $(".itiner-main-tabs li:eq(0)").addClass("active");

    }



    fnHighlightDate();
    fnDisablePastDate();
    fnBindYears();
    fnChangeYear();


    /*Copy all cruise calendar to page sailing dates*/
    if (!isCruiseCalanderInitialised) {
        setTimeout(function () {
            dynamicCruiseCalendarData = $(cruiseParentClass+" .c-main-container").html();
            $('.pageCruseDates .c-main-container').html(dynamicCruiseCalendarData);
            bindItinerMainContentEvents();
        }, 1000);
    }

    isCruiseCalanderInitialised = true;
}

//code for loop diffrent array and print its date in html tag start here
function fnPrintArrayDates(objArray, year, month, embarkation, nights) {
    var dateData = "";

    var cruiseSoldOutDate = "";
    var hotelofferingid = glblBwConfiguration.hotelCode + "-" + embarkation + "-" + nights;
    console.log(hotelofferingid);
    var tempArray = fnBwCruiseCalendarSoldOutDates(hotelofferingid);
    console.log(tempArray);


    for (var i = 0; i < objArray.length; i++) {

        cruiseSoldOutDate = "";
        var date = objArray[i].split('-');
        if (date[0] == year && date[1] == month) {
            // debugger;

            var stringDateYYYYMMDD = date[0] + "-" + date[1] + "-" + date[2];
            if (tempArray.length > 0) {

                var tempSoldOutDate = tempArray.filter(function (item) {
                    return item.date == stringDateYYYYMMDD && item.restrictionType.toLowerCase() == "close";
                });


                if (tempSoldOutDate.length > 0 && moment(stringDateYYYYMMDD)._d >= moment()._d) {
                    cruiseSoldOutDate = "cruiseSoldOutDate";
                }
                else {
                    cruiseSoldOutDate = "";
                }
            }

          //  console.log(cruiseSoldOutDate + "cruiseSoldOutDate=hotelofferingid=" + hotelofferingid + stringDateYYYYMMDD);

            dateData += '<span class="c-date ' + cruiseSoldOutDate + '" data-embarkation= "' + embarkation + '" data-nights = "' + nights + '" data-id="' + stringDateYYYYMMDD + '" data-date="' + stringDateYYYYMMDD + '">' + moment(objArray[i], "YYYY-MM-DD").format("D") + '</span>';
        }

    }

    return dateData;
}

//code for print blank dates if date is not avaliable in array
function fnPrintBlankDate() {
    $(".dynamic-cruise-calendar-data .c-date-col-2").each(function () {
        if ($(this).html() == "") {
            $(this).html("<img src='/images/OberoiHotels/booking-engine/blank-date-line.png'>");
        }
    });
}


//function date higlights on click
function fnHighlightDate() {
    $(cruiseParentClass+" .c-date").unbind();
    $(cruiseParentClass+" .c-date").click(function () {
        fnHighlightSelectedDate($(this));
    });
}

function fnHighlightSelectedDate(thisSelector) {

    fnHighlightDateOnInitialize($(thisSelector).data("embarkation"), $(thisSelector).data("date"), $(thisSelector).data("nights"));
}

//function date higlight date on Initialize
function fnHighlightDateOnInitialize(embarkation, date, nights) {
    $(".c-date").removeClass("dateSelected");
    $(".checkInCheckOut").removeClass("cruiseCalenderDefaultScreen");

    $(".selectedEmbarkationDtls").hide();
    $(".availability-cta .booking-engine.layout2.left .checkInCheckOut .datesWrap").hide();
    $(".dynamic-cruise-calendar-data [data-date]").each(function () {
        
        if ($(this).data("embarkation") == embarkation
            && $(this).data("date") == date
            && $(this).data("nights") == nights) {

            var embarkationSelected = "";
            $(this).addClass("dateSelected");
            embarkationSelected = $(this).data("embarkation");
            embarkationSelected = embarkationSelected.toLowerCase();
            embarkationSelected = embarkationSelected.charAt(0).toUpperCase() + embarkationSelected.slice(1);
            $(".selectedEmbarCruiseName").html(embarkationSelected);
            $(".selectedEmbarkationDate").html("0" + $(this).data("nights"));
            $(".selectedEmbarkationDtls").show();


            fnShowHideSailingDatesTabContent(moment(date, "YYYY-MM-DD").format("YYYY"));
        }
        $(".availability-cta .booking-engine.layout2.left .checkInCheckOut .datesWrap").show();
    });

    var _hotelcdoe = $(cruiseParentClass+":eq(0) [data-hotelcode].active").data("hotelcode");
    setCalanderValuesCruise(embarkation, date, nights, _hotelcdoe);
    //  fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();
    //fnDisplayDynamicMessageInCalendar(_hotelcdoe);

}

//code for disable past date
function fnDisablePastDate() {
    $(".dynamic-cruise-calendar-data [data-date]").each(function () {
        var dataDate = moment($(this).attr("data-date"), "YYYY-MM-DD");
        if (dataDate < moment()) {
            $(this).addClass("disabledDate");
        }
    });
}


//code for disable past date
function fnBwMarkSoldOutDates(hotel, embarkation, date) {
    $(".dynamic-cruise-calendar-data [data-date]").each(function () {
        var dataDate = moment($(this).attr("data-date"), "YYYY-MM-DD");
        if (dataDate < moment()) {
            $(this).addClass("disabledDate");
        }
    });
}


$(document).ready(function () {
    //show hide calender code
    $(".c-done-btn-mob").click(function () {
        $(cruiseParentClass+" .c-main-wrap").hide();
    });

    $('html').click(function () {
        $(cruiseParentClass+" .c-main-wrap").hide();
    });
    $(cruiseParentClass+".layout2 .selectEmbarkationBox").click(function (event) {
        event.stopPropagation();
    });

    $(".selectEmbarkationDate").click(function () {
     
        var _currIndex = $(this).closest(cruiseParentClass).attr('data-index');
        setTimeout(function(){
        $(cruiseParentClass+":eq(" + _currIndex + ") .c-main-wrap").show();
        $(".booking-engine-oberoi-one .c-main-wrap").show();
            console.log("selectEmbarkationDate clicked");
            $(cruiseParentClass + " .dynamic-cruise-calendar-data .c-row.row-" + $(".c-current-year").html()).css("display", "flex");

    },20);
    });


    /*------------cruise popup addClass code for small desktop resolution only start here-------------*/

    $(".availability-cta .bEnginepopUp .layout2cruiseParentClass").on('click', function () {
        $(".boxColumn.bEnginepopUp").removeClass("cruiseEmbarkationDatePopUP");
        $(".bookingEnginePopOverlay .close").removeClass("cruiseEmbrClose");
    });

    $(".selectEmbarkationDate").on('click', function () {
        $(".boxColumn.bEnginepopUp").addClass("cruiseEmbarkationDatePopUP");
        $(".bookingEnginePopOverlay .close").addClass("cruiseEmbrClose");
    });

    $(".bEnginepopUp cruiseParentClass.layout2 .hotelName, .c-main-wrap .yearWrap, .c-main-wrap .c-col").on('click', function () {
        event.stopPropagation();
    });

    $(".dynamic-cruise-calendar-data").on("click", ".c-col", function () {
        event.stopPropagation();
    })



    /*------------cruise popup addClass code for small desktop resolution only end here-------------*/


    setTimeout(function () {
        bindClickEventItinerMainTabs();
    }, 10);
	
	 
    
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if(isiPad){
      $('html').addClass("ipad");
    }
	
});



/*code for change year on clicking on next and previous year arrow start here*/
function fnChangeYear() {

    $(cruiseParentClass+" .c-next-prev").unbind("click");
    $(cruiseParentClass+" .c-next-prev").click(function () {

        var isNext = false;
        if ($(this).attr("id") == "c-nxt") {
            isNext = true;
        }
        else {
            isNext = false;
        }

        var nextYear = moment($(cruiseParentClass+" .c-current-year").html(), "YYYY").clone().add(1, "y").format("YYYY");
        var prevYear = moment($(cruiseParentClass+" .c-current-year").html(), "YYYY").clone().add(-1, "y").format("YYYY");

        if (isNext) {

            if (calenderYear.indexOf(nextYear) != -1) {
                $(cruiseParentClass+" .c-current-year").html(nextYear);
            }
            fnRemoveBlankColumns(nextYear);

        }
        else {
            if (calenderYear.indexOf(prevYear) != -1) {
                $(cruiseParentClass+" .c-current-year").html(prevYear);
            }
            fnRemoveBlankColumns(prevYear);
        }
        disableNextPrevIfNoDateAvailable($(cruiseParentClass+" .c-current-year").html());

        $(cruiseParentClass+" .dynamic-cruise-calendar-data .c-row").hide();
        $(cruiseParentClass+" .dynamic-cruise-calendar-data .c-row.row-" + $(".c-current-year").html()).css("display", "flex");

        fnShowHideSailingDatesTabContent(moment($(".c-current-year").html(), "YYYY-MM-DD").format("YYYY"));


    });

    bindClickEventItinerMainTabs();
}

function fnShowHideSailingDatesTabContent(itnerTabId) {

    //console.log(itnerTabId + "--" + hotelcode + "--" + document.location.href);
    if ((document.location.href.indexOf("/nile-cruise-philae/sailing-dates") != -1 && glblBwConfiguration.hotelCode == "HBASWPH")
        || (document.location.href.indexOf("/nile-cruise-zahra/sailing-dates") != -1 && glblBwConfiguration.hotelCode == "HBASWZA")) {

        $(".itiner-main-tabs li").each(function () {
            $(this).removeClass("active");
            $(".itineraries-tab-section .dynamic-cruise-calendar-data .c-row.row-" + $(this).data("itnermaintab")).hide();
            if (moment($(this).data("itnermaintab"), "YYYY-MM-DD").format("YYYY") == itnerTabId) {
                $(this).addClass("active");
            }
        });


        $(".itineraries-tab-section .dynamic-cruise-calendar-data .c-row.row-" + itnerTabId).css("display", "flex");
        $(this).addClass("active");
        fnRemoveBlankColumnsFromTabs(itnerTabId);

    }


}

function bindClickEventItinerMainTabs() {
    $(".itiner-main-tabs li").unbind("click");
    $(".itiner-main-tabs li").click(function () {

        bindItinerMainContentEvents();

        //if (document.location.href.indexOf("/nile-cruise-zahra/sailing-dates") != -1) {
        //    hotelcode = "HBASWZA";
        //}
        //else if (document.location.href.indexOf("/nile-cruise-philae/sailing-dates") != -1) {
        //    hotelcode = "HBASWPH";
        //}

        setHotelSelectedByHotelCode(glblBwConfiguration.hotelCode);

        fnShowHideSailingDatesTabContent($(this).data("itnermaintab"));
    });

    bindItinerMainContentEvents();
    fnRemoveBlankColumnsFromTabs($("[data-itnermaintab].active").data("itnermaintab"));
}



/*Philae and Zahra Calander Code Section Start*/
/*Philae and Zahra Cruise Calander Structure Settings*/
var cruiseCalendarSettings = [{
    hotelCode: "HBASWPH",
    settings: {
        showLuxorNights: [4, 6],
        showAswanNights: [4, 6],
        selectDefaultEmbarkation: "LUXOR",
        selectDefaultNight: 4,
        startDate: "2022-01-01",
        endDate: "2024-12-31"
    }
},
{
    hotelCode: "HBASWZA",
    settings: {
        showLuxorNights: [4, 5, 7],
        showAswanNights: [3, 5, 7],
        selectDefaultEmbarkation: "LUXOR",
        selectDefaultNight: 5,
        startDate: "2022-01-01",
        endDate: "2024-12-31"
    }
}];


function showAndSetCruiseCalander(hotelCode) {
    $(cruiseParentClass+" .c-main-wrap").show();
    fnCreateCruiseCalenderStructure(hotelCode);
}

/*Date selected from table provided in pages such as Sailing Dates*/
function bindItinerMainContentEvents() {
    var _hotelcode = $(cruiseParentClass+":eq(0) [data-hotelcode].active").data("hotelcode");
    $(".pageCruseDates .c-date").unbind();
    $(".pageCruseDates .c-date").click(function () {

        var checkinDateSelected = $(this).data("date");
        var embarkationSelected = $(this).data("embarkation");
        var cruiseNightsSelected = $(this).data("nights");
        var objThis = $(this).data("nights");

        /*Check if selected Date is not past Date*/
        if (moment(checkinDateSelected, "YYYY-MM-DD").format("YYYY-MM-DD") >= moment().clone().format("YYYY-MM-DD")) {

            if (document.location.href.indexOf("/nile-cruise-zahra/sailing-dates") != -1) {
                _hotelcode = "HBASWZA";
            }
            else if (document.location.href.indexOf("/nile-cruise-philae/sailing-dates") != -1) {
                _hotelcode = "HBASWPH";
            }

            if (_hotelcode == "HBASWZA" || _hotelcode == "HBASWPH") {
                fnBwSetHotelSelectedByHotelCode(_hotelcode);
                fnInitializeCruiseCalander(_hotelcode);
                setCalanderValuesCruise(embarkationSelected, checkinDateSelected, cruiseNightsSelected, _hotelcode);
                fnHighlightDateOnInitialize(embarkationSelected, checkinDateSelected, cruiseNightsSelected);
                fnShowCalendarSectionOfSelectedDate(checkinDateSelected);
                $(".table-wrap span").removeClass("active");
                // $(this).addClass("active");

                openBookingEngine();
            }
        }


        fnShowHideSailingDatesTabContent(moment(checkinDateSelected, "YYYY-MM-DD").format("YYYY"));

    });

}


/*Show cruise calander section based on year. This piece of code is for pages such as Sailing Dates.
 get the Year from the Date and decriment year by 1 and set as text or HTML on class ".c-current-year"
 Now triggre the class ".c-nxt.c-next-prev" 
 This click works based on year availabe oas a text on class ".c-current-year"
 */
function fnShowCalendarSectionOfSelectedDate(checkinDateSelected) {

    var checkinYearSelected = moment(checkinDateSelected, "YYYY-MM-DD").add(-1, "year").format("YYYY");
    $(cruiseParentClass+" .c-current-year").html(checkinYearSelected);
    $(cruiseParentClass+" .c-nxt.c-next-prev").click();
}

/*TSets the selected Date in t-datpicker calendar */
function setCalanderValuesCruise(embarkationSelected, checkinDateSelected, cruiseNightsSelected, hotelSelected) {
    $(cruiseParentClass+" .offerMsgWrap").html("");
    $(cruiseParentClass+" .offerMsgWrap").hide();
    checkinDateSelected = moment(checkinDateSelected, "YYYY-MM-DD", true);
    var setStartDate = getCruiseSettingValueByKey(hotelSelected.split(";")[0], "startDate");
    var setEndDate = getCruiseSettingValueByKey(hotelSelected.split(";")[0], "endDate");

    /*Validate whether Date is in required format or not*/
    if (checkinDateSelected.isValid()) {

        /* Set Checking Date And Checkout Date*/
        setTimeout(function () {

            $(cruiseParentClass+" .t-datepicker").tDatePicker('setStartDate', moment(checkinDateSelected).clone().format("YYYY-MM-DD"));
            $(cruiseParentClass+" .t-datepicker").tDatePicker('setEndDate', setEndDate);
            $(cruiseParentClass+" .t-datepicker").tDatePicker('updateCI', moment(checkinDateSelected).clone().format("YYYY-MM-DD"));
            $(cruiseParentClass+" .t-datepicker").tDatePicker('updateCO', moment(checkinDateSelected).clone().add(cruiseNightsSelected, 'days').format("YYYY-MM-DD"));

        }, 10);
        $(cruiseParentClass+" .c-main-wrap").hide();
    }
}

function fnGetCruiseEmbarkationDateArray(hotelCode, embarkation, nights) {

    var datesToEnableInCalander = [];   

    if (hotelCode != "" && embarkation != "" & nights != "") {
        var tempArray = jsonPhilaeZahra.filter(function (item) {
            return item.hotelCode.toLowerCase() == hotelCode.toLowerCase() && item.embarkation.toLowerCase() == embarkation.toLowerCase() && item.nights == nights;
        })[0];

        if (typeof tempArray != "undefined") {
            datesToEnableInCalander = tempArray.date;
        }
    }

    if (datesToEnableInCalander.length > 0) {
        return datesToEnableInCalander.sort();
    }
    else {
        return datesToEnableInCalander;
    }
}

function getCruiseSettingValueByKey(hotelCode, keyName) {
    var keyValue = "";

    for (var i = 0; i < cruiseCalendarSettings.length; i++) {
        if (cruiseCalendarSettings[i].hotelCode == hotelCode) {
            if (keyName == "startDate") {
                keyValue = cruiseCalendarSettings[i].settings.startDate;
            }
            else if (keyName == "endDate") {
                keyValue = cruiseCalendarSettings[i].settings.endDate;
            }
            else if (keyName == "selectDefaultEmbarkation") {
                keyValue = cruiseCalendarSettings[i].settings.selectDefaultEmbarkation;
            }
            else if (keyName == "selectDefaultNight") {
                keyValue = cruiseCalendarSettings[i].settings.selectDefaultNight;
            }
            break;
        }
    }

    return keyValue;
}

function fnInitializeCruiseCalander(_hotelcode) {

    /*Global Variables startdate, enddate, minnights,dateEnabled, dateDisabled, */

    var dateEnabled = [];
    var dateDisabled = [];

    if ($(cruiseParentClass+" .selectedEmbarkationDtls").css('display') == "none") {
        $(".checkInCheckOut").addClass("cruiseCalenderDefaultScreen cruiseSelected");
    }

    $(cruiseParentClass+".bkhOffset .checkInCheckOut").attr("onClick", "fnBwShowCruisePopupScreen()");
    $(cruiseParentClass+".bkhOffset .checkInDate").css("pointer-events", "none");
    $(cruiseParentClass+".layout2 .selectEmbarkationBox").show();

    var startdate = getCruiseSettingValueByKey(_hotelcode, "startDate");
    var enddate = getCruiseSettingValueByKey(_hotelcode, "endDate");

    var selectDefaultEmbarkation = getCruiseSettingValueByKey(_hotelcode, "selectDefaultEmbarkation");
    var selectDefaultNight = getCruiseSettingValueByKey(_hotelcode, "selectDefaultNight");

    /*get enable dates*/
    dateEnabled = fnGetCruiseEmbarkationDateArray(_hotelcode, selectDefaultEmbarkation, selectDefaultNight);
    var minnights = selectDefaultNight;

    /*get disabled dates*/
    dateDisabled = enumerateDateFromStartAndEndDate(startdate, enddate, dateEnabled);


    var hotelofferingid = _hotelcode + "-" + selectDefaultEmbarkation + "-" + minnights;

    /*get dates based on hotelofferingid*/
    var tempArray = fnBwCruiseCalendarSoldOutDates(hotelofferingid);

    tempCARRAY = tempArray;

    /*get current available date*/
    var closetdate = getClosetDate(dateEnabled, "YYYY-MM-DD");

    var initialDate = "";
    var tempAvailableDates = [];

    /*Check whether closetdate is sold out date or not. If not then get next available date*/
    var tempSoldOutDate = tempArray.filter(function (item) {
        if (moment(moment(item.date)).isSameOrAfter(closetdate, 'day') && item.restrictionType.toLowerCase() != "close") {
            tempAvailableDates.push(item.date);
        }
    });

    if (tempAvailableDates.length > 0) {
        initialDate = tempAvailableDates[0];
    }
    else {
        initialDate = closetdate;
    }

    if (closetdate != Infinity) {
        calNums = 2;
        var tdate = moment(initialDate, "YYYY-MM-DD").clone().add(minnights, 'days').format("YYYY-MM-DD");
        $(cruiseParentClass+" .t-datepicker").tDatePicker('setStartDate', initialDate);
        $(cruiseParentClass+" .t-datepicker").tDatePicker('setEndDate', enddate);
        //$(cruiseParentClass+" .t-datepicker").tDatePicker('updateCI', initialDate);
        //$(cruiseParentClass+" .t-datepicker").tDatePicker('updateCO', tdate);

        $(cruiseParentClass+" .t-datepicker").tDatePicker('updateCI', '');
        $(cruiseParentClass+" .t-datepicker").tDatePicker('updateCO', '');

        fnCreateCruiseCalenderStructure(_hotelcode);

        //  fnHighlightDateOnInitialize(selectDefaultEmbarkation, closetdate, minnights);
    }
}

function fnRemoveBlankColumns(yearToCheck) {

    $(cruiseParentClass+" .c-col-night-heading").show();

    var arrEmbarkations = ["luxor", "aswan"];
    for (var embarkationIndex = 0; embarkationIndex < arrEmbarkations.length; embarkationIndex++) {
        for (var maxDaesInCalander = 0; maxDaesInCalander < 4; maxDaesInCalander++) {
            var isDateExist = false;
            var columnHeaderClass = "";

            $(cruiseParentClass+" .row-" + yearToCheck + " .col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander).each(function () {
                if (typeof $(this).find(".c-date").html() != "undefined") {
                    isDateExist = true;
                }
            });

            if (!isDateExist) {

                $(cruiseParentClass+" .row-" + yearToCheck + " .col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander).each(function () {
                    if (typeof $(this).find(".c-date").html() == "undefined") {
                        $(this).hide();
                        columnHeaderClass = ".col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander;
                        $(cruiseParentClass+" .c-col-night-heading" + columnHeaderClass).hide();

                    }
                });
            }
        }

    }

}

function fnRemoveBlankColumnsFromTabs(yearToCheck) {

    $(".pageCruseDates .c-col-night-heading").show();

    var arrEmbarkations = ["luxor", "aswan"];
    for (var embarkationIndex = 0; embarkationIndex < arrEmbarkations.length; embarkationIndex++) {
        for (var maxDaesInCalander = 0; maxDaesInCalander < 4; maxDaesInCalander++) {
            var isDateExist = false;
            var columnHeaderClass = "";

            $(".pageCruseDates .row-" + yearToCheck + " .col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander).each(function () {
                if (typeof $(this).find(".c-date").html() != "undefined") {
                    isDateExist = true;
                }
            });

            if (!isDateExist) {

                $(".pageCruseDates .row-" + yearToCheck + " .col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander).each(function () {
                    if (typeof $(this).find(".c-date").html() == "undefined") {
                        $(this).hide();
                        columnHeaderClass = ".col-" + arrEmbarkations[embarkationIndex] + "-" + maxDaesInCalander;
                        $(".pageCruseDates .c-col-night-heading" + columnHeaderClass).hide();

                    }
                });
            }
        }

    }

}



function fnBwCruiseCalendarSoldOutDates(hotelofferingid) {
    var foundData = false;
    var tempArray = arrCalendarSoldOutDates.filter(function (item) {
        if (item.hotelofferingid.toLowerCase() == hotelofferingid.toLowerCase()) {
            foundData = true;
            return item;
        }
    })[0];

    if (foundData) {
        if (tempArray.dates.length > 0) {
            return tempArray.dates;
        }
    }
    else {
        return [];
    }
}

$(document).ready(function () {
    setTimeout(function () {
        $(" .dynamic-cruise-calendar-data .c-row.row-" + $(".c-current-year").html()).css("display", "flex");
    }, 100);
});








