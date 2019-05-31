<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="Application.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Radicar.Application" %>

<HTML>
  <HEAD>
		<title>Application Selection</title>
        <!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
</HEAD>
	<body onload="BAonload()">

		<% Header(); %>
		<br>
		<table align="center" width="90%" border="0" cellspacing="2" cellpadding="2">
		<tr>
		<td>
		<%= CResourceManager.RM.GetString("SelectApplicationMessage") %>
		<script language="javascript">
							BASetLocationFromMain('<%=CResourceManager.RM.GetString("SelectApplication")%>');
							</script>
		</td>
		</tr>
		</table>
		
		<table align="center" width="90%" border="0" cellspacing="2" cellpadding="2" style="margin-left:50px">
			<tr>
				<td align="center">
						<FORM name=frmProblema action=category.aspx method=get>												
						<tr> 
							<td width="10%" valign="top">&nbsp;</td>
							<td colspan="2">
								<% BizAgi.UI.WFBiz.CMagicForm.dApplication(0, this); %>
							</td>
						</tr>
						<tr> 
							<td width="10%">&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr> 
							<td width="10%">&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						</table>
						</FORM></TD></TR></TABLE>		

	</body>
</HTML>
