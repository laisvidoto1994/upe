<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Render.aspx.cs" Inherits="BizAgiBPM.App.Render.Render" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>Render</title>         
    </head>
    <body>
         <script type='text/javascript' src='../../jquery/js/bizagi.resourceLocator.js'></script>
         <script type='text/javascript' src='../../jquery/js/lib/steal.js'></script>
         <script type="text/javascript" language="javascript">
        // Redefine path to base
            var BIZAGI_PATH_TO_BASE = "../../";
            var BIZAGI_PATH_TO_BASE_FROM_STEAL = "../../../";
            steal.curDir(BIZAGI_PATH_TO_BASE_FROM_STEAL)
            .then(
            // REFERENCES
                bizagi.getJavaScript("common.base.lib.jquery"),
                bizagi.getJavaScript("common.base.lib.json"),
                bizagi.getJavaScript("bizagi.render.facade")
            )
            .then(function () {
                // BEGIN SCRIPT

                var rendering = new bizagi.rendering.facade();
                rendering.execute();

                // END OF SCRIPT
            });
            steal.start();
    </script>       
    </body>
</html>
