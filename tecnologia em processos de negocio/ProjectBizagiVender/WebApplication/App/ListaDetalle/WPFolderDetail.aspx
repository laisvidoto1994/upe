<%@ Page language="c#" Codebehind="WPFolderDetail.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.WPFolderDetail" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 
<html>
  <head>
    <title>Folder Detail</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
<% 			
	if (Request.QueryString["x2xl"] == null || Request.QueryString["x2xl"] == string.Empty || Request.QueryString["x2xl"] != "true") {
%>
      <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
      <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
      <script language="JavaScript" src="../../js/WorkPortal/WPDragCases.js"></script>
      <script language=javascript src="../../js/WorkPortal/WPDDPositionElement.js"></script>
<%
	}
%>
	<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
	<script language="JavaScript" src="../../js/scripts.js"></script>
	<script language="javascript">
		var recycleBin = null;
		function onDropCase(idCase,x,y){
				x = x-200-10; //Left Panel and horizontal toggle
				y = y-50-30; //Menu and location frame
				if (recycleBin == null){
					var bin = document.getElementById("RecycleBin");
					recycleBin = BADDCreateContainer(bin);
				}
				if (recycleBin.validate(x,y)){
					document.getElementById("CaseToDelete").value = idCase;
					SubmitForm();
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
		function RefreshSmartFolders(){
			parent.BALeftPanel.BARefreshData('BACustomFolders');
		}
	</script>
 </head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="BALoaDDPage()">
<form id="Form1" method="post" runat="server">
<% 			
	if (Request.QueryString["x2xl"] == null ||
		Request.QueryString["x2xl"] == string.Empty ||
		Request.QueryString["x2xl"] != "true") {
		
		Header(); 
	}
%>


<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr> 
	<td align="center"> 
		<% DrawGrid(); %>
	</td>
  </tr>
  <tr>
  <td align="left">
	<table border="0" style="float:left">
	<tr>
	<td rowspan="2"><img src="../../img/WorkPortal/Folders/FolderConfigure.png"></td>
	<td><b><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPFolder")%>: </b><%=FolderName %></td>
	</tr>
	<tr>
	<td width="300px"><%=String.Format(BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPFolderClick"),String.Format("<a href=\"{0}\">",FolderLink),"</a> ")%></td>
	</tr>
	</table>
	<% if (casesCounter > 0){%>
	<table border="0" style="float:left">
	<tr>
	<td><div id = "RecycleBin"><img  width=48 height = 48 src="../../img/WorkPortal/Folders/DeleteCase.gif"></div></td>
	<td><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPFolderRecycleBin")%></td>
	</tr>	
	</table>
	<%}%>
  </td>
  </tr>
</table>
<input type="hidden" id="CaseToDelete" runat="server" enableViewState="false" />
<script language=javascript>
<%=AdditionalJavaScript%>
</script>
</form>
</body>
</html>
