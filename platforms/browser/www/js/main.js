/*
 Creator: Kirstine Nielsen
 Creation Date: 08/08/2016
 Current Version: 1
 Current Revision: 1
 Last Modified: 08/08/2016 22:43
 Last Modified by: Kirstine Nielsen
*/

/////////////////////////////////////////Variable Declaration

// 10.0.2.2 is the same as Localhost of WService running in Emulator.
var rootURL = "http://10.0.2.2/sites/EzyCar/index.php";
//var rootURL = "http://localhost/sites/EzyCar/index.php";

var pageinited = false;

// reuse panel on multiple pages
var panel = '<div data-role="panel" id="mypanel" data-position="left" data-display="overlay" data-theme="a"><ul data-role="listview"><li><a href="#homepage" data-rel="close">Home</a></li><li><a href="#page3" data-rel="close">My Bookings</a></li><li><a href="#page5" data-rel="close">Brands</a></li><li><a href="#page4" data-rel="close">Return Car</a></li><li><a id="linkPage6" href="#page6" data-rel="close">My Profile</a></li></ul></div>';

var standardDurationToast = 500;
var standardDelayToast = 2000;

/////////////////////////////////////////jquery On Document Ready

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});


$(document).on("pageinit", function(){

    // TODO what is this for? Billk added code
    if(pageinited)
    {
        return;
    }
    else
    {
        pageinited= true;
    }  // end added code


    // get from local storage id, email, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var emailFromLocalStorage = window.localStorage.getItem("Email");

//    alert("from storage id: " + idFromLocalStorage
//            + "\nfrom storage email: " + emailFromLocalStorage
//            + "\nfrom storage key: " + akeyFromLocalStorage);

    // make sure that email and OAuth exist in the local storage
    if (emailFromLocalStorage != null && akeyFromLocalStorage != null && idFromLocalStorage != null)
    {
//        alert("local storage has id, email, and authKey");

        // check if both matches both in database
        $.ajax({
            type: 'GET',
            url: rootURL + '/authenticate/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
            dataType: "json",
        })
        .done(function(data) {
//            alert("in done");

            // Execute when ajax successfully completes

            // check value of VALID in the returned json object {"VALID":"true/false"}
//            alert("data.VALID: " + data.VALID);
            if (data.VALID == "true")
            {
//                alert("in if valid == true");
                // redirect to homepage (search car page)
                $(location).attr('href', '#homepage');
            }
            else  //{"VALID":"false"}
            {
                //alert user
//                alert ("invalid");

                //redirect to Registration page
                $(location).attr('href', '#page8');
            }
        })
        .always(function() { /* always execute this code */ })
        .fail(function(data){
            /* Execute when ajax falls over */
            alert("Error Connecting to Webservice.\nTry again.");
        });
    }
    else  // not existing
    {
        // go to Registration page
//        alert("local storage empty");

        //redirect to Registration page
        $(location).attr('href', '#page8');
    }

    // Homepage Event Handlers
    $("#homepage").on("pagebeforeshow", function(){
//         alert("Before show homepage");
    }); // end homepage live beforepageshow

    $("#homepage").on("pagebeforehide", function(){
//         alert("Before hide homepage");
    }); // end homepage live pagebeforehide
    // END Homepage Event Handlers


        // Page 1 Event Handlers
//        $("#page1").on("pagebeforeshow", function(event){
////              alert("before page1 show");   // from dreamweaver
//			  console.log('before page1 show'); // from Eclipse
//        });

//
//        $("#page1").on("pageshow", function(){
////            alert("page1 show");   // from dreamweaver
//			console.log('page1 show'); // from Eclipse
//        }); // end newcard live pageshow
//
//     	$("#page1").on("pagebeforehide", function(){
////             alert("Before hide page1");
//        }); // end page1 live pagebeforehide
		// End Page 1 Events Handlers


        // Page3 Event Handlers
//        $("#page3").on("pagebeforeshow", function(event){
//            // TODO
//
////            idFromLocalStorage;
////            akeyFromLocalStorage;
////            emailFromLocalStorage;
//
////              alert("before page3 show");   // from dreamweaver
//			  console.log('before page3 show'); // from Eclipse
//        });
//
//        $("#page3").on("pageshow", function(){
////            alert("page3 show");   // from dreamweaver
//			console.log('page3 show'); // from Eclipse
//        }); // end newcard live pageshow
//
//     	$("#page3").on("pagebeforehide", function(){
////             alert("Before hide page3");
//        }); // end page3 live pagebeforehide
        // End Page3 Events Handlers



    $(document).on("pagebeforeshow","#page1",function(){
        // alert("pagebeforeshow event fired - page one is about to be shown");
        $(".clickable-row").removeClass('row_highlight');
    });


    // Page6 Event Handlers
    $("#page6").on("pagebeforeshow", function(event){
//              alert("before page6 show");   // from dreamweaver
        // get customer details
        populateCustomerDetails(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));
        console.log('before page6 show'); // from Eclipse
    });

    $("#page6").on("pageshow", function(){
//            alert("page6 show");   // from dreamweaver
        console.log('page6 show'); // from Eclipse
    }); // end newcard live pageshow

    $("#page6").on("pagebeforehide", function(){
//             alert("Before hide page6");
    }); // end page6 live pagebeforehide
    // End Page6 Events Handlers


    // Page7 Event Handlers
    $("#page7").on("pagebeforeshow", function(event){
//              alert("before page7 show");   // from dreamweaver

        // get the mobile and pre fill input field
        fillMobileTextFields(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));

        // wipe all password fields vor value and background color
        $("#pwdPasswordProve").val("");
        $("#pwdPasswordNew1").val("");
        $("#pwdPasswordNew2").val("");
        $(".errorRedBackground").removeClass('errorRedBackground');

        console.log('before page7 show'); // from Eclipse
    });


    // Page8 Event Handlers
    $("#page8").on("pagebeforeshow", function(event){
//              alert("before page8 show");   // from dreamweaver

        // only show page8 if auth key and email is null in local storage
        if (window.localStorage.getItem("OAuth") != null || window.localStorage.getItem("Email") != null)
        {
            // redirect to homepage
            $(location).attr('href', '#homepage');
        }
    });


    // btn click
    $("#btnSubmitRegisterProfile").on("click", function(){
        registerUser();
    });

    // btn click
    $("#btnSearchCar").on("click", function(){
        // redirect to page1
        $(location).attr('href', '#page1');
    });

    // btn click
    $("#btnModifySearchCar").on("click", function(){
        //redirect
        $(location).attr('href', '#homepage');
    });

    // btn click
    $("#btnConfirmCarHire").on("click", function(){
        // TODO
        toast("Car successfully booked", standardDurationToast, standardDelayToast);
        // redirect
        $(location).attr('href', '#homepage');
    });

    // btn click
    $("#btnDropOffCar").on("click", function(){
        //TODO
        toast("Car successfully returned", standardDurationToast, standardDelayToast);
        //redirect
        $(location).attr('href', '#homepage');
    });

    // btn click
    $("#btnEditProfile").on("click", function(){
        // fill in the Mobile text fields with customer's mobile
//        fillMobileTextFields(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));
        // redirect
        $(location).attr('href', '#page7');
    });

    // btn click
    $("#btnSubmitChangesProfile").on("click", function(){
        // hard coded test : mypass
        submitProfileChanges(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));

        // logic about password
//        toast("Changes submitted", standardDurationToast, standardDelayToast);
//        // redirect
//        $(location).attr('href', '#homepage');
    });

    // click row
    $("#carsAvailableTable .clickable-row").click(function() {
        // Check to see if background color is set or if it's set to white.
        $(this).toggleClass('row_highlight');

        //redirect
        $(location).attr('href', '#page2');
    });

    // click row
    $("#myBookingsTable .clickable-row").click(function() {
        // alert("row was clicked");
        toastWithCloseButton("Hawthorn<br/><br/>Auburn rd<br/><br/>Corner of Auburn rd and Barkers rd", 1000, 1000);
    });
             
});  // end document on pageinit


function registerUser()
{
    // get user input
    var firstName = $("#txtRegisterFirstname").val().trim();
    var lastName = $("#txtRegisterLastname").val().trim();
    var licenceNo = $("#txtRegisterLicence").val().trim();
    var email = $("#txtRegisterEmail").val().trim();
    var mobile = $("#txtRegisterMobile").val().trim();
    var password = $("#txtRegisterPassword").val();

    // validate
    var isFirstNameOk = firstName.length > 0;
    var isLastNameOk = lastName.length > 0;
    var isLicenceNoOk = isNumberFormatOk(licenceNo, 9);
    var isEmailOk = isEmailValidFormat(email);
    var isMobileOk = isNumberFormatOk(mobile, 10);
    var isPasswordOk = isNewPasswordFormatOK(password);

    //only try to register if ALL ok (format wise)
    if (isFirstNameOk && isLastNameOk && isLicenceNoOk && isEmailOk && isMobileOk && isPasswordOk)
    {
        // do registration
        register(firstName, lastName, licenceNo, email, mobile, password);
    }
    // make red background for relevant fields
    doRedBackground(isFirstNameOk, "#txtRegisterFirstname");
    doRedBackground(isLastNameOk, "#txtRegisterLastname");
    doRedBackground(isLicenceNoOk, "#txtRegisterLicence");
    doRedBackground(isEmailOk, "#txtRegisterEmail");
    doRedBackground(isMobileOk, "#txtRegisterMobile");
    doRedBackground(isPasswordOk, "#txtRegisterPassword");
}


// red background added to element if not valid
function doRedBackground(isOk, elementId)
{
    if (!isOk)
    {
        $(elementId).addClass('errorRedBackground');
    }
    else
    {
        $(elementId).removeClass('errorRedBackground');
    }
}

function register(aFname, aLname, aLicence, anEmail, aMob, aPwd)
{
//    alert("register");
    $.ajax({
        type: "POST",
        url: rootURL + '/customer',
        data: stringifyRegisterDetails(aFname, aLname, aLicence, anEmail, aMob, aPwd),
        dataType: 'json',
    })
    .done(function(data) {
    //        alert("inside done");

        // check if data is null which means that email was not unique
        if (data == null)
        {
    //             alert("Sorry email must be unique - data is null");

            // toast message
//            toast("Sorry email is NOT unique", standardDurationToast, standardDelayToast);
            doRedBackground(false, "#txtRegisterEmail");
        }
        else
        {
    //            alert(data.fldFirstName);

            // prepare local storage on mobile phone
            var storage = window.localStorage;

            // store authentication key and email locally on mobile phone
            storage.setItem("Id", data.fldCustomerId)  // Pass a key name and its value to add or update that key.
            storage.setItem("OAuth", data.fldAuthenticationKey)  // Pass a key name and its value to add or update that key.
            storage.setItem("Email", data.fldEmail)  // Pass a key name and its value to add or update that key.

        //            storage.removeItem("Id")  // Pass a key name to remove that key from storage.
        //            storage.removeItem("OAuth")  // Pass a key name to remove that key from storage.
        //            storage.removeItem("Email")  // Pass a key name to remove that key from storage.

        //             alert(storage.getItem("Id"));
        //             alert(storage.getItem("OAuth"));
        //             alert(storage.getItem("Email"));

            toast("Registered", standardDurationToast, standardDelayToast);

            //redirect
            $(location).attr('href', '#homepage');
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        alert("Inside Fail - Error: " + data)
    });

}

// make json string
function stringifyRegisterDetails(aFname, aLname, aLicence, anEmail, aMob, aPwd)
{
    //create registerDetails object
    var registerDetails = new Object();

    //add properties to object
    registerDetails.firstName = aFname;
    registerDetails.lastName = aLname;
    registerDetails.licenceNo = aLicence;
    registerDetails.email = anEmail;
    registerDetails.mobile = aMob;
    registerDetails.password = aPwd;

    //serialize it
    var jsonStringRegisterDetails = JSON.stringify(registerDetails);
//    alert(jsonStringRegisterDetails);

    return jsonStringRegisterDetails;
}


// check if email is valid format
function isEmailValidFormat(email)
{
    var emailValid = false;

    if (email.length < 3 || email.indexOf(' ') >= 0 || email.indexOf('@') < 0)
    {
//        alert("invalid email");
        // toast message
//        toast("Invalid email", standardDurationToast, standardDelayToast);
        emailValid = false;  // redundant
    }
    else
    {
        emailValid = true;
    }
    return emailValid;
}


// when editing My Profile the system must check if password entered is correct password
function submitProfileChanges(emailFromLocalStorage, akeyFromLocalStorage)
{
    // validate user input
    var mobile = $("#txtEditMobile").val().trim();
    var mobileFormatOK = isNumberFormatOk(mobile, 10);
//    alert ("returned mobileFormatOK: " + mobileFormatOK);

    var currentPassword = $("#pwdPasswordProve").val();

//    alert(currentPassword);
//    alert(emailFromLocalStorage);
//    alert(akeyFromLocalStorage);

    var passwordFormatOK = isStringLengthMoreThanZero(currentPassword);
//    alert ("returned passwordFormatOK: " + passwordFormatOK);

    var newPassword1 = $("#pwdPasswordNew1").val();
    var newPassword2 = $("#pwdPasswordNew2").val();

    var newPassword1FormatOK = false;
    var newPasswordsMatchOK = false;

    if (newPassword1.length == 0 && newPassword2.length == 0)
    {
//        alert("both new pwd are zero length");
        newPasswordsMatchOK = true;
    }
    else  // at least one of the new pwd fields filled out
    {
        newPassword1FormatOK = isNewPasswordFormatOK(newPassword1);
//        alert ("returned newPassword1FormatOK: " + newPassword1FormatOK);

        // if newPassword1 format is ok check if it matches
        if (newPassword1FormatOK)
        {
            if (newPassword1 == newPassword2)
            {
//                alert("match");
                newPasswordsMatchOK = true;
            }
        }
        else
        {
//            alert("At least 3 chars, no spaces");
        }
    }
//    alert ("newPasswordsMatchOK: " + newPasswordsMatchOK);

    //if all ok
    if (mobileFormatOK && passwordFormatOK && newPasswordsMatchOK)
    {
//        alert("all ok");
        checkCredentials(mobile, currentPassword, newPassword1, emailFromLocalStorage, akeyFromLocalStorage);
    }

    // make red background for relevant fields
    doRedBackground(mobileFormatOK, "#txtEditMobile");
    doRedBackground(passwordFormatOK, "#pwdPasswordProve");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew1");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew2");
}


// make sure password is macthing the users password
function checkCredentials(aMobileNo, currentPasswordEntered, newPassword, emailFromLocalStorage, akeyFromLocalStorage)
{
//    var pwdOK = false;

    // verify that the password entered is correct
    $.ajax({
        type: 'GET',
        url: rootURL + '/passwordValidation/' + currentPasswordEntered + '/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done checkCredentials");

        // Execute when ajax successfully completes
        // check password verification
        if (data.VALID == "true")
        {
//            alert("in if valid == true");
//            pwdOK = true;
            updateCustomerProfileDetails(aMobileNo, newPassword);

        }
        else  //{"VALID":"false"}
        {
            //alert user
//            alert ("invalid");
            // toast message
//            toast("Current password entered is wrong", standardDurationToast, standardDelayToast);
            doRedBackground(false, "#pwdPasswordProve");
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
        alert("Error Connecting to Webservice.\nTry again.");
    });
}


// update details
function updateCustomerProfileDetails(mobileNo, newPwd)
{
    var customerId = window.localStorage.getItem("Id");

    $.ajax({
        type: "PUT",
        url: rootURL + '/customer/' + customerId,
        data: stringifyUpdateDetails(mobileNo, newPwd),
        dataType: 'json',
    })
    .done(function(data) {
        // check boolean returned

        // data is not null
        if (data)
        {
//            alert("update done in db");

//            alert("from returned row data.fldAuthenticationKey: " +  data.fldAuthenticationKey);

            // update authentication key local storage
            window.localStorage.setItem("OAuth", data.fldAuthenticationKey);  // Pass a key name and its value to add or update that key.
//            alert("update local: " + window.localStorage.getItem("OAuth"));

            // toast message
            toast("Updated successfully", standardDurationToast, standardDelayToast);

            // redirect to homepage
            $(location).attr('href', '#homepage');
        }
        else  // date == null
        {
            // toast message
            toast("Update failed", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
         alert("Error: " + data)
    });

}


// make json string
function stringifyUpdateDetails(mobileNo, pwd) {

    // create updateDetails object
    var updateDetails = new Object();

    // add properties to object
    updateDetails.email = window.localStorage.getItem("Email");
    updateDetails.authenticationKey = window.localStorage.getItem("OAuth");
    updateDetails.mobile = mobileNo;
    updateDetails.password = pwd;

    // serialize it
    var jsonStringUpdateDetails = JSON.stringify(updateDetails);
    //alert(jsonStringUpdateDetails);

    return jsonStringUpdateDetails;
}


// check if number is correct length and digits only
function isNumberFormatOk(aNumber, aLength)
{
    var numberFormatOK = false;
    var numberLength = aNumber.length;
//    alert("number length: " + numberLength);

    if (numberLength == aLength)
    {
//        alert ("ok length");
        // check if all digits
        if (aNumber.match(/^[0-9]+$/) != null)
        {
//            alert("all digits");
            numberFormatOK = true;
        }
        else
        {
//            alert("NOT all digits");
        }
    }
    else
    {
//         alert("NOT 10 in length");
    }
//    alert("numberFormatOK: " + numberFormatOK);
    return numberFormatOK;
}


// current password must be entered
function isStringLengthMoreThanZero(aPassword)
{
    var passwordFormatOK = false;
    var length = aPassword.length;
//    alert("Password length: " + length);

    if (length > 0)
    {
//        alert ("ok length");
        // check if space exists
        if (aPassword.indexOf(' ') >= 0)
        {
//            alert("whitespace exists");
        }
        else
        {
//            alert("no whitespace");
            passwordFormatOK = true;
        }
    }
//    alert("passwordFormatOK: " + passwordFormatOK);
    return passwordFormatOK;
}


// New password must be at least 3 chars, no spaces
function isNewPasswordFormatOK(aPassword)
{
    var passwordFormatOK = false;
    var length = aPassword.length;
//    alert("Password length: " + length);

    if (length > 2)
    {
//        alert ("ok length");
        // check if space exists
        if (aPassword.indexOf(' ') >= 0)
        {
//            alert("whitespace exists");
        }
        else
        {
//            alert("no whitespace");
            passwordFormatOK = true;
        }
    }
    else
    {
//         alert("< 3");
    }
//    alert("passwordFormatOK: " + passwordFormatOK);
    return passwordFormatOK;
}


// populate page with customer details
function populateCustomerDetails(emailFromLocalStorage, akeyFromLocalStorage)
{
//    alert("in fct populateCustomerDetails");

    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + '/customer/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done populateCustomerDetails");

        // Execute when ajax successfully completes
        // build the html
        var str = "";
        str += "<p>" +  data.fldFirstName + "</p>";
        str += "<p>" +  data.fldLastName + "</p>";
        str += "<p>" +  data.fldLicenceNo + "</p>";
        str += "<p>" +  data.fldEmail + "</p>";
        str += "<p>" +  data.fldMobile + "</p>";

        $("#profileCustomerDetails").html(str);

    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
        alert("Error Connecting to Webservice.\nTry again.");
    });
}


function fillMobileTextFields(emailFromLocalStorage, akeyFromLocalStorage)
{
    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + '/customer/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done fillMobileTextFields");

        // Execute when ajax successfully completes
//        alert(data.fldMobile);

        // fill field with mobile
        $("#txtEditMobile").val(data.fldMobile);


    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
        alert("Error Connecting to Webservice.\nTry again.");
    });

}


function toast(message, duration, delayAmount) {
    var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><h3>' + message + '</h3></div>');

    $toast.css({
        display: 'block',
        background: '#fff',
        opacity: 0.90,
        position: 'fixed',
        padding: '7px',
        'text-align': 'center',
        width: '270px',
        left: ($(window).width() - 284) / 2,
        top: $(window).height() / 2 - 20
    });

    var removeToast = function(){
        $(this).remove();
    };

    $toast.click(removeToast);

    $toast.appendTo($.mobile.pageContainer).delay(delayAmount);  //2000
    $toast.fadeOut(duration, removeToast);
}



function toastWithCloseButton(message, duration, delayAmount) {
    var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><h3>' + message + '</h3></div>');

    $toast.css({
        display: 'block',
        background: '#fff',
        opacity: 0.90,
        position: 'fixed',
        padding: '7px',
        'text-align': 'center',
        width: '270px',
        left: ($(window).width() - 284) / 2,
        top: $(window).height() / 2 - 20
    });

    var removeToast = function(){
        $(this).remove();
    };

    $toast.click(removeToast);

    $toast.appendTo($.mobile.pageContainer).delay(delayAmount);  //2000
    $toast.fadeOut(duration, removeToast);
}
///////////////////////////////////////// END jquery On Document Ready
