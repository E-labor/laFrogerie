$(document).ready(function() {

    /////// desktop dropdown menu if css transitions not supported
    if (!Modernizr.csstransitions) {
        $('.menu li').hover(function() {
            $(this).children('.sub-menu').css("visibility", "visible").stop().animate({
                opacity: 1,
                top: "15px"
            }, 200);
        }, function() {
            $(this).children('.sub-menu').css("visibility", "hidden").stop().animate({
                opacity: 0,
                top: "34px"
            }, 200);
        });
    }

    ////// responsive menu

    // rebuild the nav
    var $mainNav = $('.menu').children('ul');
    var mobileNav = $('<ul></ul>').appendTo('.header-wrapper header').wrap('<nav class="mobile-nav" id="mobile-menu"></nav>');

    $mainNav.find('li').each(function() {
        var level = $(this).parents('ul').length;
        if (level < 2) {
            $(this).clone().appendTo(mobileNav);
        }
    });

    mobileNav.find('.sub-menu').closest('li').addClass('has-submenu');
    mobileNav.find('.sub-menu').removeClass('sub-menu').addClass('mobile-sub-menu');

    // mobile dropdown
    $('body').addClass('js');

    var $menu = $('#mobile-menu'),
        $menulink = $('.menu-link'),
        $menuTrigger = $('.has-submenu > a');

    $menulink.click(function(e) {
        e.preventDefault();
        $menulink.toggleClass('active');
        $menu.toggleClass('active');
    });

    $menuTrigger.click(function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.toggleClass('active').next('ul').toggleClass('active');
    });




    //////// Tabs to accordion
    var Tabs = {

        el: {
            nav: $(".tab-nav"),
            tabs: $(".tab-nav > li > a"),
            panels: $(".tab-nav > li > section")
        },

        init: function() {
            Tabs.bindUIActions();
        },

        bindUIActions: function() {
            Tabs.el.nav
                .on(
                    'click',
                    'li > a:not(.selected)',
                    function(event) {
                        Tabs.deactivateAll();
                        Tabs.activateTab(event);
                        event.preventDefault();
                    }
            );
        },

        deactivateAll: function() {
            Tabs.el.tabs.removeClass("selected");
            Tabs.el.panels.removeClass("is-open");
        },

        activateTab: function(event) {
            $(event.target)
                .addClass("selected")
                .next()
                .addClass("is-open");
        }

    };

    Tabs.init(); // init the tabs


    ////////// Get Flickr feed
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=45702874@N08&format=json&jsoncallback=?", function(data) {
        var target = ".flickr-feed",
            itemNum = 8;
        for (i = 0; i <= itemNum; i = i + 1) {
            var pic = data.items[i];
            var liNumber = i + 1;
            $(target).append("<li class='flickr-image no-" + liNumber + "'><a title='" + pic.title + "' href='" + pic.link + "'><img src='" + pic.media.m + "' /></a></li>");
        }
    });


    ///////// Get weather from Yahoo api 
    var DEG = "c",
        wQuery = 'select * from weather.forecast where woeid=610555 and u="' + DEG + '"',
        weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(wQuery) + '&format=json&callback=?';

    var enDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        frDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    var weatherIconMap = [
        'tornado',
        'cloud-lightning',
        'tornado',
        'cloud-lightning',
        'cloud-lightning',
        'cloud-snow',
        'cloud-rain',
        'cloud-snow',
        'cloud-snowflake',
        'cloud-rain',
        'cloud-snow',
        'cloud-raindrop',
        'cloud-raindrop',
        'cloud-raindrop',
        'cloud-snow',
        'cloud-snow',
        'cloud-snow',
        'cloud-snowflake',
        'cloud-rain',
        'cloud-snow',
        'cloud-snow',
        'cloud-fog',
        'cloud-fog-sun',
        'cloud-fog',
        'cloud-wind',
        'cloud-snowflake-sun',
        'clouds',
        'cloud-moon',
        'cloud-sun',
        'cloud-moon',
        'cloud-sun',
        'moon-stars',
        'sun',
        'moon-stars',
        'sun',
        'cloud-rain',
        'sun',
        'cloud-lightning',
        'cloud-lightning',
        'cloud-lightning',
        'cloud-rain-sun',
        'cloud-snow',
        'cloud-rain-sun',
        'cloud-snowflake',
        'cloud-sun',
        'cloud-lightning',
        'cloud-snowflake',
        'cloud-lightning'
    ];

    // Make a weather API request (it is JSONP, so CORS is not an issue):
    $.getJSON(weatherYQL, function(data) {

        if (data.query.count == 1) {

            // Data filter
            var weatherO = data.query.results.channel,
                currCond = weatherO.item.condition;


            var currWs = parseFloat(weatherO.wind.speed).toFixed() + ' km/h',
                currH = weatherO.atmosphere.humidity + '%',
                currT = currCond.temp + '°C',
                cuurCode = currCond.code,
                todayT = weatherO.item.forecast[0].low + '°/' + weatherO.item.forecast[0].high + '°C';

            // markup
            var locWeather = '<figure class="w-icon-large ' + weatherIconMap[currCond.code] + '"></figure><span>' + currT + '</span>';

            $('.current-weather div').html(locWeather);
            $('.thermometer-half-full').next('span').html(todayT);
            $('.raindrops').next('span').html(currH);
            $('.wind-wheel').next('span').html(currWs);

            for (var i = 1; i < 4; i++) {
                item = weatherO.item.forecast[i];
                var itemForecast, itemForTemp, itemForCode, itemForDay;

                itemForTemp = item.low + '°<hr/>' + item.high + '°';
                itemForCode = item.code;
                itemForDay = frDays[enDays.indexOf(item.day)];

                itemForecast = '<li><figure class="w-icon ' + weatherIconMap[itemForCode] + '"></figure><span>' + itemForTemp + '</span><p>' + itemForDay + '</p></li>';
                $('.forecast-weather ul').append(itemForecast);
            }


        } else {
            $('.current-weather div').html("Erreur pas de données météo disponibles");
        }
    });

});