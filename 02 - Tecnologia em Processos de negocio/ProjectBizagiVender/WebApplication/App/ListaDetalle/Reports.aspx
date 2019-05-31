<%@ Page language="c#" Codebehind="Reports.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Reports" %>
<html>
  <head>
    <title>Reports</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
      <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
  </head>
<body>

<% Header(); %>

<table width="100%" border="0" cellspacing="2" cellpadding="2">
  <tr> 
	<td align="center"> 
<object ID="ctlFlexConsultaDB"
	classid="CLSID:32DCA9BB-6A71-4E54-AAFD-23C33BEC06B9" 
	CODEBASE="../../Cab/ctlFlexDB.CAB#version=1,0,0,0"
	width="740" height="530" VIEWASTEXT>
    <param name="DSNDB" value="<%=sODBC%>" >
    <param name="BackColor" value="&HF5E7E8">
</object>
	</td>
  </tr>
</table>
</body>
</html>