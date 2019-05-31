<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="defaultipad.aspx.cs" Inherits="BizAgiBPM.defaultipad" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/DTD/strict.dtd">
<html>
<head>
    <title>Bizagi</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="apple-touch-icon-precomposed" href="jquery/workportal/css/tablet/images/BizAgi_logo.png"> 
</head>
<body>  
    <script type='text/javascript' src='jquery/steal.js'></script>
    <script type='text/javascript' src='jquery/bizagi.loader.js?version=1.0001'></script>    
    <script type="text/javascript" language="javascript">
          // Redefine path to base
        var BIZAGI_PATH_TO_BASE = "";
        var BIZAGI_DEFAULT_DEVICE = "tablet";
        var BIZAGI_LANGUAGE = '<%= base.CurrentUICulture.Name %>';
        var BIZAGI_ENVIRONMENT = 'debug';//'release';
        var BIZAGI_DEFAULT_CURRENCY_INFO = {            
            "symbol": "<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>",
            "decimalSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>",
            "groupSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>",
            "decimalDigits": "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"
        };
        var BIZAGI_SETTINGS= {            
            "UploadMaxFileSize": "<%= base.ReadAppSettings("UploadMaxFileSize", "1048576") %>"
        };
        
    	// Gets the loader instance, and load the module
        var loader = bizagi.loader;
    	loader.init(function() {
    	    loader.start("workportal")
    		.then( function () {
    	    	var workportal  = new bizagi.workportal.facade( {"proxyPrefix":""});
                workportal.execute();
            });	
    	});
    </script>
</body>    
</html>