<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="search.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.search" %>
<%@ Import Namespace="Bizagi.MD.BusinessEntities.Security" %>
<%@ Register TagPrefix="uc1" TagName="SelectCategoryItem" Src="../WorkPortal/SelectCategoryItem.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Search</title> 
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<link rel="stylesheet" href="../../css/calendar.css" type="text/css">
        <%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
	</HEAD>
	<body onload="BAonload()">
		<script language="JavaScript"> 

function verifyForm() 
{
	if ( (document.frm.I_From__CreationDate.value.length > 0) && (document.frm.I_To__CreationDate.value.length > 0) ) 
	{
		var dtFrom = getDateFromFormat(document.frm.I_From__CreationDate.value, BA_DATE_FORMAT_MASK);
		var dtTo = getDateFromFormat(document.frm.I_To__CreationDate.value, BA_DATE_FORMAT_MASK);
		if (dtFrom > dtTo) {
			setHelp("", "<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage3"));%>", 3);
			document.frm.I_From__CreationDate.focus();
			return false;
		}
		
	}
	
	if (document.frm.I_ExpiredDays.value.length > 0){
		if ( (document.frm.I_From__ExpiryDate.value.length > 0) || (document.frm.I_To__ExpiryDate.value.length > 0) ) {
			setHelp("", "<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessageExpiredDaysAndExpirationDate"));%>", 3);
			document.frm.I_ExpiredDays.focus();
			return false;
		}
		if (isNaN(document.frm.I_ExpiredDays.value) || document.frm.I_ExpiredDays.value.length > 4){
			setHelp("", "<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessageExpiredDays"));%>", 3);
			document.frm.I_ExpiredDays.focus();
			return false;
		}
	}
	
	return true;
}


		</script>
		<% Header(); %>
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="center">
					<form name="frm" method="get" action="../ListaDetalle/listaitems.aspx">
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td colspan="3" class="header">
									<UI:CLabel runat="server" Text="CaseSearch" id="CLabel1" />
									<script language="javascript">
											BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Menu_Search") %>");
									</script>
								</td>
							</tr>
							<tr>
								<td><UI:CLabel runat="server" Text="CaseNumber" id="CLabel2" /></td>
								<td>
									<input type="text" name="I_radNumber" maxlength="50" size="30">
								</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td class="header" colspan="2">
									<UI:CLabel runat="server" Text="CaseData" id="CLabel30" />
								</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td colspan="3">
									<% Ballon(CResourceManager.RM.GetString("Search"), "", "merlin5.gif", 1); %>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<uc1:SelectCategoryItem id="selectCategoryControl" runat="server"></uc1:SelectCategoryItem>
								</td>
							</tr>
							<tr>
								<td colspan="3">&nbsp;</td>
							</tr>
						</table>
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td class="header" colspan="2">
									<UI:CLabel runat="server" Text="SpecificData" id="CLabel4" />
								</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td width="30%" valign="top"><UI:CLabel runat="server" Text="TotalCaseState" id="CLabel5" /></td>
								<td valign="top" width="50%">
									<input type="radio" name="I_processState" value="<%= BizAgi.Defs.EProcessState.Running.ToString() %>">
									<UI:CLabel runat="server" Text="Pending" id="CLabel6" />
									<input type="radio" name="I_processState" value="<%= BizAgi.Defs.EProcessState.Completed.ToString() %>">
									<UI:CLabel runat="server" Text="Closed" id="CLabel7" />
									<input type="radio" name="I_processState" value="<%= BizAgi.Defs.EProcessState.Aborted.ToString() %>">
									<UI:CLabel runat="server" Text="AbortedCase" id="CLabel8" />
									<input type="radio" name="I_processState" value="<%= BizAgi.UI.WFBiz.CMagicForm.StateAll %>" checked>
									<UI:CLabel runat="server" Text="All" id="CLabel9" />
								</td>
							</tr>
							<tr>
								<%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("FromRadicationDate"), "I_From__CreationDate","",false, this);%>
							</tr>
							<tr>
								<%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("ToRadicationDate"), "I_To__CreationDate","",false, this);%>
							</tr>
							<tr>
								<%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("FromExpirationDate"), "I_From__ExpiryDate","",false, this);%>
							</tr>
							<tr>
								<%BizAgi.UI.Util.CCalendar.dCal(CResourceManager.RM.GetString("ToExpirationDate"), "I_To__ExpiryDate","",false, this);%>
							</tr>
							<tr>
								<td><UI:CLabel runat="server" Text="ExpiredDays" ID="CLabel3" NAME="CLabel3" /></td>
								<td><input type="text" name="I_ExpiredDays" maxlength="5"></td>
							</tr>
							<tr>
								<td colspan="3">&nbsp;</td>
							</tr>
						</table>
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td align="left">
									<table cellpadding="0" cellspacing="0">
										<tr>
											<td>
												<%
									H.WPButton("reset","btnReturn",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnClear"),"Return","sbttn","");
								%>
											</td>
											<td>&nbsp;</td>
											<td>
												<%
									H.WPButton("button","btnSearch",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnSearch"),"Search","sbttn","onclick='if (verifyForm(this)) { this.form.submit(); }'");
								%>
											</td>
										</tr>
									</table>
								</td>
								<td align="right" width="15%">&nbsp;</td>
							</tr>
							<tr>
								<td colspan="2">
									&nbsp;
								</td>
							</tr>
							<% if (this.oBLAuthorization.HasAccessToPage(this.oUser.Credential,AuthorizationPages.BizagiQueries)) {%>
							<tr>
								<td align="<%=ButtonsAlignment%>">
									<%
									H.WPButton("submit","btnQueryFormList",BizAgi.UI.WFBase.CResourceManager.RM.GetString("QueryFormList"),"btnQueryFormList","sbttn","onclick='location.href=\"QueryForm.aspx\"; return false;'");
								%>
								</td>
								<td align="right" width="15%">&nbsp;</td>
							</tr>
							<%}%>
						</table>
						<input type="hidden" name="I_Users" value="<%= BizAgi.UI.WFBiz.CMagicForm.StateAll %>">
					</form>
				</td>
			</tr>
		</table>
		<DIV class="text" id="popupcalendar"></DIV>
		<div id="oBAContextMenu" class="BAContextMenu"></div>
		<script language="javascript">
//	document.forms[0].elements[0].focus();
//	changeOption('idCaseType','idProduct','0');
		</script>
	</body>
</HTML>
