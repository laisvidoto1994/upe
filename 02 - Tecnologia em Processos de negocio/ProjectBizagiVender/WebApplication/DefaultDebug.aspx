<%@ Page language="c#" Codebehind="default.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.defaultNew" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Bizagi</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="x-ua-compatible" content="IE=Edge,chrome=IE8">

    <link type="image/x-icon" rel="icon" href="favicon.ico"></link>
    <link rel="apple-touch-icon-precomposed" href="jquery/workportal/css/tablet/images/BizAgi_logo.png"> 
    
	<link rel="apple-touch-icon-precomposed" sizes="144x144" href="jquery/workportal/css/tablet/images/BizAgi_logo.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="jquery/workportal/css/tablet/images/BizAgi_logo.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="jquery/workportal/css/tablet/images/BizAgi_logo.png">

</head>
<body onunload="doUnload();">
    <script type='text/javascript' src='jquery/steal.js'></script>
    <script type="text/javascript">document.write("<script type='text/javascript' src='jquery/bizagi.loader.js?_=" + new Date().getTime() + "'></scr" + "ipt>");</script>
    <script type="text/javascript" language="javascript">
        // Gets the loader instance, and load the module
        var loader = bizagi.loader;

        loader.preInit(["bizagiDefault", "<%= base.BizAgiEnvironment %>", undefined, ""], [
            "<%= base.CurrentUICulture.Name %>", "debug", "<%= base.InboxRowsPerPage %>",
            ["<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>", "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>", "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>", "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"],
            ["<%= base.CurrencyCulture.DateTimeFormat.ShortDatePattern %>", "<%= base.CurrencyCulture.DateTimeFormat.ShortTimePattern %>", "<%= base.CurrencyCulture.DateTimeFormat.LongDatePattern %>", "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax %>", "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax - System.DateTime.Now.Year %>"],
            ["<%= base.ReadAppSettings("UploadMaxFileSize", "1048576") %>", "<%= base.ReadAppSettings("SkipSubprocessGlobalForm", "true") %>"], "<%= base.UserPreferencesPage %>",
            "ASP.NET_SessionId", false
        ]);

        loader.init(function() {
            loader.start("workportal")
                .then( function () {
                    var workportal  = new bizagi.workportal.facade();
                    workportal.execute();
                });	
        });
    </script>
	<script type='text/javascript' src="js/BizAgiAJAX.js"></script>
    <script type='text/javascript'>
        function doUnload() {
            if ((top.window.location.href.toString().indexOf("/ThemeBuilder/")) == -1)
                callAjaxURL_NonAsynch("App/Inicio/LogOff.aspx?action='LogOff'");
        }
    </script>
</body>
</html>
