<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="cc1" Namespace="BizAgi.UI.Controls" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="CasesMonitor.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.CasesMonitor" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>CasesMonitor</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script src="../../js/scripts.js"></script>		

		<script language='javascript'>
		function GoToSearch(){
			var oSearchQuery = GetObject('h_redirect');
			if (oSearchQuery.value != ''){
				window.location.href="../ListaDetalle/listaitems.aspx?"+oSearchQuery.value;
			}
		}
		function SubmitForm() {
			var theform;
			if (window.navigator.appName.toLowerCase().indexOf("netscape") > -1) {
				theform = document.forms["Form1"];
			}
			else {
				theform = document.Form1;
			}
			theform.submit();
		}
		</script>
	</HEAD>
	<body MS_POSITIONING="FlowLayout">
		<% Header(); %>
		<form id="Form1" method="post" runat="server">
			<table id="Table1" cellSpacing="1" cellPadding="1" width="90%" align="center" border="0">
				<TR>
					<td class="header" colSpan="2"><UI:CLABEL id="CLabel1" runat="server" Text="Search Preferences"></UI:CLABEL></td>
					<script language="javascript">
								BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("Cases Monitor") %>");
						</script>
				</TR>
				<tr>
					<td align="center">
						<table cellSpacing="0" cellPadding="0" width="90%" border="0">
							<tr>
								<td style="HEIGHT: 8px"><UI:CLABEL id="Clabel2" runat="server" Text="Area"></UI:CLABEL></td>
								<td>&nbsp;</td>
								<td style="HEIGHT: 8px"><asp:dropdownlist id="ddlArea" runat="server" Width="156px"></asp:dropdownlist></td>
								<td>&nbsp;</td>
								<td style="HEIGHT: 8px"><UI:CButton id="btnArea" runat="server" Text="Add" Width="69px"/></td>
								<td style="HEIGHT: 8px" width="40">&nbsp;</td>
								<td style="HEIGHT: 8px"><UI:CLABEL id="Clabel5" runat="server" Text="Skill"></UI:CLABEL></td>
								<td>&nbsp;</td>
								<td style="HEIGHT: 8px"><asp:dropdownlist id="ddlSkill" runat="server" Width="156px"></asp:dropdownlist></td>
								<td>&nbsp;</td>
								<td style="HEIGHT: 8px"><UI:CButton  id="btnSkill" runat="server" Text="Add" Width="69px"/></td>
							</tr>
							<tr vAlign="top">
								<td></td>
								<td></td>
								<td><asp:datagrid id="dgArea" runat="server" AutoGenerateColumns="False" ShowHeader="False">
										<Columns>
											<asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
											<asp:BoundColumn Visible="False" DataField="idArea" HeaderText="idArea"></asp:BoundColumn>
											<asp:BoundColumn DataField="areaDisplayName" HeaderText="areaDisplayName"></asp:BoundColumn>
										</Columns>
									</asp:datagrid></td>
								<td></td>
								<td><INPUT id="h_Area" style="WIDTH: 43px; HEIGHT: 17px" type="hidden" size="1" name="Hidden1"
										runat="server"></td>
								<td></td>
								<td></td>
								<td></td>
								<td><asp:datagrid id="dgSkill" runat="server" AutoGenerateColumns="False" ShowHeader="False">
										<Columns>
											<asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
											<asp:BoundColumn Visible="False" DataField="idSkill" HeaderText="idSkill"></asp:BoundColumn>
											<asp:BoundColumn DataField="skillDisplayName" HeaderText="skillDisplayName"></asp:BoundColumn>
										</Columns>
									</asp:datagrid></td>
								<td><INPUT id="h_Skill" style="WIDTH: 43px; HEIGHT: 17px" type="hidden" size="1" name="Hidden1"
										runat="server"></td>
								<td></td>
							</tr>
							<tr>
								<td><UI:CLABEL id="Clabel3" runat="server" Text="Role"></UI:CLABEL></td>
								<td>&nbsp;</td>
								<td><asp:dropdownlist id="ddlRole" runat="server" Width="156px"></asp:dropdownlist></td>
								<td>&nbsp;</td>
								<td><UI:CButton id="btnRole" runat="server" Text="Add" Width="69px"/></td>
								<td></td>
								<td><UI:CLABEL id="Clabel7" runat="server" Text="Position"></UI:CLABEL></td>
								<td>&nbsp;</td>
								<td><cc1:ctreedropdown id="tddPosition" runat="server" BorderWidth="1px" BorderStyle="Solid" BackColor="White"
										ApplyPanelStyleProperties="true" TextWidth="140"></cc1:ctreedropdown></td>
								<td>&nbsp;</td>
								<td><UI:CButton  id="btnPosition" runat="server" Text="Add" Width="69px"/></td>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td><asp:datagrid id="dgRole" runat="server" AutoGenerateColumns="False" ShowHeader="False">
										<Columns>
											<asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
											<asp:BoundColumn Visible="False" DataField="idRole" HeaderText="idRole"></asp:BoundColumn>
											<asp:BoundColumn DataField="roleDisplayName" HeaderText="roleDisplayName"></asp:BoundColumn>
										</Columns>
									</asp:datagrid></td>
								<td><INPUT id="h_Role" style="WIDTH: 43px; HEIGHT: 17px" type="hidden" size="1" name="Hidden1"
										runat="server"></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td><asp:datagrid id="dgPosition" runat="server" AutoGenerateColumns="False" ShowHeader="False">
										<Columns>
											<asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
											<asp:BoundColumn Visible="False" DataField="idPosition" HeaderText="idPosition"></asp:BoundColumn>
											<asp:BoundColumn DataField="posDisplayName" HeaderText="posDisplayName"></asp:BoundColumn>
										</Columns>
									</asp:datagrid></td>
								<td><INPUT id="h_Position" style="WIDTH: 43px; HEIGHT: 17px" type="hidden" size="1" name="Hidden1"
										runat="server"></td>
								<td></td>
							</tr>
							<tr>
								<td><UI:CLABEL id="Clabel4" runat="server" Text="Location"></UI:CLABEL></td>
								<td>&nbsp;</td>
								<td><cc1:ctreedropdown id="tddLocation" runat="server" BorderWidth="1px" BorderStyle="Solid" BackColor="White"
										ApplyPanelStyleProperties="true" TextWidth="140"></cc1:ctreedropdown></td>
								<td>&nbsp;</td>
								<td><UI:CButton  id="btnLocation" runat="server" Text="Add" Width="69px" /></td>
								<td colSpan="1"></td>
								<td colSpan="4">
									<UI:CLABEL id="CLABEL8" runat="server" Text="DisplayOnlyUserInfo"></UI:CLABEL></td>
								<td><INPUT id="chkOnlyUserInformation" type="checkbox" name="chkOnlyUserInformation" runat="server"
										CHECKED onclick="SubmitForm();"></td>
							</tr>
							<tr>
								<td></td>
								<td>&nbsp;</td>
								<td><asp:datagrid id="dgLocation" runat="server" AutoGenerateColumns="False" ShowHeader="False">
										<Columns>
											<asp:ButtonColumn Text="Delete" CommandName="Delete"></asp:ButtonColumn>
											<asp:BoundColumn Visible="False" DataField="idLocation" HeaderText="idLocation"></asp:BoundColumn>
											<asp:BoundColumn DataField="locDisplayName" HeaderText="locDisplayName"></asp:BoundColumn>
										</Columns>
									</asp:datagrid></td>
								<td><INPUT id="h_Location" style="WIDTH: 43px; HEIGHT: 17px" type="hidden" size="1" name="Hidden1"
										runat="server"></td>
								<td colSpan="7"><INPUT id="h_redirect" type="hidden" runat="server"></td>
							</tr>
						</table>
					</td>
				</tr>
				<TR>
					<td class="header" colSpan="2"><UI:CLABEL id="Clabel6" runat="server" Text="Search Results"></UI:CLABEL></td>
				</TR>
				<tr>
					<td align="center" colSpan="2">
						<% DrawGrid(); %>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
