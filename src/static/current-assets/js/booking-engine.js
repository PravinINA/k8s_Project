/*
fnBwSetupBookingWidget()
fnBwInitializaCalendar()
fnBwCheckInCalendarSetAvailabilityPriceMarketingAssetAndOthers()
fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers()
why does the price span addition happen 3 points
should end date be max 365 days from today?
check if code change in fnEnableCODates is required
creates a lot of configuration data - fnSetBookingWidgetByOffer
showSpecificHotelsInBookingWidget - changes hotel dropdown list if arrHotelsToShowInDropdown is not blank
checkout fnsetdatepickerafterinitialization
checkout fnsetdefaultcodate -- handles default co date and vanyavilas like special cases for generic calendar


Increment checkout default Date more than 1 for some hotels on page load.
This is not minimum night stay requirement as user can book 1 night stay as well.
This is required as most of the user prefer 2, 3, 4 etc nights in some hotels.
Based on this frequency we change checkout Date on page load.

what is the use of -- cruiseCalenderDefaultScreen
call fnInitialiseCalanderAndConfigure() for phiale or zahra selection

code to enable 1 extra date in co when last date of ci is selected

error to be shown if user selects more nights then covered under teh offer and offer thus become invalid
fnBwDisplayInvalidNumberOfNightsSelectedMessage

for offers where showNightsDropDown is true also set min nights config variale while initializing the widget
shownights drop down change event
change global config parameter minnights value
fnBwSetCheckOutDate()
co date onchange event handler
on checkout change display invalid night selection message if shownightsdropdown variable is true
rpc for a single hotel / configuration can vary on basis of either number of nights or date of stay

hotel droddown change event handler
room droddown change event handler
add room button click event
remove room button click event
guests - edit button click event
guests - cross/cancel button click event
promo code  - OK button click event

view availability
  booking widget selection validation
  rate code slection code - fnBwCheckAndSetOfferRateCode()

what is the use of the folowing elements:
.offerMsgWrap - to display error message of booking widget
('.dateWrap .mobCheckInCheckOut').removeClass('active'); - underline under the checkin and checkout box of mobile view
('.booking-engine .t-mobile-heading').show(); -- additionl html section displayed aove boking widget in mobile
('.booking-engine .t-check-in-mobile').html($('.t-date-check-in').html()); -- additional html element to display checkin date
('.booking-engine .t-check-out-mobile').html($('.t-date-check-out').html()); -- additional html element to display checkout date


what is the use of the folowing variables:
isPromocodeClick = true;
isOpenBookingWidgetClicked = true;
isHotelDropdownChangeEvent = true;

*/



var glblBwLastClickedObj;
var glblBwErrorMessageMomentDateFormat = "Do MMMM, YYYY";
var glBlBwRoomOrGuestSelected = false;

var glblBwDisplayMA = true;
var glblBwDisplayPrices = true;

var glblBwArrDoNotUseSoldOutDatesForHotels = [];

var glblBwWinW = $(window).width();
var glblBwWinH = $(window).height();

var glblBwConfiguration;

var glblBwToday = new Date(new Date().toDateString());

var glblBwCalendarInitializedOnce = false;
var glblBwNumCalendar = 2;
var glblBwBlCalendarAutoClose = false;

var glblBwMobilDeviceMaxWidth = 979;
var glblBwIsMobile = false;
var glblBwIsPromocodeClick = false;

var glblBwPromoCodeValidationSettings = { "blShowMessage": false, "errorMesage": "" };

/*Tracking Booking Widget Tracking Codes*/
var glblBwTrackingHotelDropdown = 0;
var glblBwTrackingCalendarDropdown = 0;
var glblBwTrackingRoomDropdown = 0;
var glblBwTrackingGuestDropdown = 0;
var glblBwTrackingViewAvailablityClick = 0;
var glblBwTrackingPomoCodeDropdown = 0;


/*Check whether browser support startsWith if no then add this functionality to it*/
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

function fnBwPreventDefaultEvent(e) {
    e.preventDefault();
};

function fnBwSetBodyScrolling(bool) {
    if (bool === true) {
        document.body.addEventListener("touchmove", fnBwPreventDefaultEvent, false);
    } else {
        document.body.removeEventListener("touchmove", fnBwPreventDefaultEvent, false);
    }
}

var glblBwIsHotelChangedOrPageLoadClicked = false;
function fnBwSetHotelSelectedByHotelCode(_hotelcode) {
    if (_hotelcode != "") {
        console.log("fnBwSetHotelSelectedByHotelCode called");
        glblBwIsHotelChangedOrPageLoadClicked = true;
        fnBwSetupBookingWidget(_hotelcode);
        // fnBwSetDefaultCheckoutDate();
        glblBwIsHotelChangedOrPageLoadClicked = false;


        $(glblBwLastClickedObj).find('.addRoomDropDown .block .roomSelectOption:eq(0)').click();


    }
    else {
        fnBwSomeErrorOccredInBW();
    }
    /*add any additional function call here that makes changes to elements other than booking widget*/
}

/*Set default checkout date based on configuration.
 This is required based on users experience i.e Mostlly user books stay for 2 night, 3 nights and so on
 */
function fnBwSetDefaultCheckoutDate() {

    console.log(glblBwIsHotelChangedOrPageLoadClicked);
    if (typeof glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece != "undefined" && glblBwIsHotelChangedOrPageLoadClicked) {
        if (glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece >= glblBwConfiguration.offer.minNights) {
            setTimeout(function () {


                var checkInDate = moment(moment($('.booking-engine .t-datepicker').clone().tDatePicker('getDates')[0]).clone());
                $('.booking-engine .t-datepicker').tDatePicker('setStartDate', checkInDate.format("YYYY-MM-DD"));
                $('.booking-engine .t-datepicker').tDatePicker('setEndDate', glblBwConfiguration.offer.endDate);
                $('.booking-engine .t-datepicker').tDatePicker('updateCI', checkInDate.clone().format("YYYY-MM-DD"));
                $('.booking-engine .t-datepicker').tDatePicker('updateCO', checkInDate.clone().add(glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece, 'days').format("YYYY-MM-DD"));

                //add to disabled dates basis on enabled dates list


            }, 10);

        }
    }
}


function fnBwInitializaCalendar() {

    if (glblBwConfiguration.offer.addDaysInCheckinDateFromToday > 0) {
        var _temoStartDate = moment(glblBwConfiguration.offer.startDate)._d;
        if (_temoStartDate <= glblBwToday) {
            glblBwConfiguration.offer.startDate = moment().clone().add(glblBwConfiguration.offer.addDaysInCheckinDateFromToday, "days").format("YYYY-MM-DD");
        }
    }

    var _startDate = moment(glblBwConfiguration.offer.startDate)._d;
    if (_startDate < glblBwToday)
        _startDate = glblBwToday;
    var _endDate = moment(glblBwConfiguration.offer.endDate)._d;
    //temp code 366
    //if (_endDate > moment(_startDate).add(366, "days")._d) {
    //    _endDate = moment(_startDate).add(366, "days")._d;
    //}
    var _dateCheckIn;
    var _dateCheckOut;


    if (_endDate < glblBwToday) {
        _dateCheckIn = null;
        _dateCheckOutMoment = null;
    }
    else {
        var _dateCheckInMoment = fnBwGetInitialCheckinDate();
        _dateCheckIn = _dateCheckInMoment._d;


        var _dateCheckOutMoment = _dateCheckInMoment.clone().add(glblBwConfiguration.offer.minNights, "days");
        _dateCheckOut = _dateCheckOutMoment._d;


        if (typeof glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece != "undefined") {
            if (glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece >= glblBwConfiguration.offer.minNights) {

                _dateCheckOut = _dateCheckInMoment.clone().add(glblBwConfiguration.offer.defaultCheckinAndCheckoutDateDifferenece, "days")._d;
            }

        }
    }


    var _dateDisabled = glblBwConfiguration.offer.disabledDates;



    $('.booking-engine .t-datepicker').each(function () {


        $(this).addClass("t-datepicker-autoclose-" + glblBwBlCalendarAutoClose);

        $(this).unbind();
        $(this).tDatePicker({
            autoClose: glblBwBlCalendarAutoClose,
            durationArrowTop: 200,
            numCalendar: glblBwNumCalendar,
            iconDate: '',
            iconArrowTop: false,
            startDate: _startDate,
            endDate: _endDate,
            dateCheckIn: _dateCheckIn,
            dateCheckOut: _dateCheckOut,
            dateDisabled: _dateDisabled,
            CheckInDateHeading: glblBookingWidgetCommonDictionaryArray.SelectCheckInDate,
            CheckOutDateHeading: glblBookingWidgetCommonDictionaryArray.SelectCheckOutDate
        });
    }).on('clickDateCI', function (e, dateCI) {
        var objTDatepicker = this;
        setTimeout(function () {
            fnBwCheckInIconClicked(objTDatepicker);
        }, 10);
    }).on('clickDateCO', function (e, dateCO) {
        var objTDatepicker = this;
        setTimeout(function () {
            fnBwCheckOutIconClicked(objTDatepicker);
        }, 10);
    }).on('selectedCI', function (e, changeDateCI) {
        var objTDatepicker = this;
        setTimeout(function () {
            fnBwCheckInDateChanged(objTDatepicker);
        }, 10);
    }).on('selectedCO', function (e, changeDateCI) {
        var objTDatepicker = this;
        setTimeout(function () {
            fnBwCheckOutDateChanged(objTDatepicker);
        }, 10);
    });

    //fnBwSetDefaultCheckoutDate();
}

// this function use date change in label on mouse hover of calender date temp basic.
function fnBwHoveCheckInCheckOutDateChange() {

    $(".booking-engine .t-datepicker-day tbody tr td").hover(
        function () {
            //console.log('td date hover In');
            var date = moment(parseInt($(this).attr('data-t-date')));
            if (!$(this).hasClass('t-disabled')) {
                $(this).parents('.dateWrap').find('.t-dates span').eq(0).text(date.format('DD') + ' ');
                $(this).parents('.dateWrap').find('.t-dates span').eq(1).text(date.format('MMM') + ' ');
                $(this).parents('.dateWrap').find('.t-dates span').eq(2).text(date.format('YYYY') + ' ');
            }

        }, function () {

            var OrignalDate = moment($(this).closest('.dateWrap').find('input').attr('value'));
            //console.log('td date hover out');
            if (OrignalDate.format('DD') != 'Invalid date') {
                $(this).parents('.dateWrap').find('.t-dates span').eq(0).text(OrignalDate.format('DD') + ' ');
                $(this).parents('.dateWrap').find('.t-dates span').eq(1).text(OrignalDate.format('MMM') + ' ');
                $(this).parents('.dateWrap').find('.t-dates span').eq(2).text(OrignalDate.format('YYYY') + ' ');
            }
            else {
                $(this).parents('.dateWrap').find('.t-dates span').text(' ');
            }

        }
    );
    // in some case hover out is failed so we write below code.
    $(".t-datepicker-day tbody").mouseleave(function () {
        console.log('tbody over out....');
        var OrignalDate = moment($(this).closest('.dateWrap').find('input').attr('value'));
        if (OrignalDate.format('DD') != 'Invalid date') {
            $(this).parents('.dateWrap').find('.t-dates span').eq(0).text(OrignalDate.format('DD') + ' ');
            $(this).parents('.dateWrap').find('.t-dates span').eq(1).text(OrignalDate.format('MMM') + ' ');
            $(this).parents('.dateWrap').find('.t-dates span').eq(2).text(OrignalDate.format('YYYY') + ' ');

        }
        else {
            $(this).parents('.dateWrap').find('.t-dates span').text(' ');
        }

    });

}


function fnBwSomeErrorOccredInBW(errMessage) {
    if (errMessage != "") {
        // alert(errMessage);
        console.log("errMessage " + errMessage);
    }
    else {
        alert("some problem with booking widget, admin has been informed.");
    }
    /*send email to admin with configuration and other details*/
}

function fnBwShowMobileElementsOfBookingCalendar(objTDatepicker) {
    if (glblBwIsMobile) {
        var objBE = $(objTDatepicker).closest('.booking-engine');
        $(objBE).find('.t-mobile-heading').show();
        $(objBE).find('.t-check-in-mobile').html($(objBE).find('.t-date-check-in').html());
        $(objBE).find('.t-check-out-mobile').html($(objBE).find('.t-date-check-out').html());
    }
}

//#region BW elements - event handler code
function fnBwOpenBookingEngine() {
    if ($(window).width() <= 767) {
        fnBwSetBodyScrolling(true);
    }
    $(".booking-engine").toggle();
}

function fnBwCloseBookingEngine() {
    if ($(window).width() <= 767) {
        fnBwSetBodyScrolling(false);
    }
    $(".booking-engine").toggle();
}

function fnBwCloseAllDropDowns() {
    //remove active class from dropdown triggers
    $('.booking-engine .triggerDropDown').removeClass('active');
    //hide dropdowns
    $('.booking-engine .dropDown').hide();
    //hide mobile specific heading
    $('.booking-engine .t-mobile-heading').hide();

    //hide calendar
    //the following code restores original checkout date so instead we need to call $('body').click()
    //$('.booking-engine .t-datepicker').tDatePicker('hide');
    $('body').click();
}

function fnBwAllDropDownOnClick(objThis) {
    //what is the use of this
    $(".booking-engine .c-main-wrap").hide();
    //why is the following added
    //$(objThis).next('.dropDown').toggle(); // added by prince  

    console.log(objThis);
    if ($(objThis).hasClass('active')) {
        //if open
        //close it by using toggle
        fnBwCloseAllDropDowns();


    } else {
        //if closed
        //close all
        fnBwCloseAllDropDowns();
        $(objThis).addClass('active');

        if ($(objThis).next('.dropDown').hasClass('slideDown')) {
            $(objThis).next('.dropDown').slideToggle();
        } else {
            $(objThis).next('.dropDown').toggle();
        }
        //open it by using toggle
    }
    //toggle

   
    /*For click Tracking*/
    if ($(objThis).hasClass("hotelLabel")) {
        fnBwHotelDropdownClick($(objThis));
    }
    else if ($(objThis).hasClass("addRoomLabel")) {
        fnBwAddRoomClick(objThis);
    }
    else if ($(objThis).hasClass("addGuestLabel")) {
        fnBwGuestDropdownClick(objThis);
    }
    else if ($(objThis).hasClass("plusIcon")) {
        fnBwPromoCodeDropdownClick(objThis);
    }
    /*For click Tracking end*/

}

function fnBwHotelDropDownOnChange(objThis) {
    var _hotelCode = $(objThis).attr('data-hotelcode');
    fnBwSetHotelSelectedByHotelCode(_hotelCode);
    fnBwCloseAllDropDowns();
}


function fnBwRoomDropDownOnChange(objThis) {
    var objBE = $(objThis).closest('.booking-engine');
    var _currIndex = $(objThis).index();

    var _currRoomCount = _currIndex + 1;
    $('.booking-engine .addRoomDropDown .block .roomSelectOption').removeClass('active');

    /*Set Dropdown active based on selection*/
    fnBwRoomDropDownAddClassActive(_currIndex);

    $('.booking-engine .noOfRoomsWrap .addRoomLabel .roomsCount .value').html(('0' + _currRoomCount).slice(-2));

    if (_currRoomCount == 1) {
        $('.booking-engine .noOfRoomsWrap .addRoomLabel .roomsCount .lbl').html(glblBookingWidgetCommonDictionaryArray.Room + ' &nbsp;');
    } else {
        $('.booking-engine .noOfRoomsWrap .addRoomLabel .roomsCount .lbl').html(glblBookingWidgetCommonDictionaryArray.Rooms);
    }
    if (_currRoomCount == 3) {
        $('.booking-engine .noOfGuestWrap .addGuestDropDown .actionWrap .addRoomButton').hide();
    }
    $('.booking-engine .dropDown').hide();
    $('.booking-engine .triggerDropDown').removeClass('active');

    var _currBlockGuest = $(objBE).find('.addGuestDropDown .blockWrapper .block').length;
    if (_currRoomCount > _currBlockGuest) {
        var a = _currBlockGuest + 1;
        for (i = a; i <= _currRoomCount; i++) {
            var newGuestBlock = '<div class="block">' +
                '<div class="editBlock"><div class="edit">' + glblBookingWidgetCommonDictionaryArray.Edit + '</div><div class="closeIcn">x</div></div>' +
                '<div class="roomsIndividualCount"> ' + glblBookingWidgetCommonDictionaryArray.Room + i + '</div>' +
                '<div class="roomGuestCount roomGuestCountSummery">2 ' + glblBookingWidgetCommonDictionaryArray.Adults + ' <span class="roomChild">, 0 ' + glblBookingWidgetCommonDictionaryArray.Children + ' </span></div>' +
                '<div class="roomGuestCount" style="display:none;">' +
                '<div class="choose adult">' +
                '<div class="label">' + glblBookingWidgetCommonDictionaryArray.Adult + '</div>' +
                '<div class="number">' +
                '<ul>' +
                '<li>1</li>' +
                '<li class="active">2</li>' +
                '<li class="extraAdult">3</li>' +
                '<li class="extraAdult">4</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<div class="choose child">' +
                '<div class="label">' + glblBookingWidgetCommonDictionaryArray.Children + '</div>' +
                '<div class="number">' +
                '<ul>' +
                '<li>1</li>' +
                '<li>2</li>' +    
                '<li class="extraChild">3</li>' +
                '</ul>' +
                '</div>' +
                '<div class="closeIcn">x</div>' +
                '</div>' +
                '<div class="childAgeWrap childAge1">' +
                '<div class="label">' + glblBookingWidgetCommonDictionaryArray.AgeOfChild + ' 1</div>' +
                '<div class="ageList">' +
                '<ul>' +
                '<li>1</li>' +
                '<li>2</li>' +
                '<li>3</li>' +
                '<li>4</li>' +
                '<li>5</li>' +
                '<li>6</li>' +
                '<li>7</li>' +
                '<li>8</li>' +
                '<li>9</li>' +
                '<li>10</li>' +
                '<li>11</li>' +
                '<li>12</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<div class="childAgeWrap childAge2">' +
                '<div class="label">' + glblBookingWidgetCommonDictionaryArray.AgeOfChild + ' 2</div>' +
                '<div class="ageList">' +
                '<ul>' +
                '<li>1</li>' +
                '<li>2</li>' +
                '<li>3</li>' +
                '<li>4</li>' +
                '<li>5</li>' +
                '<li>6</li>' +
                '<li>7</li>' +
                '<li>8</li>' +
                '<li>9</li>' +
                '<li>10</li>' +
                '<li>11</li>' +
                '<li>12</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<div class="childAgeWrap childAge3">' +
                '<div class="label">Age of child 3</div>' +
                '<div class="ageList">' +
                '<ul>' +
                '<li>1</li>' +
                '<li>2</li>' +
                '<li>3</li>' +
                '<li>4</li>' +
                '<li>5</li>' +
                '<li>6</li>' +
                '<li>7</li>' +
                '<li>8</li>' +
                '<li>9</li>' +
                '<li>10</li>' +
                '<li>11</li>' +
                '<li>12</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
            $('.booking-engine .addGuestDropDown .blockWrapper').append(newGuestBlock);
        }
    } else {
        var a = _currRoomCount + 1;
        for (i = _currBlockGuest; i > _currRoomCount; i--) {
            $('.booking-engine .addGuestDropDown .blockWrapper .block:last-child').remove();
            //show add button if room count is less than 4
            $('.booking-engine .addGuestDropDown .actionWrap .addRoomButton').show();
        }
    }

    if ($('.booking-engine .DropDownExtraGuest').length > 0) {
        $(".extraAdult,.extraChild").show();
    }
    else {
        $(".extraAdult,.extraChild").hide();
    }

    fnBwCalculateNumberOfGuest(objBE);

}

function fnBwGuestDropDownConfirmButtonOnClick(objThis) {
    console.log("guest drop down - confirm button - on click");
    var objBE = $(objThis).closest('.booking-engine');
    fnBwCreateGuestCountOfActiveBlock(objBE);
    fnBwCalculateNumberOfGuest(objBE);
    $(objBE).find('.noOfGuestWrap .addGuestLabel').removeClass('active');
    $(objBE).find('.noOfGuestWrap .addGuestDropDown').hide();
    $(objBE).find('.editBlock .edit').show();

    //fnBwSyncHtml();

}
var testObe = "";
function fnBwGuestDropDownAddRoomButtonOnClick(objThis) {
    var objBE = $(objThis).closest('.booking-engine');
    testObe = objBE;
    //create guest count of active block
    fnBwCreateGuestCountOfActiveBlock(objBE);
    //add new block of hotel room with guest count
    var _currRoomCount = $(objBE).find('.addGuestDropDown .blockWrapper .block').length;

    console.log("_currRoomCount=" + _currRoomCount);
    if (_currRoomCount < 3) {
        var newGuestBlock = '<div class="block individualRoomSection active">' +
            '<div class="roomsIndividualCount">' + glblBookingWidgetCommonDictionaryArray.Room + ' ' + parseInt(_currRoomCount + 1) + '</div>' +
            '<div class="roomGuestCount">' +
            '<div class="choose adult">' +
            '<div class="label">' + glblBookingWidgetCommonDictionaryArray.Adult + '</div>' +
            '<div class="number">' +
            '<ul>' +
            '<li>1</li>' +
            '<li class="active">2</li>' +
            '<li class="extraAdult">3</li>' +
            '<li class="extraAdult">4</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="choose child">' +
            '<div class="label">' + glblBookingWidgetCommonDictionaryArray.Children + '</div>' +
            '<div class="number">' +
            '<ul>' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li class="extraChild">3</li>' +
            '</ul>' +
            '</div>' +
            '<div class="closeIcn">x</div>' +
            '</div>' +
            '<div class="childAgeWrap childAge1">' +
            '<div class="label">' + glblBookingWidgetCommonDictionaryArray.AgeOfChild + ' 1</div>' +
            '<div class="ageList">' +
            '<ul>' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li>3</li>' +
            '<li>4</li>' +
            '<li>5</li>' +
            '<li>6</li>' +
            '<li>7</li>' +
            '<li>8</li>' +
            '<li>9</li>' +
            '<li>10</li>' +
            '<li>11</li>' +
            '<li>12</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="childAgeWrap childAge2">' +
            '<div class="label">' + glblBookingWidgetCommonDictionaryArray.AgeOfChild + ' 2</div>' +
            '<div class="ageList">' +
            '<ul>' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li>3</li>' +
            '<li>4</li>' +
            '<li>5</li>' +
            '<li>6</li>' +
            '<li>7</li>' +
            '<li>8</li>' +
            '<li>9</li>' +
            '<li>10</li>' +
            '<li>11</li>' +
            '<li>12</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="childAgeWrap childAge3">' +
            '<div class="label">Age of child 3</div>' +
            '<div class="ageList">' +
            '<ul>' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li>3</li>' +
            '<li>4</li>' +
            '<li>5</li>' +
            '<li>6</li>' +
            '<li>7</li>' +
            '<li>8</li>' +
            '<li>9</li>' +
            '<li>10</li>' +
            '<li>11</li>' +
            '<li>12</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(newGuestBlock).insertAfter('.booking-engine .blockWrapper .block:last-child');
        //add rooms in rooms dropdown
        var _currUpdateRoomCount = _currRoomCount + 1;
        var _roomCountWithZero = ('0' + _currUpdateRoomCount).slice(-2);
        $('.booking-engine .noOfRoomsWrap .addRoomLabel .roomsCount .value').html(_roomCountWithZero);
        $('.booking-engine .mobile .counter').html(_roomCountWithZero);
        $('.booking-engine .addRoomDropDown .block .roomSelectOption').removeClass('active');
        $('.booking-engine .addRoomDropDown .block .roomSelectOption:eq(' + _currRoomCount + ')').addClass('active');

    }
    if (_currRoomCount >= 2) {
        $('.booking-engine .addGuestDropDown .actionWrap .addRoomButton').hide();
    }
    $('.booking-engine .editBlock .edit').show();


    fnBwSetDefaultAdult();

    fnBwCalculateNumberOfGuest(objBE);

    fnBwRoomDropDownAddClassActive(_currRoomCount);


    if ($('.booking-engine .DropDownExtraGuest').length > 0) {
        $(".extraAdult,.extraChild").show();
    }
    else {
        $(".extraAdult,.extraChild").hide();
    }
}

function fnBwRoomDropDownAddClassActive(index) {
    $('.booking-engine').each(function (i) {
        $('.booking-engine:eq(' + i + ') .addRoomDropDown .block .roomSelectOption:eq(' + index + ')').addClass('active');
    });
}

function fnBwCreateGuestCountOfActiveBlock(objBE) {

    console.log("fnBwCreateGuestCountOfActiveBlock" + objBE);

    var adultCount = $(objBE).find('.block.active').find('.choose.adult li.active').index();
    var childCount = $(objBE).find('.block.active').find('.choose.child li.active').index();
    var adultTxt = glblBookingWidgetCommonDictionaryArray.Adult;
    var childTxt = glblBookingWidgetCommonDictionaryArray.Children;
    var _currBlockCount = $(objBE).find('.blockWrapper .block.active').index();
    if (adultCount > 0) {
        adultTxt = glblBookingWidgetCommonDictionaryArray.Adults;
    }
    if (childCount > 0) {
        childTxt = glblBookingWidgetCommonDictionaryArray.Children;
    }
    $(objBE).find('.addGuestDropDown .block.active').find('.roomGuestCount').hide();
    $('<div class="roomGuestCount roomGuestCountSummery">' + (parseInt(adultCount) + 1) + ' ' + adultTxt + '<span class="roomChild"> ,' + (parseInt(childCount) + 1) + ' ' + childTxt + '</span></div>').insertAfter($(objBE).find('.addGuestDropDown .block.active').find('.roomsIndividualCount'));
    if ($(objBE).find('.block.active .edit').length) {
        $(objBE).find('.block .editBlock').show();
    } else {
        $(objBE).find('.block.active').prepend('<div class="editBlock"><div class="edit">' + glblBookingWidgetCommonDictionaryArray.Edit + '</div><div class="closeIcn">x</div></div>');
    }
    $(objBE).find('.block').removeClass('active');
    $(objBE).find('.block .editBlock').show();
}
function fnBwCalculateNumberOfGuest(objBE) {

    if (typeof glblBwConfiguration != "undefined") {
        if (typeof glblBwConfiguration.offer != "undefined") {
            fnBwHideChildrenBasedOnConfiguration(glblBwConfiguration.offer.hideChildrenSelectionBox);
        }
    }

    var _totalGuestCount = 0;
    $(objBE).find('.blockWrapper .block').each(function (i) {
        if ($(this).hasClass('active')) {
            var adultCount = $(objBE).find('.block.active').find('.choose.adult li.active').index();
            var childCount = $(objBE).find('.block.active').find('.choose.child li.active').index();
            _totalGuestCount += (adultCount + 1) + (childCount + 1);
        } else {
            var numberPattern = /\d+/g;
            var noOfGuest = $(this).find('.roomGuestCount').html().match(numberPattern);
            var offset = "";
            offset = parseInt(noOfGuest[0]) + parseInt(noOfGuest[1]);
            _totalGuestCount += offset;
        }
    });
    var _guestCountWithZero = ('0' + _totalGuestCount).slice(-2);
    $(objBE).find('.noOfGuestWrap .addGuestLabel .guestCount .value').html(_guestCountWithZero);

    fnBwSyncHtml(objBE);

    fnBwBindClickEventsOnDynamicElementsOfGuestDetailsSection();
}


function fnBwPromoCodeShowMessageFlag(_promocode) {

    glblBwPromoCodeValidationSettings["blShowMessage"] = false;
    glblBwPromoCodeValidationSettings["errorMesage"] = "";

    glblBwCheckincheckoutdatedifference = parseInt(getDateDifference(glblBwCheckindate.split(";")[0], glblBwCheckoutdate.split(";")[0], "YYYY-MM-DD"));

    if (glblBwIsPromocodeClick) {
        console.log(1);
        if (_promocode == "") {
            glblBwPromoCodeValidationSettings["errorMesage"] = "Please enter promocode";
            glblBwPromoCodeValidationSettings["blShowMessage"] = true;
        }
        else if (_promocode != "" && fnBwGetRpcByPromoCode() == "") {
            glblBwPromoCodeValidationSettings["errorMesage"] = "Promocode is invalid or not eligible";
            glblBwPromoCodeValidationSettings["blShowMessage"] = true;
        }
    }
    else {
        console.log(2 + "--" + _promocode + "--" + fnBwGetRpcByPromoCode());
        if (_promocode != "" && fnBwGetRpcByPromoCode() == "") {
            glblBwPromoCodeValidationSettings["errorMesage"] = "Promocode is invalid or not eligible";
            glblBwPromoCodeValidationSettings["blShowMessage"] = true;
        }
    }

    return glblBwPromoCodeValidationSettings["blShowMessage"];
}


var glblBwCurrIndex = 0;
var glblBwErrorMessage = "";
var glblBwErrorField = "";
var glblBwUrlwithparameters = "";
var glblBwResconsoleurl = "";
var glblBwHotelcode = "";
var glblBwCheckindate = "";
var glblBwCheckoutdate = "";
var glblBwAdult = "";
var glblBwChild = 0;
var glblBwChildage = "";
var glblBwPromocode = "";
var glblBwRooms = 1;

var glblBwRoom1allchildage = "";
var glblBwRoom2allchildage = "";
var glblBwRoom3allchildage = "";

var glblBwRoom1child1age = "";
var glblBwRoom1child2age = "";

var glblBwRoom2child1age = "";
var glblBwRoom2child2age = "";

var glblBwRoom3child1age = "";
var glblBwRoom3child2age = "";
var glblBwRateaccesscode = "";
var glblBwMinnights = 1;
var glblBwPlaceofembarkation = "";
var glblBwCheckincheckoutdatedifference = 1;

function fnBwViewAvailabilityButtonOnClick(objThis) {

    console.log("fnBwViewAvailabilityButtonOnClick clicked");

    //set error messages such as no room
    if (typeof glblBwConfiguration != "undefined" && typeof glblBwConfiguration.ErrorMessage == "undefined") {
        fnBwSetGlobalErrorMessage();
    }

    isOpenBookingWidgetClicked = true;
    var objBE = $(objThis).closest('.booking-engine');
    glblBwHotelcode = $(objBE).find('.allHotels').find('li.active').attr('data-hotelcode');
    glblBwHotelcode = glblBwHotelcode != undefined ? glblBwHotelcode : "";

    glblBwCheckindate = $(objBE).find('.t-input-check-in').val();
    glblBwCheckoutdate = $(objBE).find('.t-input-check-out').val();
    glblBwRooms = parseInt($(objBE).find('.blockWrapper .block').length);
    glblBwPromocode = $(objBE).find('.promocode').val();
    $(objBE).find('.promocodeDropDown').hide();
    $(objBE).find('.erroPromocode').hide();
    $(objBE).find('.offerMsgWrap').html("");
    $(objBE).find('.offerMsgWrap').hide();

    var isWidgetHave3ChildAgeSelection = false;
    if ($('.booking-engine .DropDownExtraGuest').length > 0) {
        isWidgetHave3ChildAgeSelection = true;
    }

    if (glblBwRooms == 1) {

        if (fnBwGetAdultAndChild(objBE, 1)[1] == 0) {
            glblBwRoom1allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 1) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 2) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3];
        }

        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3] + "-" + fnBwGetAdultAndChild(objBE, 1)[4];
        }

        glblBwAdult = fnBwGetAdultAndChild(objBE, 1)[0];
        glblBwChild = fnBwGetAdultAndChild(objBE, 1)[1];
        glblBwChildage = glblBwRoom1allchildage;
    }
    //If user selects 2 room
    else if (glblBwRooms == 2) {

        glblBwHotelcode = glblBwHotelcode + ";" + glblBwHotelcode;
        glblBwCheckindate = glblBwCheckindate + ";" + glblBwCheckindate;
        glblBwCheckoutdate = glblBwCheckoutdate + ";" + glblBwCheckoutdate;
        glblBwAdult = fnBwGetAdultAndChild(objBE, 1)[0] + ";" + fnBwGetAdultAndChild(objBE, 2)[0];
        glblBwChild = fnBwGetAdultAndChild(objBE, 1)[1] + ";" + fnBwGetAdultAndChild(objBE, 2)[1];

        if (fnBwGetAdultAndChild(objBE, 1)[1] == 0) {
            glblBwRoom1allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 1) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 2) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3];
        }

        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3] + "-" + fnBwGetAdultAndChild(objBE, 1)[4];
        }

        if (fnBwGetAdultAndChild(objBE, 2)[1] == 0) {
            glblBwRoom2allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 2)[1] == 1) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 2)[1] == 2) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 2)[2] + "-" + fnBwGetAdultAndChild(objBE, 2)[3];
        }

        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 2)[2] + "-" + fnBwGetAdultAndChild(objBE, 2)[3] + "-" + fnBwGetAdultAndChild(objBE, 2)[4];
        }

        glblBwChildage = glblBwRoom1allchildage + ";" + glblBwRoom2allchildage;
    }
    //If user selects 3 room.
    else if (glblBwRooms == 3) {

        glblBwHotelcode = glblBwHotelcode + ";" + glblBwHotelcode + ";" + glblBwHotelcode;
        glblBwCheckindate = glblBwCheckindate + ";" + glblBwCheckindate + ";" + glblBwCheckindate;
        glblBwCheckoutdate = glblBwCheckoutdate + ";" + glblBwCheckoutdate + ";" + glblBwCheckoutdate;
        glblBwAdult = fnBwGetAdultAndChild(objBE, 1)[0] + ";" + fnBwGetAdultAndChild(objBE, 2)[0] + ";" + fnBwGetAdultAndChild(objBE, 3)[0];
        glblBwChild = fnBwGetAdultAndChild(objBE, 1)[1] + ";" + fnBwGetAdultAndChild(objBE, 2)[1] + ";" + fnBwGetAdultAndChild(objBE, 3)[1];

        if (fnBwGetAdultAndChild(objBE, 1)[1] == 0) {
            glblBwRoom1allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 1) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 1)[1] == 2) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3];
        }

        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom1allchildage = fnBwGetAdultAndChild(objBE, 1)[2] + "-" + fnBwGetAdultAndChild(objBE, 1)[3] + "-" + fnBwGetAdultAndChild(objBE, 1)[4];
        }

        if (fnBwGetAdultAndChild(objBE, 2)[1] == 0) {
            glblBwRoom2allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 2)[1] == 1) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 2)[1] == 2) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 2)[2] + "-" + fnBwGetAdultAndChild(objBE, 2)[3];
        }

        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom2allchildage = fnBwGetAdultAndChild(objBE, 2)[2] + "-" + fnBwGetAdultAndChild(objBE, 2)[3] + "-" + fnBwGetAdultAndChild(objBE, 2)[4];
        }

        if (fnBwGetAdultAndChild(objBE, 3)[1] == 0) {
            glblBwRoom3allchildage = 0;
        } else if (fnBwGetAdultAndChild(objBE, 3)[1] == 1) {
            glblBwRoom3allchildage = fnBwGetAdultAndChild(objBE, 1)[2];
        } else if (fnBwGetAdultAndChild(objBE, 3)[1] == 2) {
            glblBwRoom3allchildage = fnBwGetAdultAndChild(objBE, 3)[2] + "-" + fnBwGetAdultAndChild(objBE, 3)[3];
        }
        if (isWidgetHave3ChildAgeSelection) {
            glblBwRoom3allchildage = fnBwGetAdultAndChild(objBE, 3)[2] + "-" + fnBwGetAdultAndChild(objBE, 3)[3] + "-" + fnBwGetAdultAndChild(objBE, 3)[4];
        }

        glblBwChildage = glblBwRoom1allchildage + ";" + glblBwRoom2allchildage + ";" + glblBwRoom3allchildage;
    }

    var finalUrlWithParameters = "";


    if (fnBwBoolIsReservationValid()) {

        if (fnBwPromoCodeShowMessageFlag(glblBwPromocode)) {
            fnBwShowPromoError(glblBwPromoCodeValidationSettings["errorMesage"]);
        }
        else {
            if (!glblBwIsPromocodeClick) {
                glblBwCheckincheckoutdatedifference = parseInt(getDateDifference(glblBwCheckindate.split(";")[0], glblBwCheckoutdate.split(";")[0], "YYYY-MM-DD"));
                glblBwRateaccesscode = fnBwGetRpc();

                var rpcAgainstRateCode = fnBwGetRpcByPromoCode();
                if (rpcAgainstRateCode != "") {
                    glblBwRateaccesscode = rpcAgainstRateCode;
                }

                try {

                    if (document.location.hostname != "ohrnewsite.iabeta.in") {

                        /*Save Booking Query*/
                        var formData = [];

                        formData.push({ name: "checkin", value: glblBwCheckindate.split(";")[0] });
                        formData.push({ name: "checkout", value: glblBwCheckoutdate.split(";")[0] });
                        formData.push({ name: "hotelcode", value: glblBwHotelcode.split(";")[0] });
                        formData.push({ name: "persons", value: fnBwGetAdultAndChild(objBE, 1)[0] + fnBwGetAdultAndChild(objBE, 2)[0] + fnBwGetAdultAndChild(objBE, 3)[0] });
                        formData.push({ name: "rooms", value: glblBwRooms });
                        formData.push({ name: "room1aduts", value: fnBwGetAdultAndChild(objBE, 1)[0] });
                        formData.push({ name: "room1children", value: fnBwGetAdultAndChild(objBE, 1)[1] });
                        formData.push({ name: "room2aduts", value: fnBwGetAdultAndChild(objBE, 2)[0] });
                        formData.push({ name: "room2children", value: fnBwGetAdultAndChild(objBE, 2)[1] });
                        formData.push({ name: "room3aduts", value: fnBwGetAdultAndChild(objBE, 3)[0] });
                        formData.push({ name: "room3children", value: fnBwGetAdultAndChild(objBE, 3)[1] });
                        formData.push({ name: "rateaccesscode", value: glblBwRateaccesscode });
                        formData.push({ name: "currentpageurl", value: document.URL });
                        formData.push({ name: "referer", value: document.referrer });
                        formData.push({ name: "room1child1age", value: fnBwGetAdultAndChild(objBE, 1)[2] });
                        formData.push({ name: "room1child2age", value: fnBwGetAdultAndChild(objBE, 1)[3] });
                        formData.push({ name: "room2child1age", value: fnBwGetAdultAndChild(objBE, 2)[2] });
                        formData.push({ name: "room2child2age", value: fnBwGetAdultAndChild(objBE, 2)[3] });
                        formData.push({ name: "room3child1age", value: fnBwGetAdultAndChild(objBE, 3)[2] });
                        formData.push({ name: "room3child2age", value: fnBwGetAdultAndChild(objBE, 3)[3] });
                        formData.push({ name: "promocode", value: glblBwPromocode });

                        $.ajax({
                            url: "/handlers/booking-console-data.ashx",
                            data: formData,
                            dataType: "jsonp",
                            type: "POST",
                            async: false,
                            success: function (result) {

                            },
                            error: function (err) {
                            }
                        });
                    }
                }
                catch (Exx) {
                    console.log("Error booking-console-data.ashx");
                }



                var objReservation = new bwMakeReservation();
                objReservation.resconsoleurl = glblBwResconsoleurl;
                objReservation.hotelcode = glblBwHotelcode;
                objReservation.checkindate = glblBwCheckindate;
                objReservation.checkoutdate = glblBwCheckoutdate;
                objReservation.adult = glblBwAdult;
                objReservation.child = glblBwChild;
                objReservation.childage = glblBwChildage;
                objReservation.promocode = glblBwPromocode;

                objReservation.rooms = glblBwRooms;
                objReservation.room1allchildage = glblBwRoom1allchildage;
                objReservation.room2allchildage = glblBwRoom2allchildage;
                objReservation.room3allchildage = glblBwRoom3allchildage;

                objReservation.room1child1age = glblBwRoom1child1age;
                objReservation.room1child2age = glblBwRoom1child2age;

                objReservation.room2child1age = glblBwRoom2child1age;
                objReservation.room2child2age = glblBwRoom2child2age;

                objReservation.room3child1age = glblBwRoom3child1age;
                objReservation.room3child2age = glblBwRoom3child2age;
                objReservation.rateaccesscode = glblBwRateaccesscode;

                objReservation.minnights = glblBwMinnights;

                objReservation.booknow();
            }
        }
    }
    else {
        console.log("error block");
        $(objBE).find('.offerMsgWrap').html(glblBwErrorMessage);
        $(objBE).find('.offerMsgWrap').show();
    }
}

function fnBwShowPromoError(message) {

    $(glblBwLastClickedObj).find('.promocodeDropDown ').hide();
    $('.erroPromocode').hide();
    $(".erroPromocode").html("");
    $(glblBwLastClickedObj).find('.plusIcon').removeClass("active");
    $(".erroPromocode").html(message);
    $(glblBwLastClickedObj).find('.plusIcon').addClass("active");
    $(glblBwLastClickedObj).find('.promocodeDropDown').show();
    $(glblBwLastClickedObj).find('.erroPromocode').show();
}


function fnBwBoolIsReservationValid() {

    glblBwErrorMessage = "";
    var datedifference = getDateDifference(moment(glblBwCheckindate).format("YYYY-MM-DD"), moment(glblBwCheckoutdate).format("YYYY-MM-DD"), "YYYY-MM-DD");
    var _hotelcode = glblBwHotelcode.split(';');

    if (_hotelcode == "" || _hotelcode == "null") {
        glblBwErrorMessage = "Please select hotel.";
        return false;
    }
    else if (glblBwCheckindate == "" || glblBwCheckindate.indexOf("null") == 0) {
        glblBwErrorMessage = "Please select check-in Date.";
        return false;
    }
    else if (glblBwCheckoutdate == "" || glblBwCheckoutdate.indexOf("null") == 0) {
        glblBwErrorMessage = "Please select check-out Date.";
        return false;
    }
    else if (typeof glblBwConfiguration.ErrorMessage != "undefined" && glblBwConfiguration.ErrorMessage != "") {
        glblBwErrorMessage = glblBwConfiguration.ErrorMessage;
        return false;
    }

    return true;
}

function bwMakeReservation() {
    this.resconsoleurl = "";
    this.hotelcode = "";
    this.checkindate = "";
    this.checkoutdate = "";
    this.adult = "";
    this.child = 0;
    this.childage = "";
    this.promocode = "";
    this.placeofembarkation = "";
    this.roomtype = "";
    this.rooms = 1;
    this.room1allchildage = "";
    this.room2allchildage = "";
    this.room3allchildage = "";

    this.room1child1age = "";
    this.room1child2age = "";

    this.room2child1age = "";
    this.room2child2age = "";

    this.room3child1age = "";
    this.room3child2age = "";
    this.rateaccesscode = "";

    this.minnights = 1;

    /*For decesion making */
    this.pagename = "";
    this.pagetype = "";

}

bwMakeReservation.prototype.booknow = function () {

    var ret = "";

    var finalURL = "https://res.oberoihotels.com/";
    var configcode = "oberoi";
    var themecode = "oberoi";
    var languagForSynxis = "en-GB";

    var _hotelcode = fnBwGetSynxisHotelCodeFromTrustHotelCode(this.hotelcode.toString().split(";")[0]);
    var custom_nothn = "";
    console.log("bwMakeReservation.prototype.booknow " + _hotelcode);

    /*If true then add parameter in synxis url where this parameter is used to make some decesions such as hide price compare widget*/
    if (fnBwBoolSendCustomeParameterCustomNothn()) {
        custom_nothn = "&custom_nothn=1";
    }

    //  console.log(this.adult);
    this.adult = this.adult.toString().replace(/;/g, ',');
    this.child = this.child.toString().replace(/;/g, ',').replace(/-/g, "|");
    this.childage = this.childage.toString().replace(/;/g, ",").replace(/-/g, "|");
    this.checkindate = this.checkindate.toString().replace(/;/g, ",");
    this.checkoutdate = this.checkoutdate.toString().replace(/;/g, ",");

    if (readCookie("SsoAccessToken") != "" && readCookie("SsoAccessToken") != "false") {
        if (this.rateaccesscode != "") {
            if (this.rateaccesscode.indexOf("WEBEXL") == -1) {
                if (this.rateaccesscode.indexOf("WEB-") != -1) {
                    this.rateaccesscode = this.rateaccesscode.replace(/-/g, "EXL-");
                }
            }
        }
    }


    if (this.pagename == "sugardoctormedicarellp" && _hotelcode == "5271") {

        finalUrlWithParameters = finalURL + "?hotel=" + _hotelcode + "&rate=" + this.rateaccesscode + "&arrive=" + this.checkindate + "&depart=" + this.checkoutdate + "&rooms=" + this.rooms + "&adult=" + this.adult + "&child=" + this.child + "&childages=" + this.childage + "&themecode=InitialThemeTrident&configcode=InitialConfigTrident&chain=24188&level=hotel&locale=en-US&sbe_ri=0" + custom_nothn;
    }
    else {

        if (_hotelcode.indexOf("5267") != -1 || _hotelcode.indexOf("5264") != -1 || _hotelcode.indexOf("5265") != -1) {
            configcode = "oberoicruise";
        }
        else if (_hotelcode.indexOf("5274") != -1 || _hotelcode.indexOf("5283") != -1) {
            configcode = "oberoi_geo";
        }
        else if ((_hotelcode.indexOf("5257") != -1 || _hotelcode.indexOf("5282") != -1) && $('.booking-engine .DropDownExtraGuest').length > 0) {
            configcode = "OberoiFourGuest";
        }
        else if (_hotelcode.indexOf("5287") != -1) {
            configcode = "OberoiMauritius";
        }
        else if (_hotelcode.indexOf("5276") != -1) {
            configcode = "OberoiRajvilas";
            themecode = "OberoiRajVilas";
        }

        if (typeof glblCurrentPageLanguageName != "undefined" && glblCurrentPageLanguageName != "en") {
            languagForSynxis = glblCurrentPageLanguageName;
        }

        finalUrlWithParameters = finalURL + "?hotel=" + _hotelcode + "&rate=" + this.rateaccesscode + "&arrive=" + this.checkindate + "&depart=" + this.checkoutdate + "&rooms=" + this.rooms + "&adult=" + this.adult + "&child=" + this.child + "&childages=" + this.childage + "&themecode="+themecode+"&configcode=" + configcode + "&brand=ob&chain=24188&level=hotel&locale=" + languagForSynxis + "&sbe_ri=0" + custom_nothn;
    }



    console.log("RPC=", this.rateaccesscode);
    console.log("finalUrlWithParameters " + finalUrlWithParameters);

    fnBwViewAvailAbilityBeforeRedirectionClick($(this));


    setUserLastSearchData(finalUrlWithParameters);

    if (fnGetParameterByNameNew("iatesting") == "") {

        createCookieWithDomainName("bookingSourceDomain", "website", 10, ".oberoihotels.com");

        if (readCookie("SsoAccessToken") != "" && readCookie("SsoAccessToken") != "false") {

            if (readCookie("OberoiOneMemberTier").toLowerCase() == "blue") {
                finalUrlWithParameters += "&filter=member";

            }
            else {
                finalUrlWithParameters += "&filter=ob1";
            }

            this.createVirualFormAndPostIt(finalUrlWithParameters, readCookie("SsoAccessToken"));
        }
        else {
            window.location = finalUrlWithParameters;
        }
    }
    else {
        // console.log("Final URL = " + finalUrlWithParameters);
    }

    return ret;
}


function fnBwBoolSendCustomeParameterCustomNothn() {

    var currentURLPath = document.location.pathname.toLocaleLowerCase();

    if (currentURLPath.startsWith("/special-offers-lp")
        || currentURLPath.startsWith("/partner")
        || currentURLPath.startsWith("/alliances")
        || currentURLPath.startsWith("/events-landing-page")
    ) {
        return true;
    }
    else {
        return false;
    }

}


function fnBwGetSynxisHotelCodeFromTrustHotelCode(hotelCodeTrust) {

    var hotelCodeSynxis = "5261";
    var objHotelCodeMapping = {
        "HTLMRCO": "9796",
        "HBDPSOB": "5258",
        "HBBLROB": "5269",
        "HBDELOG": "5272",
        "HBAMIOB": "5266",
        "HBMRUTO": "5287",
        "HBBOMOB": "5270",
        "HBDELOB": "5280",
        "HBHRGOB": "5283",
        "HBAGROB": "5256",
        "HBDXBAZ": "5274",
        "HBSLVOB": "5289",
        "HBDXBOB": "5282",
        "HBCCUOB": "5257",
        "HBCOKVR": "5265",
        "HBASWPH": "5264",
        "HBJAIOB": "5276",
        "HBIXCOB": "5275",
        "HBUDROB": "5261",
        "HBJAIVA": "5285",
        "HBASWZA": "5267",
        "HBMEDOB": "5286",
        "HBSLVWH": "5255",
        "HBBOMOT": "5271"

    };


    hotelCodeTrust = hotelCodeTrust.toUpperCase();
    if (objHotelCodeMapping[hotelCodeTrust] != undefined)
        hotelCodeSynxis = objHotelCodeMapping[hotelCodeTrust];
    else {
        console.log("hotelCodeTrust -- " + hotelCodeTrust);
    }
    return hotelCodeSynxis;
}

/* Get hotelcode by synxis code for card abandoment pop up (Marketing asset)  */
function getHotelCodeBySynxisCode(synxisCode) {

    /* Note hotelcode HBBOMOT is for Trident Nariman Point Mumbai
       This code is used on Offer /lp/hotels-in-mumbai/sugardoctormedicarellp
    */
    var hotelTrustCode = "";

    var arrSynxixCodeAndHotelCode = {
        "_9796": "HTLMRCO",
        "_5258": "HBDPSOB",
        "_5269": "HBBLROB",
        "_5272": "HBDELOG",
        "_5266": "HBAMIOB",
        "_5287": "HBMRUTO",
        "_5270": "HBBOMOB",
        "_5280": "HBDELOB",
        "_5283": "HBHRGOB",
        "_5256": "HBAGROB",
        "_5274": "HBDXBAZ",
        "_5289": "HBSLVOB",
        "_5282": "HBDXBOB",
        "_5257": "HBCCUOB",
        "_5265": "HBCOKVR",
        "_5264": "HBASWPH",
        "_5276": "HBJAIOB",
        "_5275": "HBIXCOB",
        "_5261": "HBUDROB",
        "_5285": "HBJAIVA",
        "_5267": "HBASWZA",
        "_5286": "HBMEDOB",
        "_5255": "HBSLVWH"
    };

    if (arrSynxixCodeAndHotelCode["_" + synxisCode] != undefined)
        hotelTrustCode = arrSynxixCodeAndHotelCode["_" + synxisCode];
    else {
        console.log("hotelTrustCode -- " + hotelTrustCode);
    }

    return hotelTrustCode;
}

bwMakeReservation.prototype.createVirualFormAndPostIt = function (targetUrl, ssoAccessToken) {
    //get base url
    //var currentURL = window.location.href;
    var currentURL = targetUrl;
    console.log("currentURL - " + currentURL);
    var hrefParts = currentURL.split("?");
    var basePath = hrefParts[0];
    console.log("basePath - " + basePath);
    var querystring = ""
    if (hrefParts.length > 1) {
        querystring = hrefParts[1].split("#")[0];
    }
    console.log("querystring - " + querystring);

    if (targetUrl.toLocaleLowerCase().indexOf("filter") == -1) {
        if (readCookie("OberoiOneMemberTier").toLowerCase() == "" || readCookie("OberoiOneMemberTier").toLowerCase() == "blue") {
            querystring += "&filter=member";
        }
        else {
            querystring += "&filter=ob1";
        }
    }

    var querystringParameters = querystring.split("&");
    var formPostJsonObject = {};
    for (var i = 0; i < querystringParameters.length; i++) {
        var parameter = querystringParameters[i];
        var parameterNameValue = parameter.split('=');
        var parameterName = parameterNameValue[0];
        var parameterValue = "";
        if (parameterNameValue.length > 1) {
            parameterValue = parameterNameValue[1];
        }
        formPostJsonObject[parameterName] = parameterValue;
    }
    console.log("formPostJsonObject - " + formPostJsonObject);

    if (ssoAccessToken != "") {
        formPostJsonObject["session"] = ssoAccessToken;
    }
    console.log("ssoAccessToken - " + ssoAccessToken);

    //get query string parameters
    $.redirect(basePath,
        formPostJsonObject,
        "post", "_self");
}

/*GET values of adult, child, child1age and child2age using index number start from 1
Each .block class contain group of stay details*/
function fnBwGetAdultAndChild(objBE, roomselected) {

    roomselected = roomselected - 1;

    var adult = 0;
    adult = $(objBE).find('.blockWrapper .block').eq(roomselected).find('.choose.adult li.active').html();
    if (adult == undefined) {
        adult = 0;
    }
    var child = 0;
    child = $(objBE).find('.blockWrapper .block').eq(roomselected).find('.choose.child li.active').html();
    if (child == undefined) {
        child = 0;
    }
    var child1age = 0;
    child1age = $(objBE).find('.blockWrapper .block').eq(roomselected).find('.childAgeWrap.childAge1 li.active').html();
    if (child1age == undefined) {
        child1age = 0;
    }
    var child2age = 0;
    child2age = $(objBE).find('.blockWrapper .block').eq(roomselected).find('.childAgeWrap.childAge2 li.active').html();
    if (child2age == undefined) {
        child2age = 0;
    }

    var child3age = 0;
    child3age = $(objBE).find('.blockWrapper .block').eq(roomselected).find('.childAgeWrap.childAge3 li.active').html();
    if (child3age == undefined) {
        child3age = 0;
    }

    return [parseInt(adult), parseInt(child), parseInt(child1age), parseInt(child2age), parseInt(child3age)];
}

function fnBwBindClickEventsOnDynamicElementsOfGuestDetailsSection() {

    /*booking-engine click event*/
    $('.booking-engine').unbind();
    $('.booking-engine').click(function () {
        glblBwLastClickedObj = $(this);
    });




    //number of adult - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .adult .number ul li').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .adult .number ul li').click(function () {
        $(this).closest('.number').find('li').removeClass('active');
        $(this).addClass('active');

        if ($('.booking-engine .DropDownExtraGuest').length > 0) {
            var _currIndex = $(this).index();
            var _this = $(this);
            var _childRemain = 3;
            $(this).closest('.block').find('.child .number ul li').hide();
            _childRemain = _childRemain - _currIndex - 1;
            for (i = 0; i <= _childRemain; i++) {
                _this.closest('.block').find('.child .number ul li:eq(' + i + ')').show();
            }
            _this.closest('.block').find('.child .closeIcn').click();

        }


    });

    //number of child - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .child .number ul li').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .child .number ul li').click(function () {
        $(this).closest('.number').find('li').removeClass('active');
        $(this).addClass("active");
        var _currIndex = $(this).index();
        var _this = $(this);
        $(this).closest('.number').next('.closeIcn').show();
        $(this).closest('.block').find('.childAgeWrap').hide();
        for (i = 0; i <= _currIndex; i++) {
            _this.closest('.block').find('.childAgeWrap:eq(' + i + ')').show();
        }

        if (glblBwConfiguration.offerCode == 'Default The Oberoi Beach Resort Al Zorah'
            && $(this).text() == "2"
            && $(this).closest('.individualRoomSection').index() == 0
        ) {

            $(".hotelChooseChildInfoWrap, .hotelChooseChildInfoWrapOverlay").show();
        }

    });

    $(".hotelChooseChildInfoWrap .hotelChooseChildInfoCloseBtn").click(function(){
        if($('.hotelChooseChildInfoCheckBox input[type="checkbox"]').is(':checked')){
          $(".hotelChooseChildInfoErrorMsg").hide();
         $(".hotelChooseChildInfoWrap, .hotelChooseChildInfoWrapOverlay").hide();
         $(".booking-engine .noOfGuestWrap .addGuestDropDown").show();
        }
        else{
            $(".hotelChooseChildInfoErrorMsg").show();
        }
     
    });

    //delete child - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .child .closeIcn').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .child .closeIcn').click(function () {
        $(this).hide();
        $(this).prev('.number').find('li').removeClass('active');
        $(this).closest('.block').find('.childAgeWrap').hide();
        $(this).closest('.block').find('.childAgeWrap li').removeClass('active');
    });

    //age of child - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .childAgeWrap ul li').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .childAgeWrap ul li').click(function () {
        $(this).closest('.childAgeWrap').find('li').removeClass('active');
        $(this).addClass('active');
    });

    //edit room - on click

    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .editBlock .edit').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .editBlock .edit').click(function () {
       
        var objBE = $(this).closest('.booking-engine');
        fnBwCreateGuestCountOfActiveBlock(objBE);
        var objBlock = $(this).closest('.blockWrapper .block');
        $(objBlock).find('.roomGuestCount:eq(0)').remove();
        $(objBlock).find('.roomGuestCount').show();
        $(objBlock).addClass('active');
        $(objBE).find('.editBlock .edit').show();
        $(this).hide();      
       // $(objBE).find('.roomGuestCount .adult .number ul li.active').click();
        //setTimeout(function () {
        //    $(glblBwLastClickedObj).find('.roomGuestCount .adult .number ul li.active').click();
        //}, 10);
        fnBwGuestShowHideGuestBasedOnAdultsOnClick();

        fnBwCalculateNumberOfGuest();
    });

    //delete room - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .editBlock .closeIcn').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .blockWrapper .editBlock .closeIcn').click(function () {
        var objBE = $(this).closest('.booking-engine');
        var obj = $(this).closest('.blockWrapper .block').index();
        $(objBE).find('.addGuestDropDown .actionWrap .addRoomButton').show();
        var _currBlockCountBefore = $(objBE).find('.blockWrapper .block').length;
        if (_currBlockCountBefore >= 2) {
            $(objBE).find('.blockWrapper .block:eq(' + obj + ')').remove();
            var _currBlockCount = $(objBE).find('.blockWrapper .block').length;
            var _currBlockIndex = parseInt(_currBlockCount) - 1;
            $(objBE).find('.addRoomDropDown .block .roomSelectOption').removeClass('active');
            $(objBE).find('.addRoomDropDown .block .roomSelectOption:eq(' + _currBlockIndex + ')').addClass('active');
            var _roomCountWithZero = ('0' + _currBlockCount).slice(-2);
            $(objBE).find('.noOfRoomsWrap .addRoomLabel .roomsCount .value').html(_roomCountWithZero);
            $(objBE).find('.mobile .counter').html(_roomCountWithZero);
            for (i = 0; i < _currBlockCount; i++) {
                var roomCount = parseInt(i) + 1;
                $(objBE).find('.blockWrapper .block:eq(' + i + ')').find('.roomsIndividualCount').html(glblBookingWidgetCommonDictionaryArray.Room + ' ' + roomCount);
                $(objBE).find('.blockWrapper .block:eq(' + i + ')').find('.editBlock').html('<div class="edit">' + glblBookingWidgetCommonDictionaryArray.Edit + '</div><div class="closeIcn">x</div>');
            }
        }
        fnBwCalculateNumberOfGuest(objBE);

    });


    fnBwGuestShowHideGuestBasedOnAdultsOnClick();
}

//#endregion

//#region BW elements - bind event handlers
function fnBwBindEventHandlers() {
    console.log("fnBindEventHandlers called");
    //for oberoi


    //bw event handlers:
    //open drop down on click of parent div for all dropdowns in booking widget
    $('.booking-engine .triggerDropDown').unbind();
    $('.booking-engine .triggerDropDown').click(function () {
        console.log(".booking-engine .triggerDropDown called");
        fnBwAllDropDownOnClick(this);
    });

    //hotel drop down - on change
    $('.booking-engine .hotelListDropDown .hotelList .hotelBlock .list ul > li').unbind();
    $('.booking-engine .hotelListDropDown .hotelList .hotelBlock .list ul > li').click(function () {
        fnBwHotelDropDownOnChange(this);
    });

    //under initialize calendar
    //check in calendar - clickDateCI
    //check in calendar - onChangeCI
    //check out calendar - clickDateCO
    //check out calendar - onChangeCO

    //room drop down - on change
    $('.booking-engine .addRoomDropDown .block .roomSelectOption').unbind();
    $('.booking-engine .addRoomDropDown .block .roomSelectOption').click(function () {
        fnBwRoomDropDownOnChange(this);
    });

    //guest drop down - add room button - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .actionWrap .addRoomButton').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .actionWrap .addRoomButton').click(function () {
        fnBwGuestDropDownAddRoomButtonOnClick(this);
    });
    //guest drop down - confirm button - on click
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .actionWrap .actionButton').unbind();
    $('.booking-engine .noOfGuestWrap .addGuestDropDown .actionWrap .actionButton').click(function () {
        fnBwGuestDropDownConfirmButtonOnClick(this);
    });

    //dynamically created elements
    //edit room - on click
    //delete room - on click
    //adult number span - on click
    //child number span - on click
    //child delete - on click
    //age of child number span - on click
    fnBwBindClickEventsOnDynamicElementsOfGuestDetailsSection();

    ////promo code text box - on lost focus
    //$(".booking-engine .promocodeDropDown").blur(function () {
    //    fnBwIsPromoCodeValid(this);
    //});

    //book a stay / view availability - on click
    $(".booking-engine .viewAvailabilityButton").unbind();
    $(".booking-engine .viewAvailabilityButton").click(function () {
        fnBwViewAvailabilityButtonOnClick(this);
    });

    //popup close buttons in case of mobile view - on click
    $('.booking-engine .close, .booking-engine .backWrap').unbind();
    $('.booking-engine .close, .booking-engine .backWrap').click(function () {
        fnBwCloseAllDropDowns();
    });

    //booking calendar next previous arrows - this is added to each creation of calendar element in default calendar event handlers
    //fnBwCalendarAddNextPrevEventHandler();

    /* start added by prince - maybe for special pages that have promocode already filled - pls confirm*/
    $(".booking-engine .triggerDropDown.activeAlways").unbind();
    $(".booking-engine .triggerDropDown.activeAlways").hover(function () {
        $('.booking-engine .activeAlways').removeClass('activeAlways');
    });

    $(".promocodeDropDown button").unbind();
    $(".promocodeDropDown button").click(function () {
        glblBwIsPromocodeClick = true;
        fnBwViewAvailabilityButtonOnClick(glblBwLastClickedObj);
        glblBwIsPromocodeClick = false;
    });


}//#endregion

//put comment here
$(document).mouseup(function (e) {


    /*To close dropdown sections available in booking widget */
    var container = $(".booking-engine .dropDown"),
        containerParent = $('.booking-engine .triggerDropDown');
    if (!container.is(e.target) && container.has(e.target).length === 0 && !containerParent.is(e.target) && containerParent.has(e.target).length === 0) {
        container.hide();
        containerParent.removeClass('active');
        fnBwCalculateNumberOfGuest(glblBwLastClickedObj);
        //fnBwSyncHtml();

    }


    /*To close booking widget when user clicks outside of booking engine section */
    var container2 = $(".header-view-availability");
    if (!container2.is(e.target) && container2.has(e.target).length === 0) {

        //fnBwSyncHtml();

        //$('.triggerDropDown').find('active').removeClass('active');
        container2.find('.booking-engine').hide();



        if ($(".booking-engine .offerMsgWrap").length > 0) {
            $(".booking-engine .offerMsgWrap").show();
        }
    }
});


//#region Sync booking Engine html from horizonatl to vertical and vice versa
function fnBwSyncHtml(objThis) {
    glblBwLastClickedObj = objThis;
    var _bookingWidgetLength = $(".booking-engine");

    if (typeof glblBwLastClickedObj != "undefined" && _bookingWidgetLength.length > 0) {

        if (_bookingWidgetLength.length == 2) {
            if (glblBwLastClickedObj.context.dataset.index == "0") {
                $(".booking-engine:eq(1) .noOfGuestWrap").html($(".booking-engine:eq(0) .noOfGuestWrap").html());
                // console.log("AAAAAAA");
                fnBwBindEventHandlers();

            }
            else if (glblBwLastClickedObj.context.dataset.index == "1") {
                $(".booking-engine:eq(0) .noOfGuestWrap").html($(".booking-engine:eq(1) .noOfGuestWrap").html());
                // console.log("BBBBBBB");
                fnBwBindEventHandlers();

            }

            $(".booking-engine.bkhOffset .calanderBottomMessage").html("");
        }
    }

}//#endregion

//#region calendar default event - handlers

function fnBwCheckInDateChanged(objTDatepicker) {

    console.log("fnBwCheckInDateChanged called");
    $(".booking-engine .offerMsgWrap").html("");
    $(".booking-engine .offerMsgWrap").hide();
    fnBwCalendarAddNextPrevEventHandler();
    fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers();
    fnBwDisplayMarketingAssetsInCalendar();

    //this would work only if min nights > 1
    fnBwSetCheckOutDate();

    //this function change date  on hover for apperance purpose only
    fnBwHoveCheckInCheckOutDateChange();

    fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();
    //hide mobile elements
    //fnBwHideMobileElementsOfBookingCalendar();

    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut').removeClass('active');
    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut:eq(1)').addClass('active');

    $(objTDatepicker).find('.t-check-in-mobile').html($('.booking-engine .t-date-check-in').html());
    $(objTDatepicker).find('.t-check-out-mobile').html($('.booking-engine .t-date-check-out').html());
}



function fnBwCheckInIconClicked(objTDatepicker) {

    $(".booking-engine .offerMsgWrap").html("");
    $(".booking-engine .offerMsgWrap").hide();

    console.log("fnBwCheckInIconClicked called");
    fnBwCalendarAddNextPrevEventHandler();
    //add text for disabled date range
    fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();

    fnBwCheckInCalendarSetAvailabilityPriceMarketingAssetAndOthers();
    fnBwDisplayMarketingAssetsInCalendar();
    //fnBwCheckInCalendarDisableDatesInDateRange();
    //fnBwCheckInCalendarDisableDaysOfWeek();

    //this function change date  on hover for apperance purpose only
    fnBwHoveCheckInCheckOutDateChange();

    //show mobile elements
    fnBwShowMobileElementsOfBookingCalendar(objTDatepicker);

    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut').removeClass('active');
    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut:eq(0)').addClass('active');

    $(objTDatepicker).find('.t-check-in-mobile').html($('.booking-engine .t-date-check-in').html());
    $(objTDatepicker).find('.t-check-out-mobile').html($('.booking-engine .t-date-check-out').html());


    /*For tracking*/
    fnBwClickDateCI(objTDatepicker);
}

function fnBwCheckOutDateChanged(objTDatepicker) {
    console.log("fnBwCheckOutDateChanged called");

    $(".booking-engine .offerMsgWrap").html("");
    $(".booking-engine .offerMsgWrap").hide();

    //only for case where we need to select exact number of nights as per offer
    fnBwDisplayInvalidNumberOfNightsSelectedMessage();

    fnBwCalendarAddNextPrevEventHandler();
    fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers();
    fnBwDisplayMarketingAssetsInCalendar();
    fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();

    /*Set global error messages such as no no room between stay or restricted date*/
    fnBwSetGlobalErrorMessage();

    //hide mobile elements
    //fnBwHideMobileElementsOfBookingCalendar();

    $(objTDatepicker).find('.t-check-in-mobile').html($('.booking-engine .t-date-check-in').html());
    $(objTDatepicker).find('.t-check-out-mobile').html($('.booking-engine .t-date-check-out').html());
}

function fnBwCheckOutIconClicked(objTDatepicker) {
    console.log("fnBwCheckOutIconClicked called");
    fnBwCalendarAddNextPrevEventHandler();
    //add text for disabled date range
    fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();

    //disable dates
    fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers();
    fnBwDisplayMarketingAssetsInCalendar();

    //this function change date  on hover for apperance purpose only
    fnBwHoveCheckInCheckOutDateChange();


    //show mobile elements
    fnBwShowMobileElementsOfBookingCalendar(objTDatepicker);

    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut').removeClass('active');
    $(objTDatepicker).find('.dateWrap .mobCheckInCheckOut:eq(1)').addClass('active');

    $(objTDatepicker).find('.t-check-in-mobile').html($('.booking-engine .t-date-check-in').html());
    $(objTDatepicker).find('.t-check-out-mobile').html($('.booking-engine .t-date-check-out').html());


    /*For tracking*/
    fnBwClickDateCO(objTDatepicker);
}
//#endregion 

//#region disable dates function 
//checkin calendar
function fnBwCheckInCalendarSetAvailabilityPriceMarketingAssetAndOthers() {
    fnBwCheckInCalendarDisableDaysOfWeek();
    var elementSelector = ".booking-engine .checkInDate [data-t-date]";
    $(elementSelector).each(function () {
        if ($(this).attr("data-t-date") != "") {
            var dateMoment = moment(moment(new Date(parseInt($(this).attr("data-t-date")))).format("YYYY-MM-DD"));

            //assuming that current selected date is outside disabled date range
            var outsideDisabledDateRange = true;

            //code to check if current selected date is outside disabled date range
            if (typeof glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate != "undefined") {
                if (dateMoment.isValid()) {
                    var disableDateFromCheck = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate);
                    var disableDateToCheck = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate);
                    if (dateMoment._d >= disableDateFromCheck._d
                        && dateMoment._d <= disableDateToCheck._d) {
                        $(this).addClass("t-disabled");
                        outsideDisabledDateRange = false;
                    }
                }
            }

            if (dateMoment.isValid() && outsideDisabledDateRange) {

                //code fix to following 1 line might have to be done
                //if min nights > 1 than last checkin date shud be min nights before end date of offer


                if (dateMoment._d >= moment(glblBwConfiguration.offer.endDate)
                    .subtract(glblBwConfiguration.offer.minNights - 1, "days")._d) {
                    $(this).addClass("t-disabled");
                }
                else if (dateMoment._d >= glblBwToday) {

                    //set price and sold out dates
                    if (glblBwArrDoNotUseSoldOutDatesForHotels.indexOf(glblBwConfiguration.hotelCode.toUpperCase()) == -1) {
                        if (glblBwConfiguration.AvailabilityAndPrice != null) {

                            //check if today and any further dates available as per min nights required
                            //for (var i = 0; i < glblBwConfiguration.offer.minNights; i++) {
                            //    var dateMomentString = dateMoment.clone().add(i, "days").format("YYYY-MM-DD");

                            //    //if (glblBwConfiguration.AvailabilityAndPrice.indexOf(dateMomentString) != -1) {
                            //    //    if (i == 0) {
                            //    //        blThisDateSoldOut = true;
                            //    //    }
                            //    //    else {
                            //    //        blThisDateNotAvailableForCheckIn = true;
                            //    //    }
                            //    //}


                            //}

                            var tempArrayDates = glblBwConfiguration.AvailabilityAndPrice.filter(function (item) {
                                return item.date == dateMoment.format("YYYY-MM-DD");
                            })[0];


                            if (typeof tempArrayDates != "undefined") {
                                var momentDateTempArray = moment(tempArrayDates.date, "YYYY-MM-DD");

                                if (tempArrayDates.restrictionType.toLowerCase() == "close") {
                                    $(this).addClass("t-disabled " + glblBwConfiguration.hotelCode + "" + dateMoment.format("YYYYMM") +"");
                                     //code for closed hotel date
                                    if (glblBwConfiguration.hotelCode == "HBJAIVA") {
                                        if($(this).hasClass("HBJAIVA202307") || $(this).hasClass("HBJAIVA202308")){
                                            $(this).addClass("closedHotel");
                                            $(this).parents(".t-table-wrap").addClass("hotelClosedTable");
                                        }
                                       
                                    }

                                    $(this).addClass("soldOutDate " + glblBwConfiguration.hotelCode + "" + dateMoment.format("YYYYMM") +"");
                                }


                                else {
                                    if (fnBwBoolShowPricesOnHotels()) {
                                        var tempHtml = $(this).html();
                                        if (tempHtml.indexOf('date-price') == -1) {
                                            $(this).html(tempHtml + "<span class='date-price'>" + fnBwNumberWithCommas(tempArrayDates.minimumPrice) + "</span>");
                                        }
                                    }
                                    if (tempArrayDates.restrictionType.toLowerCase() == "minstay"
                                        || tempArrayDates.restrictionType.toLowerCase() == "minstayoncheckin"
                                    ) {
                                        if (glblBwConfiguration.hotelCode.toUpperCase() != "HBCOKVR") {
                                            $(this).addClass("t-message-day minNightRequired");
                                            $(this).attr("restriction-type", "minstay");
                                            $(this).attr("duration-stay", parseInt(tempArrayDates.durationOfStay));
                                            $(".t-hover-day-content").remove();
                                            $(this).html($(this).html() + "<span class='t-message-day-content'>Min." + parseInt(tempArrayDates.durationOfStay) + " Nights Stay required</span><span class='t-message-day-restricted'></span>");
                                        }
                                    }
                                }
                            }

                        }
                    }
                    //marketing assets
                    //class name - marketingFlag
                    //disabled date range
                    //disabled days of week
                    //disabled individual dates
                }
            }
        }
    });

}
function fnBwCheckInCalendarDisableDatesInDateRange() {
    if (glblBwConfiguration.offer.disabledDateRange.exists) {
        // var disableDateFrom = new Date(parseInt($(index + " .checkOutDate tbody td.t-start").attr("data-t-date")));
        var disableDateFrom = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate);
        var disableDateTo = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate);
        var elementSelector = ".booking-engine .checkInDate [data-t-date]";
        $(glblBwLastClickedObj).find(".checkInDate [data-t-date]").each(function () {
            //the following code has date format issue as datepicker cells always return 5:50 AM of IST - pls fix it before using
            var dateMoment = moment(moment(new Date(parseInt($(this).attr("data-t-date")))).format("YYYY-MM-DD"));
            if (dateMoment._d >= disableDateFrom
                && dateMoment._d <= disableDateTo) {
                $(this).addClass("t-disabled");
            }
        });
    }
}
function fnBwCheckInCalendarDisableDaysOfWeek() {
    if (typeof glblBwConfiguration.offer.disabledDaysOfWeek != "undefined") {
        var disabledDaysOfWeek = glblBwConfiguration.offer.disabledDaysOfWeek;
        for (var i = 0; i < disabledDaysOfWeek.length; i++) {
            var dayCalendarTableCellIndex = disabledDaysOfWeek[i];
            //to set sunday day value as per booking calendar table cell index
            if (dayCalendarTableCellIndex == 0) dayCalendarTableCellIndex = 7;
            $(".booking-engine .checkInDate tbody td:nth-child(" + dayCalendarTableCellIndex + ")").addClass("t-disabled");
        }
    }
}

//checkout calendar
//fnBwCheckOutCalendarDisableDates
function fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers() {
    console.log("fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers called");

    var checkInDate = moment(moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD"));
    var nextDateToCheckInDate = checkInDate.clone().add(1, "days");
    var checkOutCalendarEndDate = fnBwGetCheckOutCalendarEndDate(checkInDate);

    var elementSelector = ".booking-engine .checkOutDate [data-t-date]";
    $(elementSelector).each(function () {
        if ($(this).attr("data-t-date") != "") {
            var dateMoment = moment(moment(new Date(parseInt($(this).attr("data-t-date")))).format("YYYY-MM-DD"));

            //assuming that current selected date is outside disabled date range
            var outsideDisabledDateRange = true;

            //code to check if current selected date is outside disabled date range
            if (typeof glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate != "undefined") {
                if (dateMoment.isValid()) {
                    var disableDateFromCheck = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate);
                    var disableDateToCheck = moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate);
                    if (dateMoment._d >= disableDateFromCheck._d
                        && dateMoment._d <= disableDateToCheck._d) {
                        outsideDisabledDateRange = false;
                        if (!dateMoment.isSame(disableDateFromCheck))
                            $(this).addClass("t-disabled");
                    }
                }
            }
            if (dateMoment.isValid() && outsideDisabledDateRange) {
                if (dateMoment._d >= glblBwToday) {


                    if (dateMoment._d > checkOutCalendarEndDate._d) {
                        // console.log(dateMoment._d);
                        $(this).addClass("t-disabled");
                    }
                    else {

                        //disable dates in checkout calendar
                        if (glblBwConfiguration.offer.minNights > 1) {
                            var disableDateFrom = checkInDate.clone().add(1, "days");
                            var disableDateTo = checkInDate.clone().add(glblBwConfiguration.offer.minNights - 1, "days");
                            if (dateMoment._d >= disableDateFrom._d
                                && dateMoment._d <= disableDateTo._d) {
                                $(this).addClass("t-disabled");
                            }
                            var checkinAndLastDateDifference = parseInt(getDateDifference(checkInDate.format("YYYY-MM-DD"), checkOutCalendarEndDate.format("YYYY-MM-DD"), "YYYY-MM-DD"));
                            if (checkinAndLastDateDifference >= glblBwConfiguration.offer.minNights && dateMoment.format("YYYY-MM-DD") == checkOutCalendarEndDate.format("YYYY-MM-DD")) {
                                $(this).removeClass("t-disabled");
                            }  
                        }
                    }


                    if (glblBwArrDoNotUseSoldOutDatesForHotels.indexOf(glblBwConfiguration.hotelCode.toUpperCase()) == -1) {
                        if (glblBwConfiguration.AvailabilityAndPrice != null) {
                            var blThisDateSoldOut = false;
                            var blThisDateNotAvailableForCheckIn = false;
                            //check if today and any further dates available as per min nights required
                            //for (var i = 0; i < glblBwConfiguration.offer.minNights; i++) {
                            //    var dateMomentString = dateMoment.clone().add(i, "days").format("YYYY-MM-DD");

                            //    //if (glblBwConfiguration.AvailabilityAndPrice.indexOf(dateMomentString) != -1) {
                            //    //    if (i == 0) {
                            //    //       blThisDateSoldOut = true;
                            //    //    }
                            //    //    else {
                            //    //        blThisDateNotAvailableForCheckIn = true;
                            //    //    }
                            //    //}

                            //    var tempArrayDates = glblBwConfiguration.AvailabilityAndPrice.filter(function (item) {
                            //        return item.date == dateMoment.format("YYYY-MM-DD");
                            //    })[0];

                            //    if (typeof tempArrayDates != "undefined") {
                            //        if (tempArrayDates.restrictionType.toLowerCase() == "close") {
                            //          blThisDateSoldOut = true;
                            //        }
                            //    }

                            //}


                            var tempArrayDates = glblBwConfiguration.AvailabilityAndPrice.filter(function (item) {
                                return item.date == dateMoment.format("YYYY-MM-DD");
                            })[0];

                            if (typeof tempArrayDates != "undefined") {
                                if (tempArrayDates.restrictionType.toLowerCase() == "close") {
                                    if (!$(this).hasClass("t-end"))
                                        $(this).addClass("soldOutDate " + glblBwConfiguration.hotelCode + "" + dateMoment.format("YYYYMM") +"");
                                }
                                else {
                                    if (fnBwBoolShowPricesOnHotels()) {
                                        var tempHtml = $(this).html();
                                        if (tempHtml.indexOf('date-price') == -1) {
                                            $(this).html(tempHtml + "<span class='date-price'>" + fnBwNumberWithCommas(tempArrayDates.minimumPrice) + "</span>");
                                        }
                                    }

                                    if (glblBwConfiguration.hotelCode.toUpperCase() != "HBCOKVR") {
                                        if (tempArrayDates.restrictionType.toLowerCase() == "minstay"
                                            || tempArrayDates.restrictionType.toLowerCase() == "minstayoncheckin"
                                        ) {
                                            $(this).addClass("t-message-day minNightRequired");
                                            $(this).attr("restriction-type", "minstay");
                                            $(this).attr("duration-stay", parseInt(tempArrayDates.durationOfStay));
                                            $(".t-hover-day-content").remove();
                                            $(this).html($(this).html() + "<span class='t-message-day-content'>Min." + parseInt(tempArrayDates.durationOfStay) + " Nights Stay required</span><span class='t-message-day-restricted'></span>");


                                        }
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }
    });

}
//#endregion


if (glblBwWinW < glblBwMobilDeviceMaxWidth) {
    glblBwIsMobile = true;
    glblBwNumCalendar = 12;
    glblBwBlCalendarAutoClose = false;
}

//Set and show global error messge on hotel change, night change and page load
function fnBwSetGlobalErrorMessage() {
    console.log("fnBwSetGlobalErrorMessage called");

    var htmlErrorMessage = "";
    var isValidForBooking = true;
    var defaultMinNight = 1;
    var tempArrayClosedDates = [];
    var tempArrayRestrictedDates = [];
    var tempArrayRestrictedOnCheckInDates = [];
    var blThisDateSoldOut = false;
    var blThisDateRestricted = false;
    var blThisDateRestrictedOnCheckIn = false;
    var blIsValidStay = true;
    glblBwConfiguration.ErrorMessage = "";

    $('.booking-engine .calender-dynamic-text').hide();
    $('.booking-engine .calender-dynamic-text').html("");
    $('.booking-engine .calender-dynamic-text-mobile').html("");

    var checkInDate = "";
    var checkOutDate = "";
    if (typeof glblBwLastClickedObj != "undefined") {
        checkInDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[0]);
        checkOutDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[1]);
    }
    else {
        checkInDate = moment($('.booking-engine .t-datepicker').tDatePicker('getDates')[0]);
        checkOutDate = moment($('.booking-engine .t-datepicker').tDatePicker('getDates')[1]);
    }


    var blIsNoRoom = false;
    var blIsMinStayRequired = false;

    var tempDate = moment(checkInDate).clone();

    var hotelofferingid = "";
    if (glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR") {
        hotelofferingid = glblBwConfiguration.hotelCode + "-" + glblBwConfiguration.offer.minNights;
    }
    else {
        hotelofferingid = glblBwConfiguration.hotelCode;
    }





    var hotelAvailabilityAndPriceData = arrCalendarSoldOutDates.filter(function (item) {
        return item.hotelofferingid.toLowerCase() == hotelofferingid.toLowerCase();
    })[0];

    if (glblBwConfiguration.AvailabilityAndPrice != null) {

        while (tempDate._d >= checkInDate._d && tempDate._d < checkOutDate._d) {
            //console.log("tempDate=" + tempDate.format("YYYY-MM-DD"));
            var tempArrayDates = glblBwConfiguration.AvailabilityAndPrice.filter(function (item) {
                return item.date == tempDate.format("YYYY-MM-DD");
            })[0];

            if (typeof tempArrayDates != "undefined") {
                console.log("tempDate1 =" + tempDate.format("YYYY-MM-DD") + tempArrayDates.restrictionType + "--");
                if (tempArrayDates.restrictionType.toLowerCase() == "close") {
                    blThisDateSoldOut = true;
                    blIsValidStay = false;
                    tempArrayClosedDates.push(tempDate.format("YYYY-MM-DD"));
                }
                else if (tempArrayDates.restrictionType.toLowerCase() == "minstay"
                    && checkOutDate.diff(checkInDate, 'days') < parseInt(tempArrayDates.durationOfStay)
                ) {
                    blThisDateRestricted = true;
                    blIsValidStay = false;
                    tempArrayRestrictedDates.push(tempDate.format("YYYY-MM-DD"));
                    defaultMinNight = tempArrayDates.durationOfStay;

                }
                else if (tempDate.isSame(checkInDate)
                    && tempArrayDates.restrictionType.toLowerCase() == "minstayoncheckin".toLowerCase()
                    && checkOutDate.diff(checkInDate, 'days') < parseInt(tempArrayDates.durationOfStay)
                ) {
                    blThisDateRestrictedOnCheckIn = true;
                    blIsValidStay = false;
                    tempArrayRestrictedOnCheckInDates.push(tempDate.format("YYYY-MM-DD"));
                    defaultMinNight = tempArrayDates.durationOfStay;
                }
                //tempArrayRestrictedOnCheckInDates
            }

            tempDate.add(1, "days");
        }

    }



    var formatedSoldOutDate = fnBwConverTagsInNumberToSuperScript(moment(tempArrayClosedDates[0]).format(glblBwErrorMessageMomentDateFormat));
    var formatedRestrictedDate = fnBwConverTagsInNumberToSuperScript(moment(tempArrayRestrictedDates[0]).format(glblBwErrorMessageMomentDateFormat));
    var formatedRestrictedOnCheckInDate = fnBwConverTagsInNumberToSuperScript(moment(tempArrayRestrictedOnCheckInDates[0]).format(glblBwErrorMessageMomentDateFormat));

    if (blThisDateSoldOut) {
        if (tempArrayClosedDates.length > 1)
            htmlErrorMessage = "Rooms are not available on " + formatedSoldOutDate + " and other selected dates.";
        else
            htmlErrorMessage = "Rooms are not available on " + formatedSoldOutDate + ".";
    }
    else if (blThisDateRestricted) {
        htmlErrorMessage = formatedRestrictedDate + " is a restricted date. Minimum " + defaultMinNight + " nights stay required.";
    }
    else if (blThisDateRestrictedOnCheckIn) {
        htmlErrorMessage = formatedRestrictedOnCheckInDate + " is a restricted date. Minimum " + defaultMinNight + " nights stay required.";
    }
    else {
        //$('.booking-engine .t-datepicker').tDatePicker('hide');
        fnBwCloseAllDropDowns();
        htmlErrorMessage = "";
    }

    console.log(11111111111111111111);
    if (htmlErrorMessage != "") {
        if (typeof $(".booking-engine .calender-dynamic-text") != "undefined") {
            $(".booking-engine .calender-dynamic-text").remove();
        }
        $('.booking-engine .t-datepicker-days').append('<div class="calender-dynamic-text" style="display:none;"></div>');
        $('.booking-engine .calender-dynamic-text').show();
        $('.booking-engine .calender-dynamic-text').html(htmlErrorMessage);
        $('.booking-engine .calender-dynamic-text-mobile').html(htmlErrorMessage);
        $(".booking-engine .offerMsgWrap").html(htmlErrorMessage);
        //$(".booking-engine .offerMsgWrap").show();
        glblBwConfiguration.ErrorMessage = htmlErrorMessage;
        fnBwHoveCheckInCheckOutDateChange();
    }

}

function fnBwConverTagsInNumberToSuperScript(str) {
    return str.replace(/(\d+)(st|nd|rd|th)/, "$1<sup>$2</sup>");
}

function fnBwGetCheckOutCalendarEndDate(checkInDate) {
    console.log("fnBwGetCheckOutCalendarEndDate called");
    // console.log("fnBwGetCheckOutCalendarEndDate checkin date - ", checkInDate);
    var tempDate = moment(checkInDate);
    var maxCheckOutDate = moment(checkInDate).clone().add(30, "days");

    while (tempDate._d <= maxCheckOutDate._d) {
        tempDate.add(1, "days");
        //get weekday mon, tue etc
        tempDateDay = tempDate.day();

        if (tempDate._d > moment(glblBwConfiguration.offer.endDate)._d) {
            console.log("fnBwGetCheckOutCalendarEndDate - offer.endDate");
            break;
        }

        if (
            glblBwConfiguration.offer.disabledDaysOfWeek.length > 0 &&
            glblBwConfiguration.offer.disabledDaysOfWeek.indexOf(tempDateDay) != -1
        ) {
            console.log("fnBwGetCheckOutCalendarEndDate - Day of week");
            break;
        }

        if (
            glblBwConfiguration.offer.disabledDates.length > 0 &&
            glblBwConfiguration.offer.disabledDates.indexOf(tempDate.format("YYYY-MM-DD")) != -1
        ) {
            console.log("fnBwGetCheckOutCalendarEndDate - in disabled dates");
            break;
        }

        if (
            glblBwConfiguration.offer.disabledDateRange.exists &&
            tempDate._d >= moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate)._d &&
            tempDate._d <= moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate)._d
        ) {
            console.log("fnBwGetCheckOutCalendarEndDate - in disabled date range");
            break;
        }


        //if (glblBwConfiguration.AvailabilityAndPrice != null) {
        //    if (glblBwArrDoNotUseSoldOutDatesForHotels.indexOf(glblBwConfiguration.hotelCode.toUpperCase()) == -1) {
        //        var dateMomentString = tempDate.format("YYYY-MM-DD");
        //        if (glblBwConfiguration.AvailabilityAndPrice.indexOf(dateMomentString) != -1) {
        //            console.log("fnBwGetCheckOutCalendarEndDate - in not available dates");
        //            break;
        //        }
        //    }
        //}
    }
    console.log("fnBwGetCheckOutCalendarEndDate -- " + tempDate.format("YYYY-MM-DD"));
    return tempDate;
}

function fnBwShowCruisePopupScreen(_hotelcode) {
    $(".availability-cta .boxColumn").addClass('bEnginepopUp');
    $('body').css('overflow', 'hidden');
    $(".availability-cta .booking-engine").toggle();
    $('.bookingEnginePopOverlay').addClass('active');

    //setTimeout(function () {
    //    fnInitializeCruiseCalander(_hotelcode);
    //},100);

}


function fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget() {


    //$('.booking-engine .calender-dynamic-text').hide();
    //$('.booking-engine .calender-dynamic-text').html("");
    //$('.booking-engine .calanderBottomMessage').html("");


    //if (
    //    glblBwConfiguration.offer.disabledDateRange.exists &&
    //    moment(glblBwConfiguration.offer.disabledDateRangeTextToBeDisplayedTillDate)._d <= new Date()
    //) {
    //    var htmlMessage = glblBwConfiguration.offer.disabledDateRange.disabledDateRangeText;
    //    if (htmlMessage != "") {

    //        if (typeof $(".booking-engine .calender-dynamic-text") != "undefined") {
    //            $(".booking-engine .calender-dynamic-text").remove();
    //        }
    //        $('.booking-engine .t-datepicker-days:not(.layout2)').prepend('<div class="calender-dynamic-text" style="display:none;"></div>');

    //        $('.booking-engine:not(.layout2) .calender-dynamic-text').show();
    //        $('.booking-engine:not(.layout2) .calender-dynamic-text').html(htmlMessage);
    //        if ($('.booking-engine.layout2 .calanderBottomMessage').length > 0) {
    //            $('.booking-engine.layout2 .calanderBottomMessage').html(htmlMessage);
    //        }
    //    }
    //}

}

function fnBwIsAnyArray1DateExistInArray2(dateArray1, dateArray2) {
    var isMonthDateMatched = false;
    for (var i = 0; i < dateArray1.length; i++) {
        var strMonthAndDate1 = moment(dateArray1[i], "YYYY-MM-DD").format("YYYY-MM").toString();
        for (var j = 0; j < dateArray2.length; j++) {
            var strMonthAndDate2 = moment(dateArray2[j], "YYYY-MM-DD").format("YYYY-MM").toString();

            if (strMonthAndDate1 == strMonthAndDate2) {
                isMonthDateMatched = true;
            }
        }
    }

    return isMonthDateMatched;
}

function fnBwSetCheckOutDate() {


    if (glblBwConfiguration.hotelCode.toLocaleUpperCase() == "HBCOKVR") {

        if (glblBwConfiguration.offer.minNights > 1) {
            var checkInDate = moment(moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD"));
            //update checkout date
            var checkOutDate = moment(moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD"));

            var datedifference = checkOutDate.diff(checkInDate, 'days');
            if (glblBwConfiguration.offer.showNightBasedOfferDropdown
                ||
                datedifference < glblBwConfiguration.offer.minNights) {
                //alert(checkInDate.add(glblBwConfiguration.offer.minNights, 'days').format("YYYY-MM-DD"));
                $('.booking-engine .t-datepicker').tDatePicker('updateCI', checkInDate.format("YYYY-MM-DD"));
                $('.booking-engine .t-datepicker').tDatePicker('updateCO', checkInDate.add(glblBwConfiguration.offer.minNights, 'days').format("YYYY-MM-DD"));

                fnBwSetGlobalErrorMessage();
                //fnBwCloseAllDropDowns();
            }

        }
    }
    else {
        /*Add blank value on checkout calendar */
        $('.booking-engine .t-check-out .t-date-check-out').html('<label class="t-date-info-title">Check Out</label><span class="t-day-check-out"> </span><span class="t-month-check-out"> </span><span class="t-year-check-out"> </span></div>');
        $('.booking-engine .t-check-out input').val('');


        /*Remove required class from both checkin and checkout calendar */
        var elementSelector = ".booking-engine [data-t-date]";
        $(elementSelector).each(function () {
            if ($(this).hasClass("soldOutDate") == false || $(this).hasClass("t-disabled") == false) {
                $(this).removeClass("t-range t-highlighted t-end t-range t-range-limit");
                $(this).addClass("t-day");
            }
        });
    }
}

function fnBwDisplayInvalidNumberOfNightsSelectedMessage() {
    if (glblBwConfiguration.offer.showNightBasedOfferDropdown) {
        var checkInDate = moment(moment($('.booking-engine .t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD"));
        var checkOutDate = moment(moment($('.booking-engine .t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD"));
        var datedifference = checkOutDate.diff(checkInDate, 'days');
        if (datedifference != glblBwConfiguration.offer.minNights) {
            //display message
        }
    }
}

function fnBwCalendarAddNextPrevEventHandler() {

    $(".booking-engine .t-next,.booking-engine .t-prev").unbind();
    $(".booking-engine .t-next,.booking-engine .t-prev").click(function () {
        setTimeout(function () {

            fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();

            //disable checkin calendar dates
            //if checkin calendar
            fnBwCheckInCalendarSetAvailabilityPriceMarketingAssetAndOthers();

            //disable checkout calendar dates
            //if checkout calendar
            fnBwCheckOutCalendarSetAvailabilityPriceMarketingAssetAndOthers();


            fnBwDisplayMarketingAssetsInCalendar();

            //this function change date  on hover for apperance purpose only
            fnBwHoveCheckInCheckOutDateChange();
        }, 1);
    });
}

function fnBwShowAdditionalHeaderForCalendarInMobile(objTDatepicker) {
    var objBE = $(objTDatepicker).closest('.booking-engine');
    $(objBE).find('.t-mobile-heading').show();
    $(objBE).find('.t-check-in-mobile').html($(objBE).find('.t-date-check-in').html());
    $(objBE).find('.t-check-out-mobile').html($(objBE).find('.t-date-check-out').html());
}

function fnBwHideAdditionalHeaderForCalendarInMobile() {
    $('.booking-engine .t-mobile-heading').hide();
    $('.booking-engine .t-datepicker').tDatePicker('hide');
}

function fnBwGetInitialCheckinDate() {
    var tempDate;
    var _startDate = moment(glblBwConfiguration.offer.startDate)._d;
    if (_startDate > glblBwToday)
        tempDate = moment(glblBwConfiguration.offer.startDate)
    else
        tempDate = moment().startOf('day');

    for (i = 0; i < 700; i++) {
        var blUseThisDate = true;
        var tempDateDay = tempDate.day();

        if (glblBwConfiguration.offer.disabledDaysOfWeek.length > 0 &&
            glblBwConfiguration.offer.disabledDaysOfWeek.indexOf(tempDateDay) != -1) {
            blUseThisDate = false;
        }

        if (glblBwConfiguration.offer.disabledDates.length > 0 &&
            glblBwConfiguration.offer.disabledDates.indexOf(tempDate.format("YYYY-MM-DD")) != -1) {
            blUseThisDate = false;
        }

        if (glblBwConfiguration.offer.disabledDateRange.exists &&
            tempDate._d >= moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate)._d &&
            tempDate._d <= moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate)._d) {
            blUseThisDate = false;
        }

        //check if today and any further dates available as per min nights required
        if (glblBwConfiguration.AvailabilityAndPrice != null) {
            if (glblBwArrDoNotUseSoldOutDatesForHotels.indexOf(glblBwConfiguration.hotelCode.toUpperCase()) == -1) {
                for (var i = 0; i < glblBwConfiguration.offer.minNights; i++) {
                    var dateMomentString = tempDate.clone().add(i, "days").format("YYYY-MM-DD");


                    var tempArrayDates = glblBwConfiguration.AvailabilityAndPrice.filter(function (item) {
                        return item.date == dateMomentString;
                    })[0];

                    if (typeof tempArrayDates != "undefined") {
                        if (tempArrayDates.restrictionType.toLowerCase() == "close") {
                            blUseThisDate = false;
                        }
                    }
                }
            }
        }

        if (blUseThisDate) {
            break;
        }
        tempDate.add(1, "days");
    }
    if (tempDate._d > moment(glblBwConfiguration.offer.endDate)._d) {
        var errMessage = "Either the booking engine has some problem or current offer is no more available. The website admin has been informed. Apologies for inconvenience.";
        fnBwSomeErrorOccredInBW(errMessage);
    }
    return tempDate;
}


function fnBwGuestShowHideGuestBasedOnAdultsOnClick() {
    /*guest reset*/

   

    setTimeout(function () {


        if ($('.booking-engine .DropDownExtraGuest').length > 0) {
            $(".extraAdult,.extraChild").show();
        }
        else {
            $(".extraAdult,.extraChild").hide();
        }


        $(glblBwLastClickedObj).find('.noOfGuestWrap .addGuestDropDown .blockWrapper .block .roomGuestCount .choose.adult .number ul li.active').each(function () {

            $(this).closest('.number').find('li').removeClass('active');
            $(this).addClass('active');

            if ($('.DropDownExtraGuest').length > 0) {
                var _currIndex = $(this).index();
                var _this = $(this);
                var _childRemain = 3;
                $(this).closest('.block').find('.child .number ul li').hide();
                _childRemain = _childRemain - _currIndex - 1;
                for (i = 0; i <= _childRemain; i++) {
                    _this.closest('.block').find('.child .number ul li:eq(' + i + ')').show();
                }

                if ($(this).text() == 4) {
                    _this.closest('.block').find('.child .closeIcn').click();
                }

            }


        });

    }, 10);

}


function fnBwGuestReset() {
/*guest reset*/

    $(glblBwLastClickedObj).find('.addGuestDropDown .blockWrapper .block').eq(0).find('.editBlock .closeIcn').click();
    //console.log('delet guest row: ' + i);

   

        $(glblBwLastClickedObj).find('.addGuestDropDown .individualRoomSection').eq(0).find('.adult .number li').removeClass('active');
        $(glblBwLastClickedObj).find('.individualRoomSection').eq(0).find('.adult .number li').eq(1).addClass('active');
        $(glblBwLastClickedObj).find('.individualRoomSection').eq(0).find('.child .number li').removeClass('active');
        $(glblBwLastClickedObj).find('.individualRoomSection').eq(0).find('.child .number li').css("display", "");
      
        $(glblBwLastClickedObj).find('.roomGuestCount').find('.adult .number li').removeClass('active');
        $(glblBwLastClickedObj).find('.roomGuestCount').find('.adult .number li').eq(1).addClass('active');
        $(glblBwLastClickedObj).find('.roomGuestCount').eq(0).find('.child .number li').removeClass('active');
        $(glblBwLastClickedObj).find('.roomGuestCount').eq(0).find('.child .number li').css("display", "");
        $(glblBwLastClickedObj).find('.roomGuestCount').find('.child .number li').css("display", "");
    
        $(glblBwLastClickedObj).find('.individualRoomSection').eq(0).find('.child .closeIcn').click();
        $(glblBwLastClickedObj).find('.roomGuestCount').eq(0).find('.child .closeIcn').click();
        $(glblBwLastClickedObj).find('.individualRoomSection').eq(0).find('.editBlock .edit').click();
      
        $(glblBwLastClickedObj).find('.block').eq(0).find('.child .closeIcn').click();
        $(glblBwLastClickedObj).find('.block').eq(0).find('.editBlock .edit').click();

    //setTimeout(function () { $(glblBwLastClickedObj).find('.actionWrap .actionButton').click(); }, 10);
    


   
}

function fnBwSetupBookingWidget(_hotelcode) {

    $(".booking-engine .offerMsgWrap").html("");
    $(".booking-engine .offerMsgWrap").hide();

    $(".booking-engine .checkInCheckOut").removeClass("cruiseCalenderDefaultScreen cruiseSelected");
    $(".booking-engine .checkInCheckOut").attr("onClick", "");
    $(".booking-engine.layout2 .selectEmbarkationBox").hide();
    $(".booking-engine .selectedEmbarkationDtls ").hide();

    /*select configuration by hotel code*/
    if (typeof arrBwConfiguration != "undefined") {
        glblBwConfiguration = arrBwConfiguration.filter(function (item) {
            return item.hotelCode.toLowerCase() == _hotelcode.toLowerCase();
        })[0];
    }


    if (glblBwConfiguration != null) {
        /*set hotel name and other details*/
        var objHotelNameCodesAndOtherDetails = JSON.parse(JSON.stringify(arrHotelNameCodesAndOtherDetails.filter(function (item) {
            return item.hotelCode.toLowerCase() == glblBwConfiguration.hotelCode.toLowerCase();
        })[0]));
        glblBwConfiguration.hotelName = objHotelNameCodesAndOtherDetails.hotelName;
        glblBwConfiguration.hotelCity = objHotelNameCodesAndOtherDetails.hotelCity;
        glblBwConfiguration.hotelCompleteName = objHotelNameCodesAndOtherDetails.hotelCompleteName;


        /*Remove cLasses and pointer events*/
        $('.booking-engine .checkInDate').removeClass('dateDisabled ');
        $('.booking-engine .checkOutDate').removeClass('dateDisabled');
        $(".booking-engine.bkhOffset .checkInDate").css("pointer-events", "auto");

        //Special Case philae and zahra
        if (_hotelcode.toLocaleUpperCase() == "HBASWZA" || _hotelcode.toLocaleUpperCase() == "HBASWPH") {
            $('.booking-engine .checkInDate').addClass('dateDisabled');
            $('.booking-engine .checkOutDate').addClass('dateDisabled');
            setTimeout(function () {
                fnInitializeCruiseCalander(_hotelcode);
            }, 5);

            if (typeof glblBwLastClickedObj != "undefined") {
                if (!glblBwLastClickedObj.hasClass("layout2")) {
                    fnBwShowCruisePopupScreen(_hotelcode);
                }
            }
        }
        //Special case for Kerala Vrinda
        else if (_hotelcode.toUpperCase() == "HBCOKVR") {
            /*temporary commented line number 2600*/
           // $('.booking-engine .checkOutDate').addClass('dateDisabled');
            if (typeof glblBwLastClickedObj != "undefined") {
                if (!glblBwLastClickedObj.hasClass("layout2")) {
                    fnBwShowCruisePopupScreen(_hotelcode);
                }
            }

            /*Add cLasses and pointer events*/
            $(".checkInCheckOut").addClass("cruiseSelected");
            $(".booking-engine.bkhOffset .checkInCheckIn").attr("onClick", "fnBwShowCruisePopupScreen()");
            $(".booking-engine.bkhOffset .checkInCheckOut").attr("onClick", "fnBwShowCruisePopupScreen()");
            $(".booking-engine.bkhOffset .checkInDate").css("pointer-events", "none");
            $(".booking-engine.bkhOffset .checkOutDate").css("pointer-events", "none");

        }



        glblBwConfiguration.offer = JSON.parse(JSON.stringify(arrBwMasterConfiguration.filter(function (item) {
            return item.offerCode.toLowerCase() == glblBwConfiguration.offerCode.toLowerCase();
        })[0]));

        fnBwSetAvailabilityAndPriceInConfiguration();


        /*Add disabledDateRange JSON to existing configuration as this is hotel specific not offer.
        /This is used to display dynamic message on calendar*/
        jsonDataBookingWidget.filter(function (item) {
            if (item.hotel_code == glblBwConfiguration.hotelCode) {
                var boolExists = true;
                if (item.from_date == "" || item.till_date == "") {
                    boolExists = false;
                }
                glblBwConfiguration.offer.disabledDateRange = { exists: boolExists, disabledDateRangeStartDate: item.from_date, disabledDateRangeEndDate: item.till_date, disabledDateRangeText: item.display_message, disabledDateRangeTextToBeDisplayedTillDate: item.till_date };

            }
        })[0];



        /*Add rpcBasisOnDurationOfStay and all required JSON to existing configuration as this is hotel specific not offer.*/
        //if (glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR") {
        //    glblBwConfiguration.offer.showNightBasedOfferDropdown = true;
        //    glblBwConfiguration.offer.rpcVaryOnDurationOfStay = false;
        //    glblBwConfiguration.offer.rpcBasisOnDurationOfStay = [{ "label": "2 Nights and 3 Days", "minNights": 2, "blExactNights": true, "rpc": "", "blackedOutDateRanges": [], "ratePlanCodes": [] }, { "label": "3 Nights and 4 Days", "minNights": 3, "blExactNights": true, "rpc": "", "blackedOutDateRanges": [], "ratePlanCodes": [] }];
        //}

        //hide children based on configuration
        fnBwHideChildrenBasedOnConfiguration(glblBwConfiguration.offer.hideChildrenSelectionBox);

        //set offer end date to 1 less than what is given as last date is only for checkout
        //var momentTempEndDate = moment(glblBwConfiguration.offer.endDate);
        //momentTempEndDate = momentTempEndDate.subtract(1, 'days');
        //glblBwConfiguration.offer.endDate = momentTempEndDate.format("YYYY-MM-DD");





        //check if offer is expired
        if (glblBwConfiguration.offer.offerAvailableTillDate != null) {
            var offerAvailableTillDate = moment(glblBwConfiguration.offer.offerAvailableTillDate);
            if (offerAvailableTillDate.isValid() && offerAvailableTillDate._d < glblBwToday) {
                glblBwConfiguration.offer.startDate = "2000-01-01";
                glblBwConfiguration.offer.endDate = "2000-01-02";
            }
        }

        //add to discabled dated
        fnBwAddToDisabledDates();

        //add to disabled dates basis on enabled dates list
        fnBwAddToDisabledDatesBasisOnEnabledDatesList();

        console.log("_hotelcode---" + _hotelcode);       
        //change the following code as it is now using a patch to see if this is an offer page or not
        if ((_hotelcode == 'HBCCUOB' || _hotelcode == 'HBDXBOB') && glblBwConfiguration.offer.offerCode.toLowerCase().indexOf('default') != -1) {
            $('.booking-engine .addGuestDropDown').addClass('DropDownExtraGuest');          
        }
        else {
            $('.booking-engine .addGuestDropDown').removeClass('DropDownExtraGuest');
        }

       fnBwGuestReset();
        $('.booking-engine .allHotels li').removeClass('active');
        $('.booking-engine .allHotels li[data-hotelcode="' + _hotelcode + '"]').addClass('active');
        $('.booking-engine .hotelListDropDown').hide();
        var _layout2HotelNameHTML = "<abbr>" + glblBwConfiguration.hotelCity + "</abbr>" + glblBwConfiguration.hotelName;
        $('.booking-engine .hotelName .hotelLabel .name .mobileN').html(_layout2HotelNameHTML);
        var _hotelName = "";
        $('.booking-engine').find('.hotelName .hotelLabel .name .desktopN').html(glblBwConfiguration.hotelCompleteName);


        //Set default adult 
        fnBwSetDefaultAdult();

        //Add Disabled DateRange Text To Calender
        fnBwAddDisabledDateRangeTextToCalenderAndBookingWidget();

        //show or hide Night Based Offer Dropdown
        fnBwShowAndBindNightBasedOfferDropdown();

        //set promocode prefilled value
        fnBwPrefillPromocode();

        //initialize calendar
        fnBwInitializaCalendar();       
    }
    else {
        fnBwSomeErrorOccredInBW("configuration data for hotel code '" + _hotelcode + "' not found");
    }

}

//set price availability in glblBwConfiguration
function fnBwSetAvailabilityAndPriceInConfiguration() {

    var hotelofferingid = "";
    if (glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR") {
        hotelofferingid = glblBwConfiguration.hotelCode + "-" + glblBwConfiguration.offer.minNights;
    }
    else {
        hotelofferingid = glblBwConfiguration.hotelCode;
    }

    console.log("hotelofferingid=" + hotelofferingid);

    var hotelAvailabilityAndPriceData = arrCalendarSoldOutDates.filter(function (item) {
        return item.hotelofferingid.toLowerCase() == hotelofferingid.toLowerCase();
    })[0];

    if (hotelAvailabilityAndPriceData != null)
        glblBwConfiguration.AvailabilityAndPrice = hotelAvailabilityAndPriceData.dates;
    else
        glblBwConfiguration.AvailabilityAndPrice = null;
}

function fnBwPrefillPromocode() {
    $(".booking-engine .promocodeDropDown .promocode").val("");
    $(".booking-engine .promocodeDropDown .promocode").prop('disabled', false);

    if (typeof glblBwConfiguration.offer.promoCodePreFilledValue != "undefined" && glblBwConfiguration.offer.promoCodePreFilledValue != "") {
        $(".booking-engine .promocodeDropDown .promocode").val(glblBwConfiguration.offer.promoCodePreFilledValue);
        if (typeof glblBwConfiguration.offer.promoCodePreFilledNotEditable != "undefined" && glblBwConfiguration.offer.promoCodePreFilledNotEditable === true) {
            $(".booking-engine .promocodeDropDown .promocode").prop('disabled', true);
        }
    }
}

function fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange(blackedOutDateRanges) {

    console.log("fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange called");
    if (typeof blackedOutDateRanges == 'undefined') {
        return false;
    }
    else {
        var momentCheckInDate = moment(glblBwCheckindate);
        var momentCheckOutDate = moment(glblBwCheckoutdate);
        var blBlackoutDayMatched = false;
        blackedOutDateRanges.forEach(function (item) {
            var momentBlackedOutRangeStartDate = moment(item.startDate);
            var momentBlackedOutRangeEndDate = moment(item.endDate);
            if (momentCheckInDate._d >= momentBlackedOutRangeStartDate._d && momentCheckInDate._d <= momentBlackedOutRangeEndDate._d) {
                console.log("checkin blackout day matched");
                //alert("blackout day matched error");
                blBlackoutDayMatched = true;
            }
            if (momentCheckOutDate._d >= momentBlackedOutRangeStartDate._d && momentCheckOutDate._d <= momentBlackedOutRangeEndDate._d) {
                console.log("checkout blackout day matched");
                //alert("blackout day matched error");
                blBlackoutDayMatched = true;
            }
        });

        if (blBlackoutDayMatched) {
            console.log("fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange returning true");
            return true;
        }
        else {
            console.log("fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange returning false");
            return false;
        }
    }
}

function fnBwHideChildrenBasedOnConfiguration(hideChildrenSelectionBox) {

    if (hideChildrenSelectionBox) {
        $(".booking-engine .choose.child,.roomChild").hide();

        setTimeout(function () {
            $('.booking-engine .child li').each(function () {
                $(this).removeClass("active");
            });

            $('.booking-engine .childAgeWrap li').each(function () {
                $(this).removeClass("active");
            });

            $('.booking-engine .childAgeWrap').hide();

        }, 5);

    }
    else {
        $(".booking-engine .choose.child,.roomChild").show();
            $('.booking-engine .child li').each(function () {

                // if (glblBwConfiguration.hotelCode.toLocaleUpperCase() == "HBHRGOB") {
                //     if ($(this).text().indexOf("2") != -1) {
                //         $(this).removeClass("active");
                //         $(this).hide();
                //     }
                // }
                // else {
                //     $(this).show();
                // }
               
            });

            $('.booking-engine .childAgeWrap.childAge2 li').each(function () {
                // if (glblBwConfiguration.hotelCode.toLocaleUpperCase() == "HBHRGOB") {
                //     $(this).removeClass("active");
                //     $('.booking-engine .childAgeWrap.childAge2').hide();

                //     $('.booking-engine .individualRoomSection .roomGuestCount .roomChild').each(function () {
                //         if ($(this).text().indexOf("2") != -1) {
                //             console.log($(this).text("  ,1 Children"));
                //         }
                //     });
                // }
                // else {
                //     //$('.booking-engine .childAgeWrap.childAge2').show();
                // }
            });
    }
}

function fnBwAddToDisabledDates() {

    if (typeof glblBwConfiguration.offer.blackedOutDateRanges != "undefined" && glblBwConfiguration.offer.blackedOutDateRanges.length > 0) {

        for (var bindex = 0; bindex < glblBwConfiguration.offer.blackedOutDateRanges.length; bindex++) {
            var _tempDisabledDates = fnBwEnumerateDateFromStartAndEndDates(glblBwConfiguration.offer.blackedOutDateRanges[bindex].startDate, glblBwConfiguration.offer.blackedOutDateRanges[bindex].endDate, []);

            for (var disdates = 0; disdates < _tempDisabledDates.length; disdates++) {                
                glblBwConfiguration.offer.disabledDates.push(_tempDisabledDates[disdates]);
            }
        }       
    }
}

function fnBwAddToDisabledDatesBasisOnEnabledDatesList() {

    if (typeof glblBwConfiguration.offer.enabledDateRanges != "undefined" && glblBwConfiguration.offer.enabledDateRanges.length > 0) {
        var tempMoment = moment(glblBwConfiguration.offer.startDate);
        var momentEndDate = moment(glblBwConfiguration.offer.endDate);
        while (tempMoment._d <= momentEndDate._d) {
            var blDateDisabled = true;
            glblBwConfiguration.offer.enabledDateRanges.forEach(function (item) {
                var momentEnabledRangeStartDate = moment(item.startDate);
                var momentEnabledRangeEndDate = moment(item.endDate);
                if (tempMoment._d >= momentEnabledRangeStartDate._d && tempMoment._d < momentEnabledRangeEndDate._d) {
                    blDateDisabled = false;
                }
            });
            if (blDateDisabled) {
                glblBwConfiguration.offer.disabledDates.push(tempMoment.format("YYYY-MM-DD"));
            }
            tempMoment.add(1, "days");
        }
    }
}

function fnBwShowAndBindNightBasedOfferDropdown() {

    console.log("fnBwShowAndBindNightBasedOfferDropdown called");

    if (glblBwConfiguration.offer.showNightBasedOfferDropdown) {
        //bind nights dropdown data

        var nightsDropdownHtml = "";
        var nightBasedOfferDropdownValues = glblBwConfiguration.offer.rpcBasisOnDurationOfStay;
        for (i = 0; i < nightBasedOfferDropdownValues.length; i++) {
            var active = (i == 0) ? "class='active'" : "";
            var minNights = nightBasedOfferDropdownValues[i].minNights;
            var blExactNights = nightBasedOfferDropdownValues[i].blExactNights;
            var additionalRpcArrayString = nightBasedOfferDropdownValues[i].additionalRpcArrayString;

            var nightsDropdownOption = "<li " + active + " blExactNights = " + blExactNights + " rpc = '" + nightBasedOfferDropdownValues[i].rpc + "' additionalRpcArrayString = '" + additionalRpcArrayString.replace(/'/g, "\"") + "' value='" + minNights + "'>" + nightBasedOfferDropdownValues[i].label + "</li>";
            nightsDropdownHtml += nightsDropdownOption;
        }
        console.log("nightsDropdownHtml", nightsDropdownHtml);

        $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul").html(nightsDropdownHtml);
        if (glblBwConfiguration.offer.thisOfferIsBasedOnExactDropdownSelection) {
            $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul").addClass("thisOfferIsBasedOnExactDropdownSelection");
        }


        //set globalConfig MinNights value
        $(".booking-engine .NumberOfNights .desktopN").html(nightBasedOfferDropdownValues[0].label);
        var minNights = nightBasedOfferDropdownValues[0].minNights;
        glblBwConfiguration.offer.minNights = minNights;
        glblBwConfiguration.offer.rpc = nightBasedOfferDropdownValues[0].rpc;
        $(".booking-engine.layout2 .NumberOfNights").show();

        //night based offer dropdown - on change
        $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul li").unbind();
        $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul li").click(function () {

            //2222222222222222222222222222222222222222222
            console.log(".booking - engine.NumberOfNights.NumberOfNightsDropDown ul li click called");



            $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul li").removeClass("active");

            $(".booking-engine .NumberOfNights .NumberOfNightsDropDown ul li").removeClass("active");
            $(this).addClass("active");

            $(".booking-engine .NumberOfNights .desktopN").html($(this).html());
            $(".booking-engine .NumberOfNights .NumberOfNightsDropDown").hide();
            $('.booking-engine .NumberOfNightsLabel').removeClass('active');
            glblBwConfiguration.offer.minNights = parseInt($(this).val());
            glblBwConfiguration.offer.blExactNights = ($(this).attr("blExactNights") == "true");
            glblBwConfiguration.offer.rpc = $(this).attr("rpc");
            glblBwConfiguration.offer.rpcBasisOnDurationOfStayIndex = $(this).index();
            // set price and availability in configuration
            fnBwSetAvailabilityAndPriceInConfiguration();
            fnBwInitializaCalendar();
        });

        //add code to add or remove container class
        $(".booking-engine.bkhOffset").parents().eq(0).removeClass("container");
        $(".booking-engine.bkhOffset").parents().eq(0).addClass("container-offer-page");
    }
    else {
        $(".booking-engine .NumberOfNights").hide();
        //add code to add or remove container class
        $(".booking-engine.bkhOffset").parents().eq(0).removeClass("container-offer-page");
        $(".booking-engine.bkhOffset").parents().eq(0).addClass("container");
    }
}

/*If array containg hotelcode then these hotels willwill be visible in booking widget else all*/
function fnBwRemoveFromHotelsDropdownHotelsNotInConfigData() {
    console.log("fnBwRemoveFromHotelsDropdownHotelsNotInConfigData called");
    $('.booking-engine .allHotels li').each(function () {
        var _hotelCode = $(this).attr('data-hotelcode');
        var tempArray = arrBwConfiguration.filter(function (item) {
            return item.hotelCode.toLowerCase() == _hotelCode.toLowerCase();
        });
        if (tempArray.length == 0)
            $(this).remove();
    });


    var isGlobalPage = false;

    var currentURLPath = document.location.pathname.toLocaleLowerCase();

    if (currentURLPath.startsWith("/special-offers")
        || currentURLPath.startsWith("/partner")
        || currentURLPath.startsWith("/alliances")
        || currentURLPath.startsWith("/mmt-staypackage")
    ) {
        isGlobalPage = true;
    }
    else if (typeof ConfigurationName != "undefined" && ConfigurationName == "") {
        isGlobalPage = true;
    }

    if (typeof glblIsAHotelSpecificPage != "undefined") {
        if (!glblIsAHotelSpecificPage) {
            isGlobalPage = true;
        }
    }


    $('.booking-engine').each(function (index) {
        if (!isGlobalPage) {
            $('.booking-engine .hotelName').addClass('NoClick');
        }
        else {
            if ($('.booking-engine:eq(' + index + ')').length > 0) {
                $('.booking-engine:eq(' + index + ') .allHotels ul').each(function () {
                    if ($(this).html().trim() == "") {

                        if ($(".booking-engine:eq(0) [data-hotelcode]").length < 20) {
                            $(this).parents(".hotelList").parents(".allHotels").parents(".hotelListDropDown").addClass('singleHotelList');
                        }

                        $(this).parents(".hotelBlock").remove();
                    }
                });

                var hotelListCount = $('.booking-engine:eq(' + index + ') .allHotels ul li').length;
                if (hotelListCount == 1) {
                    $('.booking-engine .hotelName').addClass('NoClick');
                }
            }
        }

    });

}


/*hotel list dropdown direction basis on booking widget position*/
var glblBwCheckOffsetPosOfBE;
var fnBwDropDownPosition;
function fnBwSetHorizontalBookingWidgetOffsetEvaluation() {
    if ($('.booking-engine.bkhOffset').length) {
        setTimeout(function () {
            glblBwCheckOffsetPosOfBE = $('.booking-engine.bkhOffset').offset().top;
            fnBwDropDownPosition();
            $(window).scroll(function () {
                fnBwDropDownPosition();
            });
        }, 300);
    }
    fnBwDropDownPosition = function () {
        // top/bottom positioning
        var _scrollTop = $(window).scrollTop();
        var _checkCurrPosOfBE = glblBwCheckOffsetPosOfBE - _scrollTop;

        if (_checkCurrPosOfBE > glblBwWinH / 2) {
            $('.booking-engine').addClass('reverse');
        } else {
            $('.booking-engine').removeClass('reverse');
        }
        // left/right positioning
        $('.booking-engine').each(function () {
            var _leftOffset = $(this).offset().left;
            var _currWidth = $(this).width();
            if (_leftOffset > (glblBwWinW / 2)) {
                $(this).addClass('right');
            } else {
                $(this).addClass('left');
            }
        });
    }

}
$(window).load(function () {
    fnBwSetHorizontalBookingWidgetOffsetEvaluation();
});

$(document).ready(function () {
    console.log("ready called");

    //bind event handlers
    fnBwBindEventHandlers();

    //code to remove hotels from hotels dropdown if they are not in config data
    fnBwRemoveFromHotelsDropdownHotelsNotInConfigData();
    //code to initialize the booking widget for default hotel

    //if (typeof PageSection != "undefined") {
    //    if (PageSection != "offer") {
    //        glblBwDefaultHotelCode = $(".booking-engine:eq(0) ul li[data-hotelcode]:eq(0)").data("hotelcode");
    //    }
    //}

    fnBwSetHotelSelectedByHotelCode(glblBwDefaultHotelCode);
    //this is fired in $(document).ready(function () {}); in backendtasks.js

    //function use for ExperienceDetailspage Only
    fnBwRemoveFromHotelsDropdownHotelsForExperienceDetailsPage();

});


function fnBwgetMarketingAssetsMessageByHotel(_hotelcode) {
    var arrData = [];

    if (typeof arrCalendarMarketingAssetsMessage != "undefined" && typeof _hotelcode != "undefined") {
        for (var i = 0; i < arrCalendarMarketingAssetsMessage.length; i++) {
            if (arrCalendarMarketingAssetsMessage[i].hotelcode.toLowerCase() == _hotelcode.toLowerCase()) {
                arrData.push(arrCalendarMarketingAssetsMessage[i]);
                break;
            }
        }
    }

    return arrData;
}


function fnBwDisplayDynamicMesageInCalendar() {

    console.log("fnBwDisplayDynamicMesageInCalendar called");
    $('.booking-engine .calender-dynamic-text').hide();
    $('.booking-engine .calender-dynamic-text-mobile').html("");

    if (
        glblBwConfiguration.offer.disabledDateRange.exists &&
        moment()._d < moment(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeTextToBeDisplayedTillDate)._d

    ) {
        var htmlMessage = glblBwConfiguration.offer.disabledDateRange.disabledDateRangeText;
        if (htmlMessage != "") {


            /*Get hotelcode of current active hotel*/
            var activeHotelCode = glblBwConfiguration.hotelCode;
            /*Get date array from json data by enemurating start and end date*/
            var arrHotelSpecificDateArray = fnBwEnumerateDateFromStartAndEndDates(glblBwConfiguration.offer.disabledDateRange.disabledDateRangeStartDate, glblBwConfiguration.offer.disabledDateRange.disabledDateRangeEndDate, []);

            /*Get date array from ViewPort either from Desktop or on scroll on mobile*/
            var momentDates = fnBwDisplayMonthINCalenderInViewport();

            /*bool check if any date and month available in calendar vieePort matched in array of hotel specific date array*/
            var isMonthDateMatched = fnBwIsAnyArray1DateExistInArray2(momentDates, arrHotelSpecificDateArray);


            if (isMonthDateMatched) {
                if (typeof $(".booking-engine .calender-dynamic-text") != "undefined") {
                    $(".booking-engine .calender-dynamic-text").remove();
                }
                $('.booking-engine .t-datepicker-days').append('<div class="calender-dynamic-text" style="display:none;"></div>');

                $('.booking-engine .calender-dynamic-text').show();
                $('.booking-engine .calender-dynamic-text').html(htmlMessage);

                $('.booking-engine .calender-dynamic-text-mobile').html(htmlMessage);
                //if ($('.booking-engine.layout2 .calanderBottomMessage').length > 0) {
                //    $('.booking-engine.layout2 .calanderBottomMessage').html(htmlMessage);
                //}
            }
        }
    }
    fnBwCheckInCalendarDisableDatesInDateRange();
}

function fnBwDisplayMarketingAssetsInCalendar() {

    console.log("fnBwDisplayMarketingAssetsInCalendar called");
    /* global variable declared at the start*/
    if (glblBwDisplayMA) {
        // $('.booking-engine .marketingAssetsMessage').html("");
        $(".booking-engine .calender-dynamic-text-ma").html("");
        $(".booking-engine .calender-price-msg").html("");

        /*Get hotelcode of current active hotel*/
        var activeHotelCode = glblBwConfiguration.hotelCode;

        /*Get json data of 1 hotel*/
        var jsonData = fnBwgetMarketingAssetsMessageByHotel(activeHotelCode);
        if (jsonData.length > 0) {

            /*Get date array from json data by enemurating start and end date*/
            var arrHotelSpecificDateArray = fnBwEnumerateDateFromStartAndEndDates(fnBwgetMarketingAssetsMessageByHotel(activeHotelCode)[0].start_date, fnBwgetMarketingAssetsMessageByHotel(activeHotelCode)[0].end_date, []);

            /*Get date array from ViewPort either from Desktop or on scroll on mobile*/
            var momentDates = fnBwDisplayMonthINCalenderInViewport();

            /*bool check if any date and month available in calendar vieePort matched in array of hotel specific date array*/
            var isMonthDateMatched = fnBwIsAnyArray1DateExistInArray2(momentDates, arrHotelSpecificDateArray);


            $(".booking-engine .calender-dynamic-text-ma").remove();
            $('.booking-engine .t-datepicker-days').prepend('<div class="calender-dynamic-text-ma"></div>');

            if (isMonthDateMatched) {
                fnBwDisplayMarketingFlag(arrHotelSpecificDateArray);
                var finalMessage = "<span>" + fnBwgetMarketingAssetsMessageByHotel(activeHotelCode)[0].display_message + "</span>";
                // $('.booking-engine .marketingAssetsMessage').html(finalMessage);
                $(".booking-engine .calender-dynamic-text-ma").html(finalMessage);
            }

        }
        $(".booking-engine .calender-price-msg").remove();
        /*$('.booking-engine .t-datepicker-days').prepend('<div class="calender-price-msg">All Prices are in INR and for a single guest</div>');*/

    }

    if (fnBwBoolShowPricesOnHotels()) {
        if (glblBwConfiguration.hotelCode.toUpperCase() == "HBJAIVA".toUpperCase()) {
            $('.booking-engine .t-datepicker-days').prepend('<div class="calender-price-msg">Closed due to monsoon in July and August. Reopening on 1st September.</div>');
        }
        else {
            $('.booking-engine .t-datepicker-days').prepend('<div class="calender-price-msg">Prices are in INR, for a 01 night stay. Better offers may be available for longer stays.</div>');
        }
    }

    if (glblBwConfiguration.hotelCode.toUpperCase() == "HBDXBAZ".toUpperCase()) {

        if (typeof $(".booking-engine .calender-dynamic-text") != "undefined") {
            $(".booking-engine .calender-dynamic-text").remove();
        }

        var htmlErrorMessage = glblBwConfiguration.offer.disabledDateRange.disabledDateRangeText;
        $('.booking-engine .t-datepicker-days').append('<div class="calender-dynamic-text" style="display:none;"></div>');
        $('.booking-engine .calender-dynamic-text').show();
        $('.booking-engine .calender-dynamic-text').html(htmlErrorMessage);
        $('.booking-engine .calender-dynamic-text-mobile').html(htmlErrorMessage);
        // $(".booking-engine .offerMsgWrap").html(htmlErrorMessage);
    }

    /* Display dynamic message till checking date is less than disabledDateRangeTextToBeDisplayedTillDate in arrOfferMasterList*/

    if (glblBwConfiguration.hotelCode.toUpperCase() != "HBDXBAZ".toUpperCase()) {
        fnBwDisplayDynamicMesageInCalendar();
    }
}

function fnBwDisplayMarketingFlag(arrDates) {
    setTimeout(function () {

        if (arrDates.length > 0) {
            $(".booking-engine [data-t-date]").each(function () {
                if (moment(moment(parseInt($(this).attr("data-t-date"))).format("YYYY-MM-DD"))._d >= glblBwToday) {
                    if (arrDates.indexOf(moment(parseInt($(this).attr("data-t-date"))).format("YYYY-MM-DD")) != -1) {
                        if (!$(this).hasClass("soldOutDate")) {
                            $(this).addClass("marketingFlag");
                        }
                    }
                }
            });
        }

    }, 10);
}

function scrollBindOnCalenderOpenINmobileView(objThis) {


    clearTimeout($.data(this, "scrollCheck"));

    $.data(this, "scrollCheck", setTimeout(function () {

        if ($(objThis).closest(".booking-engine").hasClass("booking-engine")) {
            fnBwDisplayMarketingAssetsInCalendar();
            // console.log(1);
        }
        else if ($(objThis).closest(".booking-engine-ev").hasClass("booking-engine-ev")) {
            fnEvBwDisplayMarketingAssetsInCalendar($(objThis).closest('.greyRow'));
            // console.log(2);
        }
    }, 250));
}


function fnBwCheckInView(elem, partial) {
    var container = $(".booking-engine .t-datepicker-day");
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight;

    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();

    var isTotal = (elemTop >= 0 && elemBottom <= contHeight);
    var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= container.height())) && partial;


    return isTotal || isPart;
}

function fnBwDisplayMonthINCalenderInViewport() {

    var arrayMomentDate = [];

    if ($('.booking-engine .t-datepicker-day').length > 0) {
        var result = "";
        $.each($(".booking-engine .t-datepicker-day .t-table-wrap"), function (i, e) {
            result += "|" + fnBwCheckInView($(e), true);

        });
        //console.log(result);
        var arr1 = result.split('|');
        var month = "";
        for (var i = 0; i < arr1.length; i++) {

            if (arr1[i] == 'true') {

                month += $('.booking-engine .t-datepicker-day .t-table-wrap').eq(i - 1).find('.t-month').text() + ",";
            }
        }

        var arrayMonth = month.split(",");
        arrayMomentDate = [];

        if (arrayMonth.length > 0) {
            for (var i = 0; i < arrayMonth.length; i++) {
                if (arrayMonth[i] != "") {
                    var momentDate = moment(arrayMonth[i] + " 01", "MMM YYYY DD").format("YYYY-MM-DD");
                    arrayMomentDate.push(momentDate);

                }
            }
        }


    }

    return arrayMomentDate;
}

function fnBwEnumerateDateFromStartAndEndDates(startDate, endDate, datearrayToExclude) {

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
//backend tasks.js

/* Get hotelcode by synxis code for card abandoment pop up (Marketing asset)  */
function fnBwGetHotelCodeBySynxisCode(synxisCode) {

    /* Note hotelcode HBBOMOT is for Trident Nariman Point Mumbai
       This code is used on Offer /lp/hotels-in-mumbai/sugardoctormedicarellp
    */
    var hotelTrustCode = "";

    var arrSynxixCodeAndHotelCode = {
        "_5258": "HBDPSOB",
        "_5269": "HBBLROB",
        "_5272": "HBDELOG",
        "_5266": "HBAMIOB",
        "_5287": "HBMRUTO",
        "_5270": "HBBOMOB",
        "_5280": "HBDELOB",
        "_5283": "HBHRGOB",
        "_5256": "HBAGROB",
        "_5274": "HBDXBAZ",
        "_5289": "HBSLVOB",
        "_5282": "HBDXBOB",
        "_5257": "HBCCUOB",
        "_5265": "HBCOKVR",
        "_5264": "HBASWPH",
        "_5276": "HBJAIOB",
        "_5275": "HBIXCOB",
        "_5261": "HBUDROB",
        "_5285": "HBJAIVA",
        "_5267": "HBASWZA",
        "_5286": "HBMEDOB",
        "_5255": "HBSLVWH"
    };

    if (arrSynxixCodeAndHotelCode["_" + synxisCode] != undefined)
        hotelTrustCode = arrSynxixCodeAndHotelCode["_" + synxisCode];
    else {
        console.log("hotelTrustCode -- " + hotelTrustCode);
    }

    return hotelTrustCode;
}

/*Convert number to comma separated*/
function fnBwNumberWithCommas(number) {
    var tempNum = "";
    if (typeof number != "undefined") {
        number = number.toString();
        number = number.replace(/,/g, '');
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        tempNum = parts.join(".");
    }
    else {
        tempNum = number;
    }

    return tempNum;
}

function fnBwIsDateLiesFromAndBetweenTwoDates(from, to, check, dateformat) {
    var isvalidDate = false;

    try {

        var momentcheck = moment(check, dateformat).clone(); //Dateformat for moment
        var momentFromDate = moment(from, dateformat).clone(); //Dateformat for moment
        var momentToDate = moment(to, dateformat).clone(); //Dateformat for moment
        if (momentcheck >= momentFromDate && momentcheck <= momentToDate) {
            isvalidDate = true;
        }
        else {
            isvalidDate = false;
        }
    }

    catch (exx) {
        isvalidDate = false;
    }

    return isvalidDate;
}

var tempRpcArrayTest;
function fnBwGetRpc() {
    //returns rpc by checking:
    //offer stay condition is matched or not
    //offer blackout dates are selected or not
    //debugger;
    var _ratePlanCode = "";
    var momentCheckInDate;
    var momentCheckOutDate;

    if (typeof glblBwLastClickedObj != "undefined") {
        momentCheckInDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD");
        momentCheckOutDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD");
    }
    else {
        momentCheckInDate = moment($('.booking-engine:eq(0) .t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD");
        momentCheckOutDate = moment($('.booking-engine:eq(0) .t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD");
    }


    glblBwCheckincheckoutdatedifference = parseInt(getDateDifference(momentCheckInDate, momentCheckOutDate, "YYYY-MM-DD"));


    if (glblBwConfiguration.offer.rpcVaryOnDurationOfStay == true) {
        //check date differnce
        //check from list of rate codes if any of this is valid
        var tempArray;


        /*If in CMS "Is Exact Night Required" checked */
        /*If item minNights matched with checin checkout days difference */
        tempArray = glblBwConfiguration.offer.rpcBasisOnDurationOfStay.filter(function (item) {
            return item.minNights == glblBwCheckincheckoutdatedifference;
        });

        /*If length of tempArray is greate than 0 ite means nights matched then get rate plan code and assign to variable _ratePlanCode */
        if (tempArray.length > 0) {
            _ratePlanCode = tempArray[0].rpc;

            if (typeof tempArray[0].blackedOutDateRanges != null) {
                if (fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange(tempArray[0].blackedOutDateRanges)) {
                    _ratePlanCode = "";
                }
            }
        }

        /*If in CMS "Is Exact Night Required"  is unchecked */
        tempArray = glblBwConfiguration.offer.rpcBasisOnDurationOfStay.filter(function (item) {
            return (glblBwCheckincheckoutdatedifference >= item.minNights) && (item.blExactNights == false);
        });


        if (tempArray.length > 0) {
            _ratePlanCode = tempArray[0].rpc;
            tempArray[0].ratePlanCodes.filter(function (item) {
                if (moment(momentCheckOutDate)._d >= moment(item.startDate)._d
                    && moment(momentCheckOutDate)._d <= moment(item.endDate)._d
                    && moment(item.offerAvailableTillDate)._d >= moment(moment().format("YYYY-MM-DD"))._d
                    && item.hotels.indexOf(glblBwConfiguration.hotelCode) != -1

                ) {
                    _ratePlanCode = item.rpc;

                }

            })[0];


            /*If in CMS Nights dropdown contains "Rate Plan Code" */
            tempArray[0].ratePlanCodes.filter(function (item) {
                if (moment(momentCheckOutDate)._d >= moment(item.startDate)._d
                    && moment(momentCheckOutDate)._d <= moment(item.endDate)._d
                    && moment(item.offerAvailableTillDate)._d >= moment(moment().format("YYYY-MM-DD"))._d
                    && item.hotels.indexOf(glblBwConfiguration.hotelCode) != -1

                ) {
                    _ratePlanCode = item.rpc;

                }

            })[0];

            if (fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange(tempArray[0].blackedOutDateRanges)) {
                _ratePlanCode = "";
            }
        }
    }
    else {

        if (moment(momentCheckOutDate)._d >= moment(glblBwConfiguration.offer.startDate)._d
            && moment(momentCheckOutDate)._d <= moment(glblBwConfiguration.offer.endDate).add(1, "days")._d
            && (moment(glblBwConfiguration.offer.offerAvailableTillDate)._d >= moment(moment().format("YYYY-MM-DD"))._d
                || glblBwConfiguration.offer.offerAvailableTillDate == "")
            && ((glblBwCheckincheckoutdatedifference == glblBwConfiguration.offer.minNights
                && glblBwConfiguration.offer.blExactNights == true)
                || glblBwCheckincheckoutdatedifference >= glblBwConfiguration.offer.minNights
                && glblBwConfiguration.offer.blExactNights == false)
        ) {
            _ratePlanCode = glblBwConfiguration.offer.rpc;
        }

    }



    if (glblBwConfiguration.offer.blackedOutDateRanges.length > 0) {
        if (fnBwDoesCheckInCheckOutDatesFallInBlackedOutDateRange(glblBwConfiguration.offer.blackedOutDateRanges)) {
            _ratePlanCode = "";
        }
    }


    /*Philae and Zahra code this piece of code is to be put in CMS*/
    if (glblBwConfiguration.hotelCode == "HBASWPH") {
        if (glblBwCheckincheckoutdatedifference == 4) {
            _ratePlanCode = "WEB-PUE4";
        }
        else if (glblBwCheckincheckoutdatedifference == 6) {
            _ratePlanCode = "WEB-PUE6";
        }
    }
    else if (glblBwConfiguration.hotelCode == "HBASWZA") {
        if (glblBwCheckincheckoutdatedifference == 3) {
            _ratePlanCode = "WEB-PUE3";
        }
        else if (glblBwCheckincheckoutdatedifference == 4) {
            _ratePlanCode = "WEB-PUE4";
        }
        else if (glblBwCheckincheckoutdatedifference == 5) {
            _ratePlanCode = "WEB-PUE5";
        }
        else if (glblBwCheckincheckoutdatedifference == 7) {
            _ratePlanCode = "WEB-PUE7";
        }
    }

    return _ratePlanCode;

}

/* Fn Set User Last Booking Search Data*/
function setUserLastSearchData(userLastSearchUrl) {
    try {

        var arrival = fnGetParameterByNameFromUrl("arrive", userLastSearchUrl).split(",")[0];
        var hoteltitle = getHotelTitleByHotelCode(getHotelCodeBySynxisCode(fnGetParameterByNameFromUrl("hotel", userLastSearchUrl).split(";")[0]));
        createCookieByDate("userLastSearchHotelTitle", hoteltitle, moment(arrival, "YYYY-MM-DD").clone().format("YYYY-MM-DD"));
        createCookieByDate("userLastSearchData", userLastSearchUrl, moment(arrival, "YYYY-MM-DD").clone().format("YYYY-MM-DD"));
        createCookieByDate("userBookingReminderCloseCount", 0, moment("2050-12-31", "YYYY-MM-DD").clone().format("YYYY-MM-DD"));

        deleteCookie("userBrowserSessionId");

    }
    catch (Exx) { }

}

function fnBwGetRpcByPromoCode() {

    var tempRpc = "";

    var momentCheckInDate;
    var momentCheckOutDate;

    if (typeof glblBwLastClickedObj != "undefined") {
        momentCheckInDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD");
        momentCheckOutDate = moment($(glblBwLastClickedObj).find('.t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD");
    }
    else {
        momentCheckInDate = moment($('.booking-engine:eq(0) .t-datepicker').tDatePicker('getDates')[0]).format("YYYY-MM-DD");
        momentCheckOutDate = moment($('.booking-engine:eq(0) .t-datepicker').tDatePicker('getDates')[1]).format("YYYY-MM-DD");
    }

    glblBwCheckincheckoutdatedifference = parseInt(getDateDifference(momentCheckInDate, momentCheckOutDate, "YYYY-MM-DD"));


    if (typeof glblBwLastClickedObj != "undefined") {
        if (!(glblBwLastClickedObj).find(".NumberOfNightsDropDown .list ul").hasClass("thisOfferIsBasedOnExactDropdownSelection")) {
            var tempArrayPromoCode = arrBwPromoCodeConfiguration.filter(function (item) {
                return item.promoCode.toLocaleUpperCase() == $(glblBwLastClickedObj).find(".promocode").val().toLocaleUpperCase();
            })[0]; tempArrayPromoCode;

            if (typeof tempArrayPromoCode != "undefined" && typeof tempArrayPromoCode.rpcBasicOnDates != "undefined") {


                if (tempArrayPromoCode.rpcBasicOnDates.length > 0) {
                    var tempRpcBasicOnDates = tempArrayPromoCode.rpcBasicOnDates.filter(function (item) {
                        if (moment(momentCheckOutDate)._d >= moment(item.offerStartDate)._d
                            && moment(momentCheckOutDate)._d <= moment(item.offerEndDate)._d
                            && moment(item.offerAvailableTillDate)._d >= moment(moment().format("YYYY-MM-DD"))._d
                            && item.hotelCodes.indexOf(glblBwConfiguration.hotelCode) != -1
                            && (
                                (glblBwCheckincheckoutdatedifference >= parseInt(item.minNights) && (item.blExactNights == false))
                                ||
                                ((glblBwCheckincheckoutdatedifference == parseInt(item.minNights)))
                            )
                        ) {
                            return item;
                        }

                    })[0];

                    if (typeof tempRpcBasicOnDates != "undefined") {
                        tempRpc = tempRpcBasicOnDates.rpc;
                    }
                }
            }
        }
    }


    /*If Dropdown have nights and promocode is valid only respective offer page.*/
    if (typeof glblBwLastClickedObj != "undefined") {
        if ((glblBwLastClickedObj).find(".NumberOfNightsDropDown .list ul").hasClass("thisOfferIsBasedOnExactDropdownSelection")) {
            if ($(glblBwLastClickedObj).find(".promocode").val() != "") {
                var ddlIsExactNightRequired = (glblBwLastClickedObj).find(".NumberOfNightsDropDown .list li.active").attr("blexactnights");
                var ddlAdditionalRpcArrayString = (glblBwLastClickedObj).find(".NumberOfNightsDropDown .list li.active").attr("additionalrpcarraystring");
                var ddlRpc = (glblBwLastClickedObj).find(".NumberOfNightsDropDown .list li.active").attr("rpc");
                var ddlValue = (glblBwLastClickedObj).find(".NumberOfNightsDropDown .list li.active").attr("value");

                if (ddlIsExactNightRequired == "true" && glblBwCheckincheckoutdatedifference == parseInt(ddlValue)) {
                    tempRpc = ddlRpc;
                }
                else if (ddlIsExactNightRequired == "false" && glblBwCheckincheckoutdatedifference >= parseInt(ddlValue)) {
                    tempRpc = ddlRpc;
                }

                if (ddlAdditionalRpcArrayString != "") {
                    var arrAdditionalRpcObj = JSON.parse(ddlAdditionalRpcArrayString);
                    var _tempArray = arrAdditionalRpcObj.filter(function (item) {
                        if (item.blExactNights == true && glblBwCheckincheckoutdatedifference == item.minNights
                            || item.blExactNights == false && glblBwCheckincheckoutdatedifference >= item.minNights
                        ) {
                            console.log(item.blExactNights + "--" + item.minNights + "==" + glblBwCheckincheckoutdatedifference);
                            if (ddlRpc != "") {
                                tempRpc = ddlRpc + "," + item.rpc;
                            }
                        }
                    })[0];
                }

            }
        }
    }

    return tempRpc;

}






/*
jQuery Redirect v1.1.3

Copyright (c) 2013-2018 Miguel Galante
Copyright (c) 2011-2013 Nemanja Avramovic, www.avramovic.info

Licensed under CC BY-SA 4.0 License: http://creativecommons.org/licenses/by-sa/4.0/

This means everyone is allowed to:

Share - copy and redistribute the material in any medium or format
Adapt - remix, transform, and build upon the material for any purpose, even commercially.
Under following conditions:

Attribution - You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
ShareAlike - If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
*/
; (function ($) {
    'use strict';

    //Defaults configuration
    var defaults = {
        url: null,
        values: null,
        method: "POST",
        target: null,
        traditional: false,
        redirectTop: false
    };

    /**
    * jQuery Redirect
    * @param {string} url - Url of the redirection
    * @param {Object} values - (optional) An object with the data to send. If not present will look for values as QueryString in the target url.
    * @param {string} method - (optional) The HTTP verb can be GET or POST (defaults to POST)
    * @param {string} target - (optional) The target of the form. "_blank" will open the url in a new window.
    * @param {boolean} traditional - (optional) This provides the same function as jquery's ajax function. The brackets are omitted on the field name if its an array.  This allows arrays to work with MVC.net among others.
    * @param {boolean} redirectTop - (optional) If its called from a iframe, force to navigate the top window.
      *//**
* jQuery Redirect
* @param {string} opts - Options object
* @param {string} opts.url - Url of the redirection
* @param {Object} opts.values - (optional) An object with the data to send. If not present will look for values as QueryString in the target url.
* @param {string} opts.method - (optional) The HTTP verb can be GET or POST (defaults to POST)
* @param {string} opts.target - (optional) The target of the form. "_blank" will open the url in a new window.
* @param {boolean} opts.traditional - (optional) This provides the same function as jquery's ajax function. The brackets are omitted on the field name if its an array.  This allows arrays to work with MVC.net among others.
* @param {boolean} opts.redirectTop - (optional) If its called from a iframe, force to navigate the top window.
*/
    $.redirect = function (url, values, method, target, traditional, redirectTop) {
        var opts = url;
        if (typeof url !== "object") {
            var opts = {
                url: url,
                values: values,
                method: method,
                target: target,
                traditional: traditional,
                redirectTop: redirectTop
            };
        }

        var config = $.extend({}, defaults, opts);
        var generatedForm = $.redirect.getForm(config.url, config.values, config.method, config.target, config.traditional);
        $('body', config.redirectTop ? window.top.document : undefined).append(generatedForm.form);
        generatedForm.submit();
        generatedForm.form.remove();
    };

    $.redirect.getForm = function (url, values, method, target, traditional) {
        method = (method && ["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) !== -1) ? method.toUpperCase() : 'POST';

        url = url.split("#");
        var hash = url[1] ? ("#" + url[1]) : "";
        url = url[0];

        if (!values) {
            var obj = $.parseUrl(url);
            url = obj.url;
            values = obj.params;
        }

        values = removeNulls(values);

        var form = $('<form>')
            .attr("method", method)
            .attr("action", url + hash);


        if (target) {
            form.attr("target", target);
        }

        var submit = form[0].submit;
        iterateValues(values, [], form, null, traditional);

        return { form: form, submit: function () { submit.call(form[0]); } };
    }

    //Utility Functions
    /**
     * Url and QueryString Parser.
 * @param {string} url - a Url to parse.
 * @returns {object} an object with the parsed url with the following structure {url: URL, params:{KEY: VALUE }}
    */
    $.parseUrl = function (url) {

        if (url.indexOf('?') === -1) {
            return {
                url: url,
                params: {}
            };
        }
        var parts = url.split('?'),
            query_string = parts[1],
            elems = query_string.split('&');
        url = parts[0];

        var i, pair, obj = {};
        for (i = 0; i < elems.length; i += 1) {
            pair = elems[i].split('=');
            obj[pair[0]] = pair[1];
        }

        return {
            url: url,
            params: obj
        };
    };

    //Private Functions
    var getInput = function (name, value, parent, array, traditional) {
        var parentString;
        if (parent.length > 0) {
            parentString = parent[0];
            var i;
            for (i = 1; i < parent.length; i += 1) {
                parentString += "[" + parent[i] + "]";
            }

            if (array) {
                if (traditional)
                    name = parentString;
                else
                    name = parentString + "[" + name + "]";
            } else {
                name = parentString + "[" + name + "]";
            }
        }

        return $("<input>").attr("type", "hidden")
            .attr("name", name)
            .attr("value", value);
    };

    var iterateValues = function (values, parent, form, isArray, traditional) {
        var i, iterateParent = [];
        Object.keys(values).forEach(function (i) {
            if (typeof values[i] === "object") {
                iterateParent = parent.slice();
                iterateParent.push(i);
                iterateValues(values[i], iterateParent, form, Array.isArray(values[i]), traditional);
            } else {
                form.append(getInput(i, values[i], parent, isArray, traditional));
            }
        });
    };

    var removeNulls = function (values) {
        var propNames = Object.getOwnPropertyNames(values);
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (values[propName] === null || values[propName] === undefined) {
                delete values[propName];
            } else if (typeof values[propName] === 'object') {
                values[propName] = removeNulls(values[propName]);
            } else if (values[propName].length < 1) {
                delete values[propName];
            }
        }
        return values;
    };
}(window.jQuery || window.Zepto || window.jqlite));

//#endregion




//Not in use
function fnBwSoldOutDates(hotelofferingid) {
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





/*Set Default Adult selection base on hotel */
function fnBwSetDefaultAdult() {


    var arrrDefaultAdults = ["HBBLROB", "HBDELOB", "HBBOMOB", "HBCCUOB", "HBDELOG"];
    if (!glBlBwRoomOrGuestSelected) {
        var defaultGuest = 2;
        if (arrrDefaultAdults.indexOf(glblBwConfiguration.hotelCode.toUpperCase()) != -1) {
            defaultGuest = 1;
        }

        $(".booking-engine").each(function () {
            var thisBookingEngine = this;
            $(this).find(".noOfGuestWrap .choose.adult .number ul li").each(function () {

                var guestCount = parseInt($(this).text());
                $(this).removeClass("active");
                if (guestCount == defaultGuest) {
                    guestCountFound = true;
                    console.log(guestCount + "\n");
                    $(this).addClass("active");
                    $(thisBookingEngine).find(".noOfGuestWrap .guestCount .value").html("0" + defaultGuest);
                }
            });
        });
    }

    if ($('.booking-engine .DropDownExtraGuest').length > 0) {
        $(".extraAdult,.extraChild").show();
    }
    else {
        $(".extraAdult,.extraChild").hide();
    }


    fnBwGuestShowHideGuestBasedOnAdultsOnClick();

}

function fnBwBoolShowPricesOnHotels(){

    if ((glblBwConfiguration.hotelCode.toUpperCase() == "HBDELOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBBLROB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBBOMOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBCCUOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBDELOG".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBJAIOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBAGROB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBJAIVA".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBSLVOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBSLVWH".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBIXCOB".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR-3".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBCOKVR-2".toUpperCase()
        || glblBwConfiguration.hotelCode.toUpperCase() == "HBUDROB".toUpperCase())
        && glblBwConfiguration.offer.offerCode.toLowerCase().indexOf('default') != -1) {
        return true;
    }
    else {
        return false;
    }


}


/* Booking Engine Clic tracking codes*/
function fnBwHotelDropdownClick(objThis) {
    console.log("fnBwHotelDropdownClick Clicked");   
    glblBwTrackingHotelDropdown++;
    fnPushBwClicksCount();
    fnPushTrackingBoolValues("hotel");
}

function fnBwClickDateCI(objThis) {
    console.log("fnBwClickDateCI Clicked");
    fnBwCiCoClick(objThis);
}
function fnBwClickDateCO(objThis) {
    console.log("fnBwClickDateCO Clicked");
    fnBwCiCoClick(objThis);
}

function fnBwCiCoClick(objThis) {
    glblBwTrackingCalendarDropdown++;
    fnPushBwClicksCount();
    console.log("fnBwCiCoClick Clicked");
    fnPushTrackingBoolValues("calendar");
}

function fnBwAddRoomClick(objThis) {
    console.log("fnBwAddRoomClick Clicked"); 
    glBlBwRoomOrGuestSelected = true;
    glblBwTrackingRoomDropdown++;
    fnPushBwClicksCount();
    fnPushTrackingBoolValues("room");
}

function fnBwGuestDropdownClick(objThis) {
    console.log("fnBwGuestDropdownClick Clicked");
    fnBwGuestShowHideGuestBasedOnAdultsOnClick();
  //  $(glblBwLastClickedObj).find('.noOfGuestWrap .addGuestDropDown .blockWrapper .roomGuestCount .adult .number ul li.active').click();

    glBlBwRoomOrGuestSelected = true;
    glblBwTrackingGuestDropdown++;
    fnPushBwClicksCount();
    fnPushTrackingBoolValues("guest");
}

function fnBwPromoCodeDropdownClick(objThis) {
    console.log("fnBwPromoCodeDropdownClick Clicked");
    glblBwTrackingPomoCodeDropdown++;
    fnPushBwClicksCount();
    fnPushTrackingBoolValues("promocode");
}

function fnBwViewAvailAbilityBeforeRedirectionClick(objThis) {
    console.log("fnBwViewAvailAbilityBeforeRedirectionClick Clicked");
    glblBwTrackingViewAvailablityClick++;
    fnPushBwClicksCount();
    fnPushTrackingBoolValues("viewavailability");
}

function fnPushBwClicksCount() {
    var arrBokingWidgetClickTracking = [{
        'hotelDropdown': glblBwTrackingHotelDropdown,
        'calendarDropdown': glblBwTrackingCalendarDropdown,
        'roomDropdown': glblBwTrackingRoomDropdown,
        'guestDropdown': glblBwTrackingGuestDropdown,
        'viewAvailablityClick': glblBwTrackingViewAvailablityClick,
        'promoCodeDropdown': glblBwTrackingPomoCodeDropdown
    }];

    if (document.location.href.indexOf("www.oberoihotels.com") != -1) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'OH_BokingWidgetClickTracking': arrBokingWidgetClickTracking
        });
    }
    // console.table(arrBokingWidgetClickTracking);
}


function fnPushTrackingBoolValues(sectionName) {

    var isHotelDropdownClicked = false;
    var isCalendarDropdownClicked = false;
    var isRoomDropdownClicked = false;
    var isGuestDropdownClicked = false;
    var isViewAvailablityClicked = false;
    var isPromoCodeDropdownClicked = false;

    if (sectionName == "hotel") {
        isHotelDropdownClicked = true;
    }
    else if (sectionName == "calendar") {
        isCalendarDropdownClicked = true;
    }
    else if (sectionName == "room") {
        isRoomDropdownClicked = true;
    }
    else if (sectionName == "guest") {
        isGuestDropdownClicked = true;
    }
    else if (sectionName == "viewavailability") {
        isViewAvailablityClicked = true;
    }
    else if (sectionName == "promocode") {
        isPromoCodeDropdownClicked = true;
    }

    var arrBokingWidgetSectionClickTracking = [{
        'isHotelDropdownClicked': isHotelDropdownClicked,
        'isCalendarDropdownClicked': isCalendarDropdownClicked,
        'isRoomDropdownClicked': isRoomDropdownClicked,
        'isGuestDropdownClicked': isGuestDropdownClicked,
        'isViewAvailablityClicked': isViewAvailablityClicked,
        'isPromoCodeDropdownClicked': isPromoCodeDropdownClicked
    }];
    if (document.location.href.indexOf("www.oberoihotels.com") != -1) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'OH_BokingWidgetSectionClickTracking': arrBokingWidgetSectionClickTracking
        });
    }

    // console.table(arrBokingWidgetSectionClickTracking);
}

function fnBwRemoveFromHotelsDropdownHotelsForExperienceDetailsPage() {
    console.log("fnBwRemoveFromHotelsDropdownHotelsForExperienceDetailsPage called");
    var currentUrl = document.location.pathname.toLocaleLowerCase();
    var splitCheckExpName = currentUrl.split('/')
   
    if (splitCheckExpName[2] == "experiences") {
        $('.booking-engine .hotelName').addClass('NoClick');
    }
    else if (splitCheckExpName[3] == "experiences") {
        $('.booking-engine .hotelName').addClass('NoClick');
    }
}