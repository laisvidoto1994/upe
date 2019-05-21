<%@ Page language="c#" Codebehind="defaultBizagi.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.defaultNew" %>

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
        var BIZAGI_ENVIRONMENT = '<%= base.BizAgiEnvironment %>';
        var BIZAGI_ENABLE_LOG =  '<%= base.BizAgiEnvironment %>' == 'debug';
        var BIZAGI_ENABLE_CUSTOMIZATIONS  =  false;
        var BIZAGI_DEFAULT_CURRENCY_INFO = {            
            "symbol": "<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>",
            "decimalSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>",
            "groupSeparator": "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>",
            "decimalDigits": "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"
        };
        var BIZAGI_SETTINGS= {            
            "UploadMaxFileSize": "<%= base.ReadAppSettings("UploadMaxFileSize", "1048576") %>"
        };
        
        var BIZAGI_ENABLE_LOG =  '<%= base.BizAgiEnvironment %>' == 'debug';
        
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
