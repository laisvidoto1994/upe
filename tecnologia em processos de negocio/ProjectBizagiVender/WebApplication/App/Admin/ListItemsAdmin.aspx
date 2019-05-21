<%@ Page Language="c#" CodeBehind="ListItemsAdmin.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.ListaItemsAdmin" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html>
<head>
    <title>
        <% Response.Write(CResourceManager.RM.GetString("CaseList"));%></title>
    <link href="../../css/estilos.css" rel="stylesheet" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/WPDragCases.js"></script>
    <%WriteHead();%>
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
    <script language="javascript" type="text/javascript">
		var eSubmitReassign = 1;
		var eSubmitAbort    = 2;
	
		function SubmitForm(eSubmitType)					
		{
			var bChecked = false;
			var bWIChecked = false;
		
			for (i = 0; i < frm.length; i++)
			{
				if (frm.elements[i].name == "<% H.W(BizAgi.Defs.AdminDefs.CaseAdminKey); %>" && frm.elements[i].checked)
				{
					bChecked = true;
					break;
				}
			}
			
			for (i = 0; i < frm.length; i++)
			{
				if (frm.elements[i].name == "<% H.W(BizAgi.Defs.AdminDefs.WorkItemAdminKey); %>" && frm.elements[i].checked)
				{
					bWIChecked = true;
					break;
				}
			}

			switch(eSubmitType)
			{
				case eSubmitReassign:
					if (!bWIChecked)
					{
						alert("<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage6"));%>");
						return;
					}

					frm.<% H.W(BizAgi.Defs.AdminDefs.UserActionKey); %>.value = <% H.W((int)BizAgi.Defs.UserAdminAction.Reassign); %>;
					frm.action = "ListUsers.aspx";
					frm.submit();
					break;
				case eSubmitAbort:
					if (!bChecked)
					{
						alert("<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage4"));%>");
						return;
					}

					frm.<% H.W(BizAgi.Defs.AdminDefs.CaseActionKey); %>.value = <% H.W((int)BizAgi.Defs.CaseAdminAction.Abort); %>;
					frm.action = "ItemsAdminAction.aspx";
					if(confirm("<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage5"));%>"))
					{
							frm.submit();
					}

					break;
			}
			
		}
    </script>
</head>
<body onload="BALoaDDPage()">
    <% Header(); %>
    <form name="frm" action="" method="get">
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td class="header" align="center">
                <UI:CLabel runat="server" Text="SelectCasesToManage" />
            </td>
            <script language="javascript">
				BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("SelectCasesToManage") %>");
            </script>
        </tr>
    </table>
    <table width="100%" border="0" cellspacing="2" cellpadding="2">
        <tr>
            <td align="center">
                <% DrawGrid(); %>
            </td>
        </tr>
    </table>
    <p>
        &nbsp;</p>
    <table width="60%" border="0" align="center">
        <tr>
            <td colspan="2" class="header">
                <UI:CLabel runat="server" Text="BtnInvalidate" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <UI:CLabel runat="server" Text="AbortCasesDescription" />
            </td>
        </tr>
        <tr>
            <td>
                <UI:CLabel runat="server" Text="AbortCasesReason" />
            </td>
            <td>
                <textarea name="txtReason" cols="40" rows="3" class="mask" preset="atexto" maxlength="1000"></textarea>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <UI:CHtmlInputButton runat="server" type="button" name="btnAnular" value="BtnInvalidate"
                    onclick="SubmitForm(eSubmitAbort);">
            </td>
        </tr>
    </table>
    <br>
    <table width="60%" border="0" align="center">
        <tr>
            <td colspan="2" class="header">
                <UI:CLabel runat="server" Text="BtnReassign" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <UI:CLabel runat="server" Text="ReassignActivitiesDescription" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <UI:CHtmlInputButton runat="server" type="button" name="btnReasignar" value="BtnReassign"
                    onclick="SubmitForm(eSubmitReassign);">
            </td>
        </tr>
    </table>
    <br>
    <br>
    <br>
    <input type="hidden" name="<% H.W(BizAgi.Defs.AdminDefs.UserActionKey); %>">
    <input type="hidden" name="<% H.W(BizAgi.Defs.AdminDefs.CaseActionKey); %>">
    <input type="hidden" name="I_ORGANIZATION" value="<%= idOrganization %>">
    </form>
</body>
</html>
