<%@ Page language="c#" Codebehind="PrintVersion.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.PrintVersion" %>
<html>
<head>
<title>Bizagi Printer Friendly Version</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
<link rel="stylesheet" href="../../css/estilosPrint.css" type="text/css">
<script language="JavaScript" src="../../js/ContentManager/ContentManager.js"></script>
<script language="Javascript">
function setHelp(){
    //Printable version does not show help
}
</script>

</head>
<body>
<% Header(); %>
<table width="100%" border="0" cellspacing="2" cellpadding="2">
<tr> 
<td align="center"> 
<%
	((BizAgi.Defs.IMagicForm)GetMagicFormInstance()).ProcessForm();
%>
</td>
</tr>
</table>
</body>
</html>