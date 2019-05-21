/**
 * System loader override to avoid workportalflat/webparts requests
 *
 * scoped in a function so we don't mess up system's vars
 */

(function(){

  return;

  // Creates or Defines steal loader
  var steal = window.steal || {};
  // Create or Define BizAgi namespace
  var bizagi = window.bizagi || {};
  bizagi.loader = bizagi.loader || {};

  // debug only
  bizagi.loader.environment = "release";

  // Loader override methods
  (function(){

    var loaderOverride =  {
      /**
       * Auto called function when JS file is loaded to register its webparts
       * @param webpartName Array/String
       */
      registerMobileWebpart: function( webpartName ) {

        if( typeof webpartName === "string" ) {
          webpartName = [webpartName];
        }

        this.webparts = this.webparts || {};

        // Creates a dummy webpart for each one
        webpartName.map(function( name ){
          if( !this.webparts[name] ) {
            this.webparts[name] = {
              "class": "bizagi.workportal.webparts." + name,
              devices: null,
              location: "",
              name: name,
              js: [],
              css: [],
              tmpl: []
            };
          }
          this.webparts[name].initialized = true;
          this.webparts[name].initializing = false;
          this.webparts[name].loadingDeferred = this.webparts[name].loadingDeferred || new $.Deferred();
        }.bind(this));
      }
    };

    Object.keys(loaderOverride).map(function(key){
      bizagi.loader[key] = loaderOverride[key];
    });

  })();

  // Steal override methods
  (function(){
    var loadedWebparts = false;

    steal.origRequest = steal.request;
    steal.request = function (options, success, error) {
      if( !arguments[0] || !arguments[0].src || !(arguments[0].src + "").match(/\/workportalflat\/webparts\//i) ) {
        // If asked for a normal, not workportalflat/webpart, go and do your things
        return this.origRequest( options, success, error );
      }
      else {
        var device = bizagi.detectDevice().replace(/[^a-z0-9]+/ig, "");

        if( !loadedWebparts ) {
          // Is is the 1st time that asked for workportalflat/webpart, lets load all at once

          var prefix = bizagi.loader.useAbsolutePath ? bizagi.loader.basePath + bizagi.loader.getLocationPrefix() : "" + bizagi.loader.getLocationPrefix();
          var js = prefix + "jquery/workportalflat/production/webpart." + device + ".production.js?build=" + bizagi.loader.build;
          var css = prefix + "jquery/workportalflat/production/webpart." + device + ".production.css?build=" + bizagi.loader.build;

          loadedWebparts = true;

          bizagi.loader.loadFile({
            type: "js",
            src: js
          });

          bizagi.loader.loadFile({
            type: "css",
            src: css
          });

        }

        // In any case: register a dummy resource
        var url = arguments[0].id + "";
        bizagi.loader.registerMobileWebpart(device);

        steal.resources[url].completed.resolve();
        steal.resources[url].loaded.resolve();
        steal.resources[url].loading = false;
        steal.resources[url].executing = false;
        steal.resources[url].options.text = JSON.stringify( bizagi.loader.webparts[device] );

        success(steal.resources[url].options.text);
      }

    };
  })();
})();
