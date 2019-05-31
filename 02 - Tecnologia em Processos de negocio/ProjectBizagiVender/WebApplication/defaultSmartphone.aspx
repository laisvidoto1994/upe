<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="defaultSmartphone.aspx.cs" Inherits="BizAgiBPM.defaultNew" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/DTD/strict.dtd">
<html>
<head>
    <title>Bizagi</title>
</head>
<body>  
    <script type='text/javascript' src='jquery/steal.js'></script>
    <script type='text/javascript' src='jquery/bizagi.loader.js'></script>    
    <script type="text/javascript" language="javascript">
          // Redefine path to base
        
        var BIZAGI_PATH_TO_BASE = "";
        var BIZAGI_ENABLE_LOG = false;
    //    var BIZAGI_DEFAULT_DEVICE = "smartphone_ios";
        var BIZAGI_DEFAULT_WIDGET =  "inbox";
        var BIZAGI_LANGUAGE ='<%= base.CurrentUICulture.Name %>';
        var BIZAGI_ENVIRONMENT = 'debug';
        var BIZAGI_DEFAULT_CURRENCY_INFO = {            
            "symbol": "<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>",
            "decimalSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>",
            "groupSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>",
            "decimalDigits": "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"
        };
        var BIZAGI_SETTINGS= {            
            "UploadMaxFileSize": "<%= base.ReadAppSettings("UploadMaxFileSize", "1048576") %>"
        };

        var BIZAGI_DEFAULT_DATETIME_INFO = {
            "shortDateFormat": "<%= base.CurrencyCulture.DateTimeFormat.ShortDatePattern %>",
            "timeFormat": "<%= base.CurrencyCulture.DateTimeFormat.ShortTimePattern %>",
            "longDateFormat": "<%= base.CurrencyCulture.DateTimeFormat.LongDatePattern %>",
            "twoDigitYearMax": "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax %>",
            "twoDigitYearMaxDelta": "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax - System.DateTime.Now.Year %>"
        };
        
    	// Gets the loader instance, and load the module
        var loader = bizagi.loader;
        BIZAGI_USE_ABSOLUTE_PATH=false;
    	loader.init(
    	    {
    	       // useAbsolutePath:true, 
               // basePath:"http://win-ueobu8jecnl/nmv/",
    	        //locationPrefix:"http://win-ueobu8jecnl/nmv/",
                callback:function() {
    	        loader.start("workportal")
        	        .then(
    	              function() {
    	                //  {"proxyPrefix":"http://biz-nestord/modelorender2/"}
    	                var workportal = new bizagi.workportal.facade({ "proxyPrefix": "" });
    	                workportal.execute();
                            bizagi.enableChrono = true;
                            bizagi.chrono.log = function (timer) {
                                if(console && console.info)
                                if(timer && bizagi.chronos[timer] && bizagi.chronos[timer].millis)
                                console.info("Timer " + timer + ": " + bizagi.chronos[timer].millis + "ms");
                            };

    	                 });
    	    }  
    	});


        
    </script>
</body>    
</html>