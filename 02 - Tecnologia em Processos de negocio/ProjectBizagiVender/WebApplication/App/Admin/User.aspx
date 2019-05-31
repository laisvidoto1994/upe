<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="User.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.User" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
  <HEAD>
		<title>User</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">

		<%WriteHead();%>
		<script language="JavaScript" src="../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript">
			function unCheckRelated(checkctl)
			{
				var id = checkctl.id;
				var idParts = id.split('_');
				var idOrganization = idParts[2];
				var idUserProperty = idParts[1];
				var allChecks = document.getElementsByTagName("input");
				
				if (checkctl.checked){
					for (var i = 0; i < allChecks.length; i++){
						if (allChecks[i].type == "checkbox"){
							var iCheck = allChecks[i];
							if (iCheck.id.indexOf("SingMultOrgCheck_" + idUserProperty) >= 0 && iCheck.id != id){
								//alert(iCheck.id);
								iCheck.checked = false;
							}
						}
					}
				}
			}
			
			
		</script>
</STYLE>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
		<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
		
	<script language=""javascript??>
		
		var addedObserver = false;
		function addOnDestroyObserver(){
					myObserver = {
						onDestroy: function(eventName, win) {
							var div = document.getElementById('alertDiv');
							div.style.visibility = 'hidden';
							div.style.display = 'none';
							div.innerHTML = '';
						}
					}
					Windows.addObserver(myObserver);
		}
		
		function DisplayAlert(sMessage)
		{
			var div = document.getElementById('alertDiv');
			div.style.display = 'block';
			div.style.visibility = 'visible';
			var innerText = document.getElementById("innerText");
			innerText.innerHTML = sMessage;
			
			var BADialog = new Window('alertWindow', { title: '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ClientValidationTitle1") %>', width:'300px', height:'150px', resizable: false, hideEffect:Element.hide, showEffect:Element.show, destroyOnClose: true});
			BADialog.setContent('alertDiv', true, true);
			BADialog.showCenter(true);
			if (!addedObserver){
				addOnDestroyObserver();
				addedObserver = true;
			}
		}

		function btnSMSearch_CallBack_onclick(oValue) {
			if(oValue != null){
				var oOption = oValue[0];
				if (oOption.value.length > 0){
					document.all["hdnSMId_" + oValue[2]].value = oOption.value;
					document.all["lblSMText_" + oValue[2]].innerText = oOption.text;
				}
			}
		}

		function btnSMSearch_onclick(sPage, sId) {
			var oOption = document.createElement("OPTION");
			BAWindowParam = new Array();
			BAWindowParam.push(oOption);
			BAWindowParam.push("");	//JSDFilter
			BAWindowParam.push(sId);	//UserProperty Id
			ShowBAWindowModal("Bizagi", 600, 400, sPage, btnSMSearch_CallBack_onclick);
		}
	</script>
</HEAD>
	<body>
		<div id="messageLayer" style="DISPLAY:none; VISIBILITY:hidden" >
			<div id="messageBackgroundDiv" class="messageBackgroundDiv"></div>
				<div id="messageDiv">
					<div id="textContainer">
						<table>
							<tr>
								<td>
									<span id="messageText">					
									</span>
								<td></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
<DIV></DIV>
		<form id="Form1" method="post" runat="server">
			<P><span id="SpanHeader" runat="server"></span></P>
			<asp:table id="tblUserProperties" runat="server" cellspacing="1" cellpadding="1" HorizontalAlign="Center"
				BorderWidth="0" width="90%" >
				<asp:TableRow >
					<asp:TableCell VerticalAlign="Top" class="Header" colspan="2">
							<UI:CLabel runat="server" Text="User Properties" Font-Underline="False" /></STRONG><BR>
							<script language="javascript">
									BASetLocationFromMain("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("User Properties") %>");
							</script>
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top"></asp:TableCell>
				</asp:TableRow>
				<asp:TableRow >
					<asp:TableCell >
							&nbsp;
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top">&nbsp;</asp:TableCell>
				</asp:TableRow>
			</asp:table>
			<TABLE>			
				<TR>
					<TD>&nbsp;</TD>
				</TR>
			</TABLE>
			<asp:table id="tblUserAuthentication" runat="server" cellspacing="1" cellpadding="1" HorizontalAlign="Center"
				BorderWidth="0" width="90%">
				<asp:TableRow>
					<asp:TableCell VerticalAlign="Top">
						<STRONG>
							<UI:CLabel runat="server" Text="User Authentication" Font-Underline="True" ID="Clabel1" /></STRONG><BR>
						<BR>
					</asp:TableCell>
					<asp:TableCell VerticalAlign="Top"></asp:TableCell>
				</asp:TableRow>
			</asp:table>
			<TABLE id="Table3" cellSpacing="1" cellPadding="1" width="90%" align="center" border="0">
				<TR>
					<TD>&nbsp;</TD>
					<TD>&nbsp;</TD>
				</TR>
				<TR>
					<TD vAlign="top"></TD>
					<TD><asp:Label id="LblMessage" runat="server" Font-Bold="True" Visible="False" /></TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD>&nbsp;</TD>
				</TR>
				<TR>
					<TD height=16></TD>
					<TD height=16>
					
					<UI:CButton id="btnUpdate" runat="server" class="sbttn"/>
					
					</TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD>&nbsp;</TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD>
						<asp:HyperLink id="LinkListUsers" runat="server" NavigateUrl="ListUsers.aspx">
							<UI:CLabel runat="server" Text="BackToUserList" ID="Clabel2" />
						</asp:HyperLink>&nbsp;&nbsp;
					</TD>
				</TR>
				<TR>
					<TD>&nbsp;</TD>
					<TD>&nbsp;</TD>
				</TR>
			</TABLE>
		</form>
		<div id='alertDiv' style='PADDING-RIGHT:5px;DISPLAY:none;PADDING-LEFT:5px;VISIBILITY:hidden;PADDING-BOTTOM:5px;FONT:bold 12px Verdana, Arial, Helvetica, sans-serif;WIDTH:300px;COLOR:#666666;PADDING-TOP:5px;HEIGHT:160px;BACKGROUND-COLOR:#ffffff'>
			<table border="0" align="center">
				<tr style="HEIGHT:125px">
					<td align="center">
						<div id="innerText">
						</div>
					</td>
				</tr>
				<tr>
					<td align="center"><input type="button" onClick="Windows.close('alertWindow');" value="Close"></td>
				</tr>
			</table>
		</div>
	</body>
</HTML>
