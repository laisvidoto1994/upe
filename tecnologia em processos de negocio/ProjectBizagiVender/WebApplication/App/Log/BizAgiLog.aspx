<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="BizAgiLog.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Log.BizAgiLog" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Bizagi Log</title>
	    <meta name="GENERATOR" content="Microsoft Visual Studio .NET 7.1" />
		<meta name="CODE_LANGUAGE" content="C#" />
		<meta name="vs_defaultClientScript" content="JavaScript" />
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
		<link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
        <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
		<%WriteHead();%>
		<script language="javaScript" type="text/javascript" src="../../js/implementation.js"></script>
	</head>
	<body MS_POSITIONING="FlowLayout">
		<% Header(); %>
		<form id="Form1" method="post" runat="server">
			<table width="100%" border="0">
				<tr>
					<td><asp:Label id="LblTitle1" runat="server"></asp:Label>
					</td>
				</tr>
				<tr>
					<td>
					<br>
					</td>
				</tr>
				
				<tr>
					<td>
						<% DrawLogTable(); %>
					</td>
				</tr>
				<tr>
					<td align="center">
						<UI:CButton id="btnBack" runat="server" Text="LogLog_Back" class="sbttn" />
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>
