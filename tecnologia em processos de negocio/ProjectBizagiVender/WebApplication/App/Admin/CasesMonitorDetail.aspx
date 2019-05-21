<%@ Page language="c#" Codebehind="CasesMonitorDetail.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.CasesMonitorDetail" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Monitor</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<LINK href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script src="../../js/scripts.js"></script>
	</head>
	<body MS_POSITIONING="FlowLayout">
		<form id="Form1" method="post" runat="server">
		<br>
			<table id="Table1" cellSpacing="1" cellPadding="1" width="90%" align="center" border="0">
				<% DrawDetailedData(); %>
			</table>
		</form>
	</body>
</html>
