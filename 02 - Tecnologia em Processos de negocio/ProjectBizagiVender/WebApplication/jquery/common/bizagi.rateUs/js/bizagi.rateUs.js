/**
 * @fileOverview BizAgi Rate Us action for mobile hybrid
 * This plugin will show the rate us dialog
 * @author: Bizagi Mobile Team
 */

/**
 * @namespace common
 * @class bizagi.rateUs
 * @memberof rendering/flat
 * @classdesc rateUs plugin to show the rateUs dialog to mobile only users.
 * @borrows {}
 * @exports bizagi.rateUs
 * @constructor
 */

bizagi = bizagi || {};

(function($) {
  /**
   * Asks for rate the app (android only)
   */
  bizagi.rateUs = function( ) {

    if( bizagi.override.enableRateUS &&
      bizagi.util.isCordovaSupported() &&
      bizagi.detectSO() === "android" ) {
      /**
       * Stored object with the user's login information
       * @type Object {}
       */
      var logins = null;
      /**
       * Whether or not to use de system dialog
       * @type {boolean}
       */
      var useSystemVersion = false;

      try {
        logins = JSON.parse(bizagi.util.getItemLocalStorage("BizagiLogins"));
      }
      catch( e ) {}

      logins = logins || {};
      logins.every = 20; // App loadings (20 login will shoot the dialog)
      logins.minLapsedTime = 1000 * 60 * 60 * 24 * 30; // Minimum on first rate rate (30 days)
      logins.nextRateIn = Math.max( logins.nextRateIn, 1 );
      logins.rate = {
        rated: ( logins.rate && logins.rate.rated ),
        version: ( logins.rate && logins.rate.version ? logins.rate.version : null ),
        time: ( logins.rate && logins.rate.time ? logins.rate.time : (new Date()).getTime() )
      };

      if( logins.actualVersion !== bizagi.version.client.actual() ) {
        logins.actualVersion = bizagi.version.client.actual();
        logins.nextRateIn = logins.every;
      }
      else {
        logins.nextRateIn --;
      }

      bizagi.util.setItemLocalStorage("BizagiLogins", JSON.stringify(logins) );

      var onAction = function onAction( action ) {
        var logins = JSON.parse(bizagi.util.getItemLocalStorage("BizagiLogins"));
        switch (action) {
          case "rate":
            window.open("market://details?com.bizagi.smartphone");
            /**
             * There is just android
             */
            /**
             if ( bizagi.detectSO() === "android" ) {
                            window.open("market://details?com.bizagi.smartphone");
                        }
             else if (bizagi.detectSO() === "ios") {
                            window.open("itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8"); // or itms://
                        }
             */
            logins.rate = {
              rated: true,
              version: bizagi.version.client.actual(),
              time: (new Date()).getTime()
            };
            break;
          case "never":
            logins.rate = {
              rated: false,
              version: bizagi.version.client.actual(),
              time: (new Date()).getTime()
            };
            break;
          case "later": // & any other
            // Ask the next week, lets say that the next rate time will be in 7 days by saying that we did rate ( 30 - 7 ) days before
            var lastRateWas = (new Date()).getTime() + ( 1000 * 60 * 60 * 24 * 7 ) - logins.minLapsedTime;
            logins.rate.time = (new Date(lastRateWas) ).getTime();
            logins.nextRateIn = 10000; // Just a flag
            break;
          //case "close": // & any other
          default:
            // Close
            return;
        }
        bizagi.util.setItemLocalStorage("BizagiLogins", JSON.stringify(logins));
      };

      if(
        logins.rate.version !== logins.actualVersion &&
        (
          logins.nextRateIn === 0 ||
          (
            logins.rate.time &&
            (new Date( )).getTime() > ( new Date( logins.rate.time ) ).getTime( ) + logins.minLapsedTime
          )
        )
      ) {

        if( useSystemVersion ) {
          if ( navigator &&
            navigator.notification &&
            navigator.notification.confirm ) {
            navigator.notification.confirm (
              bizagi.localization.getResource("bizagi-rateus-title", "Like using Bizagi?"),
              function(button) {
                if (button === 1) {    // Now
                  onAction("rate");
                } else if (button === 2) { // Later
                  onAction("later");
                } else if (button === 3) { // No
                  onAction("never");
                }
              },
              bizagi.localization.getResource("bizagi-rateus-description","Please take a minute to rate us!"),
              [
                bizagi.localization.getResource("bizagi-rateus-yes","YES"),
                bizagi.localization.getResource("bizagi-rateus-later","REMIND ME LATER"),
                bizagi.localization.getResource("bizagi-rateus-no","NO")
              ]
            );
          }
        }
        else {

          var $body = $(document.body);
          var bodyProps = {
            overflow: $body.css("overflow"),
            height: "",
            width: ""
          };

          var $holderModal = $("<div class=\"bizagiRateUS_blackout\"></div>")
            .click(function(event){
              event.stopPropagation();
            });

          var close = function close() {
            $holderModal.remove();
            $body.css(bodyProps);
          };
          var doAction = function doAction ( event, action ) {
            event.stopPropagation();
            event.preventDefault();
            onAction(action);
            close();
          };

          var $modalContent = $("<div class=\"bizagiRateUS_content\"></div>")
            .click(function(event){
              event.stopPropagation();
            });

          var $modalContentBody = $("<div class=\"bizagiRateUS_content_body\"></div>");

          var $modalContentBizagi = $("<img class=\"bizagiRateUS_logo\" src=\"" + bizagiConfig.proxyPrefix + "jquery/common/bizagi.rateUs/img/bizagi-logo.svg\" />");
          var $modalContentClose = $("<div class=\"bizagiRateUS_close\"><i class=\"km-icon km-cancel km-notext\"></i></div>")
            .click(function(event){
              doAction(event, "later");
            });
          var $modalContentImg = $("<img class=\"bizagiRateUS_content_image\"/>")
            .prop("src", bizagiConfig.proxyPrefix + "jquery/common/bizagi.rateUs/img/stars.png");
          var $modalContentTitle = $("<h1></h1>")
            .text(bizagi.localization.getResource("bizagi-rateus-title", "Like using Bizagi?"));
          var $modalContentText = $("<p></p>")
            .text(bizagi.localization.getResource("bizagi-rateus-description", "Please take a minute to rate us!"));


          var $modalOptions = $("<div class=\"bizagiRateUS_options\"></div>");
          var $modalOptionsHorizontal = $("<div class=\"bizagiRateUS_options_horizontal\"></div>");
          var $modalOptionNo = $("<div class=\"ui-bizagi-render-button new secondary\">" + bizagi.localization.getResource("bizagi-rateus-no", "NO") + "</div>")
            .click(function(event){
              $(this).addClass("loading");
              doAction(event, "never");
            });
          var $modalOptionNotNow = $("<div class=\"ui-bizagi-render-button new secondary\">" + bizagi.localization.getResource("bizagi-rateus-later", "REMIND ME LATER") + "</div>")
            .click(function(event){
              $(this).addClass("loading");
              doAction(event, "later");
            });
          var $modalOptionYes = $("<div class=\"ui-bizagi-render-button new primary\">" + bizagi.localization.getResource("bizagi-rateus-yes", "YES") + "</div>")
            .click(function(event){
              $(this).addClass("loading");
              doAction(event, "rate");
            });

          $modalContentBody
            .append($modalContentImg)
            .append($modalContentTitle)
            .append($modalContentText)
            .append($modalContentClose)
            .append($modalContentBizagi);
          $modalContent.append( $modalContentBody );

          $modalOptionsHorizontal
            .append( $modalOptionNo )
            .append( $modalOptionNotNow );
          $modalOptions
            .append($modalOptionsHorizontal)
            .append( $modalOptionYes );
          $modalContent.append( $modalOptions );

          $holderModal.append( $modalContent );

          $body.css({
            overflow: "hidden",
            height: "100%",
            width: "100%"
          });
          $(window.document.body).append( $holderModal );
        }
      }
    }
  };
})(jQuery);
