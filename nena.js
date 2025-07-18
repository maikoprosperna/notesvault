$(function(){
	console.log('Theme Version 1.7.11'); //temporary
	// loopCategories();
	showHideLoginModal();
	showPromotionAnnouncementModal();
	operatingHoursFlashMessage();
	sliderSinglePageInit();
	backToTop();
	fixedHeader();
	sortOnchange();
	filterOnChange();
	addToCart();
	addToCartModal();
	deleteToCart();
	paymentOnChange();
	filterFieldInitx();
	colorPicker();
	promocodeInit();
	payWithCoins();
	validateMaxNumber();
	onLoadForgotPassword();
	selectInit();
	clearLocalStorage();
	dropdownFixed();
    onClickCheckBoxDemo();
    variantCheck();
    onVariantHide();
    onStoreLocationPick();
    shareModal();
    onAddonPick();
    onReply();
    onLoadDragonPayPage();
    recurringBtnOnClick();
    clickShowOrderAttachment();
    reviewStarClick();
	
	onChangeScheduler();
	getValueOfRadioButtonCheckoutPage();
	getFirstCheckBox();
	onGetProductsView();
	runPopUp();
	onLoadPaymayaPayPage();
	initializeSlickOnHomePage();
	slickOnProductsPage();
	radioInputOnProductCategory();
	productCategoriesScrolled();
	showSocialMediaLinkModal();
	expandSearchBar();
	hideSearchOnProductsPage();
	copyToClipboardModal();
	seeAllProducts();

	initSlickOnHomeCategory();
	initSlickCleanBeautyOnHomeCategory();
	// initSlickCleanBeautyOnHomeTestimonials();
	onLoadGcashPaymongoThankYou();
	checkoutDatePickerInit();
	setDefaultDateTimeDeliveryDate();
	//runPopUp();
	clearLocalStorageCloseBrowser();
	onClickFloatingCart();
	
	activeGeoloacation();
	addListenerToCategory();
	saveTotalPrice();
	sliderPartner();
	onLoadBuxPayPage();
	maximaChanges();
	executionListener();
	categoryAccordionFunction();
	setPhoneStaticText();
	checkFirstCheckBox();
	checkoutListener();
	seniorCodeApply();
	executeFreeShippingPromo();
	cropperInit();
	cropperInitPrinter();
	xZoom();
	userInfoValidation();
	onChangeProdCartQty();
	cleanBeautyBannerSliderSlick();
	cleanBeautyTestiSlider();
	slickCleanBeautyHomePage();
	checkIfTapfiliatePresent();
	checkIfTapfiliatePresentStorage();
	onChangeProductCart();
	onInfoSave();
	categorySelect();
	paymentOnChangeDeliveryOpt();
	paymentOptiobsOnChange();
	onSettingOrderingScheduleBlockHours();
	handleFailedPaymentsCheckoutPage();
	settingNewlyRegCustomerVoucher();
	sendEmailVerifitication();
	showHidenPaymentGatewayOnState();
	displayRequestQuotationMessage();
	showPhoneAreaCode();
  	dedicationMsg();
	changeMapSearchPosition();
	handleExpiredSessionPopupMessage();
	buyNowDirect();
	buyNowDirectSingleProductPage();
	handleCartErrorMessages();
	validateImage();
	initSlickOnBrandListing();
	handleSingleProductPageQty();
    resetCustomerLatLng();
	uploadImageOnChange();
	addEventToBankTransferConfirm();
	addEventOnBankTransferSkip();
	hideMapWhenStoreGeolocationIsOn();
	handleWebsiteSearchOnClick();
	userInputValidation();
	endCallInSession();
	deliveryDateOnChange();
	addListenerToPinAddressoMap();
	handleDeliveryMethod();
  gcashDirectTYPageListeners();
	
  /* Note: Insert function calls above this line */
	handleLoadSpinner();
	/* Note: Do not insert any function call below this line */

	validateInfoShippingOnLoad();

	calculateGrandTotal();
});

let grandTotalCalulating;
let grandTotalCalculatingDone = false;
let onGettingShippingCostCompleted;
let onGettingShippingCostKilometerCompleted;
let onGettingCashOnDeliveryFeeCompleted;

const INVALID_CART_STATE = [
	'LOW QUANTITY',
	'SOLD OUT',
	'INACTIVE'
];
const FILE_SIZE_LIMIT = 25000000

function handleWebsiteSearchOnClick(){
	$(document).on('click', '#search-container .search i.fa-search', function() {
		$("#search-container .search").submit();
	})
}

function handleSingleProductPageQty(){

    $(document).on('change focus',  '.not-variant input[name="qty"]', function(){
        let productId = $('.not-variant input[name="product_id"]').val();
        let qty = $(this).val();

        $.request('onCheckMaximumProductQtyValidator', {
            data: {
                qty: qty,
                prodctId: productId,
                variantId: null,
                color: null,
                size: null,
                type: null,
                type2: null,
                type3: null,
            }
        });
    });
    $(document).on('input focus',  '#variant-btn input[name="qty"]', function(){
        let productId = $(this).attr("data-product-id") || $('form.add-to-cart-form input[name="product_id"]').val();
        let variantId = $(this).attr("data-variant-id");
        let qty = $(this).val();

        const color = $('input.colorInput').val();
        const size = $('input.sizeInput').val();
        const type = $('input.typeInput').val();
        const type2 = $('input.typeInput2').val();
        const type3 = $('input.typeInput3').val();

		$.request('onCheckMaximumProductQtyValidator', {
			data: {
				qty: qty,
				prodctId: productId,
				variantId: variantId,
				color: color,
				size: size,
				type: type,
				type2: type2,
				type3: type3,
			}
		});
    });
}

function handleCartErrorMessages(){
	const currentPathName = window.location.pathname;

	if((currentPathName == "/ecommerce/cart" || currentPathName == "/cart") || (currentPathName == "/ecommerce/products" || currentPathName == "/products")){
		const url_string = window.location.href;
		const url = new URL(url_string);
		const isCartItemExpired = url.searchParams.get("cie");
		if(isCartItemExpired === "1"){
			const cartItemExpiredMsg = url.searchParams.get("m");
			$.oc.flashMsg({
				'text': cartItemExpiredMsg,
				'class': 'error',
				'interval': 15
			})
		}else{
			console.log("isCartItemExpired","false");
		}
	}
}

function handleExpiredSessionPopupMessage(){
	const currentPathName = window.location.pathname;

	if(currentPathName == "/ecommerce/information-and-shipping" || currentPathName == "/information-and-shipping"){
		const url_string = window.location.href;
		const url = new URL(url_string);
		const isExpiredSession = url.searchParams.get("expired-session");
		if(isExpiredSession != null){
			console.log("isExpiredSession",isExpiredSession)
			if(isExpiredSession){
				$("#checkout-session-expired-modal .message").text(url.searchParams.get("message"));
				$('#checkout-session-expired-modal').modal('show');
			}
		}
	}
}

function handleFailedPaymentsCheckoutPage(){
	const currentPathName = window.location.pathname;

	if(currentPathName == "/ecommerce/checkout" || currentPathName == "/checkout"){
		const url_string = window.location.href;
		const url = new URL(url_string);
		const isPaymentFailed = url.searchParams.get("payment-failed");
		if(isPaymentFailed != null){
			console.log("isPaymentFailed",isPaymentFailed)
			if(isPaymentFailed){
				$('#failed-payment-modal').modal('show');
			}
		}
	}
	
}

function operatingHoursFlashMessage() {
	$(document).on('click', '#closed-hours-button', function() {
		$.request("onOperatingHoursFlashMessage")
	})
}
function onInfoSave(){
	order_method = $('input[name="order_method"]:checked').val();
	if(order_method == "Store Pickup"){
		$('.other-info-container.info-content').hide();
	}

	$(document).on('click', '.info-botton .continue-validation', function(e) {
		e.preventDefault();
		var cart_check = [];
		$('.info-content .prod-container-holder').each(function() {
			cart_check.push($(this).data('cart-id'));
		});

		if (!cart_check.length) {
			$.oc.flashMsg({text: 'Session expired. Refresh the page to continue.', 'class': 'error'});
			return false;
		}

		$.request('onValidateProductAvailability', {
			loading: $.oc.stripeLoadIndicator,
			data : {
				ids: cart_check
			},
			success: function(response) {
				if (!response.success) {
					$.oc.flashMsg({text: response.message, class: 'error'});
					return false;
				}

				if (response.success) {
					if (!response.data.length) {
						$.oc.flashMsg({text: 'Please select item(s).', 'class': 'error'});
						return false;
					}

					let listString = '';
					let ctr = 1;
					$.each(response.data, function(index, value) {
						if (INVALID_CART_STATE.includes(value.product_state)) {
							listString += '<li class="list-group-item" ' +
								'data-id="'+value.id+'"' +
								'data-cart_id="'+value.cart_id+'"' +
								'data-prod-state="'+value.product_state+'">' +ctr +'. '+value.title+' - ' + value.product_state +'</li>';
							ctr++;
						}
					});
					$('.invalid-cart-product-list li').each(function() {
						$(this).remove();
					});
					$('.invalid-cart-product-list').append(listString);

					if (ctr > 1) {
						$('#productValidationModal').modal('show');
						location.replace('/cart');
					}
					$('.info-botton .continue').click();
				}
			},
			error: function() {
				$.oc.flashMsg({text: 'Error Occured. Please try again.', 'class': 'error'});
			}
		});
	});

	$(document).on('click',  '.info-botton .continue', function(){
        complete = true;
        fname = $('#info_container__plain input[name="fname"]').val();
		lname = $('#info_container__plain input[name="lname"]').val();
		email = $('#info_container__plain input[name="email"]').val();
		phone = $('#info_container__plain input[name="phone"]').val();
		billing_address = $('#info_container__plain input[name="billing_address"]').val();
		billing_state = $('#info_container__plain .billing-state').val();
		billing_city = $('#info_container__plain .billing-city').val();
		billing_barangay = $('#info_container__plain .billing-barangay').val();
		billing_landmark = $('#info_container__plain input[name="billing_landmark"]').val();
		billing_postal = $('#info_container__plain input[name="billing_postal"]').val();
		billing_lat = $('#info_container__plain input[name="lat"]').val();
		billing_long = $('#info_container__plain input[name="long"]').val();
		order_method = $('input[name="order_method"]:checked').val();
		order_notes = $('textarea[name="order_notes"]').val();
		dedication_msg = $('textarea[name="dedication_msg"]').val();
		delivery_type = $('input[name="whenradio"]:checked').val();
		guest_register = $('input[type=radio][name=register_btn]:checked').val();
		var leadTime = $("#minimumLeadTime").val() != "" ? parseInt($("#minimumLeadTime").val()) : 0;
		recipient_name = $('input[name="recipient_name"]').val();
		recipient_contact = $('input[name="recipient_contact"]').val();
		pass = $('.password-checkout').val();
		var error_msg = "";
		var newDeliveryDate = $("#delivery-date").val().length > 0 ? new Date($("#delivery-date").val()) : new Date();
		var currentlySelectedTime = $("#delivery-date").val() +" "+ $(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val();
        
        if($("#delivery-date").val()){
			wholeTime = moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00";
		}
		register = $('#guest_header__plain input[name="register_btn"]:checked').val();
		password = $('#guest_header__plain input[name="password"]').val();
		if(delivery_type == "now"){
				var deliveryDate = moment().format("Y-M-D");
				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

				//Check if minutes is available in the option, if not set to 00 or 30
				if($('.minutes-select option[value="'+minutes+'"]').length < 1){
					minutes = parseInt(minutes) > 30 ? '00' : '30';
				}

				//Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
				if($('.hour-select option[value="'+hour+'"]').length < 1){
					hour = $('.hour-select option:nth-child(1)').val();
				}

				$('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$("#delivery-date").val(deliveryDate);
				$(".am-pm-select").val(ampm);

				$("#delivery-date-value").val(deliveryDate);
				$("#delivery-time-value").val(moment().format("H:m:00"));
		}
	
		var validate_email = validateEmail(email);
		var validate_phone = validatePhoneNumber(phone.replace(/\s+/g, ''));
		if(validate_email == "not valid"){
			$('.error').text('Invalid Email');
			$.oc.flashMsg({text: 'Invalid Email', 'class': 'error'});
			complete = false;
		}

		if((!validate_phone) || phone.length > 13){
			$('.error').text('Invalid Phone');
			$.oc.flashMsg({text: 'Invalid Phone', 'class': 'error'});
			complete = false;
		}

		if(order_method == "Delivery"){
			if (billing_lat == "" || billing_long == ""){
				$('.error').text('Please point your location');
				$.oc.flashMsg({text: 'Please point your location', 'class': 'error'});
				complete = false;
			}
		}

		if (fname == "" || lname == "" || email == "" || phone == null || order_method == "") {
			$('.error').text('Please complete all the fields');
			$.oc.flashMsg({text: 'Please complete all the fields', 'class': 'error'});
			complete = false;
		}

        let orderMethodsWithoutAddressInfo = ['Store Pickup', 'Book Your Own']
        if (! orderMethodsWithoutAddressInfo.includes(order_method)) {
            if (billing_address == "" || billing_state == "" || billing_city == "" || billing_barangay == "" ||(billing_postal == "" && $('#info_container__plain input[name="billing_postal"]').data('billease') != '1')) {
                $('.error').text('Please complete all the fields');
                $.oc.flashMsg({text: 'Please complete all the fields', 'class': 'error'});
                complete = false;
            }
        }

        if(guest_register == "register"){
			if($('.password-checkout').val().length < 8){
		     	$('.error').text('The password must be between 8 and 255 characters');
				$.oc.flashMsg({text: 'The password must be between 8 and 255 characters', 'class': 'error'});
				$('.password-checkout').css("border-color", "#DA4A59");
				complete = false;
		    }
		    if(pass == ""){
		    	$('.error').text('Password are required');
		    	$('.password-checkout').css("border-color", "#DA4A59");
				$.oc.flashMsg({text: 'Password are required', 'class': 'error'});
				complete = false;
		    }else{
		    	$('.password-checkout').css("border-color", "#CED4DA");
		    }

			if (recipient_name == ""){
		    	$('.error').text('Recipient name is required');
		    	$('[name="recipient_name"]').css("border-color", "#DA4A59");
				$.oc.flashMsg({text: 'Recipient name is required', 'class': 'error'});
				complete = false;
		    }

			if (recipient_contact == ""){
		    	$('.error').text('Recipient information is required');
		    	$('[name="recipient_contact"]').css("border-color", "#DA4A59");
				$.oc.flashMsg({text: 'Recipient contact information is required', 'class': 'error'});
				complete = false;
		    }
		}

		if($("#order_scheduling_switch").val() == "1" && leadTime > 0){
			var testssg = convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00";
            console.log(testssg, newDeliveryDate);
			var wholeTime = moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00";
			var now  = moment().format("Y-M-D H:m:00").toString();
			var then = wholeTime.toString();
			if($(".minutes-select").val() != null && parseInt(moment(then,"Y-M-D H:m:ss").diff(moment(now,"Y-M-D H:m:ss"), 'hours')) < leadTime) {
				var texterror = "Advanced orders should be placed "+$("#minimumLeadTime").val()+" hour(s) ahead.";
				$.oc.flashMsg({ text: texterror, 'class': 'error' });
		
				$("#delivery-date-value").val(moment().format("Y-M-D"));
				$("#delivery-date").val(moment().format("Y-M-D"));
				$("#delivery-time-value").val(moment().format("H:m:00"));
		
				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

				//Check if minutes is available in the option, if not set to 00 or 30
				if($('.minutes-select option[value="'+minutes+'"]').length < 1){
					minutes = parseInt(minutes) > 30 ? '00' : '30';
				}

				//Check if hour is available in the option, if not set to 1st option
				if($('.hour-select option[value="'+hour+'"]').length < 1){
					hour = $('.hour-select option:nth-child(1)').val();
				}

				$('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$(".am-pm-select").val(ampm);
				complete = false;
			}


		}

		if($("#orderSchedSwitch").val() == "1") {
			var inputtedDelivTime = moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00";
			if($("#orderSchedOpen").val() != "" && $("#orderSchedClose").val() != "") {
				if(openHour != "" && closeHour != "") {
					if(leadTime <= 0) {
						console.log([$('#orderSchedOpen').val(), $('#orderSchedClose').val()]);
						var openHour =  moment(moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + $("#orderSchedOpen").val().split(" ")[1]);
						var closeHour = moment(moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + $("#orderSchedClose").val().split(" ")[1]);
						if(moment(inputtedDelivTime).isBefore(closeHour) && moment(inputtedDelivTime).isAfter(openHour)) {
							
						}else {
							$.oc.flashMsg({text: 'Order scheduling is from ' + convertTimeFron24To12($("#orderSchedOpen").val().split(" ")[1]) + " to "
							+ convertTimeFron24To12($("#orderSchedClose").val().split(" ")[1]) + " only", 'class': 'error'});

							complete = false;
						}
					}
					else {
						var openHour = moment(moment().format("Y-M-D") + " " + $("#orderSchedOpen").val().split(" ")[1]);
						var closeHour = moment(moment().format("Y-M-D") + " " + $("#orderSchedClose").val().split(" ")[1]);
						var userInputtedOrder = moment(moment().format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00");

						if(moment(userInputtedOrder).isBefore(closeHour) && moment(userInputtedOrder).isAfter(openHour)) {
							
						}
						else {
							$.oc.flashMsg({text: 'Order scheduling is from ' + convertTimeFron24To12($("#orderSchedOpen").val().split(" ")[1]) + " to "
							+ convertTimeFron24To12($("#orderSchedClose").val().split(" ")[1]) + " only", 'class': 'error'});

							complete = false;
						}
					}
				}
			}
		}

		if(leadTime > 0) {
			if($(".minutes-select").val() != null && parseInt(moment(moment(newDeliveryDate.toISOString()).format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00","Y-M-D H:m:ss").diff(moment(moment()), 'hours')) < leadTime) {
				var texterror = "Advanced orders should be placed "+$("#minimumLeadTime").val()+" hour(s) ahead.";
				$.oc.flashMsg({ text: texterror, 'class': 'error' });
		
				$("#delivery-date-value").val(moment().format("Y-M-D"));
				$("#delivery-date").val(moment().format("Y-M-D"));
				$("#delivery-time-value").val(moment().format("H:m:00"));
		
				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

                //Check if minutes is available in the option, if not set to 00 or 30
                if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                    minutes = parseInt(minutes) > 30 ? '00' : '30';
                }

                //Check if hour is available in the option, if not set to 1st option
                if($('.hour-select option[value="'+hour+'"]').length < 1){
                    hour = $('.hour-select option:nth-child(1)').val();
                }

                $('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$(".am-pm-select").val(ampm);
				complete = false;
			}
		}

		//If no other errors, check if order schedule is not blocked
		if(complete) complete = validateOrderScheduleWithBlockedDates($("#delivery-date").val() + ' ' + $('.hour-select').val() + ':' + $('.minutes-select').val() + ' ' + $('.am-pm-select').val());

		if(lname == ""){
			$('#info_container__plain input[name="lname"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="lname"]').css("border-color", "#CED4DA");   
		}

		if(fname == ""){
			$('#info_container__plain input[name="fname"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="fname"]').css("border-color", "#CED4DA");   
		}

		if(email == ""){
			$('#info_container__plain input[name="email"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="email"]').css("border-color", "#CED4DA");   
		}

		if(phone == ""){
			$('#info_container__plain input[name="phone"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="phone"]').css("border-color", "#CED4DA");   
		}

		if(billing_address == ""){
			$('#info_container__plain input[name="billing_address"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="billing_address"]').css("border-color", "#CED4DA");   
		}

		if(billing_state == ""){
			$('#info_container__plain select[name="billing_state"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain select[name="billing_state"]').css("border-color", "#CED4DA");   
		}

		if(billing_city == ""){
			$('#info_container__plain select[name="billing_city"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain select[name="billing_city"]').css("border-color", "#CED4DA");   
		}

		if(billing_barangay == ""){
			$('#info_container__plain select[name="billing_barangay"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain select[name="billing_barangay"]').css("border-color", "#CED4DA");   
		}

		if(billing_postal == ""){
			$('#info_container__plain input[name="billing_postal"]').css("border-color", "#DA4A59");
		}else{
			$('#info_container__plain input[name="billing_postal"]').css("border-color", "#CED4DA");   
		}

        if($('#lalamove_direct_hidden').val() == 1 && complete && order_method == "Delivery"){
			// if($("#sewn_sandal_shipping_logic_switch").val() == false) {
			// 	var lalamove_area = $('#lalamove_area_hidden').val(),
            //     error_msg = 'Delivery Address is out of service area.' + ((lalamove_area !== '') ? ' We only deliver within ' + lalamove_area + '.' : '');

			// 	if (lalamove_area.toLowerCase() != ($('select[name="billing_state"] option:selected').val()).toLowerCase()) {
			// 		$.oc.flashMsg({text: error_msg, 'class': 'error'});
			// 		complete = false;
			// 	}
			// } else {
			// 	if($('input[name="whenradio"]:checked').val() != "later") {
			// 		var lalamove_area = $('#lalamove_area_hidden').val(),
			// 		error_msg = 'Delivery Address is out of service area.' + ((lalamove_area !== '') ? ' We only deliver within ' + lalamove_area + '.' : '');

			// 		if (lalamove_area.toLowerCase() != ($('select[name="billing_state"] option:selected').val()).toLowerCase()) {
			// 			$.oc.flashMsg({text: error_msg, 'class': 'error'});
			// 			complete = false;
			// 		}
			// 	}
			// }

			if($('span#delivery-options #delivery').is(":hidden")){
				complete = false;
				error_msg = 'Delivery Address is out of service area.';
				$.oc.flashMsg({text: error_msg, 'class': 'error'});
			}
			
        }

		if($('input[name="whenradio"]:checked').val() == "later") {
			var checkDeliveryTime = checkIfDeliveryTimeIsMoreThan30Mins(currentlySelectedTime);

			if (!checkDeliveryTime) {
				complete = false;
			}
		}

        var continueSaveUserInfo = function(){
			$.request('onUserInfoUpdate', {
				data: {
					fname: fname,
					lname: lname,
					email: email,
					phone: phone,
					billing_address: billing_address,
					billing_state: billing_state,
					billing_city: billing_city,
					billing_barangay: billing_barangay,
					billing_landmark: billing_landmark,
					billing_postal: billing_postal,
					billing_lat: billing_lat,
					billing_long: billing_long,
					order_method: order_method,
					order_notes:order_notes,
					dedication_msg:dedication_msg,
					delivery_type: delivery_type,
					delivery_schedule: wholeTime,
					register: register,
					password: password,
					recipient_name: recipient_name,
					recipient_contact: recipient_contact
				},
				loading:  $.oc.stripeLoadIndicator
			});
		};

        if(complete){
            if($('#lalamove_direct_hidden').val() == 1 && order_method == "Delivery"){
                //Check if serviceable by Lalamove
                var latLonObject = {
					"delivery_schedule": delivery_type == "now" ? moment().format("Y-M-D H:m:00").toString() : wholeTime,
                    "lat1": $("#store_lat_input").val(),
                    "lon1" : $("#store_long_input").val(),
                    "lat2" : billing_lat,
                    "lon2" : billing_long,
                    "customer_address" : billing_address + " " + billing_barangay + " " + billing_city,
                    "store_address" : $('#store_address').val(),
                    "requester_contact_name" : $("#store_manager_full_name_hid").val(),
                    "request_contact_phone" : $("#store_contact_number").val(),
                    "delivery_contact_name" : fname + " " + lname,
                    "delivery_contact_phone" : phone,
                    "delivery_remarks" : '',
                    "country_code" : "PH",
                    "service_type" : "MOTORCYCLE",
					"userId": $('input[name="userId"]').val()
                };

                lalamoveGetQuotationAjax(latLonObject, function(data){
                    if(data.message == "ERR_OUT_OF_SERVICE_AREA"){
                        $.oc.flashMsg({text: 'Delivery Address is out of service area.', 'class': 'error'});
                    }else{
                        continueSaveUserInfo();
                    }
                });
                //End Check if serviceable by Lalamove
            }else{
                continueSaveUserInfo();
            }
        }
		
	});
	$(".info-content .email-input").on('keyup', function(event) {
		var guestEmail = $(".info-content .email-input").val();
		var emailReg = /^(?:[A-Za-z0-9!#$%&amp;'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&amp;'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]*[A-Za-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;  
		if(!emailReg.test(guestEmail)) {  
			$(".info-content .email-input").addClass("error");
			$("#email_alert").html(" please use a valid email address, ie: example@email.com");
		}else{
			$(".info-content .email-input").removeClass("error");
			$("#email_alert").html("");
   		}       
	});

	$("#recipient_contact, #recipient_name").on('keyup', function(event) {
		var recipientContact = $("#recipient_contact").val();
		if((!recipientContact.match(/^[\+][0-9]{12}/)) && (recipientContact !== "")) {
			$("#recipient_contact_alert").html(" ie: +639865432321 or leave blank");
			$("#recipient_contact").addClass("error");
			$('.info-botton .continue').prop("disabled", true);
		}else{
			if((!recipientContact.startsWith('+63')) && (recipientContact !== "")){
				$("#recipient_contact_alert").html(" ie: +639865432321 or leave blank");
				$("#recipient_contact").addClass("error");
				$('.info-botton .continue').prop("disabled", true);
			}else{
				$("#recipient_contact_alert").html("");
				$("#recipient_contact").removeClass("error");
				$('.info-botton .continue').prop("disabled", false);
			}
		}
		var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,/~`=1234567890";
		var recipientName = $("#recipient_name").val();
		var checkForSpecialChar = function(string){
		for(i = 0; i < specialChars.length;i++){
		if(string.indexOf(specialChars[i]) > -1){
			return true
			}
		}
		return false;
		}
		if(checkForSpecialChar(recipientName)){
			$("#recipient_name_alert").html(" must not contain special characters and numbers or leave blank");
			$("#recipient_name").addClass("error");
			$('.info-botton .continue').prop("disabled", true);
		} else {
			$("#recipient_name_alert").html("");
			$("#recipient_name").removeClass("error");
		}
	});

	$(document).on('change',  '#info_container__plain .billing-state', function(){
		$(".billing-city").prop('disabled', true);
		$('.billing-city').empty().append('<option value="loading">Loading...</option>');
		$(".billing-city").val('loading');

		$(".billing-barangay").prop('disabled', true);
		$('.billing-barangay').empty().append('<option value="empty">--</option>');
		$(".billing-barangay").val('empty');

		var _val = $(this).val();
		// $.request('onClearBrangay');
		// $.request('onClearCity');
		$.request('onGetCityLocation', {
			data: {
				province: _val,
			}
		});
	});
	$(document).on('change',  '#info_container__plain .billing-city', function(){
		$(".billing-barangay").prop('disabled', true);
		$('.billing-barangay').empty().append('<option value="loading">Loading...</option>');
		$(".billing-barangay").val('loading');

		var _val = $(this).val();
		var province = $('#info_container__plain .billing-state').val();
		$.request('onGetBarangayLocation', {
			data: {
				province: province,
				city: _val,
			}
		});
		$.request('onValidateLalamoveServicableArea', {
			data: {
				province: province,
				city: _val,
			},
			success: function(response) {
				if (!response.success && $('#lalamove_direct_hidden').val() === '1') {
					// $.oc.flashMsg({text: response.message, class: 'error'});
					$('span#delivery-options #delivery').hide();
				}else{
					$('span#delivery-options #delivery').show();
				}
			},
			error: function() {
				$.oc.flashMsg({text: 'Error Occured. Please try again.', 'class': 'error'});
			}
		});
	});

	$(document).on('change',  '#info_container__plain .option-rad', function(){
		order_method = $('input[name="order_method"]:checked').val();
		if(order_method == "Store Pickup" || order_method == "Book Your Own"){
			$('.lolat-wrap').hide();
            $('#billing-address-information-fieldset').parent().hide();
			$('span#delivery-options #delivery').show();
			$(".billing-state").val('');
			$(".billing-city").val('');
		}else{
			$('.lolat-wrap').show();
            $('#billing-address-information-fieldset').parent().show();
		}
	});

	$(document).on('click',  '#info_container__plain .order-hide', function(){
		_val = $(this).attr('aria-expanded');
		if(_val == "false"){
			$('#info_container__plain .order-hide').html('Open My Orders <i class="fa fa-angle-down" aria-hidden="true"></i>');
		}else{
			$('#info_container__plain .order-hide').html('Hide My Orders <i class="fa fa-angle-up" aria-hidden="true"></i>');
		}
	});
	
}

function validateEmail(emailaddress){  
   var emailReg = /^(?:[a-z0-9!#$%&amp;'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;  
   if(!emailReg.test(emailaddress.toLowerCase())) {
        return "not valid"
   }else{
   		return "valid"
   }       
}

function validatePhoneNumber(phone){  
	console.log("phone",phone)
	// OLD IMPLEMENTATION
	// var phoneReg = /((^(\+)(\d){12}$)|(^\d{11}$))/;  
	// if(!phoneReg.test(phone)) {  
	// 		return "not valid"
	// }else{
	// 		return "valid"
	// }       

   	var regEx = /^(|\+639)\d{9}$/;
   	return phone.match(regEx);
}
function onChangeProdCartQty(){
	$(document).on('change',  '.cart-prod-qty-input', function(){
		var $form = $(this).closest('form');
		$form.request();
	});
}
function onChangeProductCart(){
	$(document).on('click', '.multi-delete', function() {
		var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });

		if(cart_check.length != 0){
			$('#deleteModal').modal('show')
		}else{
			$.oc.flashMsg({text: 'Please select item(s).', 'class': 'error'});
		}
	});
	$(document).on('click', '#deleteModal .confirm', function() {
		var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
		var cart_product_ids = $.map(
			$('.cart-check input[name="product[]"]:checked'), 
			function(c){
				return $(c).data( 'product' ); });
		$.request('onCheckDelete', {
			data: {
				cart_ids: cart_check,
				cart_product_ids: cart_product_ids
			}
		});
	});
	
	$(document).on('change', '.cart-check input[name="product[]"]', function() {
		$('#checkSubTotal').text('Loading...');

		$id_number = $(this).data("storeid");
		$id = '#storeId' + $id_number;

		$('.cart-check input[name="product[]"]').each(function( index ) {
		  	product_id = $(this).data("storeid");
		  	if(product_id != $id_number){
		  		 $(this).prop('checked', false);
		  	}
		});
		$('.select-all').each(function( index ) {
		  	product_id = $(this).data("storeid");
		  	if(product_id != $id_number){
		  		 $(this).prop('checked', false);
		  	}
		});

		$($id).prop('checked', true);
		var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
		$.request('onCheckProductSubTotal', {
			data: {
				cart_ids: cart_check,
			}
		});
	});
	$(document).on('change', '.select-all', function() {
		$('#checkSubTotal').text('Loading...');
		
		$id_number = $(this).data("storeid");
		$id = '#storeId' + $id_number;
		$($id).prop('checked', true);

		$('.cart-check input[name="product[]"]').each(function( index ) {
		  	product_id = $(this).data("storeid");
		  	if(product_id != $id_number){
		  		 $(this).prop('checked', false);
		  	}
		});
		$('.select-all').each(function( index ) {
		  	product_id = $(this).data("storeid");
		  	if(product_id != $id_number){
		  		 $(this).prop('checked', false);
		  	}
		});

		 if($(this).is(":checked")){
		 	$(this).parent().parent().parent().find('input[name="product[]"]').prop('checked', true);
		 	var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
			$.request('onCheckProductSubTotal', {
				data: {
					cart_ids: cart_check,
				}
			});
		 }else{
		 	$(this).parent().parent().parent().find('input[name="product[]"]').prop('checked', false);
		 	var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
			$.request('onCheckProductSubTotal', {
				data: {
					cart_ids: cart_check,
				}
			});
		 }
	});
	
	$(document).on('change', 'input[name="product[]"]', function() {
		if($('.select-all').is(":checked")){
			$('.select-all').prop('checked', false);
		}
	});

	$(document).on('click', '.proceed-checkout-info-validation', function(e) {
		e.preventDefault();
		var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
		if (!cart_check.length) {
			$.oc.flashMsg({text: 'Please select item(s).', 'class': 'error'});
			return false;
		}

		$.request('onValidateProductAvailability', {
			loading: $.oc.stripeLoadIndicator,
			data : {
				ids: cart_check
			},
			success: function(response) {
				if (!response.success) {
					$.oc.flashMsg({text: response.message, class: 'error'});
					return false;
				}

				if (response.success) {
					if (!response.data.length) {
						$.oc.flashMsg({text: 'Please select item(s).', 'class': 'error'});
						return false;
					}

					let listString = '';
					let ctr = 1;
					$.each(response.data, function(index, value) {
						if (INVALID_CART_STATE.includes(value.product_state)) {
							listString += '<li class="list-group-item" ' +
								'data-id="'+value.id+'"' +
								'data-cart_id="'+value.cart_id+'"' +
								' data-prod-state="'+value.product_state+'">' +ctr +'. '+value.title+' - ' + value.product_state +'</li>';
							ctr++;
						}
					});
					$('.invalid-cart-product-list li').each(function() {
						$(this).remove();
					});
					$('.invalid-cart-product-list').append(listString);

					if (ctr > 1) {
						$('#productValidationModal').modal('show');
						location.replace('/cart');
					}
					$('.proceed-checkout-info').click();
				}
			},
			error: function() {
				$.oc.flashMsg({text: 'Error Occured. Please try again.', 'class': 'error'});
			}
		});
	});

	$(document).on('click', '.proceed-checkout-info', function() {
		var cart_check = $.map($('.cart-check input[name="product[]"]:checked'), function(c){return c.value; });
		var store_id = $('#partialListingCart input[type=radio][name=store_picker]:checked').val();
		if(cart_check.length != 0){
			$.request('onGettingCheckProduct', {
				loading: $.oc.stripeLoadIndicator,
				data: {
					cart_ids: cart_check,
					store_id: store_id
				}
			});
			/*if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
				$(location).attr('href', 'http://localhost/ecommerce/information-and-shipping')
			}else{
				$(location).attr('href', '/information-and-shipping')
			}*/
			
		}else{
			$.oc.flashMsg({text: 'Please select item(s).', 'class': 'error'});
		}
	});
	
	$('input[type=radio][name=store_picker]').change(function() {
		$('.cart-check input[name="product[]"]').prop('checked', false);
		$('.select-all').prop('checked', false);
	});
}
function cropperInit(){
	var image = $('.cropper-image img');

    // Tools
    $(document).on('click', '.crop-tools .btn', function(event) {
        // This code triggers the cropper but some "tool buttons"
        // elements shouldn't - like the upload button.
        // The cropper is destroyed here because we can't upload
        // an image if there's still a cropper
        if (event.target.getAttribute("ignore")) {
            image.cropper('destroy');
            return;
        }
        width = $('#room_width').val();
        height = $('#room_length').val();
        _method = $(this).data('method');
        _option = $(this).data('option');
        _second_option = $(this).data('second-option');

        if (width && height){
            if (_method == "scaleX" || _method == "scaleY" ){
                if (_option == -1) {
                    $(this).data('option',"1");
                } else {
                    $(this).data('option',"-1");
                }
            }
            image.cropper(_method,_option,_second_option);
        }
    });

	function cropSetData(width, height){
		image.cropper('destroy');
		image.cropper({
			responsive:false,
			zoomable: true,
	        cropBoxResizable: false,
	        toggleDragModeOnDblclick: false,
	        guides: false,
	        movable:true,
	        dragMode: 'move',
	        data: {
                width: parseInt(width) * 0.96,
                height: parseInt(height) * 0.96
	        },
			crop: function(event) {
			    console.log(event.detail.height);
			    console.log(event.detail.width);
			}
		});
	}
	function delay(callback, ms) {
	    var timer = 0;
		return function() {
		    var context = this, args = arguments;
		    clearTimeout(timer);
		    timer = setTimeout(function () {
		      callback.apply(context, args);
		    }, ms || 0);
		};
	}
	function getWallpaperPrice(){
		width = $('#room_width').val();
		height = $('#room_length').val();
		room_size = $('input[type=radio][name=room_size]:checked').val();
		type = $('input[type=radio][name=wall_type]:checked').val();
		disclaimer  = $('input[type=radio][name=disclaimer_wall]:checked').val();
		var addons_id = $.map($('.addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$.request('onWallPaperPrice', {
			data: {
				width: width,
				height: height,
				room_size: room_size,
				type: type,
				disclaimer: disclaimer,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			},
			update: { 
				'products/productPriceWallpaper': '#priceWallpaper',
				'products/totalsqm': '#sqmTotal',
				'products/wallpaperBtn': '#wallpaperBtn',
			}
		});
		if(width && height){
			width = width * 100;
			height = height * 100;
			cropSetData(width, height);
			$('.slider-preview').html('');
			$('.crop-tools').show();
			$('.cropper-image').show();
		}
	}


	$(document).on('click', '.wallpaper-add-to-cart', function() {
		width = $('#room_width').val();
		height = $('#room_length').val();

		print_width = $('#room_width_print').val();
		print_height = $('#room_length_print').val();
		print_type = $('input[type=radio][name=wall_type_print]:checked').val();

		room_size = $('input[type=radio][name=room_size]:checked').val();
		type = $('input[type=radio][name=wall_type]:checked').val();
		store_id = $('.store-id').val();
		product_id = $('.product-id').val();
		croppedimage = null;
		try {
			croppedimage = image.cropper('getCroppedCanvas').toDataURL("image/png");
		}
		catch(e) {
			$.oc.flashMsg({
				'text': "Oops! there's a problem while adding the wallpaper to your cart. Please refresh this page and try again.",
				'class': 'error',
				'interval': 10
			})
		}
		
		if(croppedimage != null){
			img_crop = croppedimage.replace('data:image/png;base64,', '');
			frame = $('input[type=radio][name=frame]:checked').val();
			var addons_id = $.map($('.addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
			var addons_qty = $.map($('.addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
			var addons_qty_filter = addons_qty.filter(function(v){return v!==''});

			customized = $('input[type="hidden"][name="customized"]').val() || false
			$.request('onAddToCartSingle', {
				data: {
					qty: 1,
					customized: customized,
					product: product_id,
					product_id: product_id,
					store_id: store_id,
					width: width,
					height: height,
					room_size: room_size,
					type: type,
					croppedimage: img_crop,
					print_type: print_type,
					print_width: print_width,
					print_height: print_height,
					frame: frame,
					Addon: addons_id,
					addon_qty: addons_qty_filter,
					wallpaper_file_name: null
				},
			});
		}
	});
}

function cropperInitPrinter(){
	var imagex = document.getElementById('crop_mage');
	var imageCheck = document.getElementById('crop_mage');
	var image = $('.cropper-image img');
    
    $('.note').prepend('<p id="shiftNote" style="font-size:9pt;">Hold <b>SHIFT</b> when resizing crop box to maintain aspect ratio</p>');
    $('#shiftNote').hide();
	function cropSetData(width, height){
		image.cropper('destroy');
		image.cropper({
			responsive:false,
			zoomable: false,
	        cropBoxResizable: false,
	        toggleDragModeOnDblclick: false,
	        guides: false,
	        movable:false,
	        cropBoxResizable: true,
	        background: false,
	        dragMode: 'move',
	        data: {
	        	width: parseInt(width) * 0.96,
                height: parseInt(height) * 0.96
	        },
			crop: function(event) {

			}
		});
	}

	$('#room_width_print,#room_length_print,input[type=radio][name=disclaimer]').change(function() {
		getPrintCanvasPrice();
	});
	$(document).on('change', '.canvas-addon .addons input.custom-control-input,.canvas-addon .addons .addon-qty', function() {
		getPrintCanvasPrice();
	});
	$('input[type=radio][name=disclaimer],input[type=radio][name=disclaimer_wall] ').change(function() {
		_this = $(this).val();
		if(_this == "No"){
			$('.policy-decline').show();
		}else{
			$('.policy-decline').hide();
		}
	});
	function getPrintCanvasPrice(){
		width = $('#room_width_print').val();
		height = $('#room_length_print').val();
		type = $('input[type=radio][name=wall_type_print]:checked').val();
		disclaimer  = $('input[type=radio][name=disclaimer]:checked').val();
		var addons_id = $.map($('.addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$.request('onCustomPrintPrice', {
			data: {
				width: width,
				height: height,
				type: type,
				disclaimer: disclaimer,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			},
			update: { 
				'products/productPriceWallpaper': '#priceWallpaper',
				'products/totalsqm': '#sqmTotal',
				'products/wallpaperBtn': '#wallpaperBtn',
			}
		});
		if(width && height){
			width = width * 100;
			height = height * 100;
			$('.crop-tools').show();
			cropSetData(width, height);
			$('.slider-preview').html('');
			$('.cropper-image').show();
		}
	}

	$('#inputImage').change(function(event){
		var files = event.target.files;
		var file_size = Math.round((files[0].size / 1024));
		if (file_size >= 25600) {
			$.oc.flashMsg({text: 'Upload Error: File size should be 25MB and below', 'class': 'error'});
			return false;
		}
		/**
		if (file_size <= 106) {
			$.oc.flashMsg({text: 'File too Small, Recommended Minimum image dimensions are 500 x 750', 'class': 'error'});
			return false;
		}**/
		var done = function(url){
			imagex.src = url;
			imagex.onload = function() {
                const inputLengthPrint = document.getElementById("room_length_print");
                const inputWidthPrint = document.getElementById("room_width_print");
                inputLengthPrint.value = " ";
                inputWidthPrint.value = " ";
				var widthx = this.naturalWidth;
				var heightx = this.naturalHeight;
				$('label.empty').hide();
				$('#room_width_print').prop( "disabled", false );
				$('#room_length_print').prop( "disabled", false );
				/*if( (widthx > 749 && heightx > 499)  ){
				    $.oc.flashMsg({text: 'File too Small, Recommended Minimum image dimensions are 500 x 750 (PPI 125)', 'class': 'error'});
				}*/
				$("#room_width_print").click(function(){
                    this.disabled = false;
                    removeClass(this.cropper, CLASS_DISABLED);
                    });
				if(widthx <= 499 || heightx <= 499){
				    //alert('the image you uploaded is ' + widthx + ' x ' + heightx + 'minimum is 500px');
				    $.oc.flashMsg({text: 'the image you uploaded is ' + widthx + ' x ' + heightx + ' minimum is 500px', 'class': 'error'});
				    $('#room_width_print').prop( "disabled", true );
    				$('#room_length_print').prop( "disabled", true );
			        $('label.empty').show();
			        imagex.src = '';
				    /*if(!alert('the image you uploaded is ' + widthx + ' x ' + heightx + 'minimum is 500px')){
				        
        				$('#room_width_print').prop( "disabled", true );
        				$('#room_length_print').prop( "disabled", true );
				        $('label.empty').show();
				        imagex.src = '';
				        
				    }*/
				}else{
				    if($("#room_length_print").val() == '' && widthx >= 500 || heightx >=500){
				    $('.crop-tools').hide();
				    image.cropper('destroy');
                    $.oc.flashMsg({text: 'please set height and width', 'class': 'error'});
                    //alert('please set height and width');
                    $('#crop_mage').on('mousedown', function(e) {
                        e.preventDefault();
                        $.oc.flashMsg({text: 'please set height and width', 'class': 'error'});
                      });
                    
				    $('#shiftNote').show();
                    this.cropper.disabled = true;
                    addClass(this.cropper, CLASS_DISABLED);
                    }else{
                        this.disabled = false;
                        removeClass(this.cropper, CLASS_DISABLED);
                    }
				    
				}
                
                //const inputLengthPrint = document.getElementById("room_length_print");
                /*const inputWidthPrint = document.getElementById("room_width_print");
                $(".room-width").click(function (evt) {
                    evt.stopPropagation();
                    //inputLengthPrint.value = " ";
                    //inputWidthPrint.value = " ";
                    alert();
                });*/
			}
			
		};

		if(files && files.length > 0)
		{
			
			reader = new FileReader();
			reader.onload = function(event)
			{
				done(reader.result);
				alert(result);
			};
			reader.readAsDataURL(files[0]);
		}
    
	});

	$(document).on('click', '.print-add-to-cart', function() {
		width = $('#room_width').val();
		height = $('#room_length').val();

		print_width = $('#room_width_print').val();
		print_height = $('#room_length_print').val();
		print_type = $('input[type=radio][name=wall_type_print]:checked').val();

		room_size = $('input[type=radio][name=room_size]:checked').val();
		type = $('input[type=radio][name=wall_type]:checked').val();
		frame = $('input[type=radio][name=frame]:checked').val();
		store_id = $('.store-id').val();
		product_id = $('.product-id').val();
		croppedimage = image.cropper('getCroppedCanvas').toDataURL("image/png");
		img_crop = croppedimage.replace('data:image/png;base64,', '');
		var addons_id = $.map($('.addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$.request('onAddToCartSingle', {
			data: {
				qty: 1,
				product: product_id,
				product_id: product_id,
				store_id: store_id,
				width: width,
				height: height,
				room_size: room_size,
				type: type,
				croppedimage: img_crop,
				print_type: print_type,
				print_width: print_width,
				print_height: print_height,
				frame: frame,
				Addon: addons_id,
				addon_qty: addons_qty_filter
			},
		});
	});

	// Tools
	$(document).on('click', '.crop-tools .btn', function(event) {
    // This code triggers the cropper but some "tool buttons"
    // elements shouldn't - like the upload button.
    // The cropper is destroyed here because we can't upload
    // an image if there's still a cropper
    if (event.target.getAttribute("ignore")) {
      image.cropper('destroy');
      return;

    }

		width = $('#room_width_print').val();
		height = $('#room_length_print').val();
		_method = $(this).data('method');
		_option = $(this).data('option');
		_second_option = $(this).data('second-option');

		if(width && height){
			if(_method == "scaleX" || _method == "scaleY" ){
				if(_option == -1){
					$(this).data('option',"1");
				}else{
					$(this).data('option',"-1");
				}
				
			}
			image.cropper(_method,_option,_second_option);
		}
	});
}
// check window is loaded meaning all external assets like images, css, js, etc
$(window).on("load", function () {
	$.request('onPaymentOptionEnabled', { 
		success: function(data) {
			if(data.result == "false") {
				console.log("Payment Option: false")
			} else {
				// $('input[type=radio][name=payment_gateway]').trigger('change'); 
				// $('input[type=radio][name=store_pick]').trigger('change');
				// $('input[type=radio][name=payment_gateway_type]')[0].checked = true;
				// $('input[type=radio][name=payment_gateway_type]').trigger('change');
			}
		}
	});
	onCityChange();
	$('.page-loading').removeClass('active');
	$('.image-popup-link').magnificPopup({
	  type: 'image'
	});
	// Category url Parameter
	let searchParams = new URLSearchParams(window.location.search)
	if(searchParams.has('categories')) {
		let splitDelimiter = searchParams.get('categories').toString()
		let removeDelimeter = splitDelimiter.split(';')
		let dataSplit = [] //store array values
		//remove array key
		removeDelimeter.forEach((el) => {
			dataSplit.push(el.split("=")[1]) 
		})
		//find id
		dataSplit.forEach(el => {
			$("#filterProperties").find("#"+el).prop('checked', true);
		})
		//Set hidden input for current page
		$("#currentPage").val(searchParams.get('page').toString())
		$('#filterProperties').closest('form').request(); //trigger ajax call
	}
});
function activeGeoloacation(){
	//Get URL Parameters function
	function GetURLParameter(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}
	$.request('onCheckingGeolocation', {
		success: function(data) {
			if(data.result == "ok"){
				getLocation();
			}
		}
	});
	
	function getLocation() {
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(showPosition);
		} else { 
		   	alert("Geolocation is not supported by this browser.");
		}
	}

	function showPosition(position) {
		if(position){
		 	var lat = position.coords.latitude;
		  	var long = position.coords.longitude;
		  	var api_url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + long + '&localityLanguage=en';
		
			$.ajax({
				url: api_url, 
				headers: {
					'Content-Type': 'application/json'
				},
				type: "get",
				success:function(data) {
					geo_province = data.localityInfo.administrative['3']['name'];
					category = GetURLParameter('province');
					console.log(geo_province);
					console.log(category);
					if( geo_province == 'Davao City') {
						geo_province = 'Davao del sur';
					}
					if( geo_province ){
						if( typeof category === "undefined"){
							$('.filter-province').val(decodeURI(geo_province).toUpperCase());
	    					$('.filter-province').trigger("change");
	    					$('#region').val(decodeURI(geo_province).toUpperCase());
	    				}
					}
					// if(localStorage.getItem('modal_province') !== null) {
					// 	$('.filter-province').val(localStorage.getItem('modal_province').toUpperCase());
					// 	$('.filter-province').trigger("change");
					// 	$('#region').val(decodeURI(localStorage.getItem('modal_province')).toUpperCase());
						//localStorage.removeItem('modal_province')
					// }
				}
			})
		}
	}
}
function onClickFloatingCart()
{
	$(document).on('click', '#floatingCartBtn', function(e) {
		$.request('onFetchFloatingCartItems', {
			update: { 'cartFloating/floatingCart': '#partialFloatingCart'},
			success: function(data) {
				this.success(data).done(function() {
					if($('.cart-container-drop').hasClass("active")) {
						$('.cart-container-drop').removeClass("active");
					}else {
						$('.cart-container-drop').addClass("active");
					}		
				})
			}
		});
	});


    function qtyStepper(id, qty, cartid, event, color, size, typex, type2, type3) {
    	$.request('onQtyStepper', {
            data: {
                prodctId: id,
                qty: qty,
                cartid: cartid,
                event: event,
                color: color,
                size: size,
                typex: typex,
                type2: type2,
                type3: type3
            },
            update: { 'cartFloating/cartTotal': '#partialFloatingCartTotal'}
        });
    }

	//qty stepper
	$(document).on('click', '.decreaseVal', function(e) {
        $('p.error.flash-message').remove(); //remove current flash error msg, so as not to overlap
        var input_el= $(this).parent().next('td').find('input'),
			v = input_el.val() * 1 - 1,
			id = input_el.attr('data-prod-id'),
			cartid = input_el.attr('data-cart-id');

        let productId = $(this).attr("data-product-id");
        let color = $(this).attr("data-variant-color");
        let size = $(this).attr("data-variant-size");
        let type = $(this).attr("data-variant-typex");
        let type2 = $(this).attr("data-variant-typex2");
        let type3 = $(this).attr("data-variant-typex3");
        let qty = $(this).attr("data-qty");
        let minQty = $(this).data("min-qty");
        let productTitle = $(this).data("prod-title");

        if(v < minQty){
            $.oc.flashMsg({text: 'Minimum order quantity of "'+ productTitle +'" is '+ minQty, 'class': 'error'});
            return false;
		}

        if(v >= input_el.attr('min')){
            input_el.val(v); //Update input qty
            qtyStepper(id, v, cartid, "decrease");
        }
    });

	$(document).on('click', '.increaseVal', function(e) {
        $('p.error.flash-message').remove();  //remove current flash error msg, so as not to overlap
		var input_el= $(this).parent().prev('td').find('input'),
        	v = input_el.val() * 1 + 1,
            id = input_el.attr('data-prod-id'),
            cartid = input_el.attr('data-cart-id');

        if(v <= input_el.attr('max') || input_el.attr('max') === "") {
            input_el.val(v); //Update input qty
        }

        let $input_qty = $(this);
        let productId = $(this).attr("data-product-id");
		let variantId = $(this).attr("data-variant-id");
		let color = $(this).attr("data-variant-color");
		let size = $(this).attr("data-variant-size");
		let type = $(this).attr("data-variant-typex");
		let type2 = $(this).attr("data-variant-typex2");
		let type3 = $(this).attr("data-variant-typex3");
		let qty = $(this).attr("data-qty");

		qtyStepper(productId, v, cartid, "increase", color, size, type, type2, type3);
	});
}
function clearLocalStorageCloseBrowser()
{
    //Removed, clears cart on every page refresh
	/**
	window.onbeforeunload = function() {
		$.request('onClearCart', {
		});
		return null;
	};
	 **/

	// $('.user-logout').click(function () {
	// 	$.request('onClearCart', {
	// 	});
	// });
}

function onCityChange(){
	var current_city = $('.current-city-form').val();
	$('input.pay-city').val(current_city);
	$('.checkout-form .custom-city').val(current_city); 
	$('.checkout-form .custom-city').trigger('change'); 

	$('.shipx').val($('.hidden_shipping_city').val());
	$('.billx').val($('.hidden_billing_city').val());

	$('.shipx,.billx ').trigger('change'); 
  
/*	setTimeout(function(){
		$('.select2province').trigger('change');
	}, 200); 
	setTimeout(function(){
		$('.select2city ').trigger('change');
	}, 800); */

	$(document).on('change', '.checkout-form .state-input, .update-user .state-input', function (e) {
		var _val = $(this).val();
		$.request('onClearBrangay');
		$.request('onClearCity');
		$.request('onGettingCities', {
			data: {
				province: _val,
			}
		});
		// setTimeout(function(){
		// 	$('.select2city').select2({
		//   	    placeholder: "Select a City",
		// 	});
		// 	$('.select2city').trigger('change');
		// }, 500); 
		// $('.select2barangay').select2({
	  	//     placeholder: "Select a Barangay",
		// });
		// setTimeout(function(){
		// 	$('.select2city').select2({
		//   	    placeholder: "Select a City",
		// 	});
		// 	$('.select2city').trigger('change');
		// }, 500); 

		// $('.select2barangay').select2({
	  	//     placeholder: "Select a Barangay",
		// });
		// $('.select2barangay').trigger('change');

		//customShippingFeeHtpLooca();
	});
	$(document).on('change', '.checkout-form .city-input, .update-user .city-input', function (e) {
		var _val = $(this).val();
		$('input.current-city').val(_val);
		$('input.pay-city').val(_val);
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $province = $('.checkout-form .state-input, .update-user .state-input').val();

		$.request('onGettingBarangay', {
			data: {
				province: $province,
				city: _val,
			},
		});

		// setTimeout(function(){
		// 	$('.select2barangay').select2({
		//   	    placeholder: "Select a Barangay",
		// 	});
		// }, 800); 
		$('.select2barangay').trigger('change');
		/*setTimeout(function(){
			$('.select2barangay').select2({
		  	    placeholder: "Select a Barangay",
			});
		}, 800); */


		//customShippingFeeHtpLooca();
		
	});
	$(document).on('change', '.checkout-form .shipping-trigger', function (e) {
		var $city = $('.checkout-form .city-input').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $address = $('.checkout-form .address-input').val();
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
		var $province = $('.checkout-form .state-input').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		var customer_lat = $("#latInput").val();
		var customer_long = $("#lngInput").val();

		if($shippingFeeIsEnabled == "1"){
			$.request('onGettingShippingCost', {
				data: {
					city: $city,
					barangay: $barangay,
					province: $province,
					promoCode: $promoCode,
					promoType: $promoType,
					payment_type: $payment_type,
					store_pick: store_pick,
					address: $address,
					lat: customer_lat,
					long: customer_long,
					payment_gateway_type: payment_gateway_type
				},
			});
			$.request('onGettingCashOnDeliveryFee', {
				data: {
					city: $city,
					barangay: $barangay,
					province: $province,
					payment_type: $payment_type,
					shipping_fee: ($("#shipping_fee_by_kilometer").val() == "" ? 0 : $("#shipping_fee_by_kilometer").val()),
					store_pick: store_pick,
					address: $address,
					payment_gateway_type: payment_gateway_type
                }
			});
		}
	});

	$('.checkout-form .state-input').on('change', function() {
		var webUrl = window.location.hostname;
		if(webUrl == "store.maxima.com.ph")
			onDropPin($("#latInput").val(), $("#lngInput").val());
	});
	
	var startTimer = function(duration, display) {
		// Get a reference to the last interval + 1
		const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

		// Clear any timeout/interval up to that id
		for (let i = 1; i < interval_id; i++) {
		window.clearInterval(i);
		}

		var timer = duration, minutes, seconds;
		minutes = parseInt(timer / 60, 10)
		seconds = parseInt(timer % 60, 10);
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		var time_text = `${minutes}:${seconds} ${minutes === 0 || minutes === "00" ? "secs" : "mins"}`;
		var time_text2 = `${minutes}:${seconds} ${minutes === 0 || minutes === "00" ? "second" : "minute"}`;
		document.querySelector('#payment-method-countdown-timer #countdownLimit').textContent = time_text;
		display.textContent = time_text;
		$('#cutOffTimeExceeded .modal-description').html("You have already reached the "+time_text2+" cut-off time. <br/> Please try again.");

		var interval = setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);
	
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
	
			display.textContent = minutes + ":" + seconds + `${minutes === 0 || minutes === "00" ? " secs" : " mins"}`;
			
			if (--timer < 0) {
				clearInterval(interval);
				$('#payment-method-countdown-timer').css("display", "none");
				$('#cutOffTimeExceeded').modal("show");
			}
		}, 1000);
	}

	var paymentTypeFunction = function() {
		var $city = $('.checkout-form .city-input').val();
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $province = $('.checkout-form .state-input').val();
		var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		// var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $address = $('.checkout-form .address-input').val();
		var customer_lat = $("#latInput").val();
		var customer_long = $("#lngInput").val();
		if($payment_type == "store_pickup" || $payment_type == "lbc"){
			$('.lolat-wrap').hide();
			$('.grand-total .shipping-fee').hide();
		}else{
			$('.lolat-wrap').show();
			$('.grand-total .shipping-fee').show();
		}
		$('.page-loading').addClass('active');
		$.request('onGettingShippingCost', {
			data: {
				payment_type: $payment_type,
				city: $city,
				barangay: $barangay,
				province: $province,
				promoCode: $promoCode,
				promoType: $promoType,
				store_pick: store_pick,
				address: $address,
				lat: customer_lat,
				long: customer_long,
				payment_gateway_type: payment_gateway_type
			},
		})
		.then(function() {
			if(grandTotalCalculatingDone)
			$('.page-loading').removeClass('active');
		});
		$.request('onGettingAddonfee', {
			data: {
				payment_type: $payment_type,
			},
		});
		$.request('onGettingCashOnDeliveryFee', {
			data: {
				city: $city,
				barangay: $barangay,
				province: $province,
				payment_type: $payment_type,
				store_pick: store_pick,
				address: $address,
				shipping_fee: ($("#shipping_fee_by_kilometer").val() == "" ? 0 : $("#shipping_fee_by_kilometer").val()),
				payment_gateway_type: payment_gateway_type
            },complete: function(){
                onGettingCashOnDeliveryFeeCompleted = true;
            }
		});

		onDropPin($("#latInput").val(), $("#lngInput").val());
	};

	$('#cutOffTimeConfirmation .btn-outline-success').on('click', function() {
		window.location.reload();
	});

	$('#cutOffTimeExceeded #cutOffTimeExceededBtn').on('click', function() {
		window.location.reload();
	});

	$('#cutOffTimeConfirmation #cutOffTimeConfirmationBtn').on('click', async function() {
		await Promise.resolve(paymentTypeFunction());
		$('#payment-method-countdown-timer').css("display", "block");
		var payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
		var countdown = 0;
		if(payment_type === "paymongo"){
			countdown = 120;
		}else if(payment_type === "gcash_paymongo"){
			countdown = 60;
		}else if(payment_type === "paymaya"){
			countdown = 60;
		}
		startTimer(countdown, document.querySelector('#payment-method-countdown-timer #countdown-time'));
		$('#cutOffTimeConfirmation').modal('hide');
        $('.page-loading').removeClass('active');
	});

	$(document).on('change', 'input[type=radio][name=payment_gateway], select[name=payment_gateway]', function (e) {
		if($(this).val() === "paymongo" || $(this).val() === "gcash_paymongo" || $(this).val() === "paymaya"){
			var countdown = 0;
			if($(this).val() === "paymongo"){
				countdown = 120;
			}else if($(this).val() === "gcash_paymongo"){
				countdown = 60;
			}else if($(this).val() === "paymaya"){
				countdown = 60;
			}
			$('#cutOffTimeConfirmation').modal('show');

			minutes = parseInt(countdown / 60, 10)
			seconds = parseInt(countdown % 60, 10);
			minutes = minutes < 10 ? "" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			var time_text = `${minutes}:${seconds} ${minutes === 0 || minutes === "0" ? "seconds" : "minutes"}`;

			$('#cutOffTimeConfirmation .modal-description').html("You have "+time_text+" to complete the order. <br/> Do you wish to proceed?");
            $('.page-loading').removeClass('active');
        }else{
			paymentTypeFunction();
		}
	});

	$('input[type=radio][name=store_pick]').change(function() {
		var $city = $('.checkout-form .city-input').val();
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $province = $('.checkout-form .state-input').val();
		var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $address = $('.checkout-form .address-input').val();
		if($payment_type == "store_pickup" || $payment_type == "lbc" || payment_gateway_type == "pickup_option"){
			$('.lolat-wrap').hide();
			$('.grand-total .shipping-fee').hide();
		}else{
			$('.lolat-wrap').show();
			$('.grand-total .shipping-fee').show();
		}

		$.request('onRegisterCurrentStore', {
			data: {
				store_id: store_pick,
			}
		});
		// setTimeout(
		//   function() 
		//   {
		//     $.request('onGettingShippingCost', {
		// 		data: {
		// 			payment_type: $payment_type,
		// 			city: $city,
		// 			barangay: $barangay,
		// 			province: $province,
		// 			promoCode: $promoCode,
		// 			promoType: $promoType,
		// 			store_pick: store_pick,
		// 			address: $address
		// 		},
		// 	});

		// 	$.request('onGettingCashOnDeliveryFee', {
		// 		data: {
		// 			city: $city,
		// 			barangay: $barangay,
		// 			province: $province,
		// 			payment_type: $payment_type,
		// 			address: $address,
		// 			store_pick: store_pick,
		// 			shipping_fee: ($("#shipping_fee_by_kilometer").val() == "" ? 0 : $("#shipping_fee_by_kilometer").val())
		// 		},
		// 	});
		//   }, 1000);
		
	});
}
function initSlickOnHomeCategory() {

	$('.slick-categories').slick({
		arrows: true,
		infinite: true,
		speed: 1000,
		autoplay: true,
		autoplaySpeed: 5000,
		slidesToShow: 3,
        slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 900,
				arrows: true,
				settings: {
					infinite: true,
					speed: 1000,
				}
			},
			{
				breakpoint: 500,
				arrows: true,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 370,
				arrows: true,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			}
		]
	});
}
// slider for Clean Beauty Category
function initSlickCleanBeautyOnHomeCategory() {

	$('.slick-categories-clean-beauty').slick({
		arrows: true,
		infinite: true,
		speed: 1000,
		autoplay: true,
		autoplaySpeed: 5000,
		slidesToShow: 3,
        slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 900,
				arrows: true,
				settings: {
					infinite: true,
					speed: 1000,
				}
			},
			{
				breakpoint: 500,
				arrows: true,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 370,
				arrows: true,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			}
		]
	});
}
// function initSlickCleanBeautyOnHomeTestimonials() {
//     $(".clean-beauty-testimonials").slick({
//         dots: true,
//         infinite: true,
//         slidesToShow: 3,
//         slidesToScroll: 3
//     });
// }
function slickOnProductsPage() {
	window.addEventListener('load', function () {
		$(".product-categories").slick({
			arrows: true,
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3
		});
		var numberOfSlides = $('.slick-slide:not(.slick-cloned)').length;
		if(numberOfSlides == 3){//if there are 3 categories show 2 slides then scroll
			$('.product-categories').slick('destroy');
			$(".product-categories").slick({
				arrows: true,
				infinite: true,
				slidesToShow: 2,
				slidesToScroll: 2
			});
		}
		if(numberOfSlides <= 2){//if there are 2 or lower category only, do not initiate slick
			$('.product-categories').slick('destroy');
			$('.product-categories').css('justify-content','center');
		}
	});
}
function radioInputOnProductCategory() {
	$('.parent input[type="radio"]').change(function () {
		// save the id of the input type radio in inputId variable
		var inputId = $(this).attr("id");
		// if the checkbox is unchecked
		if (!$(this).is(':checked')) {

			$('.product-categories label').each(function (index) {
				// save the label for attribute. To be used in comparing on the input radio id
				var labelId = $(this).attr("for");
				// if label for attribute and input id is the same, remove the class on that specific element
				if (labelId === inputId) {
					$(this).removeClass("check-style");
				}
			})
		} else {
			// if the radio is checked
			$('.product-categories label').each(function (index) {
				// save the label for attribute. To be used in comparing on the input radio id
				var labelId = $(this).attr("for");
				// remove style for reset button if there is a checked radio
				$("#reset").removeClass("check-style");
				// if label for attribute and input id is the same, add the class on that specific element else remove class
				if (labelId !== inputId) {
					$(this).removeClass("check-style");
				} else {
					$(this).addClass("check-style");
				}
			})
		}
	})
}

function productCategoriesScrolled(){
	//  when window is scrolled , the product category section will go up to the top
	$(window).scroll(function (e) {
        const scrolled = window.scrollY;
        // if the user scrolls over the 600 mark, the category will be placed at the top and have a fixed position
        if (scrolled > 600) {
			$(".product-categories").addClass("fixed-position-top");
			// $("#relative-row").addClass("fixed-position-top");

			// $("#top-header,#header-main").addClass("hide-navbar");
        } else {
            // else , the category will just stay at the same original position
			$(".product-categories").removeClass("fixed-position-top");
			// $("#relative-row").removeClass("fixed-position-top");

			// $("#top-header,#header-main").removeClass("hide-navbar");
        }
    });
}
function showSocialMediaLinkModal(id){
	// when the share button is clicked
	$(".product-share-button").click(function() {
		// show modal for link sharing
		$("#share-link-modal").modal('show');
		// loop through each a tag
		$("#product_listing #partialListing .btn-wrap a,.product__related .btn-wrap a").each(function(idx, link){
			// If the id of the a tag is equal with the binded data from the share button's id 
			// change the value of the input form of the modal. 
			if(id==link.id){
				var URL = link.href
				$("#share-link-modal #share-link").val(URL);
				$("#share-link-modal .social-buttons #fb").attr("data-url","http://www.facebook.com/sharer.php?u=" + URL);
				$("#share-link-modal .social-buttons #linkedin").attr("data-url","http://www.linkedin.com/shareArticle?mini=true&url=" + URL);
				$("#share-link-modal .social-buttons #twitter").attr("data-url","https://twitter.com/share?url=" + URL);

				$("#share-link-modal .social-buttons #whatsapp").attr({
					"href":"https://wa.me/?text=" + URL,
					"data-action": "share/whatsapp/share",
					"target":"_blank"
				});
				$("#share-link-modal .social-buttons #viber").attr({
					href:"viber://forward?text=" + URL
				});
			}

		})
	});
}
function expandSearchBar(){
	$("#top-header .searchbtn").click(function(){
		$(this).toggleClass("color-change");
		$(".searchbox .input").focus().toggleClass("expand-width").val('');
		$(".searchbox .input.clean-beauty-input").focus().toggleClass("expand-width-clean-beauty").val('');
	});
}

function hideSearchOnProductsPage(){
	var url = location.pathname;
	// check if the url has listing or products text.
	if(url.indexOf('products') !== -1 ){
        $("form.search").css("display", "none");
	 	$("#search-container.top-search-version2").css("visibility","hidden");
	 	$(".searchbox").css("visibility","hidden");
     }
	// if(window.location.href === window.location.protocol + "//" + window.location.host + "/products" || window.location.href ===  "http://localhost:8888/ecom/products"){
	// 	$("form.search").css("display", "none");
	// 	$("#search-container.top-search-version2").css("visibility","hidden");
	// 	$(".searchbox").css("visibility","hidden");
	// }
}

function copyToClipboardModal(){
	$("#share-link-modal #copyButton").click(function() {
		var inputValue = document.getElementById("share-link");
		inputValue.select(); //desktop
		inputValue.setSelectionRange(0, 99999); //mobile
		navigator.clipboard.writeText(inputValue.value);
		$('#share-link-modal #copyButton').tooltip({title: "Link copied", placement: "top"});
		$('#share-link-modal #copyButton').tooltip('show');
	});
	$(".product-card .product-title .product-share-button").click(function() {
		$('#share-link').css('border','none');
		$('#share-link-modal #copyButton').tooltip('dispose');
	});
}
function seeAllProducts(){
	$("#reset").click(function() {
		// reset the categories and show all products
		location.reload();
	});
}
function validateRecaptcha(){
	$( ".form-setting .btn-primary" ).click(function() {
		var response = grecaptcha.getResponse();
		$(this).parent().parent().find('.error').text('');
		if (!response) {
		    $(this).parent().parent().find('.error').text('reCAPTCHA is mandatory');
		    return false;
		} else {            
		    return true;
		}
	});
}
function reviewStarClick(){
	$(document).on('click', '.rating-star span.star', function () {
		$(".rating-star span.star").removeClass("active");
		$(this).addClass("active");
		var star_value = $(this).data("value");
		$(".star-rating").val(star_value);

	});
}
function recurringBtnOnClick(){
	$(".single-recurring-btn").click(function () {
		var qty = $('.single-recurring-btn input[name="qty"]').val();
		var link = $('.single-recurring-btn .btn-primary').attr('data-link');
		var full_link = link + "&product-qty=" + qty
		$('.single-recurring-btn .btn-primary').attr('href', full_link);
	});
}
function clickShowOrderAttachment(){
	$(document).on('click', '.show-attachment', function () {
		var img = $(this).attr('data-img');
		$('#modal-attachment .modal-body img').attr('src', img);
		$('#modal-attachment').modal('show');
	});
}
function onLoadDragonPayPage(){
	var dragonpay_status = $('.status-dragon').val();
	if(dragonpay_status == "P" || dragonpay_status == "S"){
		$('.dragonpay-checkout').request('onExecuteOrder', {
			data: {
				payment_type_pick: "Dragonpay",
			},
		});
	}
}

function onLoadPaymayaPayPage(){
	var paymaya_status = $('.paymaya-status').val();
	if(paymaya_status == "s"){
		$('.paymaya-checkout').request('onExecuteOrder', {
			data: {
				payment_type_pick: "Paymaya",
			},
		});
	}
}

function onLoadBuxPayPage(){
	if(window.location.pathname == "//bux-callback" || window.location.pathname == "/bux-callback"){
		var display_receipt = $('.bux-display-receipt').val();
		if(display_receipt == "false"){
			$('.bux-checkout').request('onExecuteOrder', {
				data: {
					payment_type_pick: "BUX",
				},
			});
		}
	}
}

function onReply(){
	$(document).on('submit','.post-comment-form',function(){
	  	$('.post-comment-form input, .post-comment-form textarea').val("");
	  	$(this).find('.error').html("Your comment is awaiting moderation to approve.");
	});
	$(".comment-footer a.reply-btn").click(function () {
		$('.reply-wrap').hide();
		$(this).parent().find('.reply-wrap').show();
	});
}
function shareModal() {
	$(".social-shares a,#share-link-modal .social-buttons a").click(function () {
		var url = $(this).attr('data-url');
		window.open(url, 'sharer', 'toolbar=0,status=0,width=648,height=395');
		return true;
	});
}

function onStoreLocationPick(){
	$(document).on('click', '.store-location-form .btn-primary', function (e) {
		if( !$('.store-location-picker').val() ) { 
			$('.error').html('Select store');
		}else{
			$('.store-location-form').request('onStoreLocationPick', {});
		}
	});
}

function onVariantHide(){
	if ( $('.size-picker ul').children().length <= 0) {
		 $('.size-picker').hide();
	}
	if ( $('.color-picker ul').children().length <= 0) {
		 $('.color-picker').hide();
	}
	if( $('#typeSelect').has('option').length <= 0 ) {
		$('.type-picker').hide();
	}
	if( $('#typeSelect2').has('option').length <= 0 ) {
		$('.type2-picker').hide();
	}
	if( $('#typeSelect3').has('option').length <= 0 ) {
		$('.type3-picker').hide();
	}
}
function checkProductVariantQty(){
	var variant_qty = $('span.variant-qty').text();
	if(variant_qty == 0){
		$('form.add-to-cart-form').html("");
	}
}
function variantCheck(){
	$(document).on('click', '.variant-btn', function (e) {
		var code = $('#promoform .promocode-use').text();
		var addons_id = $.map($('.add-to-cart-form .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.add-to-cart-form .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});
	$('.btn.variant-btn').trigger('click');
}
function addToCartModal(){
	$(document).on('click', '.cart-modal', function (e) {
		 var productId = $(this).data('id');
		 $("#listingCartModal #productId").val( productId )
	     $('#listingCartModal').modal('show');
	});
	$(document).on('show.bs.modal', '#listingCartModal', function (e) {
		var product_id = $("#productId").val();
	    $.request('onLoadProductInfo', {
			data: {
				product_id: product_id,
			}
		});
	});
}

function onClickCheckBoxDemo(){
	//Init tooltip
	$('[data-toggle="tooltip"]').tooltip()
	//This prototype function allows you to remove even array from array
	Array.prototype.remove = function(x) { 
	    var i;
	    for(i in this){
	        if(this[i].toString() == x.toString()){
	            this.splice(i,1)
	        }
	    }
	}
	var valueArr = [];
	var team_id = $('a.add-cart-demo').attr("data-id");
	var ind_id = $('a.add-cart-demo').attr("data-indid");

	var radioValue = $("#demo_wrap input[name='check1']:checked").val();
	var currentURL = $('.add-cart-demo').attr("href");

	var urlfinalx = currentURL + "&sp=" + radioValue
	$('.add-cart-demo').attr("href", urlfinalx);
 	$('.buy-now').attr("href", urlfinalx);

	$(document).on('click', '#demo_wrap .custom-checkbox .custom-control-input', function (e) {
		
		if($(this).is(":checked")){
            valueArr.push($(this).val());
        }
        else if($(this).is(":not(:checked)")){
    		valueArr.remove($(this).val());
        }
	 	var radioValue = $("#demo_wrap input[name='check1']:checked").val();
	 	var urlFinal = "https://sites.prosperna.com/?demo-checkout=true&sl=" +  valueArr + "&pid=" + team_id + "&ind-id=" + ind_id + "&sp=" + radioValue;
	 	$('.add-cart-demo').attr("href", urlFinal);
	 	$('.buy-now').attr("href", urlFinal);
	});

	$(document).on('click', '#demo_wrap .custom-radio .custom-control-input', function (e) {
		var radioValue = $("#demo_wrap input[name='check1']:checked").val();
		var urlfinalx = "https://sites.prosperna.com/?demo-checkout=true&sl=" +  valueArr + "&pid=" + team_id + "&ind-id=" + ind_id + "&sp=" + radioValue;
		$('.add-cart-demo').attr("href", urlfinalx);
	 	$('.buy-now').attr("href", urlfinalx);
	});
}
function dropdownFixed(){
	$(document).on('click', '#demo_wrap .dropdown-menu', function (e) {
	  e.stopPropagation();
	});
}
function clearLocalStorage() {
	$('.logout-btn').click(function() {
		localStorage.clear();
	}); 
}

// testing Purposes
function testgetpartners(){
	$.ajax({
		url: 'https://us-central1-fleet-ph.cloudfunctions.net/getPartners/?apiKey=b98c87d25aecc7f50adc3d6b24d860826f653348', 
		headers: {
			'Auth-Token': "f26f7b8a1c3986d9c0d4b616dca849acba8681162df40834b52fd9227b5efbe5a03d5bdd2d56547308100dd8483d4d453e5c6c2956f7d01a7b3af40097c615bb"
		},
		type: "get",
		success:function(data) {
			console.log(data); 
		}
	})
}
function testcreate(){
	var data = {
		refNo: "order-001",
		pickupDetails: {
			"customerName": "Maric Pick up",
			 "contactNumber": "09123456789",
			 "emailAddress": "mmarfil@xtendly.com",
			 "completionDateTime": "2020-03-10T18:30",
			 "pickupAddress": "015 San Jose",
			 "pickupCity": "Calamba",
			 "province": "Laguna",
			 "lat": 14.210810,
			 "long": 121.170490,
			 "tags": [],
			 "details": "my details",
			 "remarks": "my remarks"
		}, 
		deliveries: [
			{
				 "customerName": "Maric Delivery",
				 "contactNumber": "09123456789",
				 "emailAddress": "mmarfil@xtendly.com",
				 "completionDateTime": "2020-03-11T20:15",
				 "deliveryAddress": "015 San Jose",
				 "deliveryCity": "Calamba",
				 "province": "Laguna",
				 "itemPrice": 200,
				 "dimension": "fff",
				 "actualShippingCost": 50,
				 "codAmount": 250,
				 "lat": 14.210810,
				 "long": 121.170490,
				 "tags": [],
				 "details": "my details",
				 "remarks": "my remarks",
				 "metaFields": {}
			}
		]
	};
	console.log(JSON.stringify(data));
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/createPostv2/?apiKey=b98c87d25aecc7f50adc3d6b24d860826f653348&partnerId=SANDBOX_PROVIDER', 
		headers: {
			'Auth-Token': '9a462372810f889a5794f413c016df8b7e2b64c4e637f380348246b22e1f115e81bd2c786d93d9f1e102c8d0abfd7cebaaa155ffc48e7039a6392eda1b243ecb',
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		type: "post",
		success:function(data) {
			console.log(data); 
		}
	})
}
function testconnect(){
	$data = {
		'email': "ecommerce@mylyka.com", 
		'password': "2k2472qt", 
	};
	$.ajax({
		url: 'https://us-central1-fleet-ph.cloudfunctions.net/login', 
		data: $data,
		type: "post",
		success:function(data) {
		    console.log(data.results); 
		},
		failure: function (data, success, failure) {
            alert("Error:" + failure);
        }
	})
}
function getStoreIDFleet(){
	var fleet_pkey = localStorage.getItem("fleet_pkey");
	var fleet_skey = localStorage.getItem("fleet_skey");
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/getListOfAreas/?apiKey='+ fleet_pkey, 
		headers: {
			'Auth-Token': fleet_skey,
			'Content-Type': 'application/json'
		},
		type: "get",
		success:function(data) {
			console.log(data);
		}
	});
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/getListOfStores/?apiKey='+ fleet_pkey + '&areaCode=A1', 
		headers: {
			'Auth-Token': fleet_skey,
			'Content-Type': 'application/json'
		},
		type: "get",
		success:function(data) {
			console.log(data);
		}
	});
}
function getJobFleet(){
	var fleet_pkey = localStorage.getItem("fleet_pkey");
	var fleet_skey = localStorage.getItem("fleet_skey");
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/getJobList/?apiKey='+ fleet_pkey + "&storeId=-KokExCJGEbp7lhjrKpa&status=PENDING", 
		headers: {
			'Auth-Token': fleet_skey,
			'Content-Type': 'application/json'
		},
		type: "get",
		success:function(data) {
			console.log(data);
		}
	});
}
function cancelJob(){
	var fleet_pkey = localStorage.getItem("fleet_pkey");
	var fleet_skey = localStorage.getItem("fleet_skey");
	var data_job = {
		'jobIds':  ["kHLMHNc0DsOMZ0RLa09U"],
	};
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/cancelJob/?apiKey='+ fleet_pkey + "&storeId=-KokExCJGEbp7lhjrKpa", 
		headers: {
			'Auth-Token': fleet_skey,
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data_job),
		type: "post",
		success:function(data) {
			console.log(data);
		}
	});
}
function testcreatefleet(){
	var fleet_pkey = localStorage.getItem("fleet_pkey");
	var fleet_skey = localStorage.getItem("fleet_skey");
	var data_deliveries = {
		'createdAt':  "2020-04-16T17:45",
		'receiverContactNumber':  "09260771702",
		'completedWithin': 3000000,
		'refNo': 6,
		'storeId': "-KokExCJGEbp7lhjrKpa",
		'custFirstName': "Mauro",
		'custLastName': "Marfil",
		'custEmail': "mmarfil@xtendly.com",
		'jobDetails': "jobDetails",
		'remarks': "jobDetails",
		'locationDetails': "015 San Jose",
		'landMark': "Near Olartes",
		'province': "Laguna",
		'city': "Calamba",
		'lat': 0,
		'long': 0,
		'riderId': "",
		'tags': "",
		'meta': "",
		'codAmount': 10000,
		'item price': 0,
	};
	$.ajax({
		url: 'https://us-central1-fleet-staging-2333a.cloudfunctions.net/pushJob/?client=CESIL_PELAYO&apiKey=7f3ab08a7d8aa65619d2e5d53218d2a24caeb881', 
		headers: {
			'Auth-Token': fleet_skey,
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data_deliveries),
		type: "post",
		success:function(data) {
			console.log(data);
		}
	});
}
function testPaymongoCreatePaymethod(){
	var data = {
		'data':{
			'attributes':{
				'type': 'card',
				'details': {
					'card_number': "4343434343434345",
					'exp_month': 12,
					'exp_year': 2020,
					'cvc': "123",
				}
			}
		}
	}
	$.ajax({
		url: 'https://api.paymongo.com/v1/payment_methods', 
		headers: {
			'Authorization': 'Basic c2tfdGVzdF9TQWo2NWo4b0VHMXVHRW1Gc2hicnVWaEw=',
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		type: "post",
		success:function(data) {
			console.log(data);
		}
	});
}
function createPayIntentPaymongo(){
	var data = {
		'data':{
			'attributes':{
				'amount': 100000,
				'payment_method_allowed': ["card"],
				'currency': 'PHP'
			}
		}
	}
	$.ajax({
		url: 'https://api.paymongo.com/v1/payment_intents', 
		headers: {
			'Authorization': 'Basic c2tfdGVzdF9TQWo2NWo4b0VHMXVHRW1Gc2hicnVWaEw=',
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		type: "post",
		success:function(data) {
			console.log(data);
		}
	});
}
function attachToPaymentIntent(){
	var data = {
		'data':{
			'attributes':{
				'payment_method': 'pm_FmUenX7Eq33pg8A7NRy8RU65',
				'client_key': 'pi_yeDxmNRJk1DJLNmaUsjfrkyq_client_us5pqB44YZJn4NkxiBPiyy6x',
				'return_url': 'http://localhost/ecommerce/shopping-cart'
			}
		}
	}
	$.ajax({
		url: 'https://api.paymongo.com/v1/payment_intents/pi_yeDxmNRJk1DJLNmaUsjfrkyq/attach', 
		headers: {
			'Authorization': 'Basic c2tfdGVzdF9TQWo2NWo4b0VHMXVHRW1Gc2hicnVWaEw=',
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(data),
		type: "post",
		success:function(data) {
			console.log(data);
		}
	});
}
// Validate all required field
function validatePersonalData(){
	// alert("asdsad123")
	var phone = $('.checkout-form .phone-input').val();
	var address = $('.checkout-form .address-input').val();
	var city = $('.checkout-form .city-input').val();
	var state = $('.checkout-form .state-input').val();
	var barangay = $('.checkout-form .barangay-input').val();
	var fname = $('.checkout-form .fname-input').val();
	var lname = $('.checkout-form .lname-input').val();
	var deliveryDate = $("#delivery-date-value").val();
	
	var wholeTime = moment($("#delivery-date").val()).format("Y-M-D") + " " + convertTimeFrom12To24($(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val()) + ":00";
	var now  = moment().format("Y-M-D H:m:00").toString();
	var then = wholeTime.toString();

	if (phone == "" || address == "" || city == "" || state == "" || barangay == "" || fname == "" || lname == ""){
		$('.error').text('Please complete all the fields');
		$.oc.flashMsg({text: 'Please complete all the fields', 'class': 'error'});
		return false;
	}else if($(".minutes-select").val() != null && parseInt(moment(then,"Y-M-D H:m:ss").diff(moment(now,"Y-M-D H:m:ss"), 'hours')) < parseInt($("#minimumLeadTime").val())) {
        var texterror = "Advanced orders should be placed "+$("#minimumLeadTime").val()+" hour(s) ahead.";
		$.oc.flashMsg({ text: texterror, 'class': 'error' });

        $("#delivery-date-value").val(moment().format("Y-M-D"));
        $("#delivery-date").val(moment().format("Y-M-D"));
		$("#delivery-time-value").val(moment().format("H:m:00"));

		var hour = moment().format("h");
		var minutes = moment().format("mm");
		var ampm = moment().format("A");

        //Check if minutes is available in the option, if not set to 00 or 30
        if($('.minutes-select option[value="'+minutes+'"]').length < 1){
            minutes = parseInt(minutes) > 30 ? '00' : '30';
        }

        $('.minutes-select').val(minutes);
		$(".hour-select").val(hour);
		$(".am-pm-select").val(ampm);
		return false;
	}else{
		return true;
	}

	return false;
}

// Payment gateway
function codCheckout(){
	$(document).on('click',  '.cod-btn .btn-primary', function(){
		var validation = validatePersonalData();
						
		if (validation == false){
			$('.error').text('Please complete all the fields');
			$.oc.flashMsg({text: 'Please complete all the fields', 'class': 'error'});
		}else{
			$('.cod-btn').html("<p>Loading ...</p>");
			completeTransaction("COD","false");
		}
	});
}

function payWithCoins(){
	$( ".coins-btnx" ).click(function() {
		var validation = validatePersonalData();

		if (validation == false){
			$('.error').text('Please complete all the fields');
			$.oc.flashMsg({text: 'Please complete all the fields', 'class': 'error'});
		}else{
			var phone = $('.checkout-form .phone-input').val();
			var address = $('.checkout-form .address-input').val();
			var city = $('.checkout-form .city-input').val();
			var email = $('.checkout-form .email-input').val();
			var state = $('.checkout-form .state-input').val();
			var barangay = $('.checkout-form .barangay-input').val();
			var fname = $('.checkout-form .fname-input').val();
			var lname = $('.checkout-form .lname-input').val();
			var landmark_input = $('.checkout-form .landmark-input').val();
			var remarks_input = $('.checkout-form .remarks-input').val();
			
			$data = {
				'amount': 1000, 
				'currency': "PHP", 
				'external_transaction_id': "14hb2389bb1"
			};
			$.ajax({
				url: 'https://api.coins.asia/v1/invoices/', 
				headers: {
					'Authorization': fleet_skey,
					'Content-Type': 'application/json'
				},
				data: $data,
				type: "post",
				success:function(data) {
					console.log(data.results); 
				}
			})
		}
	});
}


function selectInit(){
	const countryOptions = [{"id":"Afghanistan","text":"Afghanistan"},{"id":"Aland Islands","text":"Aland Islands"},{"id":"Albania","text":"Albania"},{"id":"Algeria","text":"Algeria"},{"id":"American Samoa","text":"American Samoa"},{"id":"Andorra","text":"Andorra"},{"id":"Angola","text":"Angola"},{"id":"Anguilla","text":"Anguilla"},{"id":"Antarctica","text":"Antarctica"},{"id":"Antigua And Barbuda","text":"Antigua And Barbuda"},{"id":"Argentina","text":"Argentina"},{"id":"Armenia","text":"Armenia"},{"id":"Aruba","text":"Aruba"},{"id":"Australia","text":"Australia"},{"id":"Austria","text":"Austria"},{"id":"Azerbaijan","text":"Azerbaijan"},{"id":"Bahamas","text":"Bahamas"},{"id":"Bahrain","text":"Bahrain"},{"id":"Bangladesh","text":"Bangladesh"},{"id":"Barbados","text":"Barbados"},{"id":"Belarus","text":"Belarus"},{"id":"Belgium","text":"Belgium"},{"id":"Belize","text":"Belize"},{"id":"Benin","text":"Benin"},{"id":"Bermuda","text":"Bermuda"},{"id":"Bhutan","text":"Bhutan"},{"id":"Bolivia","text":"Bolivia"},{"id":"Bosnia And Herzegovina","text":"Bosnia And Herzegovina"},{"id":"Botswana","text":"Botswana"},{"id":"Bouvet Island","text":"Bouvet Island"},{"id":"Brazil","text":"Brazil"},{"id":"British Indian Ocean Territory","text":"British Indian Ocean Territory"},{"id":"Brunei Darussalam","text":"Brunei Darussalam"},{"id":"Bulgaria","text":"Bulgaria"},{"id":"Burkina Faso","text":"Burkina Faso"},{"id":"Burundi","text":"Burundi"},{"id":"Cambodia","text":"Cambodia"},{"id":"Cameroon","text":"Cameroon"},{"id":"Canada","text":"Canada"},{"id":"Cape Verde","text":"Cape Verde"},{"id":"Cayman Islands","text":"Cayman Islands"},{"id":"Central African Republic","text":"Central African Republic"},{"id":"Chad","text":"Chad"},{"id":"Chile","text":"Chile"},{"id":"China","text":"China"},{"id":"Christmas Island","text":"Christmas Island"},{"id":"Cocos (Keeling) Islands","text":"Cocos (Keeling) Islands"},{"id":"Colombia","text":"Colombia"},{"id":"Comoros","text":"Comoros"},{"id":"Congo","text":"Congo"},{"id":"Congo}, Democratic Republic","text":"Congo}, Democratic Republic"},{"id":"Cook Islands","text":"Cook Islands"},{"id":"Costa Rica","text":"Costa Rica"},{"id":"Cote D'Ivoire","text":"Cote D'Ivoire"},{"id":"Croatia","text":"Croatia"},{"id":"Cuba","text":"Cuba"},{"id":"Cyprus","text":"Cyprus"},{"id":"Czech Republic","text":"Czech Republic"},{"id":"Denmark","text":"Denmark"},{"id":"Djibouti","text":"Djibouti"},{"id":"Dominica","text":"Dominica"},{"id":"Dominican Republic","text":"Dominican Republic"},{"id":"Ecuador","text":"Ecuador"},{"id":"Egypt","text":"Egypt"},{"id":"El Salvador","text":"El Salvador"},{"id":"Equatorial Guinea","text":"Equatorial Guinea"},{"id":"Eritrea","text":"Eritrea"},{"id":"Estonia","text":"Estonia"},{"id":"Ethiopia","text":"Ethiopia"},{"id":"Falkland Islands (Malvinas)","text":"Falkland Islands (Malvinas)"},{"id":"Faroe Islands","text":"Faroe Islands"},{"id":"Fiji","text":"Fiji"},{"id":"Finland","text":"Finland"},{"id":"France","text":"France"},{"id":"French Guiana","text":"French Guiana"},{"id":"French Polynesia","text":"French Polynesia"},{"id":"French Southern Territories","text":"French Southern Territories"},{"id":"Gabon","text":"Gabon"},{"id":"Gambia","text":"Gambia"},{"id":"Georgia","text":"Georgia"},{"id":"Germany","text":"Germany"},{"id":"Ghana","text":"Ghana"},{"id":"Gibraltar","text":"Gibraltar"},{"id":"Greece","text":"Greece"},{"id":"Greenland","text":"Greenland"},{"id":"Grenada","text":"Grenada"},{"id":"Guadeloupe","text":"Guadeloupe"},{"id":"Guam","text":"Guam"},{"id":"Guatemala","text":"Guatemala"},{"id":"Guernsey","text":"Guernsey"},{"id":"Guinea","text":"Guinea"},{"id":"Guinea-Bissau","text":"Guinea-Bissau"},{"id":"Guyana","text":"Guyana"},{"id":"Haiti","text":"Haiti"},{"id":"Heard Island & Mcdonald Islands","text":"Heard Island & Mcdonald Islands"},{"id":"Holy See (Vatican City State)","text":"Holy See (Vatican City State)"},{"id":"Honduras","text":"Honduras"},{"id":"Hong Kong","text":"Hong Kong"},{"id":"Hungary","text":"Hungary"},{"id":"Iceland","text":"Iceland"},{"id":"India","text":"India"},{"id":"Indonesia","text":"Indonesia"},{"id":"Iran}, Islamic Republic Of","text":"Iran}, Islamic Republic Of"},{"id":"Iraq","text":"Iraq"},{"id":"Ireland","text":"Ireland"},{"id":"Isle Of Man","text":"Isle Of Man"},{"id":"Israel","text":"Israel"},{"id":"Italy","text":"Italy"},{"id":"Jamaica","text":"Jamaica"},{"id":"Japan","text":"Japan"},{"id":"Jersey","text":"Jersey"},{"id":"Jordan","text":"Jordan"},{"id":"Kazakhstan","text":"Kazakhstan"},{"id":"Kenya","text":"Kenya"},{"id":"Kiribati","text":"Kiribati"},{"id":"Korea","text":"Korea"},{"id":"Kuwait","text":"Kuwait"},{"id":"Kyrgyzstan","text":"Kyrgyzstan"},{"id":"Lao People's Democratic Republic","text":"Lao People's Democratic Republic"},{"id":"Latvia","text":"Latvia"},{"id":"Lebanon","text":"Lebanon"},{"id":"Lesotho","text":"Lesotho"},{"id":"Liberia","text":"Liberia"},{"id":"Libyan Arab Jamahiriya","text":"Libyan Arab Jamahiriya"},{"id":"Liechtenstein","text":"Liechtenstein"},{"id":"Lithuania","text":"Lithuania"},{"id":"Luxembourg","text":"Luxembourg"},{"id":"Macao","text":"Macao"},{"id":"Macedonia","text":"Macedonia"},{"id":"Madagascar","text":"Madagascar"},{"id":"Malawi","text":"Malawi"},{"id":"Malaysia","text":"Malaysia"},{"id":"Maldives","text":"Maldives"},{"id":"Mali","text":"Mali"},{"id":"Malta","text":"Malta"},{"id":"Marshall Islands","text":"Marshall Islands"},{"id":"Martinique","text":"Martinique"},{"id":"Mauritania","text":"Mauritania"},{"id":"Mauritius","text":"Mauritius"},{"id":"Mayotte","text":"Mayotte"},{"id":"Mexico","text":"Mexico"},{"id":"Micronesia}, Federated States Of","text":"Micronesia}, Federated States Of"},{"id":"Moldova","text":"Moldova"},{"id":"Monaco","text":"Monaco"},{"id":"Mongolia","text":"Mongolia"},{"id":"Montenegro","text":"Montenegro"},{"id":"Montserrat","text":"Montserrat"},{"id":"Morocco","text":"Morocco"},{"id":"Mozambique","text":"Mozambique"},{"id":"Myanmar","text":"Myanmar"},{"id":"Namibia","text":"Namibia"},{"id":"Nauru","text":"Nauru"},{"id":"Nepal","text":"Nepal"},{"id":"Netherlands","text":"Netherlands"},{"id":"Netherlands Antilles","text":"Netherlands Antilles"},{"id":"New Caledonia","text":"New Caledonia"},{"id":"New Zealand","text":"New Zealand"},{"id":"Nicaragua","text":"Nicaragua"},{"id":"Niger","text":"Niger"},{"id":"Nigeria","text":"Nigeria"},{"id":"Niue","text":"Niue"},{"id":"Norfolk Island","text":"Norfolk Island"},{"id":"Northern Mariana Islands","text":"Northern Mariana Islands"},{"id":"Norway","text":"Norway"},{"id":"Oman","text":"Oman"},{"id":"Pakistan","text":"Pakistan"},{"id":"Palau","text":"Palau"},{"id":"Palestinian Territory}, Occupied","text":"Palestinian Territory}, Occupied"},{"id":"Panama","text":"Panama"},{"id":"Papua New Guinea","text":"Papua New Guinea"},{"id":"Paraguay","text":"Paraguay"},{"id":"Peru","text":"Peru"},{"id":"Philippines","text":"Philippines"},{"id":"Pitcairn","text":"Pitcairn"},{"id":"Poland","text":"Poland"},{"id":"Portugal","text":"Portugal"},{"id":"Puerto Rico","text":"Puerto Rico"},{"id":"Qatar","text":"Qatar"},{"id":"Reunion","text":"Reunion"},{"id":"Romania","text":"Romania"},{"id":"Russian Federation","text":"Russian Federation"},{"id":"Rwanda","text":"Rwanda"},{"id":"aint Barthelemy","text":"Saint Barthelemy"},{"id":"Saint Helena","text":"Saint Helena"},{"id":"Saint Kitts And Nevis","text":"Saint Kitts And Nevis"},{"id":"Saint Lucia","text":"Saint Lucia"},{"id":"Saint Martin","text":"Saint Martin"},{"id":"Saint Pierre And Miquelon","text":"Saint Pierre And Miquelon"},{"id":"Saint Vincent And Grenadines","text":"Saint Vincent And Grenadines"},{"id":"Samoa","text":"Samoa"},{"id":"San Marino","text":"San Marino"},{"id":"Sao Tome And Principe","text":"Sao Tome And Principe"},{"id":"Saudi Arabia","text":"Saudi Arabia"},{"id":"Senegal","text":"Senegal"},{"id":"Serbia","text":"Serbia"},{"id":"Seychelles","text":"Seychelles"},{"id":"Sierra Leone","text":"Sierra Leone"},{"id":"Singapore","text":"Singapore"},{"id":"Slovakia","text":"Slovakia"},{"id":"Slovenia","text":"Slovenia"},{"id":"Solomon Islands","text":"Solomon Islands"},{"id":"Somalia","text":"Somalia"},{"id":"South Africa","text":"South Africa"},{"id":"South Georgia And Sandwich Isl.","text":"South Georgia And Sandwich Isl."},{"id":"Spain","text":"Spain"},{"id":"Sri Lanka","text":"Sri Lanka"},{"id":"Sudan","text":"Sudan"},{"id":"Suriname","text":"Suriname"},{"id":"Svalbard And Jan Mayen","text":"Svalbard And Jan Mayen"},{"id":"Swaziland","text":"Swaziland"},{"id":"Sweden","text":"Sweden"},{"id":"Switzerland","text":"Switzerland"},{"id":"Syrian Arab Republic","text":"Syrian Arab Republic"},{"id":"Taiwan","text":"Taiwan"},{"id":"Tajikistan","text":"Tajikistan"},{"id":"Tanzania","text":"Tanzania"},{"id":"Thailand","text":"Thailand"},{"id":"Timor-Leste","text":"Timor-Leste"},{"id":"Togo","text":"Togo"},{"id":"Tokelau","text":"Tokelau"},{"id":"Tonga","text":"Tonga"},{"id":"Trinidad And Tobago","text":"Trinidad And Tobago"},{"id":"Tunisia","text":"Tunisia"},{"id":"Turkey","text":"Turkey"},{"id":"Turkmenistan","text":"Turkmenistan"},{"id":"Turks And Caicos Islands","text":"Turks And Caicos Islands"},{"id":"Tuvalu","text":"Tuvalu"},{"id":"Uganda","text":"Uganda"},{"id":"Ukraine","text":"Ukraine"},{"id":"United Arab Emirates","text":"United Arab Emirates"},{"id":"United Kingdom","text":"United Kingdom"},{"id":"United States","text":"United States"},{"id":"United States Outlying Islands","text":"United States Outlying Islands"},{"id":"Uruguay","text":"Uruguay"},{"id":"Uzbekistan","text":"Uzbekistan"},{"id":"Vanuatu","text":"Vanuatu"},{"id":"Venezuela","text":"Venezuela"},{"id":"Viet Nam","text":"Viet Nam"},{"id":"Virgin Islands}, British","text":"Virgin Islands}, British"},{"id":"Virgin Islands}, U.S.","text":"Virgin Islands}, U.S."},{"id":"Wallis And Futuna","text":"Wallis And Futuna"},{"id":"Western Sahara","text":"Western Sahara"},{"id":"Yemen","text":"Yemen"},{"id":"Zambia","text":"Zambia"},{"id":"Zimbabwe","text":"Zimbabwe"}]
	var current_country = $('.country-input').attr('data-value');

	$('.country-input').select2({
	  data: countryOptions,
	  placeholder: 'Select a country',
	});

	$('.country-input').val(current_country); 
	$('.country-input').trigger('change.select2'); 

	$('.store-location-picker').select2({
  	    placeholder: "Select a store",
		allowClear: true
	});

	$('#typeSelect').select2({
  	    placeholder: "Select a type",
		allowClear: true
	});
	$('#typeSelect2').select2({
  	    placeholder: "Select a type",
		allowClear: true
	});
	$('#typeSelect3').select2({
  	    placeholder: "Select a type",
		allowClear: true
	});
/*	$('.select2city').select2({
  	    placeholder: "Select City",
	});
	$('.select2province').select2({
  	    placeholder: "Select Province",
	});
	$('.select2barangay').select2({
  	    placeholder: "Select a Barangay",
	});*/
}
function onLoadForgotPassword(){
	$("input#userSigninPassword").after('<div id="forgot-password"><a href="/forgot-password/">Forgot Password?</a></div>');
}
function validateMaxNumber(){
	 $(document).on('change', '#number-input,.number-input', function (e) {
		  var max = parseInt($(this).attr('max'));
		  var min = parseInt($(this).attr('min'));
		  if ($(this).val() > max)
		  {
			  $(this).val(max);
		  }
		  else if ($(this).val() < min)
		  {
			  $(this).val(min);
		  }       
	});

	 $(document).on('click', '#number-input,.number-input', function (e) {
		var productTitle = $('.Product-details h4').text();

		if(productTitle.length < 1) productTitle = $("#partialModalProduct .modal-title").text();

		if(parseInt($(this).attr('min')) > 1 && $(this).attr('min') == $(this).val()){
		  $.oc.flashMsg({text: 'Minimum order quantity of "'+ productTitle +'" is '+ $(this).attr('min'), 'class': 'error'});
		  return false;
		}
	});
}
function countCurrentAddons(){
	 var total = 0;
	 var limit = $(".addonlimit").val();
	$( ".addon-qty" ).each( function( index, element ){
		if($(this).prop('disabled') == false){
		     var this_ =  parseInt($(this).val());
		     total = total + this_;
		    $('.addoncounter').val(total);
		}
	});
}
function onAddonPick(){
	$(document).on('change', '.addons input.custom-control-input', function() {
	   	var counter =  $('.addoncounter').val();
	    var addon_id = '#addon' + $(this).val() + 'ID';
	    var addon_qty = '.addon-qty' + $(this).val();
	    var max_limit = $('input.addonlimit').val();
	    var code = $('#promoform .promocode-use').text();

	    if($(this).is(":checked")){
	    	$(addon_id).prop( "checked", true );
	    	$(this).parent().parent().find('.addon-qty').show();
	    	$(this).parent().parent().find('.addon-qty').prop('disabled', false);
	    	$(this).parent().parent().find('.addon-qty').val(1);

	    	$(addon_qty).prop('disabled', false);
	    	$(addon_qty).val(1);
	    	countCurrentAddons();
	    	if(max_limit){
				var addoncounter = $('input.addoncounter').val();
				console.log(addoncounter);
				console.log(max_limit);

		        if(parseInt(addoncounter) > parseInt(max_limit)){
		        	console.log("asdsd");
		    		this.checked = false;
		    		$.oc.flashMsg({
					    'text': 'You can add maximum of ' + max_limit + ' Addons',
					    'class': 'error',
					    'interval': 3
					})
					$(addon_id).prop( "checked", false  );
					$(this).parent().parent().find('.addon-qty').hide();
					$(this).parent().parent().find('.addon-qty').prop('disabled', true);
					$(this).parent().parent().find('.addon-qty').val("");

					$(addon_qty).prop('disabled', true);
					$(addon_qty).val("");
		    	}
			}
		}else if($(this).is(":not(:checked)")){
			$(addon_id).prop( "checked", false  );
			$(this).parent().parent().find('.addon-qty').hide();
			$(this).parent().parent().find('.addon-qty').prop('disabled', true);
			$(this).parent().parent().find('.addon-qty').val("");

			$(addon_qty).prop('disabled', true);
			$(addon_qty).val("");
			$('.addoncounter').val(0);
			countCurrentAddons();
		}

		var addon_id2 = '#addon' + $(this).val() + $(this).val();
	    if($(this).is(":checked")){
	    	$(addon_id2).prop( "checked", true );
	    	$(this).parent().parent().find('.addon-qty').show();
	    	$(this).parent().parent().find('.addon-qty').prop('disabled', false);
	    	$(this).parent().parent().find('.addon-qty').val(1);
		}else if($(this).is(":not(:checked)")){
			$(addon_id2).prop( "checked", false  );
			$(this).parent().parent().find('.addon-qty').hide();
			$(this).parent().parent().find('.addon-qty').prop('disabled', true);
			$(this).parent().parent().find('.addon-qty').val("");
		}

		var size = $('.add-to-cart-form input[name=size]').val();
		var color = $('.add-to-cart-form input[name=color]').val();
		var typex = $('.add-to-cart-form input[name=typex]').val();
		var typex2 = $('.add-to-cart-form input[name=typex2]').val();
		var typex3 = $('.add-to-cart-form input[name=typex3]').val();
		var addons_idx = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qtyx = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qtyx.filter(function(v){return v!==''});
		var code = $('#promoform .promocode-use').text();
		$.request('onComputeAddonPrice', {
			data: {
				code: code,
				size: size,
				color: color,
				typex: typex,
				typex2: typex2,
				typex3: typex3,
				addons_id: addons_idx,
				addons_qty: addons_qty_filter
			}
		})
	});
	$(document).on('change', '.addons .addon-qty', function() {
		var addon_qty = '.addon-qty' + $(this).data('index');
		var max_limit = $('input.addonlimit').val();
		var code = $('#promoform .promocode-use').text();
		if($(this).val() <= 0){
			$(this).val(1);
			$(addon_qty).val(1);
		}
		$(addon_qty).val($(this).val());
		countCurrentAddons();
		
		if(max_limit){
			var addoncounter = $('input.addoncounter').val();
	        if(parseInt(addoncounter) > parseInt(max_limit)){
	    		$(this).val(1);
	    		$.oc.flashMsg({
				    'text': 'You can add maximum of ' + max_limit + ' Addons',
				    'class': 'error',
				    'interval': 3
				})
				$(addon_qty).val(1);
	    	}
		}

		var size = $('.add-to-cart-form input[name=size]').val();
		var color = $('.add-to-cart-form input[name=color]').val();
		var typex = $('.add-to-cart-form input[name=typex]').val();
		var typex2 = $('.add-to-cart-form input[name=typex2]').val();
		var typex3 = $('.add-to-cart-form input[name=typex3]').val();
		var addons_idx = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qtyx = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qtyx.filter(function(v){return v!==''});
		var code = $('#promoform .promocode-use').text();
		$.request('onComputeAddonPrice', {
			data: {
				code: code,
				size: size,
				color: color,
				typex: typex,
				typex2: typex2,
				typex3: typex3,
				addons_id: addons_idx,
				addons_qty: addons_qty_filter
			}
		})
	});
}
function seniorCodeApply(){
	$( ".senior-form-btn" ).click(function() {
		var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $city = $('.checkout-form .city-input').val();
		var $province = $('.checkout-form .state-input').val();
		var shipping_fee_by_kilometer = $('#shipping_fee_by_kilometer').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		var address = $('.checkout-form .address-input').val();
		var senior_id = $('.checkout-form .senior-field').val();
		let oldGrandTotal = null;
		if(oldGrandTotal == null) {
			oldGrandTotal = $("#grandTotal").text();
		}

		$('.senior-form').request('onSeniorCodeApply', {
			data: {
				oldGrandTotal: oldGrandTotal,
				payment_type: $payment_type,
				barangay: $barangay,
				city: $city,
				province: $province,
				shipping_fee_by_kilometer: shipping_fee_by_kilometer,
				store_pick: store_pick,
				address: address,
				senior_id: senior_id,
				payment_gateway_type: payment_gateway_type
			}
		})

		  setTimeout(
		  function() 
		  {
		    	if($( "#voucher-checkout" ).length){
		    		$('.promocode').hide();
		    	}
		  }, 2000);
	});
}
function promocodeInit(){
	$( ".btn.btn-primary.codformbtn" ).click(function() {
		var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $city = $('.checkout-form .city-input').val();
		var $province = $('.checkout-form .state-input').val();
		var shipping_fee_by_kilometer = $('#shipping_fee_by_kilometer').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		var address = $('.checkout-form .address-input').val();

		if($payment_type == ""){
			return $.oc.flashMsg({text: 'Please Select Payment Method', 'class': 'error'});
		}
		let oldGrandTotal = null;
		if(oldGrandTotal == null) {
			oldGrandTotal = $("#grandTotal").text();
		}
		$('.codform').request('onPromoCodeApply', {
			data: {
				oldGrandTotal: oldGrandTotal,
				payment_type: $payment_type,
				barangay: $barangay,
				city: $city,
				province: $province,
				shipping_fee_by_kilometer: shipping_fee_by_kilometer,
				store_pick: store_pick,
				address: address,
				payment_gateway_type: payment_gateway_type
			}
		})

		 setTimeout(
		  function() 
		  {
		    	if($( "#voucher-checkout" ).length){
		    		$('.senior-form').hide();
		    	}
		  }, 2000);
	});
	$( "#product__single-main .btn.btn-primary.promoformbtn" ).click(function() {
		var size = $('.add-to-cart-form input[name=size]').val();
		var color = $('.add-to-cart-form input[name=color]').val();
		var typex = $('.add-to-cart-form input[name=typex]').val();
		var typex2 = $('.add-to-cart-form input[name=typex2]').val();
		var typex3 = $('.add-to-cart-form input[name=typex3]').val();
		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});

		$('#promoform').request('onPromoCodeApplySingle', {
			data: {
				size: size,
				color: color,
				typex: typex,
				typex2: typex2,
				typex3: typex3,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		})
		$('input.promo-add').val($('#product__single-main input.form-control.voucherfield').val());
	});
	$('.promocode input#voucher_field').on('keyup', function(){
		if( !$(this).val() ){
			$('.promocode .codformbtn').prop('disabled', true);
		}else{
			$('.promocode .codformbtn').prop('disabled', false);
		}
	});
}
function colorPicker(){
	$(document).on('click', '.color-picker li', function (e) {
		var $color_value = $(this).data('value');
		var $color_id =  $(this).data('id');
		var code = $('#promoform .promocode-use').text();

		$(".color-picker li").not(this).removeClass('active');;
		$(this).toggleClass('active');
		
		if($(this).hasClass('active')){
			$('input.colorInput').val($color_id);
			$('input[name="variant_color"]').val($color_id);
		}else{
			$('input.colorInput').val("");
			$('input[name="variant_color"]').val("");
		}
		
		$(".custom-checkbox input[type=checkbox]").prop("checked", false);

		$('.addon-qty').hide();
		$('.addon-qty').prop('disabled', true);
		$('.addon-qty').val("");

		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});
	$(document).on('click', '.size-picker li', function (e) {
		var $size_value = $(this).data('value');
		var $size_id =  $(this).data('id');
		var code = $('#promoform .promocode-use').text();

		$(".size-picker li").not(this).removeClass('active');;
		$(this).toggleClass('active');
		
		if($(this).hasClass('active')){
			$('input.sizeInput').val($size_id);
			$('input[name="variant_size"]').val($size_id);
		}else{
			$('input.sizeInput').val("");
			$('input[name="variant_size"]').val("");
		}
		$(".custom-checkbox input[type=checkbox]").prop("checked", false);

		$('.addon-qty').hide();
		$('.addon-qty').prop('disabled', true);
		$('.addon-qty').val("");

		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});
	$('#typeSelect').on('change', function(){
		var $form = $(this).closest('form');
		var $type_value = $(this).children("option:selected").val();
		var code = $('#promoform .promocode-use').text();

		$('input.typeInput').val($type_value);
		$('input[name="variant_type"]').val($type_value);
		$(".custom-checkbox input[type=checkbox]").prop("checked", false);

		$('.addon-qty').hide();
		$('.addon-qty').prop('disabled', true);
		$('.addon-qty').val("");

		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});
	$('#typeSelect2').on('change', function(){
		var $form = $(this).closest('form');
		var $type_value2 = $(this).children("option:selected").val();
		var code = $('#promoform .promocode-use').text();

		$('input.typeInput2').val($type_value2);
		$('input[name="variant_type2"]').val($type_value2);
		$(".custom-checkbox input[type=checkbox]").prop("checked", false);
		
		$('.addon-qty').hide();
		$('.addon-qty').prop('disabled', true);
		$('.addon-qty').val("");

		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});

	$('#typeSelect3').on('change', function(){
		var $form = $(this).closest('form');
		var $type_value3 = $(this).children("option:selected").val();
		var code = $('#promoform .promocode-use').text();

		$('input.typeInput3').val($type_value3);
		$('input[name="variant_type3"]').val($type_value3);
		$(".custom-checkbox input[type=checkbox]").prop("checked", false);
		
		$('.addon-qty').hide();
		$('.addon-qty').prop('disabled', true);
		$('.addon-qty').val("");

		var addons_id = $.map($('.product-input .addon-item input[name="Addon[]"]:checked'), function(c){return c.value; });
		var addons_qty = $.map($('.product-input .addon-item input[name="addon_qty[]"]'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});
		$('#variantForm').request('onGetVariantQty', {
			data: {
				code: code,
				addons_id: addons_id,
				addons_qty: addons_qty_filter
			}
		});
	});
}
function filterFieldInitx(){
	//Get URL Parameters function
	function GetURLParameter(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}
	var category = GetURLParameter('cat');
    var province = GetURLParameter('province');
    var status = GetURLParameter('status');
	
    if (province) {
    	fix_province = decodeURI(province);
    	$('.filter-province').val(fix_province);
    	$('.filter-province').trigger("change");
    	$('#region').val(fix_province);
    }
    if (status) {
    	var cat_var = '.' + status;
    	$(cat_var).prop('checked', true);
    	$(cat_var).trigger("change");
    }
	if( category ){
		var cat_var = '.' + category;
		$(cat_var).prop('checked', true);
		var $form = $('#filterProperties').closest('form');
		$form.request();

		//hide-search theme 3 when category is selected
		$("form.search").addClass("hide-search");
		//hide-search theme 2 when category is selected
		$("#search-container").addClass("not-visible");
		$(".searchbox").addClass("not-visible");
	} 

	var cat = GetURLParameter('categ');
	if (cat) {
		$('#searchFilterCategory').val(cat);
	}

	var search = GetURLParameter('s');

	if ( search ){
		var optimizeSearchWords = search.split("+").join(" ");

		$("#searchFilterValue").val(optimizeSearchWords);
		var $form = $('#filterProperties').closest('form');
		$form.request();

		//hide-search when the user searched
		$("form.search").addClass("hide-search");
		//hide-search theme 2 when the user searched
		$("#search-container").addClass("not-visible");
		$(".searchbox").addClass("not-visible");
	}
	//check for results
	$(document).ajaxComplete(function() {
		showNoResultsFound();
	});
	function showNoResultsFound() {	
		if($('#partialListing').find('.products_grid_view').length == 0) {
			$('#product_listing .no-results').removeAttr('hidden');
		}
		else {
			$('#product_listing .no-results').attr('hidden', true);
		}
	}
	// var cat = GetURLParameter('cat');

	// if ( cat ){
	// 	$("#searchFilterValue").val(optimizeSearchWords);
	// 	var $form = $('#filterProperties').closest('form');
	// 	$form.request();

	// 	//hide-search when the user searched
	// 	$("form.search").addClass("hide-search");
	// 	//hide-search theme 2 when the user searched
	// 	$("#search-container").addClass("not-visible");
	// 	$(".searchbox").addClass("not-visible");
	// }
}

/* PAYMENT GATEWAY SELECT CHANGE SMH */
function paymentOnChange(){
	$('.payment select[name=payment_gateway], input[type=radio][name=payment_gateway]').on('change', function() {
        var this_ = $(this).val();
		$(".proceed-div-btn").hide("slow");
		var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();

		function hideAllButtons() {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".gcash-aub-pay-btn").hide("slow");
			$(".grabpay-aub-pay-btn").hide("slow");
			$( ".deliveryFee" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-ewallet-btn-wrapper").hide("slow");
			$(".xendit-ewallet-types").hide("slow");

			$('.addon-wrap.addon-creditcard-on').hide();
			$(".paynamics").hide();
		}

		$('#cod-prompt').hide();

		if (this_ == "store_pickup") {
			hideAllButtons()
			$( ".store-pickup-btn" ).show( "slow" );
		} else if(this_ == "cod") {
			hideAllButtons()
			$('#cod-prompt').show();
			$(".cash-delivery-fee-div").show("slow");
			$( ".cod-btn" ).show( "slow" );
		}else if(this_ == "paypal") {
			hideAllButtons()
			$( ".paypal-btn" ).show( "slow" );
		} else if(this_ == "stripe") {
			hideAllButtons()
			$( ".stripe-btn" ).show( "slow" );
		} else if(this_ == "coins") {
			hideAllButtons()
			$( ".coins-btn" ).show( "slow" );
		} else if(this_ == "paymongo") {
			hideAllButtons()
			$( ".paymongo-btn" ).show( "slow" );
		} else if(this_ == "bank") {
			hideAllButtons()
			$( ".bank-btn" ).show( "slow" );
		} else if(this_ == "dragonpay" || this_ == "dragonpay_reduced_installment" || this_ == "dragonpay_0_installment") {
			hideAllButtons()
			$( ".dragonpay-btn" ).show( "slow" );
		} else if(this_ == "paymaya") {
			hideAllButtons()
			$( ".paymaya-btn" ).show( "slow" );
		} else if(this_ == "lbc") {
			hideAllButtons()
			$( ".lbc-btn" ).show( "slow" );
			$( ".form-check.lbc" ).show( "slow" );
		} else if (this_ == "gcash_paymongo") {
			hideAllButtons()
			$( ".gcash-paymongo-btn" ).show( "slow" );
		} else if (this_ == "gcash_direct") {
			hideAllButtons()
			$( ".gcash-direct-btn" ).show( "slow" );
		} else if (this_ == "xendit") {
			hideAllButtons()
			$(".xendit-btn").show("slow");
		} else if (this_ == "billease_bux" || this_ == "gcash_bux" || this_ == "grabpay_bux" || this_ == "ub_bux" || this_ == "bpi_bux" || this_ == "rcbc_bux") {
			hideAllButtons()
			$(".bux-btn").show("slow");
		} else if (this_ == "wechat_aub") {
			hideAllButtons()
			$(".we-chat-aub-pay-btn").show("slow");
		} else if (this_ == "xendit_direct_devit") {
			hideAllButtons()
			$(".xendit-direct-btn").show("slow");
		} else if (this_ == "gcash_aub") {
			hideAllButtons()
			$(".gcash-aub-pay-btn").show("slow");
		} else if (this_ == "grabpay_aub") {
			hideAllButtons()
			$(".grabpay-aub-pay-btn").show("slow");
		} else if (this_ == "xendit_ewallet") {
			hideAllButtons()
			$(".xendit-ewallet-btn-wrapper").show("slow");
			$(".xendit-ewallet-types").show("slow");
		} else if (this_ == "Xendit Billease") {
			hideAllButtons()
			$(".xendit-billease").show("slow");
		} else if (this_ == "Credit Card(Sale) - Paynamics") {
			hideAllButtons();
			$(".paynamics").show("slow");
		}
		 else {
			// HIDE EVERYTHING BECAUSE NOTHING WAS SELECTED
			hideAllButtons()
		}

		if (this_ == "paypal" || this_ == "paymongo") {
			$('.addon-wrap.addon-creditcard-on').show();
		} else {
			$('.addon-wrap.addon-creditcard-on').hide();
		}
		if($shippingFeeIsEnabled == "1"){
			$.request('onGettingShippingCost', {
				data: {
					payment_type: this_,
					promoCode: $promoCode,
					promoType: $promoType,
					store_pick: store_pick,
					payment_gateway_type: payment_gateway_type
				},
			});
			$.request('onGettingCashOnDeliveryFee', {
				data: {
					payment_type: this_,
					store_pick: store_pick,
					payment_gateway_type: payment_gateway_type
				},
			});
		}

		var checkShippingKilometerSwitch = $("#shipping_kilometer_switch_value").val();
		if(checkShippingKilometerSwitch == "1"){
			onDropPin($("#latInput").val(), $("#lngInput").val());
		}

		//Check cart products availability
        $(".proceed-div-btn:not(:hidden)").addClass("unvalidated-cart").parents('form').removeAttr('data-request');
    });

    $(".unvalidated-cart").on('click', function(){
    	checkout_form=$(this).parents('form');
        return validateCheckoutProducts($('div#cart__container').find('.checkout-details'), function(){
			checkout_form.attr('data-request',"onExecuteOrder");
			checkout_form.trigger('submit');
            $.oc.stripeLoadIndicator.show();
		});
	});
		
	$(document).on("change", ".payment input[type=radio][name=payment_gateway]", function () {
		if($(this).val() == "store_pickup"){
			$( ".store-pickup-btn" ).show( "slow" ); //Show
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "paymongo") {
			$( ".paymongo-btn" ).show( "slow" ); //Show
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "cod"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).show( "slow" ); //Show
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").show("slow"); //show
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "paypal"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).show( "slow" ); //show
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "stripe"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".stripe-btn" ).show( "slow" ); //show
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "coins"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".coins-btn" ).show( "slow" ); //show
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "bank"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).show( "slow" ); //show
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "dragonpay"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).show( "slow" ); //show
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "paymaya"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".lbc-btn" ).hide( "slow" );
			$( ".form-check.lbc" ).hide( "slow" );
			$( ".paymaya-btn" ).show( "slow" ); //show
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if($(this).val() == "lbc"){
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".lbc-btn" ).show( "slow" ); //show
			$( ".form-check.lbc" ).show( "slow" ); //show
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".xendit-btn").hide("slow");
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if ($(this).val() == "gcash_paymongo") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).show( "slow" ); //show
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if ($(this).val() == "gcash_direct") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).show( "slow" ); //show
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if ($(this).val() == "xendit") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".xendit-btn").show("slow"); //show
			$(".bux-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		}
		else if ($(this).val() == "gcash_bux" || $(this).val() == "grabpay_bux" || $(this).val() == "ub_bux" || $(this).val() == "bpi_bux" || $(this).val() == "rcbc_bux") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".bux-btn").show("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		} 
		else if ($(this).val() == "wechat_aub") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").show("slow"); //show
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").hide("slow");
		} 
		else if ($(this).val() == "xendit_direct_devit") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".xendit-direct-btn").show("slow"); //show
			$(".xendit-billease").hide("slow");
		}
		else if ($(this).val() == "Xendit Billease") {
			$( ".store-pickup-btn" ).hide( "slow" );
			$( ".cod-btn" ).hide( "slow" );
			$( ".deliveryFee" ).hide( "slow" );
			$( ".paypal-btn" ).hide( "slow" );
			$( ".stripe-btn" ).hide( "slow" );
			$( ".paymaya-btn" ).hide( "slow" );
			$( ".coins-btn" ).hide( "slow" );
			$( ".paymongo-btn" ).hide( "slow" );
			$( ".bank-btn" ).hide( "slow" );
			$( ".dragonpay-btn" ).hide( "slow" );
			$( ".gcash-paymongo-btn" ).hide( "slow" );
			$( ".gcash-direct-btn" ).hide( "slow" );
			$(".cash-delivery-fee-div").hide("slow");
			$(".xendit-btn").hide("slow");
			$(".we-chat-aub-pay-btn").hide("slow");
			$(".xendit-direct-btn").hide("slow");
			$(".xendit-billease").show("slow"); //show
		}
		else if ($(this).val() == 'dragonpay_0_installment') {
			hideAllButtons2()
			$( ".dragonpay-btn" ).show( "slow" );
		} else if ($(this).val() == "xendit_ewallet") {
			hideAllButtons2()
			$(".xendit-ewallet-btn-wrapper").show("slow");
			$(".xendit-ewallet-types").show("slow");
		} else if ($(this).val() == "billease_bux" || $(this).val() == "gcash_bux" || $(this).val() == "grabpay_bux" || $(this).val() == "ub_bux" || $(this).val() == "bpi_bux" || $(this).val() == "rcbc_bux") {
			hideAllButtons2()
			$(".bux-btn").show("slow");
		}

		if($(this).val() == "store_pickup" || $(this).val() == "lbc"){
			$('.lolat-wrap').hide();
			$('.grand-total .shipping-fee').hide();
		}else{
			$('.lolat-wrap').show();
			$('.grand-total .shipping-fee').show();
		}
	});
}

function hideAllButtons2() {
	$( ".store-pickup-btn" ).hide( "slow" );
	$( ".cod-btn" ).hide( "slow" );
	$( ".paypal-btn" ).hide( "slow" );
	$( ".stripe-btn" ).hide( "slow" );
	$( ".coins-btn" ).hide( "slow" );
	$( ".paymongo-btn" ).hide( "slow" );
	$( ".bank-btn" ).hide( "slow" );
	$( ".dragonpay-btn" ).hide( "slow" );
	$( ".paymaya-btn" ).hide( "slow" );
	$( ".lbc-btn" ).hide( "slow" );
	$( ".form-check.lbc" ).hide( "slow" );
	$( ".gcash-paymongo-btn" ).hide( "slow" );
	$( ".gcash-direct-btn" ).hide( "slow" );
	$(".xendit-btn").hide("slow");
	$(".bux-btn").hide("slow");
	$(".we-chat-aub-pay-btn").hide("slow");
	$(".xendit-direct-btn").hide("slow");
	$(".gcash-aub-pay-btn").hide("slow");
	$(".grabpay-aub-pay-btn").hide("slow");
	$( ".deliveryFee" ).hide( "slow" );
	$( ".dragonpay-btn" ).hide( "slow" );
	$(".cash-delivery-fee-div").hide("slow");
	$(".xendit-ewallet-btn-wrapper").hide("slow");
	$(".xendit-ewallet-types").hide("slow");

	$('.addon-wrap.addon-creditcard-on').hide();
}

function deleteToCart(){
	$(document).on('click',  '.delete-cart', function(){

		var _this = $(this);
		var $form = $(this).closest('form');
		var $promoCode = $('.code-value').val();
		var $promoType = $('.code-type').val();

		_this.parent().find('.promocode-value').val($promoCode);
		_this.parent().find('.promocode-type').val($promoType);

		var cartCount = $("#cartCount").text();
		$form.request();
		if($promoType == 'percent'){
			$('a.btn.btn-primary.codformbtn').trigger('click');
		}
		if (cartCount == '1'){
			$('.checkout-form,.grand-total').hide();
			$('form.cod-checkout').after("<div class='back-cart'><p>Your cart is currently empty.</p><a href='/products' class='btn btn-primary'>Return to shop</a></div>");
		}
	});
}
function addToCart(){
	$(document).on('click',  '.sign-in-modal', function(){
		$("#signupModal").modal("show");
	});
	$(document).on('click',  '.add-to-cart', function(){
		var userLogin = $('body').hasClass( "login-user" );
		var _this = $(this);
		var $form = $(this).closest('form');
		$form.request();
		$('#listingCartModal').modal('hide');
	});
	$(document).on('click',  '.cart-wrap .add-to-cart', function(){
		var userLogin = $('body').hasClass( "login-user" );
		if(userLogin){
			$(this).removeClass('fa-shopping-cart');
			$(this).removeClass('add-to-cart');
			$(this).addClass('fa-check');
		}
	});
}
function addToCartLocalStorage(){
	/**
	 * Add an item to a localStorage() object
	 * @param {String} name  The localStorage() key
	 * @param {String} key   The localStorage() value object key
	 * @param {String} value The localStorage() value object value
	 */
	var addToLocalStorageObject = function (name, key, value) {

		// Get the existing data
		var existing = localStorage.getItem(name);

		// If no existing data, create an array
		// Otherwise, convert the localStorage string to an array
		existing = existing ? JSON.parse(existing) : {};

		// Add new data to localStorage Array
		existing[key] = value;

		// Save back to localStorage
		localStorage.setItem(name, JSON.stringify(existing));

	};

	$( ".add-to-cart-single" ).click(function() {
		var $productID = $(this).data('id');

		addToLocalStorageObject('cartItem', $productID, 1);
	});
}
function filterOnChange(){
	function initNumberOnload(){
		setTimeout(
		  function() 
		  {
			$('.to-number').number( true );
		  }, 1000);
	}
	$('#locationSelector').on('change', '#region', function(){
		//temp fix redirection auto fill reference task https://app.clickup.com/t/7537039/MS-1207
		if(!($(this).is(":visible")) || $(this).is(":hidden")) return false;
		_val = $(this).val();
		if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
			url = "http://localhost/ecommerce/products?province="
		}else{
			url = "/products?province="
		}
		if (window.location.pathname != "/information-and-shipping") {
			window.location.replace(url + _val);
		}
	});
	$('#nav-content').on('change', '#region_nav', function(){
		//temp fix redirection auto fill reference task https://app.clickup.com/t/7537039/MS-1207
		if(!($(this).is(":visible")) || $(this).is(":hidden")) return false;
		_val = $(this).val();
		if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
			url = "http://localhost/ecommerce/products?province="
		}else{
			url = "/products?province="
		}
		if (window.location.pathname != "/information-and-shipping") {
			window.location.replace(url + _val);
		}
	});
	$('#filterProperties').on('change', '.filter-province', function(){
		var filter_province = $('.filter-province').val();
		$.request('onGettingFilterCities', {
			data: {
				filter_province: filter_province,
			},
		});	
	});
	
	$('#filterProperties').on('change', 'input, select', function(){
		var $form = $(this).closest('form');
		$('#currentPage').val('1');

		$form.request();
		initNumberOnload();
	});
	$('#filterPropertiesSort').on('change', 'input, select', function(){
		var $form = $(this).closest('form');
		$('#currentPage').val('1');
		$form.request();
		initNumberOnload();
	});
	//Pagination part
	$('#product_listing.ajax-listing').on('click', '.pagination > li > a', function (event) {
		var paged = $(this).text();
		if(paged == "»"){
			var current =  parseInt($('#currentPage').val()) + 1;
			$('#currentPage').val(current);
		}else if(paged == "«"){
			var current =  parseInt($('#currentPage').val()) - 1;
			$('#currentPage').val(current);
		}
		else{
			$('#currentPage').val(paged);
		}
		event.preventDefault();
		var $form = $('.ajax-listing form');
		$form.request();
		initNumberOnload();
		$(window).scrollTop(0);
	});
	//remove URL on paginate on load
	$( "#product_listing.ajax-listing .paginate-wrap .pagination li > a" ).each(function() {
		$(this).attr( "href", "#");
	});

	//insert filter form inside slide nav
	if (window.matchMedia('(max-width: 991px)').matches) 
		$('#product_listing form').appendTo($('#filter_slidenav'));
		
	else if (window.matchMedia('(min-width: 992px)').matches) 
		$('#product_listing form').appendTo($('#filter_sidebar'));
	

	$(window).on('resize', function () {
		if (window.matchMedia('(max-width: 991px)').matches) 
			$('#product_listing form').appendTo($('#filter_slidenav'));
		
		else if (window.matchMedia('(min-width: 992px)').matches) 
			$('#product_listing form').appendTo($('#filter_sidebar'));
	});
	
	//Disappearing Mobile Keyboard Bugfix Workaround START
    //Turn off Window Resize Event
    $('#filterby_btn').on('click', function() {
		$('#filter_slidenav').css('width', '280px');
		$("body").append($('<div class="filter-overlay"></div>'));
		$(window).off('resize');
	});
	
	//Turn on Window Resize Event
	$('#closeFilterSideMenu').on('click', function() {	
		$('.filter-overlay').remove();
		$('#filter_slidenav').css('width', '0');
		reEnterInsertFilter();
		windowResizeEvent();
	});
	
	//Turn on Window Resize Event
	$(document).on('click', '.filter-overlay', function() {
		$(this).remove();
		$('#filter_slidenav').css('width', '0');
		reEnterInsertFilter();
		windowResizeEvent();
	});
	
    // Close #filter_slidenav after Enter keypress
	$('#searchFilterValue').on('keydown',function(e) {
        if(e.which == 13) {
            $('.filter-overlay').remove();
    		$('#filter_slidenav').css('width', '0');
    		reEnterInsertFilter();
    		windowResizeEvent();
        }
    });

	
	// Window Resize Event Function for re-activation
	function windowResizeEvent() {
	    $(window).on('resize', function () {
    		if (window.matchMedia('(max-width: 991px)').matches) 
    			$('#product_listing form').appendTo($('#filter_slidenav'));
    		
    		else if (window.matchMedia('(min-width: 992px)').matches) 
    			$('#product_listing form').appendTo($('#filter_sidebar'));	
    	});
	}
	
	// Re-enter function for insert filter form inside slide nav
	function reEnterInsertFilter() {
	if (window.matchMedia('(max-width: 991px)').matches) 
		$('#product_listing form').appendTo($('#filter_slidenav'));
		
	else if (window.matchMedia('(min-width: 992px)').matches) 
		$('#product_listing form').appendTo($('#filter_sidebar'));
	}
	
	//Disappearing Mobile Keyboard Bugfix Workaround END


	//stick filter to the top on scroll
	var navHeight = $("#top-header").innerHeight() + $("#header-main").innerHeight(); 
	$("#filter_sidebar").css('top', navHeight + 30 + 'px'); 
}

function sortOnchange(){
	$('#searchFilterSortx').on('change', function() {
		var value = $(this).val();
		$('#searchFilterSort').val(value).change();
	});

	$('#searchFilterByX').on('change', function() {
		var value = $(this).val();
		$('#searchFilterSort').val(value).change();
	});
}

function sliderSinglePageInit(){
	$('#galleryslider').lightSlider({
		gallery:true,
		item:1,
		loop:true, 
		thumbItem:4,
		slideMargin:0,
		enableDrag: false,
		onSliderLoad: function(e) {
			e.lightGallery({
			selector: '#galleryslider .lslide',
			exThumbImage: 'data-thumb'
			});
		 } 
	}); 
}

function backToTop(){
	$(window).scroll(function () {
		if ($(this).scrollTop() > 1000) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
	});
	// scroll body to 0px on click
	$('#back-to-top').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	}); 
}

function fixedHeader(){
	var header_height = $( '#header-main' ).height();
	var top_header_height = $( '#top-header' ).height();
	var header_height_total = top_header_height + header_height + 19;
	$("#wrapper").css("margin-top", header_height_total);

	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$('#header-main').addClass('header-fixed');
		} else {
			$('#header-main').removeClass('header-fixed');
		}
		if ($(this).scrollTop() > 300) {
			$('#top-header').addClass('header-fixed');
		} else {
			$('#top-header').removeClass('header-fixed');
		}
	});
}

function onChangeScheduler() {
	$('[name=whenradio]').click(function(){

		if($("[name='payment_gateway']:checked").val() === "store_pickup") {
			//$("[name=whenradio][value='now']").prop("checked",true);
			if($(this).val() == "later") {
				$(".scheduler-div").show();
			} else {
				$(".scheduler-div").hide();
			}
		} else {

			if($(this).val() == "later") {
				$(".scheduler-div").show();
				$("#delivery-date").prop('required',true);
				$(".hour-select").prop('required',true);
				$(".minutes-select").prop('required',true);
				$(".am-pm-select").prop('required',true);

				var deliveryDate = moment().format("Y-M-D");
				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

                //Check if minutes is available in the option, if not set to 00 or 30
                if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                    minutes = parseInt(minutes) > 30 ? '00' : '30';
                }

                //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
                if($('.hour-select option[value="'+hour+'"]').length < 1){
                    hour = $('.hour-select option:nth-child(1)').val();
                }

				hour = parseInt(hour)+1;

                if(hour > 12) hour -=12;

				for(var count = 1; count < hour; count++){
					$(`.hour-select option[value=${count}]`).prop("disabled", true);
				}

                $('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$("#delivery-date").val(deliveryDate);
				$( "#delivery-date" ).datepicker({ minDate: 0});
				$(".am-pm-select").val(ampm);

				$("#delivery-date-value").val(deliveryDate);
				$("#delivery-time-value").val(moment().format("H:m:00"));
			} else {
				$(".scheduler-div").hide();
				$("#delivery-date-value").val("");
				$("#delivery-time-value").val("");
				$("#delivery-date").prop('required', false);
				$(".hour-select").prop('required', false);
				$(".minutes-select").prop('required', false);
				$(".am-pm-select").prop('required', false);

				var deliveryDate = moment().format("Y-M-D");
				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

                //Check if minutes is available in the option, if not set to 00 or 30
                if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                    minutes = parseInt(minutes) > 30 ? '00' : '30';
                }

                //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
                if($('.hour-select option[value="'+hour+'"]').length < 1){
                    hour = $('.hour-select option:nth-child(1)').val();
                }

                $('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$("#delivery-date").val(deliveryDate);
				$(".am-pm-select").val(ampm);

				$("#delivery-date-value").val(deliveryDate);
				$("#delivery-time-value").val(moment().format("H:m:00"));

			}
		}
    });
}

function convertTimeFrom12To24(timeStr) {
	var colon = timeStr.indexOf(':');
	var hours = timeStr.substr(0, colon),
		minutes = timeStr.substr(colon+1, 2),
		meridian = timeStr.substr(colon+4, 2).toUpperCase();
   
	
	var hoursInt = parseInt(hours, 10),
		offset = meridian == 'PM' ? 12 : 0;
	
	if (hoursInt === 12) {
	  hoursInt = offset;
	} else {
	  hoursInt += offset;
	}
	return hoursInt + ":" + minutes;
	
}

function getValueOfRadioButtonCheckoutPage() {
	$("[name='payment_gateway']").on("click", function() {
		if($(this).val() == "store_pickup") {
			// $(".scheduler-div").hide();
			$("#delivery-date").val(moment().format("M/D/Y"));
			$(".hour-select").val("1");
			$(".minutes-select").val("00");
			$(".am-pm-select").val("AM");
			$("[name=whenradio][value='now']").prop("checked",true);
			$("#delivery-date-value").val("");
			$("#delivery-time-value").val("");
			//$(".when-div, .scheduler-div").hide();

			$("#delivery-date-value").val(moment().format("Y-M-D"));
			$("#delivery-time-value").val(moment().format("H:m:00"));
		} else {
			$("#delivery-date").val(moment().format("M/D/Y"));
			$(".hour-select").val("1");
			$(".minutes-select").val("00");
			$(".am-pm-select").val("AM");
			$("[name=whenradio][value='now']").prop("checked",true);
			// $("#delivery-date-value").val("");
			// $("#delivery-time-value").val("");
			$(".when-div").show();
		}
	});
}

function checkFirstCheckBox() {
	function GetURLParameter(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}
	var linked_account_token_id = GetURLParameter('linked_account_token_id');
	if( linked_account_token_id ){

		$('input[name=payment_gateway][value="xendit_direct_devit"]').prop('checked', true).trigger('change');
	
	}else{
		$("[name='payment_gateway']:first").click(); 
		$("[name='payment_gateway']:first").prop("checked",true);
	}
}
function getFirstCheckBox() {
	if($("[name='payment_gateway']:checked").val() === "store_pickup") {
		// $(".when-div, .scheduler-div").hide();
	} else {
		$(".when-div").show();
	}
}

function onGetProductsView(){

	$(document).on('click', '#product-list-view-icon', function(){
		var current_page = $('.paginate-wrap .pagination .active').text();
		$('#currentPage').val(current_page);
		$('#product_view').val('list');
		var $form = $('.ajax-listing form');
		$form.request();
	})


	$(document).on('click', '#product-grid-view-icon', function(){
		var current_page = $('.paginate-wrap .pagination .active').text();
		$('#currentPage').val(current_page);
		$('#product_view').val('grid');
		var $form = $('.ajax-listing form');
		$form.request();
	})

}

function onGetProductsByCategoriesView(){

	$(document).on('click', '#product-list-view-icon', function(){
		
			var current_page = $('.paginate-wrap .pagination .active').text();
			$('#currentPage').val(current_page);
			$('#product_view').val('list');
			console.log($('#product_view').val('list'));	
			var $form = $('.ajax-listing form');
			$form.request();
		})

		
		$(document).on('click', '#product-grid-view-icon', function(){

			var current_page = $('.paginate-wrap .pagination .active').text();
			$('#currentPage').val(current_page);
			$('#product_view').val('grid');
			console.log($('#product_view').val('grid'));
			var $form = $('.ajax-listing form');
			$form.request();
		})

}
function slickCleanBeautyHomePage() {
	$('.clean-beauty-container-div').slick({
		infinite: true,
		slidesToShow:4,
		responsive: [
			{
			  breakpoint: 990,
			  settings: {
				slidesToShow: 2,
			  }
			},
			{
				breakpoint: 580,
				settings: {
					slidesToShow: 1,
					centerMode:true
				}
			}
		  ]
	});
}
function initializeSlickOnHomePage() {
	$('.our-recommedation-container-div').slick({
		infinite: true,
		variableWidth: true,
		centerMode: true
	});
}

function onLoadGcashPaymongoThankYou() {
	var href = location.href;
	var lastSegmentName = href.match(/([^\/]*)\/*$/)[1];

	if(lastSegmentName == "thank-you-gcash-paymongo") {
		$(".fname-input").val(localStorage.getItem("fname"));
		$(".lname-input").val(localStorage.getItem("lname"));
		$(".email-input").val(localStorage.getItem("email"));
		$(".phone-input").val(localStorage.getItem("phone"));
		$(".address-input").val(localStorage.getItem("billing_addess"));
		$(".barangay-input").val(localStorage.getItem("billing_barangay"));
		$(".city-input").val(localStorage.getItem("billing_city"));
		$(".state-input").val(localStorage.getItem("billing_state"));
		$("#shipping_fee_by_kilometer").val(localStorage.getItem("shipping_fee_by_kilometer"));

		$("#latInput").val(localStorage.getItem("billing_lat"));
		$("#lngInput").val(localStorage.getItem("billing_long"));
		$(".postal-input").val(localStorage.getItem("billing_postal"));
		$(".remarks-input").val(localStorage.getItem("billing_remark"));
		$(".landmark-input").val(localStorage.getItem("billing_landmark"));
		$(".voucherfield").val(localStorage.getItem("voucher"));
		$(".store-pick").val(localStorage.getItem("store_pick"));
		$(".code-type").val(localStorage.getItem("code_type"));
		$(".payment-gateway-type").val(localStorage.getItem("payment_gateway_type"));

		localStorage.removeItem("fname");
		localStorage.removeItem("lname");
		localStorage.removeItem("email");
		localStorage.removeItem("phone");
		localStorage.removeItem("billing_addess");
		localStorage.removeItem("billing_barangay");
		localStorage.removeItem("billing_city");
		localStorage.removeItem("billing_state");
		localStorage.removeItem("shipping_fee_by_kilometer");

		localStorage.removeItem("billing_lat");
		localStorage.removeItem("billing_long");
		localStorage.removeItem("billing_postal");
		localStorage.removeItem("billing_remark");
		localStorage.removeItem("billing_landmark");
		localStorage.removeItem("voucher");
		localStorage.removeItem("store_pick");
		localStorage.removeItem("code_type");
		localStorage.removeItem("payment_gateway_type");
		// Note: localStorage needs to be cleared !important
		$('.gcash-paymongo-checkout').request('onExecuteOrder', {
			data: {
				payment_type_pick: "gcash_paymongo",
			},
		});
	}
}

var blockedDates = [];
var getBlockedDates = false;
var blocked_date_url = "/api/blocked-dates";
function checkoutDatePickerInit() {
    var disableDates = [];

    if(location.hostname === "localhost"){
        $url = "http://localhost/ecommerce/api/blocked-dates";
    }else{
        $url = "/api/blocked-dates";
    }

    //If no date is selected, revert value to current date
    $('#delivery-date').on('focusout', function(){
        if($(this).val().length < 1){
            $(this).val(moment().format('YYYY-M-D'));
        }
    });

    $.ajax({
        url: $url,
        type: "GET",
        dataType: 'json',
        success: function(data) {
            blockedDates = data;
            getBlockedDates = true;
            disableDates = [];

            if(data.dates.length > 0) {
                $.each(data.dates, function (index, value) {


                    var dt = new Date();

                    var startTimeData = value.time_start_block_date;
                    var endTimeData = value.time_end_block_date;

                    if (startTimeData === null || endTimeData === null) {
                        disableDates.push(moment(value.chosen_blocked_dates).format("YYYY-M-DD"));
                    }
                });
            }

            var dateToday = new Date();
			$('#delivery-date').datepicker({
				beforeShowDay: function(date){
                    dmy = moment(date).format("YYYY-M-DD");
                    if(disableDates.indexOf(dmy) != -1){
						return false;
					}
					else{
						return true;
					}
				},
				startDate: dateToday,
			});

            $('span#delivery-options').show();
        }, error: function(){
            $.oc.flashMsg({text: 'Oops! Something went wrong. Please try refreshing the page. <br/><span class="small display-block">If error still persist, please contact support for assistance. <br/>Error Code: OS#0001</span>', 'class': 'error', 'interval': 8}); //Error message hides after 8 seconds
        }
    });
}

//Returns true if order schedule does not fall within blocked date/time
function validateOrderScheduleWithBlockedDates(schedule){
	var is_valid = true;

	//Sets is_valid to false if schedule falls on blocked dates
	function isScheduleNotBlocked(schedule, blocked_dates){
		if(!$.isEmptyObject(blocked_dates)){
            $.each(blocked_dates, function () {
                var block_from = moment(this.chosen_blocked_dates, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' ' + moment(this.time_start_block_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
                var block_to = moment(this.chosen_blocked_dates, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' ' + moment(this.time_end_block_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');

                //Subtract 1 minute to block_from, add 1 minute to block_to so when schedule is set to exactly the same time as the block date start or end, it will still return true
                if (moment(schedule, 'YYYY-M-D h:mm A').isBetween(moment(block_from).subtract(1, 'minutes'), moment(block_to).add(1, 'minutes'))) {
                    $.oc.flashMsg({text: 'Store is not available on your selected order schedule. Please set a different schedule', 'class': 'error'});
                    is_valid = false;
                }

                if(is_valid === false) return false; //Break $.each loop
            });
        }
	}

	//If blocked dates have not been retrieved before
	if(getBlockedDates === false){
		//Retrieve blocked dates
		$.get(blocked_date_url, {}, function(data){
            blockedDates = data;
			getBlockedDates = true;
			isScheduleNotBlocked(schedule, data.dates);
		});
	}else{
		//Reuse previously retrieved blocked dates
		isScheduleNotBlocked(schedule, blockedDates.dates);
	}

	return is_valid;
}

function setDefaultDateTimeDeliveryDate() {
	var deliveryDate = moment().format("Y-M-D");
	$("#delivery-date-value").val(deliveryDate);
	$("#delivery-time-value").val(moment().format("H:m:00"));
}

function onGetProductsByCategoriesView(){

	$(document).on('click', '#product-list-view-icon', function(){
		
			var current_page = $('.paginate-wrap .pagination .active').text();
			$('#currentPage').val(current_page);
			$('#product_view').val('list');
			console.log($('#product_view').val('list'));	
			var $form = $('.ajax-listing form');
			$form.request();
		})

		
		$(document).on('click', '#product-grid-view-icon', function(){

			var current_page = $('.paginate-wrap .pagination .active').text();
			$('#currentPage').val(current_page);
			$('#product_view').val('grid');
			console.log($('#product_view').val('grid'));
			var $form = $('.ajax-listing form');
			$form.request();
		})

}
function runPopUp() {
	var href = location.href;
	var lastSegmentName = href.match(/([^\/]*)\/*$/)[1];

	if($("#popup-upsell-switch").val() == 1) {
		if($("#upsell-option").val() === "product-discount") {
			// Note: product discount countdown timer
			getProductDiscountCountdownTime();
		} else if ($("#upsell-option").val() === "pop-up-modal") {
			// Note: popup upsell voucher countdown timer
			getActiveUpsellAjax();
		}
	}
}

function getActiveUpsellAjax() {
	$.ajax({
		url: '/api/get-active-upsell', 
		type: "GET",
		dataType: 'json',
		success: function(data) {
			if(data.upsell_data.length > 0) {


				var showModal = false;

				$.each(data.upsell_data, function(index, value) {
					$(".voucher-message").text(value.offer_message);
					$(".voucher-code").html("<p>"+ value.discount_code +"</p>");
					console.log(moment().isAfter(value.timeframe), "checking date"); // true);

					if(moment().isAfter(value.timeframe) === false) {
						showModal = true;
						runCountDownTimer(value.timeframe);
					}
				});
				/* Note: previous implementation
				if(!sessionStorage.popup_upsell_already_shown) {
					$("#popup-upsell-modal").modal("show");
					sessionStorage.popup_upsell_already_shown = 1;
				} */
				
					if(showModal === true) {
						$("#popup-upsell-modal").modal("show");
					}
				
			} else {
				sessionStorage.removeItem("popup_upsell_already_shown");
			}
		}
	});
}

function getProductDiscountCountdownTime() {
	$.ajax({
		url: '/api/get-product-discounts-countdown-time', 
		type: "GET",
		dataType: 'html',
		success: function(html) {
			if (html === undefined || html.length == 0) {
				$(".discounted-products-promo-div").remove();
			} else {
				var expiryDate = "";
                document.querySelector('div.discounted-products-promo').insertAdjacentHTML('afterbegin', html)
                expiryDate = document.getElementById('product-card--first').dataset.saleExpiryDate;
				initiateSlickOnDiscountedProducts();
				runCountDownTimer(expiryDate);
			}
		}
	});
}

function runCountDownTimer(timeframe) {
	const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
		
		console.log(timeframe, "test");

  		let birthday = timeframe,
      	countDown = new Date(birthday).getTime(),
		x = setInterval(function() {    

			let now = new Date().getTime(),
			distance = countDown - now;

			document.getElementById("days").innerText = Math.floor(distance / (day)),
			document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
			document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
			document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

			//do something later when date is reached
			if (distance < 0) {
				let headline = document.getElementById("headline"),
				countdown = document.getElementById("countdown"),
				content = document.getElementById("content");

				headline.innerText = "It's my birthday!";
				countdown.style.display = "none";
				content.style.display = "block";

				clearInterval(x);
			}
		//seconds
		}, 0)
}

function onDropPin(lat2, lon2) {
	var $city = $('.checkout-form .city-input').val();
	var $promoCode = $('#promoCode .code-value').val();
	var $promoType = $('#promoCode .code-type').val();
	var $barangay = $('.checkout-form .barangay-input').val();
	var $province = $('.checkout-form .state-input').val();
	var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
	var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
	var payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
	var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
	var $address = $('.checkout-form .address-input').val();
	var customer_lat = $("#latInput").val();
	var customer_long = $("#lngInput").val();
	var delivery_timestamp_val = $('.delivery_timestamp_val').val();
	if($shippingFeeIsEnabled == "1"){
		$.request('onGettingShippingCost', {
			data: {
				payment_type: payment_type,
				city: $city,
				barangay: $barangay,
				province: $province,
				promoCode: $promoCode,
				promoType: $promoType,
				store_pick: store_pick,
				address: $address,
				lat: customer_lat,
				long: customer_long,
				payment_gateway_type: payment_gateway_type
			},
		});
	}

	var htploocaShippingLogicSwitch = $(".htp-looca-custom-shipping-logic-switch").val();

	if(htploocaShippingLogicSwitch == 1 && $("[name='payment_gateway']").val() != "store_pickup") {
		return false;
	}

	var checkShippingKilometerSwitch = $("#shipping_kilometer_switch_value").val();

	var lat1 = $("#store_lat_input").val();
	var lon1 = $("#store_long_input").val();
	var lalamoveDirectIntegration = $("#lalamove_direct_hidden").val();
	var latLonObject = {
		"delivery_schedule": delivery_timestamp_val,
		"lat1": lat1,
		"lon1" : lon1,
		"lat2" : lat2,
		"lon2" : lon2,
		"requester_contact_name" : $("#store_manager_full_name_hid").val(),
		"request_contact_phone" : $("#store_contact_number").val(),
		"delivery_contact_name" : $(".fname-input").val() + " " + $(".lname-input").val(),
		"delivery_contact_phone" : $(".phone-input").val(),
		"delivery_remarks" : $(".remarks-input").val(),
		"country_code" : "PH_MNL",
		"service_type" : "MOTORCYCLE",
		"userId": $('input[name="userId"]').val()
	};
	var isInvalidLongLat = false;
	// Note: check if lat and long input exist on the checkout page
	var isLatLongExist = $('#latInput').length == 1;

	// Note: check if shipping by kilometer switch is on
	if(checkShippingKilometerSwitch == 1) {
		if(isLatLongExist) {
			if(lat1 == "" & lon1 == "") {
				isInvalidLongLat = true;
			} else {
				setTimeout(function(){
					if($('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val() == "cod") {
						$("#cod-fee-hid-input").val($("#codfeeprice").text());
					} else {
						$("#cod-fee-hid-input").val(0);
					}
				}, 3000);
				// $('input[type=radio][name=payment_gateway]:checked').trigger("change");
				// let payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
				//console.log("payment_type: "+payment_type)
				if(lalamoveDirectIntegration == 0) {
					googleMatrixAjax(latLonObject);
				} else {
					latLonObject.store_address = $("#store_address").val();
					latLonObject.customer_address = $(".address-input").val() + " " + $(".state-input").val() + " " + $(".city-input").val() + " " + $(".barangay-input").val();
					
					const invalidPaymentsForDelivery = ["store_pickup", ""];

					if (!invalidPaymentsForDelivery.includes($('[name=payment_gateway]').val()) && $("#order_method").val().toLowerCase() == "delivery") {
						lalamoveGetQuotationAjax(latLonObject);
					}
				}
			}
		}
	}else if(lalamoveDirectIntegration == 1){
		if(isLatLongExist){
			if(lat1 == "" & lon1 == "") {
				isInvalidLongLat = true;
			}else{
				latLonObject.store_address = $("#store_address").val();
				latLonObject.customer_address = $(".address-input").val() + " " + $(".state-input").val() + " " + $(".city-input").val() + " " + $(".barangay-input").val();
				
				const invalidPaymentsForDelivery = ["store_pickup", ""];
		
				if (!invalidPaymentsForDelivery.includes($('[name=payment_gateway]').val())) {
					lalamoveGetQuotationAjax(latLonObject);
				}
			}
		}
	}

	if(isInvalidLongLat){
		var payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
				
		if(payment_type != "store_pickup" && payment_type != "lbc") {
			$.oc.flashMsg({text: 'Store location is not set.', 'class': 'error'});

			// Note: disabled the proceed button when store lat and long not set
			$(".proceed-div-btn").css({"pointer-events": "none"});
		} else {
			$(".proceed-div-btn").css({"pointer-events": "auto"});
		}
	}
}

function lalamoveComputation(km) {

	if($("#shipping_rates_has_value").val() != 1) {
		var websiteUrl = window.location.hostname;
		console.log("Computation is hardcoded");
		if(websiteUrl == "nxtgenconsolidated.com") {
			if(km == 1) {
				return "82";
			} else if (km == 2) {
				return "91";
			} else if (km == 3) {
				return "100";
			} else if (km == 4) {
				return "109";
			} else if (km == 5) {
				return "117";
			} else if (km == 6) {
				return "126";
			} else if (km == 7) {
				return "135";
			} else if (km == 8) {
				return "144";
			} else if (km == 9) {
				return "153";
			} else if (km == 10) {
				return "162";
			} else if (km == 11) {
				return "171";
			} else if (km == 12) {
				return "180";
			} else if (km == 13) {
				return "189";
			} else if (km == 14) {
				return "198";
			} else if (km == 15) {
				return "207";
			} else if (km == 16) {
				return "216";
			} else if (km == 17) {
				return "225";
			} else if (km == 18) {
				return "234";
			} else if (km == 19) {
				return "243";
			} else if (km == 20) {
				return "252";
			} else if (km == 21) {
				return "261";
			} else if (km == 22) {
				return "270";
			} else if (km == 23) {
				return "279";
			} else if (km == 24) {
				return "288";
			} else if (km > 24) {
				var exceededKm = km - 24;
				var exceededKmComputation = 8.96 * exceededKm + 288;
				return Math.ceil(exceededKmComputation);
			}
		} else if(websiteUrl == "donbenitos.ph") {
			if(km == 1) {
				return "67.72";
			} else if (km == 2) {
				return "74.44";
			} else if (km == 3) {
				return "81.16";
			} else if (km == 4) {
				return "87.88";
			} else if (km == 5) {
				return "94.6";
			} else if (km == 6) {
				return "101.32";
			} else if (km == 7) {
				return "108.04";
			} else if (km == 8) {
				return "114.76";
			} else if (km == 9) {
				return "121.48";
			} else if (km == 10) {
				return "128.2";
			} else if (km == 11) {
				return "134.92";
			} else if (km == 12) {
				return "141.64";
			} else if (km == 13) {
				return "148.36";
			} else if (km == 14) {
				return "155.08";
			} else if (km == 15) {
				return "161.8";
			} else if (km == 16) {
				return "168.52";
			} else if (km == 17) {
				return "175.24";
			} else if (km == 18) {
				return "181.96";
			} else if (km == 19) {
				return "188.68";
			} else if (km == 20) {
				return "195.4";
			} else if (km == 21) {
				return "202.12";
			} else if (km == 22) {
				return "208.84";
			} else if (km == 23) {
				return "215.56";
			} else if (km == 24) {
				return "222.28";
			} else if (km > 24) {
				var exceededKm = km - 24;
				var exceededKmComputation = 8.96 * exceededKm + 287.24;
				// return Math.ceil(exceededKmComputation);
				return exceededKmComputation;
			}
		} else if((websiteUrl == "beery.ph") || (websiteUrl == "www.beery.ph")) {
			if(km == 1) {
				return "90";
			} else if (km == 2) {
				return "100";
			} else if (km == 3) {
				return "110";
			} else if (km == 4) {
				return "120";
			} else if (km == 5) {
				return "125";
			} else if (km == 6) {
				return "135";
			} else if (km == 7) {
				return "145";
			} else if (km == 8) {
				return "152";
			} else if (km == 9) {
				return "160";
			} else if (km == 10) {
				return "170";
			} else if (km == 11) {
				return "180";
			} else if (km == 12) {
				return "190";
			} else if (km == 13) {
				return "200";
			} else if (km == 14) {
				return "205";
			} else if (km == 15) {
				return "215.00";
			} else if (km == 16) {
				return "225.00";
			} else if (km == 17) {
				return "235.00";
			} else if (km == 18) {
				return "242.00";
			} else if (km == 19) {
				return "250.00";
			} else if (km == 20) {
				return "260.00";
			} else if (km == 21) {
				return "270.00";
			} else if (km == 22) {
				return "280.00";
			} else if (km == 23) {
				return "290.00";
			} else if (km == 24) {
				return "295.00";
			} else if (km > 24) {
				var exceededKm = km - 24;
				var exceededKmComputation = 8.96 * exceededKm + 287.24;
				// return Math.ceil(exceededKmComputation);
				return exceededKmComputation;
			}
		} else if((websiteUrl == "androgynouspanda9158.prosperna.ph") || (websiteUrl == "kingchefph.com")) {
			if(localStorage.getItem('targetProvince') == "BENGUET") {
				if(km == 1) {
					return "80.00";
				} else if (km == 2) {
					return "80.00";
				} else if (km == 3) {
					return "80.00";
				} else if (km == 4) {
					return "92.00";
				} else if (km == 5) {
					return "104.00";
				} else if (km == 6) {
					return "116.00";
				} else if (km == 7) {
					return "128.00";
				} else if (km == 8) {
					return "140.00";
				} else if (km == 9) {
					return "152.00";
				} else if (km == 10) {
					return "164.00";
				} else if (km > 10) {;
					var exceededKmComputation = 0;

					Swal.fire('Selected branch does not deliver to your area, please choose a branch closer to you').then(function() {
						window.location = "/location";
					});
					$('#container__plain').html('<div class="text-center mt-5"><h2>Location is not a servicable area. You may click <a href="/location" style="color: #007BF7">here</a> to to choose location.</h2></div>');

					return exceededKmComputation;
				}	
			}

			else if(localStorage.getItem('targetProvince') == "METRO MANILA") {
				
				if(km == 1) {
					return "60.00";
				} else if (km == 2) {
					return "60.00";
				} else if (km == 3) {
					return "60.00";
				} else if (km == 4) {
					return "60.00";
				} else if (km == 5) {
					return "60.00";
				} else if (km == 6) {
					return "68.00";
				} else if (km == 7) {
					return "74.00";
				} else if (km == 8) {
					return "80.00";
				} else if (km == 9) {
					return "88.00";
				} else if (km == 10) {
					return "94.00";
				} else if (km == 11) {
					return "100.00";
				} else if (km == 12) {
					return "106.00";
				} else if (km > 12) {
					var exceededKmComputation = 0;

					Swal.fire('Selected branch does not deliver to your area, please choose a branch closer to you').then(function() {
						window.location = "/location";
					});
					$('#container__plain').html('<div class="text-center mt-5"><h2>Location is not a servicable area. You may click <a href="/location" style="color: #007BF7">here</a> to to choose location.</h2></div>');

					return exceededKmComputation;
				}	
			}
			
		} else if((websiteUrl == "store.maxima.com.ph")) {
		
			var province = $('.checkout-form .state-input').val();
			var weight = $("#partialCartListing tr:last-of-type .text-center.align-middle:contains(kg)").text().trim().slice(0, -3);
	
			var defaultManilaPrice = 1000;
			var defaultProvincialPrice = 5000;
			var manilaPrice = 40 * weight * km;
			var provincialPrice = 20 * weight * km;
	
			if(province == "") {
				return 0;
			}
	
			else if(province == "METRO MANILA")
			{
				if(defaultManilaPrice >= manilaPrice) {
					return defaultManilaPrice;
				}
				else if (defaultManilaPrice < manilaPrice) {
					return manilaPrice;
				}
			}
	
			else if(province !== "METRO MANILA") {
				if(defaultProvincialPrice >= provincialPrice) {
					return defaultProvincialPrice;
				}
				else if (defaultProvincialPrice < provincialPrice) {
					return provincialPrice;
				}
			}
	
			else
				return defaultManilaPrice;	
		} else {
			if(km == 1) {
				return "81.16";
			} else if (km == 2) {
				return "90.12";
			} else if (km == 3) {
				return "99.08";
			} else if (km == 4) {
				return "108.04";
			} else if (km == 5) {
				return "117.00";
			} else if (km == 6) {
				return "125.96";
			} else if (km == 7) {
				return "134.92";
			} else if (km == 8) {
				return "143.88";
			} else if (km == 9) {
				return "152.84";
			} else if (km == 10) {
				return "161.80";
			} else if (km == 11) {
				return "170.76";
			} else if (km == 12) {
				return "179.72";
			} else if (km == 13) {
				return "188.68";
			} else if (km == 14) {
				return "197.64";
			} else if (km == 15) {
				return "206.60";
			} else if (km == 16) {
				return "215.56";
			} else if (km == 17) {
				return "224.52";
			} else if (km == 18) {
				return "233.48";
			} else if (km == 19) {
				return "242.44";
			} else if (km == 20) {
				return "251.40";
			} else if (km == 21) {
				return "260.36";
			} else if (km == 22) {
				return "269.32";
			} else if (km == 23) {
				return "278.28";
			} else if (km == 24) {
				return "287.24";
			} else if (km > 24) {
				var exceededKm = km - 24;
				var exceededKmComputation = 8.96 * exceededKm + 287.24;
				return exceededKmComputation;
			}
		}
	} else {
		console.log("Computation is from the backend");
		var kmComputationFromApi = $.ajax({
			url: '/api/get-shipping-rates',
			type: "get",
			dataType: "json",
			global: false,
			async:false,
			data: {
				km: km
			},
			success:function(data) {
				return data;
			}
		}).responseText;
		return JSON.parse(kmComputationFromApi).final_rate;
	}
}
function round(value, decimals) {
    return Number(Math.round(value +'e'+ decimals) +'e-'+ decimals).toFixed(decimals);
}

function googleMatrixAjax(latLonObject) {
	$.ajax({
		url: '/api/gmail-distance-matrix',
		type: "get",
		dataType: "json",
		data: {
			latLonData: latLonObject
		},
		success:function(data) {
			//Check if delivery option is enabled
			let payment_options_exists = document.getElementById("payment_options")
			let payment_gateway_type = $("[name=payment_gateway_type]:checked").val()
			
			if(payment_options_exists) { //Check if payment option is enabled
				if(payment_gateway_type === undefined) { //check if payment gateway is selected
					$.oc.flashMsg({text: 'Please select picku-up type', 'class': 'error'});
					return; //do nothing
				} else if (payment_gateway_type === 'pickup_option') {
					return;
				}
			}

			var kmvalue = data.rows[0].elements[0].distance.text;
            if(kmvalue.indexOf('km') > -1){
                var finalKm = parseFloat(kmvalue);
            }else if(kmvalue.indexOf('m') > -1){ //if distance matrix's response is in meters divide by 1000, hence: 1km = 1000m
                var finalKm = parseFloat(kmvalue)/1000;
            }

            var ceilFinalKm = Math.ceil(finalKm);
			var shippingFee = round(lalamoveComputation(ceilFinalKm), 2);

			var freeShippingPromotionSwitch = $(".shipping-promo-amount-div").length;
			
			if(freeShippingPromotionSwitch == 1) {
				var gotFreeShipping = $(".shipping-promo-amount-div p").attr("data-free-shipping");

				if(gotFreeShipping == "true") {
					$("#shipping_fee_by_kilometer").val("0");
				} else {
					$("#shipping_fee_by_kilometer").val(shippingFee);
				}
			} else {
				$("#shipping_fee_by_kilometer").val(shippingFee);
				console.log(ceilFinalKm, shippingFee);
			}

			var $promoCode = $('#promoCode .code-value').val();
			var $promoType = $('#promoCode .code-type').val();
			var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
			var $city = $('.checkout-form .city-input').val();
			var $barangay = $('.checkout-form .barangay-input').val();
			var $province = $('.checkout-form .state-input').val();
			var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
			var $address = $('.checkout-form .address-input').val();

			$.request('onGettingShippingCostKilometer', {
				data: {
					shipping_fee: shippingFee,
					promoCode: $promoCode,
					promoType: $promoType,
					payment_type: $payment_type,
					final_kilometer: ceilFinalKm,
					store_pick: store_pick,
					payment_gateway_type: payment_gateway_type
				},complete: function(){
                    onGettingShippingCostKilometerCompleted = true;
				}
			});

			$.request('onGettingCashOnDeliveryFee', {
				data: {
					city: $city,
					barangay: $barangay,
					province: $province,
					payment_type: $payment_type,
					shipping_fee: shippingFee,
					store_pick: store_pick,
					address: $address,
					payment_gateway_type: payment_gateway_type
				},complete: function(){
                    onGettingCashOnDeliveryFeeCompleted = true;
				}
			});
		}
	})
}

function lalamoveGetQuotationAjax(latLonObject, successCallback) {
	const defaultSuccessCallback = function(data){
        if(data.message == "ERR_REQUIRED_FIELD" || data.message == "ERR_INVALID_PHONE_NUMBER") {
            $.oc.flashMsg({text: 'Please complete all the fields and input a correct phone number', 'class': 'error'});
        }else {
            var shippingFee = data.data.priceBreakdown.total;
            var $promoCode = $('#promoCode .code-value').val();
            var $promoType = $('#promoCode .code-type').val();
            var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
            var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
            var ceilFinalKm = 0;
            var $city = $('.checkout-form .city-input').val();
            var $barangay = $('.checkout-form .barangay-input').val();
            var $province = $('.checkout-form .state-input').val();
            var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
            var $address = $('.checkout-form .address-input').val();


			if($(".sewn-sandal-custom-shipping-logic-switch").val() == true && $(".delivery-preference").val() == "later") {
				sewnSandalsShippingLogic();
			} else {
				var shippingFee = data.data.priceBreakdown.total;
				var $promoCode = $('#promoCode .code-value').val();
				var $promoType = $('#promoCode .code-type').val();
				var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
				var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
				var ceilFinalKm = 0;
				var $city = $('.checkout-form .city-input').val();
				var $barangay = $('.checkout-form .barangay-input').val();
				var $province = $('.checkout-form .state-input').val();
				var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
				var $address = $('.checkout-form .address-input').val();

				$("#shipping_fee_by_kilometer").val(shippingFee);
				$.request('onGettingShippingCostKilometer', {
					data: {
						shipping_fee: shippingFee,
						promoCode: $promoCode,
						promoType: $promoType,
						payment_type: $payment_type,
						final_kilometer: ceilFinalKm,
						store_pick: store_pick,
						payment_gateway_type: payment_gateway_type
					}, complete: function(){
                        onGettingShippingCostKilometerCompleted = true;
					}
				});

				$.request('onGettingCashOnDeliveryFee', {
					data: {
						city: $city,
						barangay: $barangay,
						province: $province,
						payment_type: $payment_type,
						shipping_fee: shippingFee,
						store_pick: store_pick,
						address: $address,
						payment_gateway_type: payment_gateway_type
					},complete: function(){
                        onGettingCashOnDeliveryFeeCompleted = true;
                    }
				});
			}
        }
	};

	var successCallback = successCallback || defaultSuccessCallback;

	$.ajax({
		url: 'api/lalamove-get-qoutation',
		type: "get",
		dataType: "json",
		data: {
			latLonData: latLonObject
		},
		success: function(data) {
			successCallback(data);
			if(data.data.expiresAt !== undefined){
				$('#lalamove_expiration').val(data.data.expiresAt);
			}
		}
	})
}

function initiateSlickOnDiscountedProducts() {
	$('.discounted-products-promo').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 4,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
}

function removeUrlParameter() {
	var href = location.href;
	var pathName = window.location.pathname;

	if(pathName == '/products') {
		window.history.pushState('page', 'Title', location.protocol + '//' + location.host + location.pathname);
	}
}

function addListenerToCategory() {
	$(document).on("click", ".category-title, .sub-category-title", function(){
		$(this).prev().click();

		var highlightSubCategorySwitch = $("#highlight_all_sub_category").val();
		if(highlightSubCategorySwitch == 1) {
			$("[data-parent-category='"+ $(this).attr("data-category") +"'] input").click();
			$("[data-parent-category='"+ $(this).attr("data-category") +"']").next(".subsub").find("input").click();
		}

	});
}
            
// function saveTotalPrice(){
// 	$(".proceed-div-btn").click(function() {
// 		console.log( "Handler for .click() called." );
		
// 		var sum = 0;
		
//         $(".cart-total.text-center.align-middle").each(function( index ) {
//             var text =  $( this ).text().replace(/Php /g,'').replace(/,/g, '');
//             sum += Number(text);
//         });
//         // save total computed on local storage
//         localStorage.setItem("conversion", sum);
		
//    });
// }
function saveTotalPrice(){
	$(".proceed-div-btn, .paymongo-wrap").click(function() {
	
		var sum = 0;
		
		$(".cart-total.text-center.align-middle").each(function( index ) {
			var text =  $( this ).text().replace(/Php /g,'').replace(/,/g, '');
			sum += Number(text);
		});
		// save total computed on local storage
		localStorage.setItem("conversion", sum);

		var fName = $(".fname-input").val();
		var lName = $(".lname-input").val();

		// push product title into an array
		var products = [];

		$(".cart-content h4 a").each(function(){
			// save product title
			products.push($(this).text());

			var uniqueId = fName + ' ' + lName  + ' - '+ products.toString() + ' ('+ new Date().getTime().toString() + ')';
			localStorage.setItem("orderId", uniqueId);

		})
	});
	
}

function sliderPartner(){
	$('.partnerSlider').slick({
		dots: true,
		speed: 300,
		infinite:true,
		slidesToShow: 1,
		slidesToScroll:1,
		centerMode: true,
		variableWidth: true,
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 480,
				settings: {
					arrows:false,
					autoplay: true,
  					autoplaySpeed: 2000
				}
			}
		]
	});
}

function maximaChanges() {
	var websiteUrl = window.location.hostname;

	if(websiteUrl == "store.maxima.com.ph") {
		$(".price-label").hide();
		$(".price-range").hide();
		$(".sort-by-div").hide();
	}
}

function executionListener () {
	//Only for PJL
	if(window.location.href.includes("/products")) {
		$.request('onCheckingPJL', {
			success: function(data) {
				if(data['result']) {
					if (localStorage.hasOwnProperty("modal_city")) {
						if($('[name="Filter[city]"] > option').length > 1) {
							//console.log(localStorage.getItem('modal_city'));
							$('[name="Filter[city]"]').val(localStorage.getItem('modal_city'));
							$('[name="Filter[city]"]').trigger("change");
							localStorage.removeItem('modal_city');
						}
						else
						{
							setTimeout(executionListener, 1000);
						}
					}
				}
			}
		});
	}
}

function categoryAccordionFunction() {
	const accordionAdminSwitch = document.getElementById('product_category_accordion_switch')

	if (accordionAdminSwitch && accordionAdminSwitch.value == 1) {

		const parentCategories = Array.from(document.getElementsByClassName('parent'))
		parentCategories.forEach(parentCategoryElement => {
			parentCategoryElement.classList.add('parent-plus')
			changeAccordionElementDisplay(parentCategoryElement.nextElementSibling, "none")

			parentCategoryElement.onclick = function(event) {
				// it's just itself
				const element = event.target
				if (element.classList.contains('parent-plus')) {
					element.classList.remove('parent-plus')
					element.classList.add('parent-minus')
					changeAccordionElementDisplay(parentCategoryElement.nextElementSibling, "block")
				} else if (element.classList.contains('parent-minus')) {
					element.classList.remove('parent-minus')
					element.classList.add('parent-plus')
					changeAccordionElementDisplay(parentCategoryElement.nextElementSibling, "none")
				}
			}
		})
	}
}

// Private helper function for categoryAccordionFunction
function changeAccordionElementDisplay(_subCategoryElement, display) {
	let subCategoryElement = _subCategoryElement
	while(subCategoryElement && (subCategoryElement.classList.contains('sub') || subCategoryElement.classList.contains('subsub'))) {
		subCategoryElement.style.display = display
		subCategoryElement = subCategoryElement.nextElementSibling
	}
}

function setPhoneStaticText() {
	$('.logout-user #cart__table .form-control.phone-input').keyup(function(e) {  //for guest only
		if (this.value.length < 3) {
		  this.value = '+63';
		} else if (this.value.indexOf('+63') !== 0) {
		  this.value = '+63' + String.fromCharCode(e.which);
		}
	});
}

function checkoutListener () {
	$('input:radio[name="store_pick"]').click(
		function(){
		if ($(this).is(':checked')) {
			var $city = $('.checkout-form .city-input').val();
			var $barangay = $('.checkout-form .barangay-input').val();
			var $address = $('.checkout-form .address-input').val();
			var $promoCode = $('#promoCode .code-value').val();
			var $promoType = $('#promoCode .code-type').val();
			var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
			var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
			var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
			var $province = $('.checkout-form .state-input').val();
			var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
			var customer_lat = $("#latInput").val();
			var customer_long = $("#lngInput").val();
			$('input:text[name="voucher"]').val("").text("");
			$.request('onGettingShippingCost', {
				data: {
					city: $city,
					barangay: $barangay,
					province: $province,
					promoCode: undefined,
					promoType: undefined,
					payment_type: $payment_type,
					store_pick: store_pick,
					address: $address,
					reset_ship_price: 1,
					lat: customer_lat,
					long: customer_long,
					payment_gateway_type: payment_gateway_type
				},complete: function(){
					onGettingShippingCostCompleted = true;
				}
			});
		}
	});
}

function executeFreeShippingPromo() {
	var lastUriSegment = window.location.pathname.split("/").pop();

	if(lastUriSegment == "checkout") {
		var $city = $('.checkout-form .city-input').val();
		var $barangay = $('.checkout-form .barangay-input').val();
		var $address = $('.checkout-form .address-input').val();
		var $promoCode = $('#promoCode .code-value').val();
		var $promoType = $('#promoCode .code-type').val();
		var $payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		var $shippingFeeIsEnabled = $('.shippingFeeIsEnabled').val();
		var $province = $('.checkout-form .state-input').val();
		var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
		var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
		var shippingPromotionAmountSwitch = $('#shipping_promotion_amount_switch').val();

		$('input:text[name="voucher"]').val("").text("");

		if(shippingPromotionAmountSwitch == 1) {

			$.request('onGettingFreeShippingFee', {
				data: {
					city: $city,
					barangay: $barangay,
					province: $province,
					promoCode: undefined,
					promoType: undefined,
					payment_type: $payment_type,
					store_pick: store_pick,
					address: $address,
					reset_ship_price: 1,
					payment_gateway_type: payment_gateway_type
				},
			});
		}
	}
}
function xZoom() {
	$(".xzoom,.xzoom-gallery").xzoom({
		tint: '#000',
		tintOpacity: 0.3,
		lensOpacity: 0.3
	});
};

function userInfoValidation() {
	$("a:contains(Confirm Order)").click(function(){
        
		$( "input[required], textarea" ).each(function() {
		  if( !$(this).val()) 
			 $(this).css("border-color", "#DA4A59");
		  else
			 $(this).css("border-color", "#CED4DA");
		});
		
		
		$("input[required], textarea").blur(function(){
		  if( !$(this).val() ) 
			 $(this).css("border-color", "#DA4A59");
		  else
			 $(this).css("border-color", "#CED4DA");   
	   });
		
		if($( ".state-input" ).val() == "")
			$('.state-input').attr('style', 'border: 1px solid #DA4A59;');
	
		
		if($( ".city-input" ).val() == "")
			$('.city-input').attr('style', 'border: 1px solid #DA4A59;');
	
		
		if($(".barangay-input").val() == "")
			$('.barangay-input').attr('style', 'border: 1px solid #DA4A59;');
	
	   
		$(".state-input").blur(function(){
		  if( !$(this).val() ) 
			 $(this).css("border-color", "#DA4A59");
		  else
			 $(this).css("border-color", "#CED4DA");   
	   });
	   
	   $(".city-input").blur(function(){
		  if( !$(this).val() ) 
			 $(this).css("border-color", "#DA4A59");
		  else
			 $(this).css("border-color", "#CED4DA");   
	   });
	   
	   $(".barangay-input").blur(function(){
		  if( !$(this).val() ) 
			 $(this).css("border-color", "#DA4A59");
		  else
			 $(this).css("border-color", "#CED4DA");   
	   });
	   
	   $(".grand-total textarea.form-control.address-input.mb-3").attr("style", "border: 1px solid #ced4da !important;");
	   $(".landmark-input").attr("style", "border: 1px solid #ced4da !important;");
	   $(".remarks-input").attr("style", "border: 1px solid #ced4da !important;");	
	});
}
function cleanBeautyBannerSliderSlick(){
	$('.banner-slick-slider').slick({
		arrows: false,
		dots:true
	});
}
function cleanBeautyTestiSlider(){
  $('.testi-slick').slick({
    slidesToShow: 3,
	slidesToScroll: 1,
	autoplay: true,
	arrows:false,
	autoplaySpeed: 2000,
	responsive: [
		{
		  breakpoint: 990,
		  settings: {
			centerMode: true,
			slidesToShow: 1
		  }
		}
	  ]
  });
}
function checkIfTapfiliatePresent() {

	var pattern = /[?&]ref=/;
	var URL = location.search;

	if(pattern.test(URL)) {
		localStorage.setItem("tapfiliate", true);		
	}
}

function checkIfTapfiliatePresentStorage() {
	var tapfiliate = localStorage.getItem("tapfiliate");

	if(tapfiliate) {
		console.log("Tapfiliate present");
		$(".promocode ").hide();
	}
}

/**
 * Order Summary
 * - Store Pickup
 * - Delivery
 */
let delivery_options = null; //Global
function paymentOnChangeDeliveryOpt() {
	$('input[type=radio][name=payment_gateway_type]').change(function() {

			//Reset Payment Extension Fields
			$( ".store-pickup-btn" ).hide(); //Show
			$( ".cod-btn" ).hide();
			$( ".paypal-btn" ).hide();
			$( ".stripe-btn" ).hide();
			$( ".coins-btn" ).hide();
			$( ".paymongo-btn" ).hide();
			$( ".bank-btn" ).hide();
			$( ".dragonpay-btn" ).hide();
			$( ".paymaya-btn" ).hide();
			$( ".lbc-btn" ).hide();
			$( ".form-check.lbc" ).hide();
			$( ".gcash-paymongo-btn" ).hide();
			$( ".gcash-direct-btn" ).hide();
			$(".cash-delivery-fee-div").hide();
			$(".xendit-btn").hide();
			$(".we-chat-aub-pay-btn").hide();
			$(".bux-btn").hide();
			$(".xendit-direct-btn").hide();

		delivery_options = $(this).val();
		$.request('onGetPaymentOptions', {
			data: {
				payment_option: delivery_options
			}
		}).done(() => {
			// $('input[type=radio][name=payment_gateway]')[0].checked = true
			// $('input[type=radio][name=payment_gateway]').trigger('change');
		});
		
		//Get payment types
		if(delivery_options === 'pickup_option') {
			let city = $('.checkout-form .city-input').val();
			let barangay = $('.checkout-form .barangay-input').val();
			let address = $('.checkout-form .address-input').val();
			let promoCode = $('#promoCode .code-value').val();
			let promoType = $('#promoCode .code-type').val();
			let province = $('.checkout-form .state-input').val();
			let payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
			let store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();

			$.request('onGettingShippingCost', {
				data: {
					
					city: city,
					barangay: barangay,
					province: province,
					promoCode: undefined,
					promoType: undefined,
					payment_type: payment_type,
					store_pick: store_pick,
					address: address,
					reset_ship_price: 1
				},complete: function(){
					onGettingShippingCostCompleted = true;
				}
			});
		} 
		else {
			onDropPin($("#latInput").val(), $("#lngInput").val());
		}
	})
}

function categorySelect() {
	$('#searchFilterCategory').on('change', function () {
		if ($(this).val() == "") {
			window.location.href = "/blog";
		} else {
			window.location.href = "/blog/category?categ=" + $(this).val();
		}
	});
}

/**
 * Payment Options
 */
function paymentOptiobsOnChange() {
	$(document).on("change", "input[type=radio][name=payment_gateway]", function () {
		//Input fields here
		let city = $('.checkout-form .city-input').val();
		let barangay = $('.checkout-form .barangay-input').val();
		let address = $('.checkout-form .address-input').val();
		let promoCode = $('#promoCode .code-value').val();
		let promoType = $('#promoCode .code-type').val();
		let province = $('.checkout-form .state-input').val();
		let payment_type = $('input[type=radio][name=payment_gateway]:checked').val();
		
		//Miltiple store selection
		let store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();

		//If pick-up option no shipping fee
		if(delivery_options == "pickup_option") {
			
		} else {
			
		}
	});
}

function onSettingOrderingScheduleBlockHours() {
	$(window).on('load', function() {
		if ($('#orderSchedOpen').val() &&  $('#orderSchedClose').val()) {
			$.request('onSettingOrderingScheduleBlockHours',{
                success: function(data) {
					console.log(data);
                    $('#orderSchedSwitch').val(data["switch"]);
                    if(data["open"] !== null) {
                        var openHouse = moment().format("Y-M-D") + " " + data["open"].split(" ")[1];
                        $('#orderSchedOpen').val(openHouse);
                    }
                    if(data["close"] !== null) {
                        var closeHours = moment().format("Y-M-D") + " " + data["close"].split(" ")[1];
                        $('#orderSchedClose').val(closeHours);
                    }
                }
            })
		}
	});
}

function convertTimeFron24To12(time) {
	if(time == null || time == '') {
		return '';
	}
	time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];


	if (time.length > 1) { // If time format correct
		time.pop();
		time = time.slice (1);  // Remove full string match value
		time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join (''); // return adjusted time or original string
}

function unsetRelatedCategories(node) {
	descelectChildCategories(node)
	deselectParentCategories(node)
}

function deselectParentCategories(node) {
	const identifier = node.dataset.parentCategory
	if (identifier) {
		const categoryContainer = document.querySelector(`div[data-category="${identifier}"]`)

		// remove all parent checks
		Array.from(categoryContainer.querySelectorAll('input[type="checkbox"]')).forEach(input => {
			if (input.dataset.parentCategory) {
				deselectParentCategories(input)
			}
			input.checked = false
		})
	}
}

function descelectChildCategories(node) {
	// remove all children checks
	const identifier = node.dataset.category
	if (identifier) {
		Array.from(document.querySelectorAll(`input[data-parent-category="${identifier}"]`)).forEach(input => {
			const childCategories = Array.from(document.querySelectorAll(`input[data-parent-category="${identifier}"]`))
			if (childCategories.length > 0) {
				descelectChildCategories(input)
			}
			input.checked = false
		})
	}
}

function settingNewlyRegCustomerVoucher() {
	if (window.location.href.includes("activate")) {
		$('#signupCouponModal').modal('show');
	}

}

function sendEmailVerifitication () {
	$(document).on("click", ".verify-email-my-account-page", function () {

		var _this = $(this);

		_this.text("Verifying Email...");

		var postData = {
			'user_id': $(this).attr("data-user-id"),
			'email': $(this).attr("data-email"),
			'full_name': $(this).attr("data-full-name")
		};

		$.ajax({
			url: '/api/send-email-verification', 
			type: "post",
			dataType: "json",
			data: {
				postData: postData
			},
			success:function(data) {
				if(data.status == "Email Sent") {
					_this.text("Verify Email");
					$.oc.flashMsg({text: 'An email message has been sent to your email', 'class': 'success', 'interval': 5});
				}
			}
		})
	});

	$(document).on("click", ".verify-email-address-shopping-cart", function() {
		var postData = {
			'user_id': $(this).attr("data-user-id"),
			'email': $(this).attr("data-email"),
			'full_name': $(this).attr("data-full-name")
		};

		$.ajax({
			url: '/api/send-email-verification', 
			type: "post",
			dataType: "json",
			data: {
				postData: postData
			},
			success:function(data) {
				if(data.status == "Email Sent") {
					$.oc.flashMsg({text: 'Email Verification has been sent to your email.', 'class': 'success', 'interval': 5});
				}
			}
		})
	});
}

function triggerNotif() {
	$('#bsalert').fadeIn();
	closeTriggerAlert();
}

function closeTriggerAlert() {
	setTimeout(function(){
		$('#bsalert').fadeOut(), function(){
            $('#bsalert').html('');
        };
	}, 3500);
}

function showHidenPaymentGatewayOnState() {
	var state = $(".state-input").val();
	var hidePaymentIfNotMetroManila = $(".hide-other-payment-method-outside-mm").val();

	if(hidePaymentIfNotMetroManila == true) {
		if(state != "Metro Manila") {
			// Dropdown
			$("select[name='payment_gateway'] option").hide();
			$("select[name='payment_gateway'] option[value='store_pickup']").show();
	
			// Radio
			$("[name=payment_gateway]").parent("div.form-check").hide();
			$("[name=payment_gateway][value='store_pickup']").parent("div.form-check").show();
		}
	}
}

function removeAddToCartHideQtyInput(){
	$('#number-input').hide();
	$('#reserveBtn').removeClass('btn btn-primary add-to-cart');
}

function onReserveProductSuccess(form, context, data){
    if(data.success){
        $('#bsalert').fadeIn();
        closeTriggerAlert();
    }
}

function showPhoneAreaCode() {
	$('.logout-user .personal-info-container input[name="phone"]').val('+63'); //for guest only
    
    $(document).on('keydown', function (e) {
      if (e.keyCode == 8 && $('.personal-info-container input[name="phone"]').is(":focus") && $('.personal-info-container input[name="phone"]').val().length < 4) {
          e.preventDefault();
      }
    });	
}

function sewnSandalsShippingLogic() {
	var deliverPreference = $(".delivery-preference").val();

	if(deliverPreference == "later") {
		setTimeout(function(){

			if($(".state-input").val() == "Metro Manila") {
				var shippingFee = 75;
			} else {
				var shippingFee = 185;
			}

			var $promoCode = $('#promoCode .code-value').val();
			var $promoType = $('#promoCode .code-type').val();
			var $payment_type = $('select[name=payment_gateway]').val() || $('input[name=payment_gateway]:checked').val();
			var payment_gateway_type = $('input[type=radio][name=payment_gateway_type]:checked').val();
			var ceilFinalKm = 0;
			var $city = $('.checkout-form .city-input').val();
			var $barangay = $('.checkout-form .barangay-input').val();
			var $province = $('.checkout-form .state-input').val();
			var store_pick = $('#partialCartListing input[type=radio][name=store_pick]:checked').val();
			var $address = $('.checkout-form .address-input').val();

			$("#shipping_fee_by_kilometer").val(shippingFee);
			$.request('onGettingShippingCostKilometer', {
				data: {
					shipping_fee: shippingFee,
					promoCode: $promoCode,
					promoType: $promoType,
					payment_type: $payment_type,
					final_kilometer: ceilFinalKm,
					store_pick: store_pick,
					payment_gateway_type: payment_gateway_type
				},complete: function(){
                    onGettingShippingCostKilometerCompleted = true;
				}
			});
		}, 3000);
	}
}

function userInputValidation() {
	$("#user_contact").on('keyup', function(event) {
		var contactSignupNumber = $("#user_contact").val();
		if(!contactSignupNumber.match(/^[\+][0-9]{12}/)) {
			$('.update-user button.btn').prop("disabled", true);
			if(contactSignupNumber == ""){
				$("#user_contact").css('background-color','#ffbaba');
				$("#contact_error").html(" ie: +639865432321<i class='fa fa-times-circle float-right inputError' aria-hidden='true'></i>");
				$.oc.flashMsg({text: 'Contact Number must not be empty', 'class': 'error'});
			}else{
				if (!contactSignupNumber.startsWith('+63')) {
					$("#user_contact").css('background-color','#ffbaba');
					$("#contact_error").html(" ie: +639865432321<i class='fa fa-times-circle float-right inputError' aria-hidden='true'></i>");
					$.oc.flashMsg({text: 'Follow format ie: +639865432321', 'class': 'error'});
				}else{
					var substring = contactSignupNumber.substring(3);
					if(isNaN(substring)){
						$("#user_contact").css('background-color','#ffbaba');
						$("#contact_error").html(" ie: +639865432321<i class='fa fa-times-circle float-right inputError' aria-hidden='true'></i>");
						$.oc.flashMsg({text: 'Follow format ie: +639865432321', 'class': 'error'});
					}else {
						if(substring.length <= 9) {
							$("#user_contact").css('background-color','#ffbaba');
							$("#contact_error").html(" ie: +639865432321<i class='fa fa-times-circle float-right inputError' aria-hidden='true'></i>");
							$.oc.flashMsg({text: 'Contact number cannot be less than 13', 'class': 'error'});
						}
					}
				}
			}
		}else{
			$('.update-user button.btn').prop("disabled", false);
			$.oc.flashMsg({text: 'Please click submit to save contact number', 'class': 'success'});
			$("#user_contact").css('background-color','#fff');
			$("#contact_error").html(" ie: +639865432321<i class='fa fa-check-circle float-right inputCorrect' aria-hidden='true'></i>");
		}
	});
}
function showHideLoginModal() {
	$( "#signupRedirect" ).click(function() {
		$( "#loginForm" ).hide();
		$( "#signupForm" ).show();
	});
	
	$( "#loginRedirect" ).click(function() {
		$( "#signupForm" ).hide();
		$( "#loginForm" ).show();
	});

	$('#signupModal').on('hidden.bs.modal', function (e) {
		$( "#signupForm" ).hide();
		$( "#loginForm" ).show();
	});
	
	
	$("#signupRedirect").on('click', function(event) {
		$( "#signupModal .inputGuide" ).html("");
		//$("#signupModal input:not(#registerSurname, #registerName)").on('keyup', function(event) {
		$("#signupModal input").on('keyup', function(event) {
			/** password validation **/
			var password = $("#registerPassword").val();
			var confirmPassword = $("#confirmPassword").val();
			if (password.length <= 8) {
				$("#password_error").html("Must be more than 8 characters");
				$("#registerPassword").addClass("inputError");
			}else{
				$("#confirm_password_error, #password_error").html("");
				$("#registerPassword").removeClass("inputError");
				if (confirmPassword == "") {
					$("#confirm_password_error").html("Password does not match");
					$("#confirmPassword").addClass("inputError");
					$('#signupForm button.btn').prop("disabled", true);
				}
				else {
					if (password != confirmPassword) {
						$("#confirm_password_error").html("Password does not match");
						$("#confirmPassword").addClass("inputError");
						$('#signupForm button.btn').prop("disabled", true);
					}else {
						$("#confirm_password_error, #password_error").html("");
						$("#confirmPassword, #registerPassword").removeClass("inputError");
						$('#signupForm button.btn').prop("disabled", false);
					}
				} 
			}
			/** contact number register validation **/
			var contactSignupNumber = $("#registerContact").val();
			if(!contactSignupNumber.match(/^[\+][0-9]{12}/)) {
				$('#signupForm button.btn').prop("disabled", true);
				if(contactSignupNumber == ""){
					$("#registerContact").addClass("inputError");
					$("#contact_error").html(" ie: +639865432321");
				}else{
					if (!contactSignupNumber.startsWith('+63')) {
						$("#registerContact").addClass("inputError");
						$("#contact_error").html(" ie: +639865432321");
					}else{
						var substring = contactSignupNumber.substring(3);
						if((isNaN(substring)) && (contactSignupNumber != "")){
							$("#registerContact").addClass("inputError");
							$("#contact_error").html(" ie: +639865432321");
						}else {
							if((substring.length <= 9) && (substring.length >= 1)) {
								$("#registerContact").addClass("inputError");
								$("#contact_error").html(" ie: +639865432321");
							}else{
								$(".input-registerContact").html("");
								$("#registerContact").removeClass("inputError");
							}
						}
					}
				}
			}else{
				$('.update-signupForm button.btn').prop("disabled", false);
				$("#contact_error").html("");
				$("#registerContact").removeClass("inputError");
			}
			/* email address register valdiation */
			var mail = document.getElementById('registerEmail').value;
			var email = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
			if(mail.match(email)){
				$("#registerEmail").removeClass("inputError");
				$("#email_error").html("");
			}else{
				if(mail == ""){
					$("#registerEmail").addClass("inputError");
					$("#email_error").html("Email must not be blank");
				}else if(!mail.match(email)){
					$("#email_error").html("ie: Invalid email format");
					$("#registerEmail").addClass("inputError");
					$('#signupForm button.btn').prop("disabled", true);
					
				}else{
					$("#registerEmail").removeClass("inputError");
					$("#email_error").html("");
					$('#signupForm button.btn').prop("disabled", false);
				}
			}
			
			var firstName = $("#registerName").val();
			var LastName = $("#registerSurname").val();

			if (!firstName.replace(/\s/g, "").length){
					$("#first_name_error").html("First name must not be empty");
					$("#signupModal #registerName").addClass("inputError");
					$('#signupForm button.btn').prop("disabled", true);
			}else{
				$("#first_name_error").html("");
				$("#signupModal #registerName").removeClass("inputError");
				$('#signupForm button.btn').prop("disabled", false);
			}
			if (!LastName.replace(/\s/g, "").length){
				$("#last_name_error").html("Last name must not be empty");
				$("#signupModal #registerSurname").addClass("inputError");
				$('#signupForm button.btn').prop("disabled", true);
			}else{
				$("#last_name_error").html("");
				$("#signupModal #registerSurname").removeClass("inputError");
				$('#signupForm button.btn').prop("disabled", false);
			}

		});
	});
	
}
function deliveryDateOnChange() {
	$('#delivery-date').on('change', function() {
		if(moment($("#delivery-date").val(), "MM/DD/YYYY").format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")){
			// for(var count = 1; count <= 12; count++){
			// 	$(`.hour-select option[value=${count}]`).prop("disabled", false);
			// }
		}else if(moment($("#delivery-date").val(), "MM/DD/YYYY").format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")){
			var hour = moment().format("h");
			//Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
			if($('.hour-select option[value="'+hour+'"]').length < 1){
				hour = $('.hour-select option:nth-child(1)').val();
			}
			hour = parseInt(hour)+1;
			// for(var count = 1; count < hour; count++){
			// 	$(`.hour-select option[value=${count}]`).prop("disabled", true);
			// }
			$(".hour-select").val(hour);
		}
	});
}

function deliveryTimeOnChange() {
	//Included delivery date to correctly compare dates
	$('.dropdown-select-time, #delivery-date').on('change', function() {
		var fullTime = $("#delivery-date").val() +" "+ $(".hour-select").val() + ":" + $(".minutes-select").val() + " " + $(".am-pm-select").val();

		if(moment(fullTime, "MM/DD/YYYY h:mm A").format("YYYY-MM-DD HH:mm") < moment().format("YYYY-MM-DD HH:mm")) {
			$.oc.flashMsg({text: 'You selected a past time of '+ fullTime +'. Returning the value to current time.', 'class': 'error'});

			var hour = moment().format("h");
			var minutes = moment().format("mm");
			var ampm = moment().format("A");

            //Check if minutes is available in the option, if not set to 00 or 30
            if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                minutes = parseInt(minutes) > 30 ? '00' : '30';
            }

            //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
            if($('.hour-select option[value="'+hour+'"]').length < 1){
                hour = $('.hour-select option:nth-child(1)').val();
            }

            $('.minutes-select').val(minutes);
			$(".hour-select").val(hour);
			$(".am-pm-select").val(ampm);

		} else {
			var currentTime30mins =  moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");

			if(moment(fullTime, "MM/DD/YYYY h:mm A").format("YYYY-MM-DD HH:mm") < currentTime30mins) {
				$.oc.flashMsg({text: 'You selected a time of ' + fullTime + ' Please add 30 minutes or up to the current time. Returning the value to current time.', 'class': 'error'});

				var hour = moment().format("h");
				var minutes = moment().format("mm");
				var ampm = moment().format("A");

                //Check if minutes is available in the option, if not set to 00 or 30
                if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                    minutes = parseInt(minutes) > 30 ? '00' : '30';
                }

                //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
                if($('.hour-select option[value="'+hour+'"]').length < 1){
                    hour = $('.hour-select option:nth-child(1)').val();
                }

                $('.minutes-select').val(minutes);
				$(".hour-select").val(hour);
				$(".am-pm-select").val(ampm);
			}
		}
	});
}

function showPromotionAnnouncementModal() {
	$("#upsell-marketing-promotion-modal").modal("show");
	$("#upsell-marketing-announcement-modal").modal("show");
}

function dedicationMsg(){
	const dedication_limit = $('span#dedication-limit').text() * 1;
	$('textarea#dedication_msg').on('keyup', function(){
		var dedication_input = $(this).val();
		if(dedication_input.length > dedication_limit){ //If dedication length is greater than limit
            $(this).val( ($(this).val()).slice(0, dedication_limit - dedication_input.length ) ); //Remove extra texts
		}

		var remaining = dedication_limit - dedication_input.length;
		$('span#dedication-limit').text( (remaining >= 0 ? remaining : 0) ); //Do not show negative value
	});
}

function displayRequestQuotationMessage() {
    var currenturl = window.location.hostname;
    if(currenturl == "hornedelephant61669e91b8b49.prosperna.ph"){//custom for Golfcarts.ph
        $( ".requestQuotation" ).bind( "click", function() {
    	    var customMessage = "Hi, I'd like to request a quotation for " +  $(this).attr('data-name');
    		localStorage.setItem('message', customMessage);
    		localStorage.setItem('subject', 'Request for Quotation');
    	});

    	$(document).ajaxComplete(function() {
    		$( ".requestQuotation" ).bind( "click", function() {
    			localStorage.setItem('message', customMessage);
    			localStorage.setItem('subject', 'Request for Quotation');
    		});
    	});

    	if(window.location.pathname == "/contact-us") {
    		$('[name="subject"]').val(localStorage.getItem('subject'));
    		$('.message-text').text(localStorage.getItem('message'));
    		$('button:contains("Submit")').text('Request a Quotation');
    		localStorage.removeItem('message');
    		localStorage.removeItem('subject');
    	}
    }else{//default
        $( ".requestQuotation" ).bind( "click", function() {
    		localStorage.setItem('message', $(this).attr('data-name'));
    		localStorage.setItem('subject', 'Request for Quotation');
    	});
    
    	$(document).ajaxComplete(function() {
    		$( ".requestQuotation" ).bind( "click", function() {
    			localStorage.setItem('message', $(this).attr('data-name'));
    			localStorage.setItem('subject', 'Request for Quotation');
    		});
    	});
    
    	if(window.location.pathname == "/contact-us") {
    		$('[name="subject"]').val(localStorage.getItem('subject'));
    		$('.message-text').text(localStorage.getItem('message'));
    		localStorage.removeItem('message');
    		localStorage.removeItem('subject');
	    }
    }
}

function changeMapSearchPosition() {
	$('.use-current-location').appendTo('.leaflet-touch .geocoder-control');
	$('.leaflet-touch .geocoder-control-input').insertAfter('.lolat-wrap label:contains(Search location)');
	$('.leaflet-touch .geocoder-control-suggestions').insertAfter('.geocoder-control-input');
}

function buyNowDirect() {
	$(document).on("click", ".buy-now-directly", function() {

		let productId = $(this).attr("data-id");
		let storeId = $(this).attr("data-store");

		$.request('onBuyNowDirect', {
			data: {
				product_id: productId,
				store_id : storeId
			}
		});
	});
}

function buyNowDirectSingleProductPage() {
	$(document).on("click", ".buy-now-btn-single-product-page", function() {

		let productId = $(this).attr("data-product-id");
		let variantId = $(this).attr("data-variant-id");
		let storeId = $(this).attr("data-store-id");
		let qtyOrdered = $("#number-input").val();

		const color = $('input.colorInput').val();
		const size = $('input.sizeInput').val();
		const type = $('input.typeInput').val();
		const type2 = $('input.typeInput2').val();
		const type3 = $('input.typeInput3').val();

		var addons_id = $.map($('.addon-item .displayed-addon-ids:checked'), function(c){return c.value; });
		// addon ids must be unique!
		var unique_addon_ids = [];
		$.each(addons_id, function(i, el){
			if($.inArray(el, unique_addon_ids) === -1) unique_addon_ids.push(el);
		});
		var addons_qty = $.map($('.addon-item .displayed-addon-qty'), function(c){return c.value; });
		var addons_qty_filter = addons_qty.filter(function(v){return v!==''});

		$.request('onBuyNowDirectSingleProductPage', {
			data: {
				product_id: productId,
				variant_id: variantId,
				color: color,
				size: size,
				type: type,
				type2: type2,
				type3: type3,
				store_id : storeId,
				qtyOrdered: qtyOrdered,
				promo: $('input.promo-add').val(),
				addons_id: unique_addon_ids,
				addons_qty: addons_qty_filter
			}
		});
	});
}

function newCustomerEmailNotif() {
	$.request('onRegisterNotifForAdmin');
}

function checkIfDeliveryTimeIsMoreThan30Mins(currentlySelectedTime) {
	var fullTime = currentlySelectedTime;

	if(moment(fullTime, "MM/DD/YYYY h:mm A").format("YYYY-MM-DD HH:mm") < moment().format("YYYY-MM-DD HH:mm")) {
		$.oc.flashMsg({text: 'You selected a past time of '+ fullTime +'. Returning the value to current time.', 'class': 'error'});

		var hour = moment().format("h");
		var minutes = moment().format("mm");
		var ampm = moment().format("A");

        //Check if minutes is available in the option, if not set to 00 or 30
        if($('.minutes-select option[value="'+minutes+'"]').length < 1){
            minutes = parseInt(minutes) > 30 ? '00' : '30';
        }

        //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
        if($('.hour-select option[value="'+hour+'"]').length < 1){
            hour = $('.hour-select option:nth-child(1)').val();
        }

        $('.minutes-select').val(minutes);
		$(".hour-select").val(hour);
		$(".am-pm-select").val(ampm);

		return false;

	} else {
		var currentTime30mins =  moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");

		if(moment(fullTime, "MM/DD/YYYY h:mm A").format("YYYY-MM-DD HH:mm") < currentTime30mins) {
			$.oc.flashMsg({text: 'You selected a time of ' + fullTime + ' Please add 30 minutes or up to the current time. Returning the value to current time.', 'class': 'error'});

			var hour = moment().format("h");
			var minutes = moment().format("mm");
			var ampm = moment().format("A");

            //Check if minutes is available in the option, if not set to 00 or 30
            if($('.minutes-select option[value="'+minutes+'"]').length < 1){
                minutes = parseInt(minutes) > 30 ? '00' : '30';
            }

            //Check if hour is available in the option, if not set to 1st option (for Clients with custom hour options)
            if($('.hour-select option[value="'+hour+'"]').length < 1){
                hour = $('.hour-select option:nth-child(1)').val();
            }

            $('.minutes-select').val(minutes);
			$(".hour-select").val(hour);
			$(".am-pm-select").val(ampm);

			return false;
		}
	}

	return true;
}

function validateImage() {
	$('.image-attachment-div button').on( "click", function() {
		if($('input[name="bankreceipt"]').val() === '') {
			$('#bsalert').fadeIn();	
			$('#bsalert').css('background-color', 'red');	
			$('#bsalert').html('Please choose a file');
			
			setTimeout(function(){
				$('#bsalert').fadeOut(), function(){
					$('#bsalert').css('background-color', 'rgb(46, 204, 113)');
					$('#bsalert').html('');
				};
			}, 3500);

			return false;
		} else {
			$('#bsalert').fadeIn();	
			$('#bsalert').css('background-color', 'rgb(46, 204, 113)');	
			$('#bsalert').html('Image uploaded successfully');

			setTimeout(function(){
				$('#bsalert').fadeOut(), function(){
					$('#bsalert').html('');
				};
			}, 3500);
		}	
	});

	$('.image-attachment-div [name="bankreceipt"]').change(function () {
        var fileExtension = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            $.oc.flashMsg({text: 'Upload Error: Invalid File Format', 'class': 'error', 'interval': 8});
            $('[name="bankreceipt"]').val(null);
        }
    });
}

function initSlickOnBrandListing() {
	if($('#brand__listing div').hasClass('slick-brands')){
		$('.slick-brands').slick({
			arrows: true,
			infinite: true,
			speed: 1000,
			autoplay: true,
			autoplaySpeed: 5000,
			slidesToShow: 4,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 900,
					arrows: true,
					settings: {
						infinite: true,
						speed: 1000,
					}
				},
				{
					breakpoint: 500,
					arrows: true,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					}
				},
				{
					breakpoint: 370,
					arrows: true,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				}
			]
		});
	}
}
function resetCustomerLatLng(){ //Force user to pin map when visiting information and shipping page (MS-4532)
    if(window.location.pathname == "/information-and-shipping"){
        $("#latInput").val("");
        $("#lngInput").val("");
    }
}

function uploadImageOnChange() {
	$(document).on("change", ".image-attachment-div input[type=file]", function () {

		const fileSizeLimit = 25000000;

		if ($(this)[0].files[0].size > fileSizeLimit) {
			$.oc.flashMsg({text: 'Upload Error: Maximum file upload is 25mb', 'class': 'error', 'interval': 8});
			$('[name="bankreceipt"]').val(null);
			return;
		}

		if ($(this)[0].files.length > 0) {
			setTimeout(function() {
				$("#bank-transfer-submit-image").click();
			}, 1500)
		}
	})
}

function addEventToBankTransferConfirm() {
	$(document).on("click", ".bank-details-page .confirm", function () {
		if ($(".img-uploaded").length > 0) {
			$.request('onPressConfirmBankTransfer', {
				data: {
					order_id: $("#hid-order-id").val(),
				},
			});
		}
	});
}

function addEventOnBankTransferSkip() {
	$(document).on("click", ".bank-details-page .skip", function () {
		window.location.href = "/bank-transfer-skip";
	});
}

function hideMapWhenStoreGeolocationIsOn() {
	if ($("#store_geolocation_switch").val() == 1) {
		console.log("Store Geolocation ON. Hide Map");
		$(".other-info-container").hide();

		$('#info_container__plain input[name="lat"]').val(localStorage.getItem("lat_store_geolocation"));
		$('#info_container__plain input[name="long"]').val(localStorage.getItem("long_store_geolocation"));
	}
}
function showModalAlert(validation) {
	if (validation === '1') {
		$('.cart-validation-message').show();
		$('.checkout-error-message').hide();
		if(!$('.cart-container-drop').hasClass('active')) {
			if ($('.invalid-cart-prod'.length)) {
				let listString = '';
				let ctr = 1;
				$('.invalid-cart-prod').each(function() {
					let state = $(this).data('prod-state');
					let style = 'display: none';
					listString += '<li style="'+(state === "DELETED" ? style : '') +'" class="list-group-item" ' +
						'data-id="'+$(this).data('prod-id')+'"'+
						'data-cart-id="'+$(this).data('cart-id')+'"'+
						'data-prod-state="'+$(this).data('prod-state')+'">' +ctr +'. '+$(this).data('prod-name')+' - ' + state +'</li>';
					ctr++;
				});
				$('.invalid-cart-product-list li').each(function() {
					$(this).remove();
				});
				$('.invalid-cart-product-list').append(listString);
			}
			$('#productValidationModal').modal('show');
		}
	}
}

function productValidationUpdateCartItems() {
	let prodId = [];
	const LOCALHOST_URL = [
		'127.0.0.1',
		'localhost',
	];
	let mainSiteUrl = LOCALHOST_URL.includes(window.location.hostname) ? window.location.origin + '/' + window.location.pathname.split('/')[1] + '/' : window.location.origin + '/';
	$('.invalid-cart-product-list li').each(function() {
		prodId.push([$(this).data('id'), $(this).data('prod-state'), $(this).data('cart-id')]);
	});

	$.request('onValidateProductUpdate', {
		loading: $.oc.stripeLoadIndicator,
		data: {
			data: prodId
		},
		success: function(data) {
			$.oc.flashMsg({text: data.message, class: !data.success ? 'error' : 'success'});
			if (!data.data) {
				return false;
			}

			switch (data.data) {
				case 'information-and-shipping':
					//Click the Checkout button on cart
					if (!$('.cart-container-drop').hasClass('active')) {
						$('.proceed-checkout-info').click();
					}
					break;
				case 'checkout':
					//Click the Continue button on information and shipping
					if (!data.cart.length) {
						$('#productValidationCheckoutErrorModal').modal('show');
					} else {
						$('.info-botton .continue').click();
					}
					break;
				case 'information-and-shipping?':
					//Return to information and shipping from checkout
					if (!data.cart.length) {
						$('#productValidationCheckoutErrorModal').modal('show');
					} else {
						window.location.replace(mainSiteUrl + '/' + data.data);
					}
					break;
				default:
					return false;
			}
		},
		complete: function() {
			$('#productValidationModal').modal('hide');
			//Close floating cart
            $('#floating-cart-container').removeClass('active');
            $('#floating-cart-container #partialFloatingCart .cart-container-drop').removeClass('active');
        },
		error: function() {
			$.oc.flashMsg({text: 'Error occured. Refresh the page and try again.'});
			$('#productValidationModal').modal('hide');
		}
	});
}

function cartValidationUpdateCartItems() {
	let prodId = [];
	$('.invalid-cart-list-item li').each(function() {
		prodId.push([$(this).data('id'), $(this).data('prod-state'), $(this).data('cart-id')]);
	});

	$.request('onValidateProductUpdate', {
		loading: $.oc.stripeLoadIndicator,
		data: {
			data: prodId
		},
		success: function(data) {
			if (!data.data) {
				return false;
			}

			switch (data.data) {
				case 'information-and-shipping':
					if (!data.cart.length) {
						$('#productValidationCheckoutError').modal('show');
					} else {
						window.location.reload();
					}
					break;
				default:
					return false;
			}
		},
		complete: function() {
			$('#cartValidationModal').modal('hide');
            //Close floating cart
            $('#floating-cart-container').removeClass('active');
            $('#floating-cart-container #partialFloatingCart .cart-container-drop').removeClass('active');
        },
		error: function() {
			$.oc.flashMsg({text: 'Error occured. Refresh the page and try again.'});
			$('#cartValidationModal').modal('hide');
		}
	});
}

function endCallInSession(){
	if(window.location.href.indexOf("/thank-you") > -1) {
        $.request('onEndCallInSession');
    }
}

var geocoder;
var map;
var markers = [];

function initiateGoogleMap() {

	var lat = ($("#latInput").val() ? $("#latInput").val() : 14.579762416373141);
	var lng = ($("#lngInput").val() ? $("#lngInput").val() : 121.0407543182373);

	function createCenterControl(map) {
		const controlButton = document.createElement("button");
	  
		// Set CSS for the control.
		controlButton.style.backgroundColor = "#fff";
		controlButton.style.border = "2px solid #fff";
		controlButton.style.borderRadius = "2px";
		controlButton.style.boxShadow = "0px 1px 4px -1px rgba(0,0,0,.3)";
		controlButton.style.color = "rgb(255,255,255)";
		controlButton.style.cursor = "pointer";
		controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
		controlButton.style.fontSize = "16px";
		controlButton.style.lineHeight = "38px";
		controlButton.style.margin = "8px 0 8px 10px";
		controlButton.style.textAlign = "center";
		controlButton.style.width = "40px";
		controlButton.style.height = "40px";
		controlButton.innerHTML = '<img src="themes/real-estate-pro-ecommerce/assets/images/point-location.png">'
		controlButton.title = "Click to use your current location.";
		controlButton.type = "button";
		controlButton.className = "use-current-location";
	  
		// Setup the click event listeners: simply set the map to Chicago.
		controlButton.addEventListener("click", () => {
		//   map.setCenter(chicago);
		});
	  
		return controlButton;
	  }
	  

	geocoder = new google.maps.Geocoder();
    gmapsSearchPlaces = new google.maps.places.AutocompleteService();
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
		zoom: 10,
        center: latlng,
        mapTypeId: "roadmap",
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        }
    }
	
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// Create the DIV to hold the control.
	const centerControlDiv = document.createElement("div");
	// Create the control.
	const centerControl = createCenterControl(map);
	// Append the control to the DIV.
	centerControlDiv.appendChild(centerControl);
  
	map.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv);

	const infowindow = new google.maps.InfoWindow();

	map.addListener("click", (e) => {
		clearPin();
		var latLng = e.latLng.lat() + "," + e.latLng.lng();
		if ($('#google_reverse_geocoding_switch').val() !== '1') {
			$('#latInput').val(e.latLng.lat());
			$('#lngInput').val(e.latLng.lng());
		}
		
		if ($("#google-reverse-geocoding-switch").val() == 0) {
			const marker  = new google.maps.Marker({
				position: { lat: parseFloat(e.latLng.lat()), lng: parseFloat(e.latLng.lng()) },
				map: map
			});

			markers.push(marker);
		}

		reverseGeocoding(geocoder, map, infowindow, latLng);
	});

	function clearPin() {
		for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
	}
	
	$(document).on('click', '.use-current-location', function(e) {
		e.preventDefault;
		if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            $.oc.flashMsg({text: 'Geolocation is not supported by this browser.', 'class': 'error'});
        }

		function showPosition(position) {
			$('#latInput').val(position.coords.latitude);
			$('#lngInput').val(position.coords.longitude);
			clearPin();
			if ($('#google-reverse-geocoding-switch') !== '0') {
				var latLng = position.coords.latitude + "," + position.coords.longitude;

				const infowindow = new google.maps.InfoWindow();

				reverseGeocoding(geocoder, map, infowindow, latLng);
			}

			const marker  = new google.maps.Marker({
				position: { lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) },
				map: map,
			});

			markers.push(marker);
        }

        function showError(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                // Comments are only permitted when location sharing is enabled- you have denied the request for Geolocation.
                $.oc.flashMsg({text: 'Enable Location Feature To Determine Your Location.', 'class': 'error'});
                break;
                case error.POSITION_UNAVAILABLE:
                // Comments are only permitted when location sharing is enabled- Location information is unavailable.
                $.oc.flashMsg({text: 'Your Current Location Is Undetermined.', 'class': 'error'});

                break;
                case error.TIMEOUT:
                // Comments are only permitted when location sharing is enabled- the request to get user location timed out.
                $.oc.flashMsg({text: 'Your Request Has Timed Out. Please Retry.', 'class': 'error'});

                break;
                case error.UNKNOWN_ERROR:
                // Comments are only permitted when location sharing is enabled- An unknown error occurred.
                $.oc.flashMsg({text: 'An Unknown Error Occured. If Problem Persists, Refresh Your Page.', 'class': 'error'});

                break;
            }
        }
	})

	$('#__gmaps-search').autocomplete({
        minLenght: 5,
        source: function(req, res) {
            let term = $('#__gmaps-search').val();
            let locationsObj = [];

            //api that gets the prediction of searched location via Google Maps API
            gmapsSearchPlaces.getPlacePredictions({
                input: term,
                bounds: {
                    north: 12.29577,
                    west: 115.90576,
                    south: 2.64265,
                    east: 129.35303
                },
                componentRestrictions: {
                    country: "PH",
                }
            })
            .then((response) => {
                let result = response;
                const { predictions: locations } = result;
                //Putting all the location to an array to use as an dropdown item on autocomplete
                $.each(locations, function(index, value) {
                    locationsObj.push({
                        value: value.place_id,
                        label: value.description,
                    });
                });

                res(locationsObj);
                
            })
            .catch((error) => {
                $.oc.flashMsg({
                    text: error.message ? error.message : error,
                    class: 'error'
                })
                res([]);
            });
        },
        select: function(event, ui) {
            $('#__gmaps-search').attr('data-value', ui.item.value);
            $('#__gmaps-search').val('');

            geocoder.geocode({
                placeId: ui.item.value
            })
            .then((response) => {
                let result = response;
                const { geometry, formatted_address } = result.results[0];
                const { location } = geometry;
                let lat = location.toJSON().lat;
                let lng = location.toJSON().lng;
				map.setCenter(location)
				reverseGeocoding(geocoder, map, infowindow, lat + ', ' + lng);
                let wholeAddress = response.results[0].formatted_address;
                let splitWholeAddress = wholeAddress.split(",");
                let province = splitWholeAddress[splitWholeAddress.length - 2];
                let city = splitWholeAddress[splitWholeAddress.length - 3];
                let brgy = splitWholeAddress[0];
                localStorage.setItem('addressObject', JSON.stringify({
                    address: wholeAddress,
                    province: processProvinceFromReverseGeocode(province),
                    city: processCityFromReverseGeocode(city),
                    brgy: brgy
                }));
            })
            .catch((error) => {
                console.log(error);
                $.oc.flashMsg({
                    text: error.message ? error.message : error,
                    class: 'error'
                })
            });
            return false;
        }
    });
}

function addListenerToPinAddressoMap() {
	if ($("#google-geocoding-switch").val() == 1) {
		$(document).on("click", "#pinAddressToMap", function () {

			var addressToProcess = $('input[name="billing_address"]').val() + 
									" " + $('select[name="billing_barangay"]').val() + 
									" " + $('select[name="billing_city"]').val();
	
			geocoder.geocode( { 'address': addressToProcess}, function(results, status) {
				if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
	
					setMapOnAll(map);
	
					addMarker({
						lat: parseFloat(results[0].geometry.location.lat()),
						lng: parseFloat(results[0].geometry.location.lng()),
					});
	
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
			$('#pinAddressToMapConfirmation').modal('hide');
		});
	}
}

function reverseGeocoding(geocoder, map, infowindow, latlngValue) {

	const input = latlngValue;
	const latlngStr = input.split(",", 2);
	const latlng = {
	  lat: parseFloat(latlngStr[0]),
	  lng: parseFloat(latlngStr[1]),
	};

	if ($("#google-reverse-geocoding-switch").val() == 1) {
		geocoder
			.geocode({ location: latlng })
			.then((response) => {
				if (response.results[0]) {
					$('#googleMapConfirmation').modal('show');

					$('#googleMapAddressPin').click(function() {
						setMapOnAll(map);
						addMarker(latlng);
						console.log(response);
						var brgy = response.results[0].address_components[1].long_name;

						var wholeAddress = response.results[0].formatted_address;
						var splitWholeAddress = wholeAddress.split(",");

						var province = splitWholeAddress[splitWholeAddress.length - 2];
						var city = splitWholeAddress[splitWholeAddress.length - 3];
						var brgy = splitWholeAddress[0];
						changeAddressValues({
							wholeAddress: wholeAddress,
							province: processProvinceFromReverseGeocode(province),
							city: processCityFromReverseGeocode(city),
							brgy: brgy
						});
						$('#googleMapConfirmation').modal('hide');
					});
					
				} else {
					window.alert("No results found");
				}
			})
			.catch((e) => window.alert("Geocoder failed due to: " + e));
	}
}

function changeAddressValues(data) {
	$(".address-input").val(data.wholeAddress);
	
	$('select[name="billing_state"] option').filter(function() {
		if (data.province == "National Capital Region") {
			return $(this).val().toLowerCase() == 'metro manila';
		} else {
			return $(this).val().toLowerCase() == data.province.toLowerCase();
		}
	}).prop('selected', true).trigger('change');

	setTimeout(function() { 
        $('select[name="billing_city"] option[value="'+ data.city.toUpperCase() +'"]').prop('selected', true).trigger('change');
    }, 2000);
	

}

function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
    }
}

function processProvinceFromReverseGeocode(provinceString) {
	if (provinceString.replace(/[0-9]/g, '').trim() == "Kalakhang Maynila") {
		return "Metro Manila";
	}

	return provinceString.replace(/[0-9]/g, '').trim();
}

function processCityFromReverseGeocode(cityString) {

	if (cityString.trim() == "Taguig") {
		return "Taguig";
	}

	return cityString.trim() + " City";
}
function handleDeliveryMethod() {
	if($('#storeGeolocationSwitch').val() == 1 && $('#brandManagementSwitch').val() == 1) {	
		$('[name="whenradio"]').trigger("click");
		var delivery_date_session = $('#delivery_date_session').val();
		var delivery_time_hour_session = $('#delivery_time_hour_session').val();
		var delivery_time_minute_session = $('#delivery_time_minute_session').val();
		var delivery_time_am_pm_session = $('#delivery_time_am_pm_session').val();
	
		$('#delivery-date').val(delivery_date_session);
		$('.hour-select').val(delivery_time_hour_session);
		$('.minutes-select').val(delivery_time_minute_session);
		$('.am-pm-select').val(delivery_time_am_pm_session);	
	}
}

function gcashDirectTYPageListeners() {
	const VALID_FILE_TYPE = 'image/'

	const validateFileContents = (element) => {
		element.preventDefault
		try {
			let file = element.target.files
			if (file.length) {
				$.each(file, function(index, value) {
					if (!value.type.includes(VALID_FILE_TYPE)) {
						$.oc.flashMsg({
							text: 'Upload Error: Invalid File Format',
							class: 'error'
						})
						$('#gcashFileUpload').val('')
						return false
					}

					if (value.size > FILE_SIZE_LIMIT) {
						$.oc.flashMsg({
							text: 'Upload Error: File size should be 25MB and below',
							class: 'error'
						})
						$('#gcashFileUpload').val('')
						return false
					}

					$('#gcashFileUpload').closest('form')
					.request()
					.then(response => {
						if (!response.success || !response.data.length) {
							$.oc.flashMsg({
								text: 'Unknown error encountered. Refresh the page to continue.',
								class: 'error'
							})
							$('#gcashFileUpload').val('')
							return false;
						}

						$.oc.flashMsg({
							text: 'Gcash Proof of Payment successfully uploaded.',
							class: 'success'
						})

						$('#uploadedImgView').show()
						$('.gcashFileUpload').hide()
						$('#uploadedImgView').attr('src', 'data:'+value.type+ ';base64,' + response.data)
						$('#confirmUploadGcashProof').attr('disabled', false);
					})
					.catch(err => {
						console.log(err)
						$.oc.flashMsg({
							text: 'Unknown error encountered. Refresh the page to continue.',
							class: 'error'
						})
					})
				})
			}
		} catch (error) {
			console.log(error)
			$.oc.flashMsg({
				text: 'Unknown error encountered. Refresh the page to continue.',
				class: 'error'
			})
		}
	}

	const handleConfirmPaymentAction = (e) => {
		e.preventDefault

		if (!$('#uploadedImgView').attr('src')) {
			$.oc.flashMsg({
				text: 'Upload proof of payment to confirm payment.',
				class: 'warning'
			})
			return false
		}

		$.request('onConfirmPaymentNotifGcash', {
			loading: $.oc.stripeLoadIndicator,
			data: {
				id: e.target.value
			}
		})
		.catch(err => {
			console.log(err)
			$.oc.flashMsg({
				text: 'Unknown error occured: Refresh the page and try again.',
				class: 'error'
			})
		})
	}

	const validateFileUpload = (element) => {
		try {
			let file = element.target.files
			let identifier = element.target.attributes.key.value

			if (file.length) {
				$.each(file, function(index, value) {
					if (!value.type.includes(VALID_FILE_TYPE)) {
						$.oc.flashMsg({
							text: 'Upload Error: Invalid File Format',
							class: 'error'
						})
						$('.gcashFileUploadAttachment[key="'+identifier+'"]').val('')
						return false
					}

					if (value.size > FILE_SIZE_LIMIT) {
						$.oc.flashMsg({
							text: 'Upload Error: File size should be 25MB and below',
							class: 'error'
						})
						$('.gcashFileUploadAttachment[key="'+identifier+'"]').val('')
						return false
					}

					$('.uploadAttachmentForm[id="'+identifier+'"]')
					.request()
					.then(response => {
						if (!response.success || !response.data.length) {
							$.oc.flashMsg({
								text: 'Unknown error encountered. Refresh the page to continue.',
								class: 'error'
							})
							$('.gcashFileUploadAttachment[key="'+identifier+'"]').val('')
							return false;
						}

						$.oc.flashMsg({
							text: 'Gcash Proof of Payment successfully uploaded.',
							class: 'success'
						})

						$('.uploadedImgView[key="'+identifier+'"]').attr('src', 'data:'+value.type+ ';base64,' + response.data)
						$('.uploadedImgView[key="'+identifier+'"]').show()
						$('.orderStatusSpan[key="'+identifier+'"]').text(response.status)
					})
					.catch(err => {
						console.log(err)
						$.oc.flashMsg({
							text: 'Unknown error encountered. Refresh the page to continue.',
							class: 'error'
						})
					})
				})
			}
		} catch (error) {
			console.log(error)
			$.oc.flashMsg({
				text: 'Unknown error encountered. Refresh the page to continue.',
				class: 'error'
			})
		}
	}

	$(document).on('change', '#gcashFileUpload', function(e) {
		e.preventDefault()
		if ($(this).val()) {
			validateFileContents(e)
		}
	})

	$(document).on('click', '#confirmUploadGcashProof', function(e) {
		handleConfirmPaymentAction(e)
	})

	$(document).on('change', '.gcashFileUploadAttachment', function(e) {
		e.preventDefault
		if ($(this).val()) {
			validateFileUpload(e)
		}
	});
}

function validateCheckoutProducts($items,onSuccess){
	var cart_check = [],
		$items = $items || {},
		onSuccess = onSuccess || function(){};

	$items.each(function() {
        cart_check.push($(this).data('cart-id'));
    });

    if(cart_check.length < 1){
        $.oc.flashMsg({text: 'Oops! Item(s) on cart has changed. Redirecting to cart page.', class: 'error'});
        location.replace('/cart');
		return false;
	}

    $.request('onValidateProductAvailability', {
        loading: $.oc.stripeLoadIndicator,
        data : {
            ids: cart_check
        },
        success: function(response) {
            if (!response.success) {
                $.oc.flashMsg({text: 'Oops! Item(s) on cart has changed. Redirecting to cart page.', class: 'error'});
                location.replace('/cart');
                return false;
            }else{
            	onSuccess();
			}
        },
        error: function() {
            $.oc.flashMsg({text: 'Oops! Item(s) on cart has changed. Redirecting to cart page.', class: 'error'});
            location.replace('/cart');
			return false;
        }
	});
}

function validateInfoShippingOnLoad(){
    if(window.location.pathname == "/information-and-shipping"){
       return validateCheckoutProducts($('div.order-list').find('.row'));
    }else if(window.location.pathname == "/checkout"){
       return validateCheckoutProducts($('div#cart__container').find('.checkout-details'));
    }
}

/* Note: Insert functions above this line */
function handleLoadSpinner() {
	/* For checkout page only */
	if (window.location.href.indexOf("checkout") > -1) {
		/* Remove the spinner when all the fees are computed */
		$(document).ajaxStop(function(){
			if(grandTotalCalculatingDone)
				$('.page-loading').removeClass('active');
		});
	}
}

function calculateGrandTotal(){
    $(document).on('change', 'input[type=radio][name=payment_gateway], select[name=payment_gateway]', function (e) {
    	onGettingShippingCostKilometerCompleted = false;
    	onGettingCashOnDeliveryFeeCompleted = false;
        grandTotalCalulating = setInterval(function(){
            grandTotalCalculatingDone = ((onGettingShippingCostKilometerCompleted || onGettingShippingCostCompleted) && onGettingCashOnDeliveryFeeCompleted);
        	if(grandTotalCalculatingDone){
                $('.page-loading').removeClass('active');
                grandTotalCalculatingDone = false;
                clearInterval(grandTotalCalulating);
        	}else{
        		$('.page-loading').addClass('active');
            }
        }, 1000);
    });
}
/* Note: Do not insert any function below this line */
