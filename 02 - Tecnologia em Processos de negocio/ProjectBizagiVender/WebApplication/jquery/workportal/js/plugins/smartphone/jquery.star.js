/* 
author oscaro
based on plugin 
 * An iOS toast (like) notification to star and unstar items
  based on the idea https://github.com/safajirafa/jquery-star-notification
 */

(function ( $, window, document, undefined ) {

    $.fn.starNotification = function ( options ) {

        options = $.extend( {}, $.fn.starNotification.options, options );

        return this.each(function () {

            // Notification box html
            var $notificationBox = $('<div></div>').addClass('star-notification');
            var $starType = $('<span class="bz-cm-icon"></span>').addClass(options.typeIcon);
            var $starLabel = $('<label></label>');
                $starLabel.text(options.starLabel);
                // Create notification
                $notificationBox.append($starType).append($starLabel);   
                // Append notification while user can see it
                $('body').append($notificationBox);
                
                // Remove DOM notificationBox to avoid "trash" after shown
                setTimeout(function() {
                $('.star-notification').remove();
                }, options.fadeOutTime);
                
         //   });

        });
    };

    $.fn.starNotification.options = {
        fadeOutTime: 700, // Same time as animation duration in css
        typeIcon:'default',
        starLabel: 'Starred'     
    };

})( jQuery, window, document );