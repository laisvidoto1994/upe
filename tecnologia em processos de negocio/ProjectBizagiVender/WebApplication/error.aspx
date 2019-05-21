<!doctype html>
<%@ Page Language="c#" Codebehind="Error.aspx.cs" AutoEventWireup="true" Inherits="BizAgiBPM.Error" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
     <meta http-equiv="expires" content="Wed, 26 Feb 1997 08:00:00 GMT">
     <META http-equiv="Pragma" content="no-cache">
    <title>Error</title>
    <%WriteHead();%>
    <link type="text/css" href="css/Jq/themes/base/ui.all.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="css/WorkPortal/WPCustomStyles.css" type="text/css" />
    <link rel="stylesheet" href="css/errorpage.css" type="text/css" />

    <script language="javascript" src="js/implementation.js" type="text/javascript"></script>
    <script language="JavaScript" src="Localization/LocalizationEN.js" type="text/javascript"></script>
    <script language="javaScript" src="js/scripts.js" type="text/javascript"></script>

    <script type="text/javascript" src="js/jquery-1.11.0.js"></script>
    <script type="text/javascript" src="js/Jquery/ui1104/jquery-ui-1.10.4.js"></script>


    <script type="text/javascript">
    
	$(function() {
		$("#accordion").accordion({
			header: "h3",
			fillSpace: true
		});
	});
	$(function() {
		$("#accordionResizer").resizable({
			resize: function() {
				$("#accordion").accordion("resize");
			},
			minHeight: 200  
		});
	});
	</script>

    <style type="text/css"> 
	.myclass li{
	    display:block;
	}
	</style>
</head>
<body>
    <% if (BizAgi.Defs.BAEnvironment.CBAEnvironmentManager.GetCurrentEnvironmentType() != BizAgi.Defs.EnvironmentType.PRODUCTION)
       { %>
    <form id="error" method="post" runat="server">
        <!-- Accordion -->
        <% if (BShowTableError)
     { %>
            <asp:Image ID="img1" ImageUrl="~/img/exceptions/error.png" runat="server" Width="48"
                Height="48" />&nbsp;<table border="0"><tr><td><UI:CLabel ID="CLabel3" runat="server" Font-Bold="True" Font-Size="Medium"
                    Height="24px" Text="Error:" Width="72px"></UI:CLabel></td><td><UI:CLabel ID="CLabel1" runat="server" Font-Bold="True" Font-Size="Small" Height="33px"
                Text="AppErrorTitle" Width="736px"></UI:CLabel></td></tr> </table>
            
        
       
        <div id="accordion">
            <div>
                <h3>
                    <a href="#">Functional Information</a></h3>
                <div>
                    <UI:CLabel ID="CLabel4" runat="server" Font-Bold="True" Text="Execution List" Width="118px"></UI:CLabel>
                    <!-- List Functional-->
                    <div class="myclass">
                        <p> <%= sHtmBussines.ToString()%> </p>
                    </div>
                    <UI:CLabel ID="CLabel2" runat="server" Text="AppErrorMessage" Font-Bold="True" Width="680px"></UI:CLabel><br />                    
                </div>
            </div>
            <div>
                <h3>
                    <a href="#">Technical Information</a></h3>
                <div>
                   <div class="myclass">
                    <p> <%= sHtmTechnical.ToString() %> </p>
                    </div>
                    
                  
                </div>
            </div>
            <div>
                &nbsp;
            </div>

        </div>
        <% } %>
        <a href="javascript:history.go(-1)"><img src="img/exceptions/refresh.png"  width="16" /></a>
    </form>
<% } else {  %>    
<div id="contentWrap">
<div id="errorBox">
	<div class="top">
	</div>
	<div class="content">
    <img class="icon" src="img/exceptions/errorIcon.png" width="64" height="64" alt="Error Icon" />
    <h2> <% Response.Write(CResourceManager.RM.GetString("ErrorProduction")); %> </h2>
    <p class="divline"></p>
     <p><% Response.Write(CResourceManager.RM.GetString("ErrorProductionfooter")); %></p>
	</div>
    <div class="bottom">
	</div>
</div>
</div>
<% } %>    
    
</body>
</html>
