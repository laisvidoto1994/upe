<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@	Page language="c#" Codebehind="Waiting.aspx.cs"	AutoEventWireup="false"	Inherits="BizAgiBPM.App.ListaDetalle.Waiting" %>
<HTML>
	<HEAD>
		<title>Waiting Page</title>
		<META http-equiv="Content-Type" content="text/html; charset=windows-1252">
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<LINK href="../../css/calendar.css" type="text/css" rel="stylesheet">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" src="../../js/BizAgiAJAX.js"></script>
	</HEAD>
	<body onclick="BAonclick(event)" onload="BAonload()">
		<DIV class="text" id="popupcalendar"></DIV>
		<% Header(); %>
		<form name="frm">
			<table width="100%" border="0" cellspacing="2" cellpadding="2">
				<tr>
					<td align="center">
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td align="left" colspan="3" class="header" style="TEXT-ALIGN: left">
									<span id="lblTitle" name="lblTitle" ><% ShowCurrentAsynchTask();%> </span>
								</td>
							<tr>
								<td>
									<table>
										<TR>
											<td><b>
												<UI:CLabel runat="server" Text="Waiting_Process" ID="lblProcessName" NAME="lblProcessName" />: &nbsp;&nbsp;&nbsp;
											</b></td>
											<td><asp:Label id="lblProcess" Runat="server"></asp:Label></td>
										</TR>
										<TR>
											<td><b>
												<UI:CLabel runat="server" Text="Waiting_RadNumber" ID="lblRadNumberName" NAME="lblRadNumberName" />: &nbsp;&nbsp;&nbsp;
											</b></td>
											<td><asp:Label id="lblRadnumber" Runat="server"></asp:Label></td>
										</TR>
									</table>
								</td>
							</tr>
							<tr><td>&nbsp;</td></tr>
							<tr>
								<td align="center">
									<img src="../../img/img/barra/Processing.gif">
								</td>								
							</tr>
							<tr>
								<td align="center" style="font-size: 12px;FONT-WEIGHT: bold">
									<span id="lblTaskDisplayName" name="lblTaskDisplayName" ><% ShowCurrentAsynchTask();%> </span>
								</td>								
							</tr>
							<tr>
							</tr>
						</table>
						<input type=hidden name="idCase" value="<%=A.ReadQFString("idCase")%>" />
			</table>
		</form>
	</body>
	<script language="javascript">
	function refresh(){
    try{
            openBACase(<%=A.ReadQFString("idCase")%>,"");
        }catch(e){
		    document.frm.submit();
        }
	}
	
	function getCurrentAsynchExecution(idCase,idAsynchWorkitem){

		var url = "../../App/Ajax/AJAXGateway.aspx?action=3000&idCase="+idCase+"&idAsynchWorkitem="+idAsynchWorkitem;
		callAjaxURL(url, getCurrentAsynchExecution_Callback);
	}

		function getCurrentAsynchExecution_Callback(strData){
		try 
		{
			var rData = eval("("+strData+")");
			
			if (rData.asynchExecution.error){
				window.location = "AsynchWorkitemError.aspx";
				return;
			}
			
			if (rData.asynchExecution.processing) {
				document.getElementById("lblProcess").innerText = rData.asynchExecution.process;
				document.getElementById("lblRadnumber").innerText = rData.asynchExecution.radNumber;
				document.getElementById("lblTaskDisplayName").innerText = "<%=WAITING_STRING%>" + rData.asynchExecution.taskDisplayName;
				document.getElementById("lblTitle").innerText = "<%=WAITING_STRING%>" + rData.asynchExecution.taskDisplayName;
				
				window.setTimeout("getCurrentAsynchExecution(<%=A.ReadQFString("idCase")%>,<%=A.ReadQFString("idAsynchWorkitem")%>)", 3000);
				
			} else {
				window.setTimeout("refresh()", 3000);
			}		
			
		} catch(e) {
			window.setTimeout("refresh()", 3000);		
		}
	}
	
	window.setTimeout("getCurrentAsynchExecution(<%=A.ReadQFString("idCase")%>,<%=A.ReadQFString("idAsynchWorkitem")%>)", 3000);
	
	</script>
</HTML>
