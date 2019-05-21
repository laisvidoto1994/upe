<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ECMSimpleError.aspx.cs" Inherits="BizAgiBPM.ECMSimpleError" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title><% Response.Write(CResourceManager.RM.GetString("AppErrorTitle")); %></title>
    <link href="css/estilos.css" type="text/css" rel="stylesheet"/>		
	<link href="css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet"/>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:Image ID="img1" ImageUrl="~/img/exceptions/error.png" runat="server" Width="48" Height="48" />
        <br/>
        <table height="30px" width="90%" border="0" cellspacing="1" cellpadding="1" align="Center">
        <tr height="20%">
            <td valign="Top" class="Header" >
            <span ><strong>
                <% Response.Write(CResourceManager.RM.GetString("AppErrorTitle")); %>
            </strong></span>
            </td>
        </tr>
        <tr>
            <td>
            <span id="lblTitle" class="BAMainFontColor">
                <br/>
                <UI:CLabel ID="lblMessage" runat="server" Font-Bold="True" Width="118px"></UI:CLabel>
            </span>
            </td>
        </tr>
        </table>
    </div>
    </form>
</body>
</html>
