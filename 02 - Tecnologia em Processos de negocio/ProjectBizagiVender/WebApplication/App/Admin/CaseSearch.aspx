<%@ Page Language="c#" CodeBehind="CaseSearch.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.CaseSearch" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="uc1" TagName="SelectCategoryItem" Src="../WorkPortal/SelectCategoryItem.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>CaseSearch</title>
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript">        j$ = jQuery.noConflict(true);</script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/CaseSearch.js"></script>
</head>
<body onload="BAonload()">
    <form name="frm" method="post" action="ListItemsAdmin.aspx">
    <span id="SpanHeader" runat="server"></span>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td class="header" colspan="3">
                <input type="hidden" name="h_CaseSearch" value="h_CaseSearch" />
                <b>
                    <UI:CLabel runat="server" Text="SearchCasesToManage" /></b>
            </td>
        </tr>
        <tr>
            <td width="30%">
                <b>
                    <UI:CLabel runat="server" Text="CaseNumber" /></b>
            </td>
            <td width="60%">
                <input type="text" name="I_radNumber" maxlength="50" size="30" />
            </td>
            <td width="10%">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td colspan="3">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="header" colspan="3">
                <b>
                    <UI:CLabel runat="server" Text="Classification" /></b>
            </td>
        </tr>
        <tr>
            <td colspan="2" valign="top">
                <uc1:SelectCategoryItem ID="selectCategoryControl" runat="server"></uc1:SelectCategoryItem>
            </td>
            <td valign="bottom" align="left">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td colspan="3">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="header" colspan="3">
                <b>
                    <UI:CLabel runat="server" Text="SpecificData" /></b>
            </td>
            <td>
                <% Ballon(CResourceManager.RM.GetString("Search"), "", "merlin5.gif", 1); %>
            </td>
        </tr>
        <tr>
            <td width="15%" valign="top">
                <b>
                    <UI:CLabel runat="server" Text="CurrentUserName" /></b>
            </td>
            <td valign="top" colspan="2">
                <input type="text" name="I_USERFULLNAME" maxlength="50" size="30" />
            </td>
        </tr>
        <tr>
            <td width="15%" valign="top">
                <b>
                    <UI:CLabel runat="server" Text="CurrentUserPosition" /></b>
            </td>
            <td valign="top" colspan="2">
                <input type="text" name="I_USERPOSITION" maxlength="50" size="30" />
            </td>
        </tr>
        <tr>
        </tr>
        <tr>
            <td colspan="3">
                <table border="0" width="75%">
                    <tr>
                        <%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("FromRadicationDate"), "I_From__CreationDate", "", false, this);%>
                    </tr>
                    <tr>
                        <%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("ToRadicationDate"), "I_To__CreationDate", "", false, this);%>
                    </tr>
                </table>
            </td>
        </tr>
        <%= GetOrganizationFilter() %>
        <tr>
            <td colspan="3">
                &nbsp;
            </td>
        </tr>
    </table>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="<%=ButtonsAlignment%>">
                <table>
                    <tr>
                        <td>
                            <% H.WPButton("reset", "btnReset", BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnClear"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnClear"), "sbttn", "");%>
                        </td>
                        <td>
                            <% H.WPButton("button", "btnSearch", BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnSearch"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnSearch"), "sbttn", "onclick='verifyForm()'"); %>
                        </td>
                    </tr>
                </table>
            </td>
            <td align="right" width="15%">
                &nbsp;
            </td>
        </tr>
    </table>
    <input type="hidden" name="I_ProcessState" value="<%= BizAgi.Defs.EProcessState.Running.ToString() %>" />
    <input type="hidden" name="I_Users" value="<%= BizAgi.UI.WFBiz.CMagicForm.StateAll %>" />
    <input type="hidden" name="h_idApp" id="h_idApp" value="<%= strIdAppAuth %>" />
    <input type="hidden" id="labelValidationMessage" value="<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage3"));%>"/>
    <input type="hidden" id="labelBASetLocationFromMain" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("SearchCasesToManage") %>"/>
    </form>
    <div class="text" id="popupcalendar">
    </div>
    <div id="oBAContextMenu" class="BAContextMenu">
    </div>
</body>
</html>
