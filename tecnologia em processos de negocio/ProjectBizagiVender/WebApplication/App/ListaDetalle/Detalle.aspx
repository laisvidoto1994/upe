<%@ Page Language="c#" CodeBehind="Detalle.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Detalle" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>Detail</title>
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <script src="../../js/implementation.js" language="javascript" type="text/javascript"></script>
    <script src="../../js/WorkPortal/BAWindows/prototype.js" language="javascript" type="text/javascript"></script>
    <script src="../../js/WorkPortal/BAWindows/window.js" language="javascript" type="text/javascript"></script>
    <script src="../../js/WorkPortal/BAWindows/BAWindow.js" language="javascript" type="text/javascript"></script>
    <%WriteHead();%>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
</head>
<body onclick="BAonclick(event)" onload="BAonload()">
    <div class="text" id="popupcalendar">
    </div>
    <div id="oBAContextMenu" class="BAContextMenu">
    </div>
    <% 
        if (A.ReadQFInt("BATest", 0) == 0)
        {
            Header();
        }
    %>
    <table width="100%" border="0" cellspacing="2" cellpadding="2">
        <tr>
            <td align="center">
                <%
                    ((BizAgi.Defs.IMagicForm)GetMagicFormInstance()).ProcessForm();
                %>
            </td>
        </tr>
    </table>
</body>
</html>
