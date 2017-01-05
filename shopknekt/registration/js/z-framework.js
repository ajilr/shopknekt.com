"use strict";

$(function () {

    var scriptloader = function scriptloader(url, options) {
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        return jQuery.ajax(options);
    };

    var cssloader = function cssloader(href) {
        var cssLink = $("<link>");
        //IE hack: append before setting href
        $("head").append(cssLink);
        cssLink.attr({
            rel: "stylesheet",
            type: "text/css",
            href: href
        });
    };

    if ($(".magnific-popup-img").length > 0 || $(".magnificpopup-parent-container").length > 0) {
        scriptloader("http://s.zivro.com/p/lib/magnific-popup/js/jquery.magnific-popup.min.js").done(function (script, textStatus) {
            cssloader("http://s.zivro.com/p/lib/magnific-popup/css/magnific-popup.css");
            if ($(".magnific-popup-img").length > 0) {
                $('.magnific-popup-img').magnificPopup({type: 'image'});
            } else {
                $('.magnific-popup-container').magnificPopup({delegate: 'a', type: 'image', gallery: {enabled: true}});
            }
        });
    }

    if ($(".owl-carousel").length > 0) {
        scriptloader("http://s.zivro.com/p/lib/owl-carousel/js/owl.carousel.min.js").done(function (script, textStatus) {
            $('div[class="owl-carousel"]').each(function (index, item) {
                // Handle No of Items
                var noofItems = $(item).data('items') == null ? 4 : parseInt($(item).data('items'));
                // Margin
                var margin = $(item).data('margin') == null ? 10 : parseInt($(item).data('margin'));
                // Owl Carousel Function
                $(item).owlCarousel({
                    margin: margin,
                    loop: true,
                    autoWidth: true,
                    itemsSelector: "item",
                    items: noofItems
                });
            });
        });
    }

    if($("#z_contact_form").length >  0) {
        scriptloader("http://s.zivro.com/p/lib/parsley/parsley.min.js").done(function (script, textStatus) {
          var $form = $('#zivro_contact_form');
          $form.parsley().on('field:validated', function() {
              var ok = $('.parsley-error').length === 0;
              $('.bs-callout-info').toggleClass('hidden', !ok);
              $('.bs-callout-warning').toggleClass('hidden', ok);
          }).on('form:submit', function() {
              //var formData = JSON.stringify($form.serializeArray());
              //console.log(formData);
              var formData = $form.serialize();
              $.ajax({
                  url: $form.attr('action'),
                  type: 'POST',
                  data: formData,
                  success: function(bkendjson) {
                      $('input[type="submit"]').prop('disabled', true);
                      var apijsonresult = jQuery.parseJSON(bkendjson);
                      if(apijsonresult.status === 'OK') {
                          $('.bs-callout-warning').toggleClass('hidden', true);
                          $('.bs-callout-info').toggleClass('hidden', false);
                          $('.bs-callout-info').toggleClass('success', true);
                          $('.bs-callout-info').toggleClass('alert', true);
                          $('.bs-callout-info').toggleClass('alert-success', true);
                          $("#successheader").html("Got it");
                          $("#successMessage").html("Will Get back to you soon");
                      } else {
                          $('.bs-callout-warning').toggleClass('hidden', false);
                          $('.bs-callout-info').toggleClass('hidden', true);
                          $("#errorMessage").html("Please try your request later ...");
                      }
                  }
              });
              return false;
          });
        });
    }


    /*
    if ($('a[href*=#]:not([href=#])').length) {
        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    }
    */

    if ($('ul.onepagenav').length) {
        var navlinks = $("ul.onepagenav li").children();
        var aArray = []; // create the empty aArray
        for (var i = 0; i < navlinks.length; i++) {
            var navlink = navlinks[i];
            var ahref = $(navlink).attr('href');
            aArray.push(ahref);
        }

        $(window).scroll(function () {
            var windowPos = $(window).scrollTop();
            var windowHeight = $(window).height();
            var docHeight = $(document).height();

            for (var i = 0; i < aArray.length; i++) {
                var theID = aArray[i];
                if (theID != null) {
                    var divPos = $(theID).offset().top;
                    var divHeight = $(theID).height();
                    if (windowPos >= divPos && windowPos < divPos + divHeight) {
                        $("a[href='" + theID + "']").addClass("active");
                    } else {
                        $("a[href='" + theID + "']").removeClass("active");
                    }
                }
            }

            if (windowPos + windowHeight == docHeight) {
                if (!$("ul.onepagenav li:last-child a").hasClass("active")) {
                    var navActiveCurrent = $(".active").attr("href");
                    $("a[href='" + navActiveCurrent + "']").removeClass("active");
                    $("ul.nav li:last-child a").addClass("active");
                }
            }
        });
    }

    if ($('.navbar-topfix-onscroll').length) {
        var vH = $(window).height();
        var dH = $(document).height();
        $('div[class="navbar-topfix-onscroll"]').each(function (index, navitem) {
            var offset = $(item).data('offset') == null ? 80 : parseInt($(item).data('offset'));
            var slideheight = vH - offset;
            $(window).on('scroll', function () {
                if ($(window).scrollTop() > slideheight) {
                    $(navitem).addClass('navbar-fixed-top');
                } else {
                    $(navitem).removeClass('navbar-fixed-top');
                }
            });
        });
    }

    if ($('#map-zcanvas').length) {
        var title = $('#map-zcanvas').data('title');
        var marker_icon = $('#map-zcanvas').data('marker-icon');
        var lat = $('#map-zcanvas').data('lat');
        var lng = $('#map-zcanvas').data('lng');
        scriptloader("https://maps.googleapis.com/maps/api/js").done(function (script, textStatus) {
            var usrlatlng = new google.maps.LatLng(lat, lng);
            var zivro_map = new google.maps.Map(document.getElementById('map-zcanvas'), {
                center: usrlatlng,
                zoom: 14,
                scrollwheel: false,
                title: "" + title
            });
            var marker = new google.maps.Marker({
                position: usrlatlng,
                title: title
            });
            if (marker_icon != null && marker_icon != '') {
                marker.setIcon(marker_icon);
            }
            if (mapstyles != null && mapstyles != '') {
                zivro_map.setOptions({ styles: mapstyles });
            }
            marker.setMap(zivro_map);
        });
    }

    if ($('#z-flexi-grid').length) {
          var col_width = $('#z-flexi-grid').data('col-width') == null ? 280 : parseInt($('#z-flexi-grid').data('col-width'));
          scriptloader("http://s.zivro.com/p/lib/masonry/masonry.pkgd.min.js").done(function (script, textStatus) {
              var elem = document.querySelector('#z-flexi-grid');
              var msnry = new Masonry( elem, {
                  itemSelector: '.z-flexi-grid-item',
                  columnWidth: col_width
              });
          });
      }
});

$(document).ready(function() {
    $('#teams').multiselect({
        templates: { // Use the Awesome Bootstrap Checkbox structure
            li: '<li><div class="checkbox"><label></label></div></li>'
        }
    });
    $('.multiselect-container div.checkbox').each(function (index) {

        var id = 'multiselect-' + index,
            $input = $(this).find('input');

        // Associate the label and the input
        $(this).find('label').attr('for', id);
        $input.attr('id', id);

        // Remove the input from the label wrapper
        $input.detach();

        // Place the input back in before the label
        $input.prependTo($(this));

        $(this).click(function (e) {
            // Prevents the click from bubbling up and hiding the dropdown
            e.stopPropagation();
        });

    });
});
