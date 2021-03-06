/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

/////////////////////////////////////////Variable Declaration

// 10.0.2.2 is the same as Localhost of WService running in Emulator.
 var rootURL = "http://10.0.2.2/sites/ITC33A/EzyCar/index.php";
//var rootURL = "http://kirstine.byethost14.com/sites/ITC33A/EzyCar/index.php";
//var rootURL = "http://kirstine.comli.com/sites/ITC33A/EzyCar/index.php";
//var rootURL = "http://localhost/sites/ITC33A/EzyCar/index.php";  // for the browser tester

var pageinited = false;

// reuse panel on multiple pages
var panel = '<div data-role="panel" id="mypanel" data-position="left" data-display="overlay" data-theme="a"><ul data-role="listview"><li><a href="#searchCarPage" data-rel="close">Home - Search Car</a></li><li><a id="linkMyBookings" href="#myBookingsPage" data-rel="close">My Bookings</a></li><li><a href="#brandsPage" data-rel="close">Brands</a></li><li><a id="linkReturnCar" href="#returnCarDetailsPage" data-rel="close">Return Car</a></li><li><a href="#myProfilePage" data-rel="close">My Profile</a></li></ul></div>';

var standardDurationToast = 500;
var standardDelayToast = 2000;

var mainBrandsArrayGlobal;

/////////////////////////////////////////jquery On Document Ready

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    initPanel();
});


///////////////////////////////////////// END jquery On Document Ready

$(document).on("pageinit", function(){

    if(pageinited)
    {
//        alert("pageinited true");
        return;
    }
    else
    {
//        alert("pageinited false");
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

                // redirect to searchCarPage (search car page)
                $(location).attr('href', '#searchCarPage');

                // changeHash false => don't save current page in navigation history (but no current page...)
//                $.mobile.changePage('#searchCarPage', {reverse: false, changeHash: false});
            }

            else  //{"VALID":"false"}
            {
                //alert user
//                alert ("invalid");

                //redirect to registrationPage
                $(location).attr('href', '#registrationPage');
                // changeHash false => don't save current page in navigation history (but no current page...)
//                $.mobile.changePage('#registrationPage', {reverse: false, changeHash: false});
            }
        })
        .always(function() { /* always execute this code */ })
        .fail(function(data){
            /* Execute when ajax falls over */
//            alert("Error Connecting to Webservice.\nTry again.");
            toast("Error Connecting to Webservice - authenticate.<br/>Try again", standardDurationToast, standardDelayToast);
        });
    }
    else  // not existing; go to Registration page
    {
//        alert("local storage empty");

        //redirect to Registration page
        $(location).attr('href', '#registrationPage');
    }


    // ref: https://jqmtricks.wordpress.com/2014/07/13/pagecontainerbeforechange/
    // handler for event before any page change
    // check to see if the page changing to is registrationPage (registration page)
    $(document).on("pagecontainerbeforechange", function ( event, data ) {

      //  alert("pagecontainerbeforechange triggered");

        var toPage = data.toPage;
        var absUrl = data.absUrl ? $.mobile.path.parseUrl(data.absUrl).hash.split("#")[1] : "";

        var detailsStored = (window.localStorage.getItem("OAuth") != null || window.localStorage.getItem("Email") != null);
       // alert("pagecontainerbeforechange triggered 2");

        if ( typeof toPage == "object" && absUrl == "registrationPage" && detailsStored)
        {
           // alert("pagecontainerbeforechange triggered 3");
            data.toPage[0] = $("#searchCarPage")[0];

            $.extend(data.options, {
                transition: "flip",
                changeHash: false
            });
        }
    });

    // load the global array of brands
    loadBrandsArrayGlobal();
             
});  // end document on pageinit


// populate array of Brands
function loadBrandsArrayGlobal()
{
    // instantiate array
    mainBrandsArrayGlobal = new Array();

    // get all brands
    $.ajax({
        type: 'GET',
        url: rootURL + '/cars/brands',
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done loadBrandsArrayGlobal");

        // Execute when ajax successfully completes

        if (data.length > 0)
        {
            // loop through all rows
            for (var i = 0; i < data.length; i++)
            {
                // add brands to array
                mainBrandsArrayGlobal[i] = data[i].fldBrand;
            }
        }
        else
        {
            // no brands in db
            toast("Currently no car brands available.", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice - load brands.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// red background added to element if not valid
// param:  boolean, string for example "#someId"
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


// toast to display information to user
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
