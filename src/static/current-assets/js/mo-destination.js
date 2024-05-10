$(document).ready(function(){
	
	$(".mo-destination-tab li").click(function(){
		var moDataTab = $(this).attr('data-tab');

	$(this).addClass("active");
	$(this).siblings().removeClass("active");
 $(".mo-destination-tab-details-wrap").removeClass("mo-destination-tab-wrap-active");
$("#"+moDataTab).addClass("mo-destination-tab-wrap-active");
});

/*---------menu code start here-------------*/

$(".mo-menu-tab ul li").click(function(){
var dataTab = $(this).attr("data-menuTab");
var siblingDataTab = $(this).siblings().attr("data-menuTab");
var siblingTabTxt = $(this).siblings().text();

$(".mo-menu-switch-tab").attr("data-menuSwitchTab", siblingDataTab);

$(".mo-menu-tab ul li").removeClass("active");
$(this).addClass("active");
$(".mo-menu-list").removeClass("mo-menu-list-active");
$("."+dataTab).addClass("mo-menu-list-active");
$(".mo-menu-switch-tab-txt").text(siblingTabTxt);
});
$(".mo-menu-switch-tab").click(function(){
var moTabSwitchDataVal = $(this).attr("data-menuSwitchTab");
$("."+moTabSwitchDataVal).click();
});
var winWidth = $(window).width();


$(".moMenuLink").click(function(){
	var dataMoUrl = $(this).attr("data-moUrl");
    
	
	$(".mo-pop-up-box .mo-pop-up-desc .mo-hotels-button a").attr("href", dataMoUrl);
});

if(winWidth > 767 ){
	$(document).on("click", ".dhover.moMenuLink, .map-popup-btn.moMenuLink", function(){
		$(".mo-black-overlay").show();
	})
}
$(document).on("click", ".moMenuLink", function(){
	
	var dataMoUrl = $(this).attr("data-moUrl");
   
	if(winWidth < 767 ){
			$(".mo-black-overlay").show();
	}
	//$(".mo-black-overlay").show();
	$(".mo-pop-up-box .mo-pop-up-desc .mo-hotels-button a").attr("href", dataMoUrl);
});

if(winWidth<1025){

$(".mo-mendarin-menu").appendTo($(".hamburger-mob-menu-head-mo .menu-level-1-omo"));	

$(".mo-menu-info-box").insertAfter(".mo-mendarin-menu .menu-colm3");
$(".mo-menu-tab").insertBefore(".mo-mendarin-menu");

$(".hamburger-mob-menu-head-mo").click(function(){
 // $(this).find(".menu-level-1-omo.menu-list").addClass("actv");
});

$(".mo-mendarin-menu .menu-hdng").click(function(){
	$(".backto-menu span").addClass("actv4");
    $(".backto-menu span").removeClass("actv2");
});

$(".menu-container").on('click', '.backto-menu span.actv4', function() {
	$(".mo-mendarin-menu .menu-list").removeClass("actv");
   
	$(".backto-menu span").removeClass("actv4");
    $(".backto-menu span").addClass("actv2");
    $(".menu-container .main-menu>li, .menu-container .social-menu").css("opacity","1");
    $(".menu-container .backto-menu").hide();    

});

$(".oberoi-one-login-pop-up-close").click(function(){
 
 $(".o-one-login > a").trigger("click");   

});

}



// var moSlideHeight = $(".destination .destination-slider .destination-slide").height();

// $(".mo-destination-component").height(moSlideHeight);

// alert(moSlideHeight);


});


//function for home page data-src to src convert 
function fnAssignDataSrcToSrc(){
    $('.lazyImg').each(function(){
        var sourceuSrc = $(this).data('src');
        $(this).attr('src', sourceuSrc);
    })
}

// JavaScript Document
function moDesinationCarousel() {
	$(".mo-destination-slider").slick({
		infinite: true,
		centerMode: true,
		lazyLoad:'ondemand',
		centerPadding: '15%',
		responsive: [
		    {
		      breakpoint: 767,
		      settings: {
			   centerMode: false,
			   arrows: false,
		        }
		    }
		  ]
	});
	
$('.mo-destination-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
  var sel = $(this).find('.slick-active.destination-slide').attr('data-country');
	//console.log(sel);
	$('.mo-mandarin-destination-tab-details-wrap .countryList li').removeClass('activec');
	$('.mo-mandarin-destination-tab-details-wrap .countryList li[data-filter='+sel+']').addClass('activec');
	var moDestinationValTrim = sel.replace(/-/g, " ");
	$(".mo-mandarin-destination-tab-details-wrap .selectedCountry").text(moDestinationValTrim);
    fnAssignDataSrcToSrc();
});

		
var winWidth = $(window).width();

if(winWidth<768){	
	$(".mo-mandarin-destination-tab-details-wrap .selectedCountry").click(function(){
		$(".mo-mandarin-destination-tab-details-wrap .countryList").toggle();
		setTimeout(function(){
			$(window).scroll();
		},50)
	});

	$(".mo-mandarin-destination-tab-details-wrap .countryList li").click(function(){
		var countryValue = $(this).attr("data-filter");
		$('#moMandrainCountryFilter').attr("data-filter", countryValue);
		$(".mo-mandarin-destination-tab-details-wrap .selectedCountry").text($(this).text());
	
	});	
	
	$(document).click(function(event){
		$(".countryList").hide();
	});	
	$(".mo-mandarin-destination-tab-details-wrap .selectedCountry").click(function(event){
		event.stopPropagation();
	});

    $(".destinationTab .selectedCountry").click(function(){
        $(this).toggleClass("actv-fltr");
    });	
}
}


	
	function moGoToSlide(num)
	{
		$('.mo-destination-slider').slick('slickGoTo', num);
		
		$('.mo-mandarin-destination-tab-details-wrap .countryList li').removeClass('active');
		$('this').addClass('active');
	}

	$(".mo-mandarin-destination-tab-details-wrap .countryList li").click(function(){
	  $('.mo-mandarin-destination-tab-details-wrap .countryList li').removeClass('activec');
	  $(this).addClass('activec');
});

$(window).load(function(){
$('.mo-mandarin-destination-tab-details-wrap .slidesText p').each(function(){
var hi =	$(this).height();
	
	//console.log(hi);
	if(hi<=25)
		{
			$(this).parent().parent('.text-container').children('.slidesBtn').addClass('singleLine');
		}
	
});	
	
});


/*    MO Login Pop Up Code Starts   */

//selec box country COde

$(document).ready(function () {
    $('.selectBox').select2();
    fnOberoiOneOtpInputGP();
    $('.existing-user-global-popup').show();
    $(".signinGPSection").hide();
    $(".selectBox").change();
  
    if($(window).width() < 991 ){
        fnOberoiOneMobMenuDisplay();
        fnOberoiOneMobMenuSubMenuDisplay();
    }



});

$(document).on("change", ".selectBox", function () {
    var selectBoxVal = "";
    selectBoxVal = $(this).val();
    $(this).parent(".countryCodeWrap").find('.selectBoxValDisplay').html(selectBoxVal);
});

function fnOberoiOneOtpInputGP() {

    $('.otp-input-box').find('input').each(function () {
        $(this).attr('maxlength', 1);
        $(this).on('keyup', function (e) {
            var parent = $($(this).parent());

            if (e.keyCode === 8 || e.keyCode === 37) {
                var prev = parent.find('input.' + $(this).data('previous'));

                if (prev.length) {
                    $(prev).select();
                }
            } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
                var next = parent.find('input.' + $(this).data('next'));

                if (next.length) {
                    $(next).select();
                } else {
                    if (parent.data('autosubmit')) {
                        parent.submit();
                    }
                }
            }
        });
    });

}

 
$(document.body).on('click', '.omo-alliance-details .mo-enroll-now', function (e) {
    $('.mo-overlay').show();
    $('.global-oberoi-one-pop-up').show();
    $(".signinGPSection").hide();
    $(".signupGPSection").show();
    $(".global-oberoi-one-pop-up #loginAccount").removeClass("activeUserTab");
    $(".global-oberoi-one-pop-up #enrolAccount").addClass('activeUserTab');
});

$(document.body).on('click', '.about-o-one .btn-style1', function (e) {
    $('.mo-overlay').show();
    $('.global-oberoi-one-pop-up').show();
    $(".signinGPSection").show();
    $(".signupGPSection").hide();
    $(".global-oberoi-one-pop-up #loginAccount").addClass("activeUserTab");
    $(".global-oberoi-one-pop-up #enrolAccount").removeClass('activeUserTab');
});

$(document.body).on('click', '.global-oberoi-one-pop-up #loginAccount', function (e) {
    $(".signinGPSection").show();
    $(".signupGPSection").hide();
});

$(document.body).on('click', '.global-oberoi-one-pop-up .loginBox', function (e) {
    $(this).siblings().removeClass("activeUserTab");
    $(this).addClass("activeUserTab");
});

$(document.body).on('click', '.global-oberoi-one-pop-up #enrolAccount', function (e) {
    $(".signupGPSection").show();
    ; $(".signinGPSection").hide();

});

$(document.body).on('click', '.loginClickHref', function (e) {
    $(".signinGPSection").show();
    $(".signupGPSection").hide();
    $(".global-oberoi-one-pop-up #loginAccount").addClass("activeUserTab");
    $(".global-oberoi-one-pop-up #enrolAccount").removeClass('activeUserTab');

});


function fnOberoiOneSignUpUserGP() {

    var FormData = $("form[name='frmOberoiOneSignUpUserGP']").serializeArray();
    if (fnOberoOneigetUrlQuereyString()['precardedsfid'] != null || fnOberoOneigetUrlQuereyString()['precardedsfid'] != "") {
        FormData.push({ name: 'precardedsfid', value: fnOberoOneigetUrlQuereyString()['precardedsfid'] });
    }
    if (window.location.pathname == "/photo-context/dashboard/") {
        FormData.push({ name: 'synxisReturnURL', value: window.location.href });
    }

    var userEmailID = $("#txtEmailId").val().trim();
    var userName = $("#txtFirstName").val().trim();
    glblOberoiOneUserEmail = userEmailID;
    $('.enroll-user-global-popup .sbmt-btn').addClass('processing');
    $('.err-txt').html(" ");
    $.ajax(
        {
            url: handelerPrefix + '/handlers/oberoi-one/create-users.ashx',
            type: 'post',
            data: FormData,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);
                glblOberoiOneUserEmail = userEmailID;

                if (response.success == true) {
                    if (response.execute_instruction == "redirect to dashboard") {
                        // window.location.replace("/oberoi-one/dashboard/");
                        createSessionCookie("OberoiOneUserLoggedInStatus", "true");
                        // createSessionCookie("OberoiOneUserDisplayNameWithSaluatation", response.Oberoi_One_Response_User_Data[0].Salutation + " " + response.Oberoi_One_Response_User_Data[0].LastName);

                        // createSessionCookie("OberoiOneLoggedMemberBasicInformation", JSON.stringify(response.Oberoi_One_Response_User_Data[0]));

                        window.dataLayer.push({
                            'oberoi_one_registration_button_click': true
                        }
                        );


                        //url for redirection.
                        if (window.location.pathname == "/photo-contest/dashboard/") {
                            location.reload();
                        }
                        else {
                            window.location = "/oberoi-one/dashboard/";
                        }
                    }
                    else if (response.execute_instruction == "email verification is pending") {
                        $('.signupGPSection .enroll-user-global-popup').hide();
                        $('.signupGPSection  #newUserRegisteredMessage').show();
                        $('.signupGPSection  #signUpCaseOtpVerification input[name="emailId"]').attr('value', userEmailID);
                        $('.signupGPSection #newUserRegisteredMessage .otp-txt').html("Thank you for enrolling for Oberoi One. <br> A verification email with a verification code and a link has been sent to your registered email ID.<br>If you cannot find the email in your primary inbox, please check your Promotions, Spam or similar folders.<br>Kindly enter the four digit code below <span class='underLine'>OR</span> click on the verification link to activate your membership.");

                        window.dataLayer.push({
                            'oberoi_one_registration_button_click': true
                        }
                        );
                        ga('send', 'event', 'Register Click', 'Click', window.location.href);
                        if ($(window).width() < 767) {
                            $('html,body').animate({
                                scrollTop: $("#newUserRegisteredMessage").offset().top - 250
                            }, 600);
                        }

                    }
                    else if (response.execute_instruction == "please contact oberoi customer care") {
                        $('.enroll-user-global-popup .err-txt').html(" ");
                        $('.enroll-user-global-popup .common-error').html('This email ID is registered with multiple profiles. Please contact the Programme Centre to enable our team to get in touch with you.');
                        $('.enroll-user-global-popup .common-error').show();
                    }
                }
                if (response.is_data_exist == true) {

                    $('.enroll-user-global-popup').hide();
                    $('.signupGPSection #newUserRegisteredMessage').show();
                    $('.signupGPSection #newUserRegisteredMessage .otp-txt').html("This email id is already registered. Kindly <a class='loginClickHref'>login</a> ");
                    $('.signupGPSection #newUserRegisteredMessage .otp-box').hide();

                    //$('.enroll-user-global-popup .err-txt').html(" ");
                    //$('.enroll-user-global-popup .common-error').html("This email id is already registered. Kindly <a class='loginClickHref'>login</a>");
                    //$('.enroll-user-global-popup .common-error').show();
                }
                else if (response.error == true) {
                    $('.enroll-user-global-popup .err-txt').html(" ");
                    for (var i = 0; i < response.oberoi_one_errors.length; i++) {
                        $('.enroll-user-global-popup .' + response.oberoi_one_errors[i].error_field).html(response.oberoi_one_errors[i].error_message);

                        $('.enroll-user-global-popup .err-txt').show();
                    }
                    if ($(window).width() < 767) {
                        $('html,body').animate({
                            scrollTop: $('.' + response.oberoi_one_errors[0].error_field).offset().top - 180
                        }, 600);
                    }
                }
                $('.enroll-user-global-popup .sbmt-btn').removeClass('processing');
            },
            error: function (objXHR, objStatus, objError) {
                $('.enroll-user-global-popup .err-txt').html(" ");
                if (objXHR.responseText.length > 50) {
                    $('.enroll-user-global-popup .common-error').html('There seems to be an issue.  Please try again after some time.');
                }

                $('.enroll-user-global-popup .common-error').show();
            }

        });
}

function fnOberoiOneLogInUserGP() {
    var FormData = $("form[name='frmOberoiOneLogInUserGP']").serializeArray();
    if (window.location.pathname == "/photo-context/dashboard/") {
        FormData.push({ name: 'synxisReturnURL', value: window.location.href });
    }
    var userEmailID = $(".existing-user-global-popup #txtSignInEmailId").val().trim();
    $(".existing-user-global-popup input[name='emailId']").val(userEmailID);
    glblOberoiOneUserEmail = userEmailID;
    $('.existing-user-global-popup .sbmt-btn').addClass('processing');
    $('.existing-user-global-popup .err-txt').html(" ");
    $.ajax(
        {
            url: handelerPrefix + '/handlers/oberoi-one/log-in.ashx',
            type: 'post',
            data: FormData,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);
                $('.existing-user-global-popup .err-txt').html(" ");
                if (response.success == true) {
                    glblOberoiOneUserEmail = userEmailID;
                    if (response.execute_instruction == "email verification is pending") {

                        if (response.success_message == "user exists in new table")
                            $('.signinGPSection #UserEmailVerificationPending .otp-txt').html('Dear Guest, <br>You would have already received an email on ' + glblOberoiOneUserEmail + ', with a verification link and a verification code, to accept an invitation to join Oberoi One. You can click that verification link or enter the verification code in the box below. Should you wish to have the verification link resent to your email address, please click the resend link below.');

                        else
                            $('.signinGPSection #UserEmailVerificationPending .otp-txt').html('Dear Guest, <br>Thank you for being part of our Web Exclusives offers. Web Exclusives has now ended and we have introduced our distinctive guest recognition programme, Oberoi One. Once you enrol into Oberoi One you will continue to have access to exclusive member rates and also many more enhanced benefits.<br><br>You would have already received an email on ' + glblOberoiOneUserEmail + ', with a verification link and a verification code, to accept an invitation to join Oberoi One. You can click that verification link or enter the verification code in the box below. Should you wish to have the verification link resent to your email address, please click the resend link below.');

                        $('.existing-user-global-popup').hide();
                        $('.signinGPSection input[name="emailId"]').attr('value', glblOberoiOneUserEmail);
                        $('.signinGPSection #UserEmailVerificationPending').show();

                    }
                    else if (response.execute_instruction == "redirct to dashboard") {
                        createSessionCookie("OberoiOneUserLoggedInStatus", "true");
                        createSessionCookie("OberoiOneUserDisplayNameWithSaluatation", response.Oberoi_One_Response_User_Data[0].Salutation + " " + response.Oberoi_One_Response_User_Data[0].LastName);

                        // createSessionCookie("OberoiOneLoggedMemberBasicInformation", JSON.stringify(response.Oberoi_One_Response_User_Data[0]));

                        //url for redirection.
                        if (window.location.pathname == "/photo-contest/dashboard/") {
                            location.reload();
                        }
                        else {
                            window.location = "/oberoi-one/dashboard/";
                        }
                    }


                }
                else if (response.error == true) {

                    if (response.oberoi_one_errors != null) {
                        $('.signinGPSection .existing-user-global-popup .err-txt').html(" ");
                        for (var i = 0; i < response.oberoi_one_errors.length; i++) {
                            $('.' + response.oberoi_one_errors[i].error_field).html(response.oberoi_one_errors[i].error_message);

                            $('.signinGPSection .existing-user-global-popup .err-txt').show();
                        }
                    }
                    if (response.error_description != "") {

                        for (var i = 0; i < response.oberoi_one_errors.length; i++) {
                            $('.signinGPSection .existing-user-global-popup .common-error').html(response.oberoi_one_errors[i].error_message);
                        }
                        $('.signinGPSection .existing-user-global-popup .err-txt').show();
                    }


                    $('.signinGPSection .existing-user-global-popup .sbmt-btn').removeClass('processing');
                }

            },
            error: function (objXHR, objStatus, objError) {
                $('.existing-user-global-popup .err-txt').html(" ");
                if (objXHR.responseText.length > 50) {
                    $('.existing-user-global-popup .common-error').html('There seems to be an issue.  Please try again after some time.');
                }

                $('.existing-user-global-popup .common-error').show();
            }

        });
}

function fnOberoiOneResendOtpAndEmailGP(email, sectiontype) {

    var sectionClassName = "signupGPSection";
    if (sectiontype == "login") {
        sectionClassName = "signinGPSection"
    }
    var dataToSend = { email: email };
    if (window.location.pathname == "/photo-context/dashboard/") {

        dataToSend = { email: email, 'synxisReturnURL': window.location.href };
    }

    $("." + sectionClassName + " .resendLoader").css("display", "inline-block");
    $("." + sectionClassName + " .err-txt").html("");
    $.ajax(
        {
            url: handelerPrefix + "/handlers/oberoi-one/resend-verification-mail.ashx",
            type: 'post',
            data: dataToSend,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);
                $('.' + sectionClassName + ' .resendOtpMessage').removeClass('green');
                $('.' + sectionClassName + ' .resendOtpMessage').hide();
                if (response.success == true) {
                    $('.' + sectionClassName + ' .resendOtpMessage').addClass('green').html(response.success_message);
                    $('.' + sectionClassName + ' .resendOtpMessage').show();
                    $("." + sectionClassName + " .resendLoader").hide();
                }
                else if (response.error == true) {
                    $('.' + sectionClassName + ' .resendOtpMessage').html('There seems to be an issue.  Please try again after some time.');
                    $('.' + sectionClassName + ' .resendOtpMessage').show();
                    $("." + sectionClassName + " .resendLoader").hide();
                }
            },
            error: function (objXHR, objStatus, objError) {
                console.log(objXHR.responseText);
            }

        });
}

function fnOberoiOneRecoverYourPasswordGP() {
    var FormData = $("form[name='frmOberoiOneRecoverYourPasswordGP']").serializeArray();
    if (window.location.pathname == "/photo-context/dashboard/") {
        FormData.push({ name: 'synxisReturnURL', value: window.location.href });
    }
    var userEmailID = $("#txtforgetpasswordemail").val().trim();
    $('.signinGPSection .password-recovery .sign-in-submit').addClass('processing');
    $.ajax(
        {
            url: handelerPrefix + '/handlers/oberoi-one/forget-password.ashx',
            type: 'post',
            data: FormData,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);

                if (response.success == true) {
                    /**/
                    glblOberoiOneUserEmail = userEmailID;
                    $('.signinGPSection #UserPasswordRecoveryMessage .otp-txt').html('Dear Guest,<br> An email with the details of resetting your password has been sent to your registered email ID. <br> Please follow the instructions given in the email to create your new password. </div></br><div class="resend-otp"><a href="javascript:;" onclick="fnOberoiOneRecoverYourPasswordResendGP()" class="otp-resened-btn">Click here</a> to resend the email. <span class="resendLoader" style="display: none"><img src="/images/OberoiHotels/oberoi-one/resend-loader.gif"></span></div>');

                    $('.signinGPSection .password-recovery').hide();
                    $('.signinGPSection #UserPasswordRecoveryMessage').show();
                    $('.signinGPSection .password-recovery .sign-in-submit').removeClass('processing');
                }
                else if (response.error == true) {
                    if (response.oberoi_one_errors != null) {
                        $('.signinGPSection .password-recovery .err-txt').html(" ");
                        for (var i = 0; i < response.oberoi_one_errors.length; i++) {
                            $('.' + response.oberoi_one_errors[i].error_field).html(response.oberoi_one_errors[i].error_message);

                            $('.signinGPSection .password-recovery .err-txt').show();
                            $('.signinGPSection .password-recovery .sign-in-submit').removeClass('processing');
                        }
                    }
                    if (response.error_description != "") {
                        $('.signinGPSection .password-recovery .err-txt').html(" ");
                        $('.signinGPSection .password-recovery .txtforgetpasswordemail').html(response.error_description);
                        $('.signinGPSection .password-recovery .err-txt').show();
                        $('.signinGPSection .password-recovery .sign-in-submit').removeClass('processing');
                    }
                }
            },
            error: function (objXHR, objStatus, objError) {
                $('.password-recovery .common-error').html(objXHR.responseText);
            }

        });
}
function fnOberoiOneRecoverYourPasswordResendGP() {
    var FormData = $("form[name='frmOberoiOneRecoverYourPasswordGP']").serializeArray();
    if (window.location.pathname == "/photo-context/dashboard/") {
        FormData.push({ name: 'synxisReturnURL', value: window.location.href });
    }
    var userEmailID = $("#txtforgetpasswordemail").val().trim();
    $('.resendLoader').show('processing');
    $('.password-recovery .sign-in-submit').addClass('processing');
    $.ajax(
        {
            url: handelerPrefix + '/handlers/oberoi-one/forget-password.ashx',
            type: 'post',
            data: FormData,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);

                if (response.success == true) {
                    /**/
                    glblOberoiOneUserEmail = userEmailID;
                    $('.resendOtpMessage').html(response.success_message).addClass('green').show();

                    $('.resendLoader').hide('processing');
                }
                else if (response.error == true) {

                }
            },
            error: function (objXHR, objStatus, objError) {

                $('.password-recovery .err-txt').html(" ");
                if (objXHR.responseText.length > 50) {
                    $('.password-recovery .common-error').html('There seems to be an issue.  Please try again after some time.');
                }

                $('.password-recovery .common-error').show();

            }

        });
}

function fnOberoiOneVerifyOtpGP(data) {

    var otpNumber = "";
    $('.err-txt').html("");
    var otpInputObj = "#oberoi-one-login-singn-up-form-container form[name='" + data + "'] .otp-input-box";
    otpNumber += $(otpInputObj + " input[name='digit-1']").val();
    otpNumber += $(otpInputObj + " input[name='digit-2']").val();
    otpNumber += $(otpInputObj + " input[name='digit-3']").val();
    otpNumber += $(otpInputObj + " input[name='digit-4']").val();

    var FormData = $("form[name=" + data + "]").serializeArray();
    FormData.push({ name: 'otpNumber', value: otpNumber });

    $("form[name='" + data + "'] .otp-txt-box .validate-otp").addClass('processing');
    $.ajax(
        {
            url: handelerPrefix + "/handlers/oberoi-one/verify-otp.ashx",
            type: 'post',
            data: FormData,
            dataType: 'jsonp',
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);
                $('form[name="' + data + '"] .txtotpNumber').html('');
                if (response.success == true) {
                    createSessionCookie("OberoiOneUserLoggedInStatus", "true");
                    createSessionCookie("OberoiOneUserDisplayNameWithSaluatation", response.Oberoi_One_Response_User_Data[0].Salutation + " " + response.Oberoi_One_Response_User_Data[0].LastName);

                    createSessionCookie("OberoiOneLoggedMemberBasicInformation", JSON.stringify(response.Oberoi_One_Response_User_Data[0]));

                    //url for redirection.
                    if (window.location.pathname == "/photo-contest/dashboard/") {
                        location.reload();
                    }
                    else {
                        window.location = "/oberoi-one/dashboard/";
                    }
                }
                else if (response.error == true) {

                    $('form[name="' + data + '"] .txtotpNumber').html(response.error_description);
                    $("form[name='" + data + "'] .otp-txt-box .validate-otp").removeClass('processing');
                    $('form[name="' + data + '"] .err-txt').show();
                }
            },
            error: function (objXHR, objStatus, objError) {
                console.log(objXHR.responseText);
            }

        });
}
function fnOberoiOneShowPasswordRecoveryScreenGP() {
    $(".signinGPSection .sign-in-wrapper").hide();
    $(".signinGPSection .password-recovery").show();
}
function fnOberoiOneShowLoginScreenGP() {
    $(".signinGPSection .sign-in-wrapper").show();
    $(".signinGPSection .password-recovery").hide();
}
/*    MO Login Pop Up Code Ends   */



function fnOberoiOneMobMenuDisplay() {

$(document).on("click", ".o-one-user-name-short", function(){
    fnOberoiOneShowLogOutDropDown();
   $(".o-one-user-name").toggle(); 
   $(".o-one-login-user-dtls").toggleClass("active");
});

$(".o-one-mob-menu-close-btn").click(function(){
    $(".o-one-user-name").hide(); 
   $(".o-one-user-log-out-btn").hide(); 
   $(".o-one-login-user-dtls").removeClass("active");
});
$(".menu-close, #nav-icon").click(function(){
$(".menu-o-one-login-details .o-one-user-name").show();    
});

$(".o-one-menu-wrap .o-one-login-menu .o-one-login-user-dtls .o-one-user-name").prop('onclick', null).off('click');         
}

function fnOberoiOneMobMenuSubMenuDisplay() {
    $(".menu-container.mo-menu-conatiner .main-menu>li .menu-level-1.oberoi-one-menu-level-1 .menu-hdng").click(function(){
        $(".menu-container .backto-menu").hide();
        $(this).toggleClass("active");
     if($(this).hasClass("active")){ 
          
      $(this).next(".menu-list").addClass("actv"); 
    } 
    else{
        
        $(this).next(".menu-list").removeClass("actv"); 
    } 

    });

$(".menu-container").on('click', '.backto-menu span.actv2', function() {
  $(".menu-container .main-menu .oberoi-one-menu-level-1 .menu-hdng").removeClass("active");  
});

$(".menu-container .main-menu .mo-mendarin-menu .menu-hdng").click(function(){
  if($(".menu-container.mo-menu-conatiner .main-menu>li .menu-level-1 .mo-mendarin-menu .menu-list").hasClass("actv")){
    $(".menu-container .main-menu>li:not(.has-submenu), .menu-container .social-menu, .menu-container .main-menu>li.type2").css("opacity","0");
  }

  $("#menu").scrollTop(0); 

});

$(".menu-container .main-menu .mo-oberoi-menu-list .menu-hdng").click(function(){
    if($(".menu-container.mo-menu-conatiner .main-menu>li .menu-level-1 .mo-oberoi-menu-list .menu-list").hasClass("actv")){
      $(".menu-container .main-menu>li:not(.has-submenu), .menu-container .social-menu, .menu-container .main-menu>li.type2").css("opacity","0");
    }
    $("#menu").scrollTop(0);
  
  });

  $(".menu-container .menu-close").click(function(){
    $(".menu-container .main-menu>li, .menu-container .social-menu").css("opacity","1");
  });



$(".menu-container .main-menu .hamburger-mob-menu-head-mo > .menu-hdng").click(function(){
   $(".menu-container .backto-menu").hide();
    $(this).toggleClass("active");
    if($(this).hasClass("active")){ 
         
     $(this).next(".menu-list").addClass("actv"); 
   } 
   else{
       $(this).next(".menu-list").removeClass("actv"); 
   }     

 }); 




}



	
	

	