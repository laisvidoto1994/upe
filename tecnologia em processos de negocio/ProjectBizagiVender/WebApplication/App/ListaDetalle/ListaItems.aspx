<%@ Page language="c#" Codebehind="ListaItems.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.ListaItems" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN
"http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <title>Case List</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
<% 			
	if (Request.QueryString["x2xl"] == null || Request.QueryString["x2xl"] == string.Empty || Request.QueryString["x2xl"] != "true") {
%>
      <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
      <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">

<%
	}
%>
<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
<script language="JavaScript" src="../../js/scripts.js"></script>
<script language="JavaScript" src="../../js/WorkPortal/WPDragCases.js"></script>

 </head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="BALoaDDPage()">

<% 			
	if (Request.QueryString["x2xl"] == null ||
		Request.QueryString["x2xl"] == string.Empty ||
		Request.QueryString["x2xl"] != "true") {
		
		Header(); 
	}
%>


<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr> 
	<td align="left"> 
		<% DrawGrid(); %>
	</td>
  </tr>
</table>

</body>
</html>