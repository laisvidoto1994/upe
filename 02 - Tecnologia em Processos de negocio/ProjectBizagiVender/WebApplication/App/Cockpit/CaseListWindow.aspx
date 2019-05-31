<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>

<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="CaseListWindow.aspx.cs"
    Inherits="BizAgiBPM.App.Cockpit.CaseListWindow" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>Anslysis Case List</title>
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" type="text/css" rel="stylesheet"/>
    <link href="../../css/Analysis/GraphicReports.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="left">
                <% DrawGrid(); %>
            </td>
        </tr>
    </table>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr style="text-align: right;">
            <td width="100%">
            </td>
            <td style="text-align: right;" align="right">
                <!--<UI:CWPHtmlInputButton runat="server" type="button" value="BtnClose" name="btnClose" ID="btnClose" onclick="parent.CloseCurrentWindow(null);" />-->
            </td>
        </tr>
    </table>
</body>
</html>
