<%@ Page language="c#" Codebehind="WPSearch.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.WPSearch" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPSearch</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
	<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
    <script language="JavaScript" src="../../js/scripts.js"></script>
    <script language=javascript>
    
    function SearchByRadNumber(){
		var oRadNumberControl = document.getElementById("RadNumber");
    	if (oRadNumberControl != null){
			parent.BAMainFrame.location.href = "../ListaDetalle/listaitems.aspx?I_processState=ALL&I_Users=ALL&I_radNumber="+oRadNumberControl.value;
		}
    }
    </script>
  </head>
  
<body >
<P><span id="SpanHeader" runat="server"></span></P>
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
	<tr>
	<td>
	<table width="100%" border="0">
		<tr>
			<td class="header" colspan="2"><UI:CLabel runat="server" Text="BasicSearch" /></td>
		</tr>
		<tr>
			<td><b><UI:CLabel runat="server" Text="CaseNumber" /></b></td><td><input id="RadNumber" style="width:60">&nbsp;<img src="../../img/WorkPortal/SearchCase.gif" border="0" align=absmiddle onclick="SearchByRadNumber()" style="cursor:hand"></td>
		</tr>
		<tr>
			<td colspan = "2"><a href="javascript:LoadMainPage('../ListaDetalle/search.aspx')"><UI:CLabel runat="server" Text="BizagiSearch" /></a></td>
		</tr>
	</table>	
	<tr>	
		<td align="center">
			<span id="SpanQueryForm" runat="server"></span>
		</td>
	</tr>
</table>
<a href="javascript:LoadMainPage('../WorkPortal/ConfigureFilteredFolder.aspx?iQueryFormId=10015')">folders</a>
</body>
</html>
