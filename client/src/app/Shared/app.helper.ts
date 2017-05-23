/*
 * Inspinia js helpers:
 *
 * correctHeight() - fix the height of main wrapper
 * detectBody() - detect windows size
 * smoothlyMenu() - add smooth fade in/out on navigation show/ide
 *
*/

declare var jQuery: any;

export function correctHeight() {

    var pageWrapper = jQuery('#page-wrapper');
    var navbarHeigh = jQuery('nav.navbar-default').height();
    var wrapperHeigh = pageWrapper.height();

    if (navbarHeigh > wrapperHeigh) {
        pageWrapper.css("min-height", navbarHeigh + "px");
    }

    if (navbarHeigh < wrapperHeigh) {
        if (navbarHeigh < jQuery(window).height()) {
            pageWrapper.css("min-height", jQuery(window).height() + "px");
        } else {
            pageWrapper.css("min-height", navbarHeigh + "px");
        }
    }

    if (jQuery('body').hasClass('fixed-nav')) {
        if (navbarHeigh > wrapperHeigh) {
            pageWrapper.css("min-height", navbarHeigh + "px");
        } else {
            pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
        }
    }
}

export function detectBody() {
    if (jQuery(document).width() < 769) {
        jQuery('body').addClass('body-small')
    } else {
        jQuery('body').removeClass('body-small')
    }
}

export function smoothlyMenu() {
    if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        jQuery('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(400);
            }, 200);
    } else if (jQuery('body').hasClass('fixed-sidebar')) {
        jQuery('#side-menu').hide();
        setTimeout(
            function () {
                jQuery('#side-menu').fadeIn(400);
            }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        jQuery('#side-menu').removeAttr('style');
    }
}
export function Login() {
    window.location.href = "/Account/Logout";
}

export function ValidateMe(id)
{ 
  return  jQuery(id).validate();

}
export function ValidateMeRule(id,Rules)
{ 
  return  jQuery(id).validate(Rules);

}
export function Valid(id)
{ 
  return   jQuery(id).valid();

}
export function SetFoucs(id) {

    jQuery(id).focus();
}
export function CloseModal(id) {
    jQuery(id).modal('toggle');
}
export function RemoveHtml(id) {
    jQuery("body").remove(id);
}
export function setAllFoucs() {
    jQuery('.modal').on('shown.bs.modal', function () {
        jQuery('.setMyFoucs').val('');
        jQuery('.setMyFoucs').focus();
    });
}
export function Processing(id, value) {
    jQuery(id).css("display", value);
}
export function Notify(id, value, msg) {
    if (msg == undefined)
        msg = 'Record saved successfully..';
    jQuery(".msg", id).text(msg);

    jQuery(id).show(value, function () {
        setTimeout(function () { jQuery(id).hide(); }, 3000);
    });
}
export function SetDatePicker(date) {
    jQuery('.form_date').datetimepicker({

        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        initialDate: date
        // startDate:new Date()
    });

}

export function onMyChange(Control) {
    jQuery(Control).on("change", function (e) {
        jQuery(this).focus();
    });
}


export function BindAll() {

    // Add body-small class if window less than 768px
    if (jQuery(document).width() < 769) {
        jQuery('body').addClass('body-small')
    } else {
        jQuery('body').removeClass('body-small')
    }

    // MetsiMenu
    jQuery('#side-menu').metisMenu();

    // Collapse ibox function
    jQuery('.collapse-link').on('click', function () {
        var ibox = jQuery(document).closest('div.ibox');
        var button = jQuery(document).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Close ibox function
    jQuery('.close-link').on('click', function () {
        var content = jQuery(document).closest('div.ibox');
        content.remove();
    });

    // Fullscreen ibox function
    jQuery('.fullscreen-link').on('click', function () {
        var ibox = jQuery(document).closest('div.ibox');
        var button = jQuery(document).find('i');
        jQuery('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function () {
            jQuery(window).trigger('resize');
        }, 100);
    });

    // Close menu in canvas mode
    jQuery('.close-canvas-menu').on('click', function () {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    });

    // Run menu of canvas
    jQuery('body.canvas-menu .sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });

    // Open close right sidebar
    jQuery('.right-sidebar-toggle').on('click', function () {
        jQuery('#right-sidebar').toggleClass('sidebar-open');
    });

    // Initialize slimscroll for right sidebar
    jQuery('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // Open close small chat
    jQuery('.open-small-chat').on('click', function () {
        jQuery(document).children().toggleClass('fa-comments').toggleClass('fa-remove');
        jQuery('.small-chat-box').toggleClass('active');
    });

    // Initialize slimscroll for small chat
    jQuery('.small-chat-box .content').slimScroll({
        height: '234px',
        railOpacity: 0.4
    });

    // Small todo handler
    jQuery('.check-link').on('click', function () {
        var button = jQuery(document).find('i');
        var label = jQuery(document).next('span');
        button.toggleClass('fa-check-square').toggleClass('fa-square-o');
        label.toggleClass('todo-completed');
        return false;
    });

    // Append config box / Only for demo purpose
    // Uncomment on server mode to enable XHR calls
    //jQuery.get("skin-config.html", function (data) {
    //    if (!jQuery('body').hasClass('no-skin-config'))
    //        jQuery('body').append(data);
    //});

    // Minimalize menu
    jQuery('.navbar-minimalize').on('click', function () {

        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();

    });

    jQuery('li', '#side-menu').on('click', function () {

        if (jQuery(this).has("ul").length == 0) {
            jQuery('li', '#side-menu').removeClass("active");
            jQuery(this).addClass("active");
        }
    });
    // Tooltips demo
   /* jQuery('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });*/


    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = jQuery("body > #wrapper").height() - 61;
        jQuery(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = jQuery('nav.navbar-default').height();
        var wrapperHeigh = jQuery('#page-wrapper').height();

        if (navbarHeigh > wrapperHeigh) {
            jQuery('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if (navbarHeigh < wrapperHeigh) {
            jQuery('#page-wrapper').css("min-height", jQuery(window).height() + "px");
        }

        if (jQuery('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                jQuery('#page-wrapper').css("min-height", navbarHeigh + "px");
            } else {
                jQuery('#page-wrapper').css("min-height", jQuery(window).height() - 60 + "px");
            }
        }

    }

    fix_height();

    // Fixed Sidebar
    jQuery(window).bind("load", function () {
        if (jQuery("body").hasClass('fixed-sidebar')) {
            jQuery('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    // Move right sidebar top after scroll
    jQuery(window).scroll(function () {
        if (jQuery(window).scrollTop() > 0 && !jQuery('body').hasClass('fixed-nav')) {
            jQuery('#right-sidebar').addClass('sidebar-top');
        } else {
            jQuery('#right-sidebar').removeClass('sidebar-top');
        }
    });

    jQuery(window).bind("load resize scroll", function () {
        if (!jQuery("body").hasClass('body-small')) {
            fix_height();
        }
    });

   /* jQuery("[data-toggle=popover]")
        .popover();*/

    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
        height: '100%'
    })

}