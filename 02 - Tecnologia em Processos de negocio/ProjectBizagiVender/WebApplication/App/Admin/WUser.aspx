<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WUser.aspx.cs" Inherits="BizAgiBPM.App.Admin.WUser" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>WUser</title>
		
		<link href="../../css/estilos.css" type="text/css" rel="stylesheet"/>
		<link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet"/>
        <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
        <%WriteHead();%>
		<script language="javascript" type="text/javascript" src="../../js/implementation.js"></script>
		<script language="javascript" type="text/javascript" src="../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>
		<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
		<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
		<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>		
		<script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
        <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
        <script language="javascript" type="text/javascript"> var j$ = jQuery.noConflict(true); </script>
		<script language="javascript" type="text/javascript" src="../../js/Admin/WUser.js"></script>
	</head>
	<body  onclick="BAonclick(event)" onload="BAonload()">
		<div id="messageLayer" style="display:none;visibility:hidden" >
		    <div id="messageBackgroundDiv" class="messageBackgroundDiv"></div>
		    <div id="messageDiv">
			    <div id="textContainer">
				    <table>
					    <tr>
						    <td><span id="messageText"></span></td>
					    </tr>
				    </table>
			    </div>
		    </div>
		</div>
		<form id="form1" method="post" runat="server">
			<table cellspacing="0" cellpadding="0" width='100%' border="0">
				<tr><td><span id="TabHTML"></span></td></tr>
				<tr>
				    <td>
					    <!--T1-->
					    <div id='xpTab1' class='BAXPTab'>
						    <asp:table id="tblUserProperties" CssClass='BAXPTabTable' runat="server" cellspacing="0" cellpadding="4" width='100%'>
						        <asp:TableRow><asp:TableCell><br /><br /></asp:TableCell></asp:TableRow>
			                </asp:table>
			                <table cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">			
			                    <tr>
				                    <td>&nbsp;</td>
			                    </tr>
		                    </table>
			                <asp:table id="tblUserAuthentication" CssClass="BAXPTabTable" runat="server" cellSpacing="0" cellPadding="4" width="100%">
				                <asp:TableRow>
					                <asp:TableCell VerticalAlign="Top">
						                <strong>
							                <UI:CLabel runat="server" Text="User Authentication" Font-Underline="True" ID="Clabel1" />
							            </strong><br/><br/>
					                </asp:TableCell>
					                <asp:TableCell VerticalAlign="Top"></asp:TableCell>
				                </asp:TableRow>
			                </asp:table>
			                <table cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">			
			                    <tr>
				                    <td>&nbsp;</td>
			                    </tr>
		                    </table>
					    </div>
					    <!--T2-->
					    <div id='xpTab2' class='BAXPTab'>
					        <asp:table id="tblUserOrganizations" CssClass='BAXPTabTable' runat="server" cellspacing="0" cellpadding="4" width='100%'>
						        <asp:TableRow><asp:TableCell><br /><br /></asp:TableCell></asp:TableRow>
			                </asp:table>
			                <table cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">			
			                    <tr>
				                    <td>&nbsp;</td>
			                    </tr>
		                    </table>
					    </div>
					    <!--T3-->
					    <div id='xpTab3' class='BAXPTab'>
    						<asp:table id="tblUserConfig" CssClass='BAXPTabTable' runat="server" cellspacing="0" cellpadding="4" width='100%'>
						        <asp:TableRow><asp:TableCell><br /><br /></asp:TableCell></asp:TableRow>
			                </asp:table>
			                <table cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">			
			                    <tr>
				                    <td>&nbsp;</td>
			                    </tr>
		                    </table>
					    </div>
					    <!--T4-->
					    <div id='xpTab4' class='BAXPTab' runat="server">
    						<asp:table id="tblUserPropOthers" CssClass='BAXPTabTable' runat="server" cellSpacing="0" cellPadding="4" width='100%'>
						        <asp:TableRow><asp:TableCell><br /><br /></asp:TableCell></asp:TableRow>
			                </asp:table>
			                <table cellspacing="0" cellpadding="4" width="100%" border="0" style="vertical-align:top">			
			                    <tr>
				                    <td>&nbsp;</td>
			                    </tr>
		                    </table>
					    </div>
				    </td>
				</tr>
				<tr>
                    <td><asp:Label id="LblMessage" runat="server" Font-Bold="True" Visible="False" /></td>
                </tr>
				<tr>
				    <td>
				        <div>
				            <table id="Table3">
				                <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
				                <tr>
					                <td><UI:CButton id="btnUpdate" runat="server"/></td>
					                <td><UI:CButton id="btnCancel" runat="server"/></td>
					                <!--<td>Llene información de Organización</td>
					                <td><UI:CButton id="btnNext" runat="server" class="sbttn" Text=">>"/></td>-->
				                </tr>
			                </table>
		                </div>
				    </td>
				</tr>
			</table>					
		</form>
		<div id='alertDiv' style="padding-right:5px;display:none;padding-left:5px;visibility:hidden;padding-bottom:5px;font:bold 12px Verdana, Arial, Helvetica, sans-serif;width:300px;color:#666666;padding-top:5px;height:160px;background-color:#ffffff">
			<table border="0">
				<tr style="height:125px">
					<td align="center">
						<div id="innerText">
						</div>
					</td>
				</tr>
				<tr>
					<td align="center"><input type="button" onclick="Windows.close('alertWindow');" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnClose") %>"/></td>
				</tr>
			</table>
		</div>
        <input type="hidden" id="labelUserAlreadyExists" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("User_Client_Exist") %>"/>
        <input type="hidden" id="labelClientValidationTitle" value="<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ClientValidationTitle1") %>"/>
	</body>
</html>
