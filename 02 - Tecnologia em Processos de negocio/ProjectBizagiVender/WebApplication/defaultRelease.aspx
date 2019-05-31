<%@ Page language="c#" Codebehind="default.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.defaultNew" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BizAgi</title>
</head>
<body>
    <script type='text/javascript' src='jquery/steal.js'></script>
    <script type='text/javascript' src='jquery/bizagi.loader.js'></script>
    <script type="text/javascript" language="javascript">
        // Redefine path to base
        var BIZAGI_PATH_TO_BASE = "";
        var BIZAGI_LANGUAGE = '<%= base.CurrentUICulture.Name %>';
        var BIZAGI_ENVIRONMENT = "release";
        var BIZAGI_DEFAULT_CURRENCY_INFO = {            
            "symbol": "<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>",
            "decimalSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>",
            "groupSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>",
            "decimalDigits": "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"
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
    	loader.init(function() {
    	    loader.start("workportal")
    		.then( function () {
    	    	var workportal  = new bizagi.workportal.facade();
                workportal.execute();
            });	
    	});
    </script>
</body>
</html>
