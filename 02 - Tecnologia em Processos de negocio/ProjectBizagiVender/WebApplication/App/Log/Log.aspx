<%@ Page language="c#" Codebehind="Log.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Log.Log" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Log</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript">
			function openGraphicQuery() {
				window.scrollTo(0, 10000);
				window.open('../Cockpit/graphicquery.aspx?analysisType=2&CaseId=<% =A.ReadQFInt("idCase") %>' , '', 'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no');
			}

			function backURL() {
				location.href = '<% =ReturnURL %>';
			}
		</script>
	</HEAD>
	<body MS_POSITIONING="GridLayout">
		<% Header(); %>
		<table cellSpacing="2" cellPadding="2" width="100%" border="0">
			<tr>
				<td align="right">
					<UI:CHyperlink ID="LnkActivities" runat="server">AppLog_ByActivities</UI:CHyperlink>|
					<UI:CHyperlink ID="LnkEntities" runat="server">AppLog_ByEntities</UI:CHyperlink>|
					<UI:CHyperlink ID="LnkUsers" runat="server">AppLog_ByUsers</UI:CHyperlink>|
					<UI:CHyperlink ID="LnkAdmin" runat="server">AppLog_ByAdmin</UI:CHyperlink></td>
			</tr>
			<tr>
				<td align="left" valign="top">
					<table width="90%" align="center" border="0" cellspacing="2" cellpadding="2">
						<tr>
							<td width="60%" valign="top">
								<table width="100%" align="center" border="0" cellspacing="2" cellpadding="2">
									<tr>
										<td width="20%">
											<asp:Label id="LblTitle1" Font-Bold="True" runat="server"></asp:Label></td>
										<td>
											<asp:Label id="LblLabel1" runat="server"></asp:Label></td>
									</tr>
									<tr>
										<td>
											<asp:Label id="LblTitle2" Font-Bold="True" runat="server"></asp:Label></td>
										<td>
											<asp:Label id="LblLabel2" runat="server"></asp:Label></td>
									</tr>
									<tr>
										<td>
											<asp:Label id="LblTitle3" Font-Bold="True" runat="server"></asp:Label></td>
										<td>
											<asp:Label id="LblLabel3" runat="server"></asp:Label></td>
									</tr>
									<tr>
										<td>
											<asp:Label id="LblTitle4" Font-Bold="True" runat="server"></asp:Label></td>
										<td>
											<asp:Label id="LblLabel4" runat="server"></asp:Label></td>
									</tr>
									<tr>
										<td colspan="2"><asp:hyperlink ID="LnkBack" runat="server"></asp:hyperlink></td>
									</tr>
								</table>
							</td>
							<td valign="top" align="right">
								<table width="100%" align="center" border="0" cellspacing="2" cellpadding="2">
								<form ID="log" method="post" runat="server">
									<tr>
										<td width="50%"><asp:Label id="LblSearchTitle1" Font-Bold="True" Visible="False" runat="server"></asp:Label></td>
										<td align="right"><asp:TextBox ID="TxtSearchField1" Visible="False" MaxLength="30" runat="server"></asp:TextBox></td>
									</tr>
									<tr>
										<td><asp:Label id="LblSearchTitle2" Font-Bold="True" Visible="False" runat="server"></asp:Label></td>
										<td align="right"><asp:TextBox ID="TxtSearchField2" Visible="False" MaxLength="30" runat="server"></asp:TextBox></td>
									</tr>
									<tr>
										<td colspan="2" align="right">
										<table border="0" >
											<tr>
												<td>
													<UI:CButton ID="BtnSearch" Visible="False" Runat="server" /> 
												</td>
												<td>
													<UI:CButton ID="BtnClear" Visible="False" Runat="server" CssClass="sbttn" />
												</td>
											</tr>
										</table>
										</td>
									</tr>
								</form>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td align="middle">
					<% DrawFormLog(); %>
				</td>
			</tr>
			<tr align="middle">
				<td><br>
					<form name="frmBack">
					<table border="0" align="center">
					<tr>
					<td>
						<UI:CWPHtmlInputButton runat="server" value="LogLog_GraphicQuery" name="btnGraphicQuery" onclick="openGraphicQuery();">
					</td>
					<td>
						<UI:CWPHtmlInputButton runat="server" ID="BtnBack"  type="button" value="LogLog_Back" name="btnRegresar" onClick="backURL();"  tabindex="1">
					</td>
					</tr>
					</table>
					</form>
				</td>
			</tr>
		</table>
	</body>
</HTML>
