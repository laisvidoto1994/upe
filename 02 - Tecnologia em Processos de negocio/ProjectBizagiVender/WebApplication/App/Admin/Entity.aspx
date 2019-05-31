<%@ Page Language="c#" CodeBehind="Entity.aspx.cs" AutoEventWireup="False" Inherits="BizAgiBPM.App.Admin.Entity" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Entity</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript">        var j$ = jQuery.noConflict(true);</script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/Entity.js"></script>
    <script language="javascript" type="text/javascript">
        var localCache = null;
        function RegisterCache() {
            if (localCache == null) {
                localCache = new Cache();
            }
        }
        RegisterCache();
    </script>
</head>
<body ms_positioning="GridLayout" onclick="BAonclick()" onload="BAonload()">
    <div class="text" id="popupcalendar">
    </div>
    <div id="oBAContextMenu" class="BAContextMenu">
    </div>
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <table align="center" width='90%'>

        <tr>
            <td>
                <span id="SpanEntity" runat="server"></span>
            </td>
        </tr>
                <tr>
            <td>
                <%								
                    bHookRespWrite = false;
                    Ballon(BizAgi.UI.WFBase.CResourceManager.RM.GetString("Entities"), "", "merlin1.gif", 1);
                    bHookRespWrite = true; 
                %>
            </td>
        </tr>
    </table>
    <% bHookRespWrite = false;	 %>
</body>
</html>
