<%@ Page language="c#" Codebehind="ItemsAdminAction.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.ItemsAdminAction" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
<head>
	<title>Case List</title>
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
	<%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script language="javascript" type="text/javascript" > var j$ = jQuery.noConflict(true);</script>
    <script language="javascript" type="text/javascript" src="../../js/Admin/ListAdminAction.js"></script>
</head>
<body>
	<P><span id="SpanHeader" runat="server"></span></P>
	<table width="90%" border=0 align="center">
		<tr>
			<td>
				<span id="SpanTitle" runat="server"></span>
			</td>
		</tr>
		<tr>
			<td>
				<% WriteReassignList(); %> 
			</td>
		</tr>
	</table>
	
</body>
</html>
