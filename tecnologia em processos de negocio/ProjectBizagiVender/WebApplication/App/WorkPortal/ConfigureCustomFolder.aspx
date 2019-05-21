<%@ Page language="c#" Codebehind="ConfigureCustomFolder.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.WorkPortal.ConfigureCustomFolder" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>ConfigureCustomFolder</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="javascript">
		
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
		function SaveWPQuery(){
		       if (GetObject('txtName').value == ""){
				    setHelp(document.sDefHelpTitle, '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCustomFoldersNameWarning") %>', document.iDefHelpType);			
		       }
		       else{											
				GetObject('h_Button').value = "btnSave";		
				SubmitForm();
		       }
		}
		function RefreshCustomFolders(){
			parent.BALeftPanel.BARefreshData('BACustomFolders');
		}		
		function RemoveSpecialCharacters(){
			GetObject('txtName').value = GetObject('txtName').value.replace(/#/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/"/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/&/g,"");
			GetObject('txtName').value = GetObject('txtName').value.replace(/'/g,"");
			
		}
		</script>
	</HEAD>
	<body onload="BAonload();" MS_POSITIONING="FlowLayout">
		<form id="Form1" method="post" runat="server">
			<table width="100%" border="0">
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCustomFoldersConfigurationHeader") %></td>
				</tr>
				<tr>
					<td colSpan="2">
						<table width="100%" border="0">
							<tr>
								<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCustomConfigurationDescription") %><br>
								</td>
								<td><IMG src="../../img/WorkPortal/Folders/FolderConfigure.png"></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationFolderInfo") %>
					</td>
				</tr>
				<tr>
					<td><b><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationFolderName") %></b>
					</td>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCustomFoldersConfigurationFolderNameDesc") %>
					</td>
				</tr>
				<tr>
					<td></td>
					<td><asp:textbox id="txtName" MaxLength="50" runat="server"></asp:textbox></td>
				</tr>
				<tr>
					<td colSpan="2">
						<%
							H.WPButton("button","btnSave",BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigurationSave"),"Save","sbttn","onclick='SaveWPQuery();'");
						%>
					</td>
				</tr>
			</table>
			<script language='javascript'>
			document.sDefHelpTitle='<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigHelpHeader") %>'
			document.sDefHelpText='';
			document.iDefHelpType=1;
			printWizardMagic("merlin1.gif");
			setHelp(document.sDefHelpTitle,"", document.iDefHelpType);	
			
			<%=AditionalJavacriptCode%>		

			</script>
			<script language="javascript">
					BASetLocationFromMain('<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFoldersConfigHelpHeader") %>');
			</script>

			<INPUT id="h_IdWPFolder" type="hidden" runat="server">
			<INPUT id="h_IdWPParentFolder" type="hidden" runat="server">
			<INPUT id="h_Button" type="hidden" runat="server" NAME="h_Button">
		</form>
	</body>
</HTML>
