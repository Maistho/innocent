jQuery(function($) {

    var body = $('body');

    /* ==========================================================================
       Fitvids by Chris Coyier
       ========================================================================== */

    function video() {
        $('#wrapper').fitVids();
    }
    video();


    /* ==========================================================================
       Reload all scripts after AJAX load
       ========================================================================== */

    function reload() {
        video();
    }

    /* ==========================================================================
       Ajax Loading based on Ghostwriter by Rory Gibson - https://github.com/roryg/ghostwriter
       ========================================================================== */

    var loading = false;
    var ajaxContainer = $('#ajax-container');

    if (!window.history) {
        return false;
    }
    window.onpopstate = function(event) {
        console.log(event.state, event);
        if (!event.state) {
            return;
        }

        $.get(window.location.href, function(result) {
            var $html = $(result);
            var newContent = $('#ajax-container', $html).contents();
            var title = result.match(/<title>(.*?)<\/title>/)[1];

            ajaxContainer.fadeOut(500, function() {
                document.title = title;
                ajaxContainer.html(newContent);
                $('html').removeClass('loading');
                NProgress.done();
                reload();
                loading = false;
                ajaxContainer.fadeIn(500);
            });
        });
    };

    $('body').on('click', 'a', function(e) {
        if ($(this).prop('href').indexOf(window.location.origin) == -1) {
            return;
        }
        e.preventDefault();
        if (loading === false) {
            var url = $(this).prop('href');
            var title = $(this).attr('title') || null;

            if (url.replace(/\/$/, "") !== window.location.href.replace(/\/$/, "")) {
                loading = true;
                $('html').addClass('loading');
                NProgress.start();
                history.pushState({}, title, url);
                window.onpopstate({state:{}});
            }
        }
    });

    history.replaceState({}, document.title);
});
