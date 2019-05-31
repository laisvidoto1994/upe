<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="Inicio.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.Inicio" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
  <HEAD>
    <title>Bizagi Today</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
    
	<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
  </HEAD>
	<body>
    <script type='text/javascript'>
        var reloadUrl;
        var sizeExt;
        var currentFile = location.pathname.search("aspx");
        if (currentFile = !"") {
            sizeExt = location.pathname.search("/App/Inicio/");
            reloadUrl = "http://" + location.hostname + location.pathname.slice(0, sizeExt) + "/index.html";
            location.href = reloadUrl;
        }
     </script>
		<% Header(); %>
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="center">
					<table border="0" cellpadding="2" cellspacing="2" width="90%">
						<!---->
						<% if (BizAgi.WFES.CWorkflowManager.ExtendedDurationEnabled) { %>
						<tr>
							<td class="header" colspan="2" valign="bottom">
								<table width="12" border="0" cellspacing="0" cellpadding="0" align="left">
									<tr>
										<td><img src="../../img/lista/BombilloNegrot.gif" width="16" height="16"></td>
									</tr>
								</table>
								&nbsp;<UI:CLabel runat="server" Text="ExtendedExpiredCases" id=CLabel1 />
							</td>
						</tr>
						<tr>
							<td valign="top">
								<table width="60%" border="0" cellspacing="1" cellpadding="1">
									<%= sExpExtWfClass %>
								</table>
							</td>
							<td valign="top">&nbsp; 
							</td>
						</tr>
						<tr>
							<td valign="top">&nbsp;</td>
							<td valign="top">&nbsp;</td>
						</tr>
						<% } %>
						<!---->

						<tr>
							<td class="header" colspan="2" valign="bottom">
								<table width="12" border="0" cellspacing="0" cellpadding="0" align="left">
									<tr>
										<td><img src="../../img/lista/BombilloRojot.gif" width="16" height="16"></td>
									</tr>
								</table>
								&nbsp;<UI:CLabel runat="server" Text="ExpiredCases" id=CLabel2 />
							</td>
						</tr>
						<tr>
							<td valign="top">
								<table width="60%" border="0" cellspacing="1" cellpadding="1">
									<%= sExpWfClass %>
								</table>
							</td>
							<td valign="top">&nbsp; 
							</td>
						</tr>
						<tr>
							<td valign="top">&nbsp;</td>
							<td valign="top">&nbsp;</td>
						</tr>
						<tr>
							<td colspan="2" valign="top" class="header">
								<table width="12" border="0" cellspacing="0" cellpadding="0" align="left">
									<tr>
										<td><img src="../../img/lista/BombilloAmarillot.gif" width="16" height="16"></td>
									</tr>
								</table>
								&nbsp;<UI:CLabel runat="server" Text="TodayExpirationCases" id=CLabel3 />
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top">
								<table width="60%" border="0" cellspacing="1" cellpadding="1">
									<%= sTodWfClass %>
									<tr>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
									</tr>
								</table>
							</td>
							<td width="50%" valign="top">&nbsp; 
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top">&nbsp;
							</td>
							<td width="50%" valign="top">&nbsp;
							</td>
						</tr>
						<tr>
							<td class="header" colspan="2" valign="top">
								<table width="12" border="0" cellspacing="0" cellpadding="0" align="left">
									<tr>
										<td><img src="../../img/lista/BombilloVerdet.gif" width="16" height="16"></td>
									</tr>
								</table>
								&nbsp;<UI:CLabel runat="server" Text="ThisWeekExpirationCases" id=CLabel4 />
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top">
								<table width="60%" border="0" cellspacing="1" cellpadding="1">
									<%= sFutureWfClass %>
									<tr>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
									</tr>
								</table>
							</td>
							<td width="50%" valign="top">&nbsp; 
							</td>
						</tr>
						<tr>
							<td width="50%" valign="top">&nbsp;</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
						<tr>
							<td width="50%" align="left" valign="top"><UI:CLabel runat="server" Text="TotalUrgentCases" id=CLabel5 />:
								<%= iCaseTotal %>
							</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
						<tr>
							<td width="50%" valign="top">&nbsp;</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
						<tr>
							<td width="50%" align="left" valign="top">
							<a href="../ListaDetalle/listaitems.aspx?<%= CMagicForm.pfxInternal + CMagicForm.InternalField.idPrevAssigned %>=<%= oUser.idUser %>&amp;<%=CMagicForm.pfxInternal + CMagicForm.InternalField.ProcessState %>=<%= BizAgi.Defs.EProcessState.Running %>"><b><UI:CLabel runat="server" Text="CasesIHaveWorkedOn" id=CLabel6 /></b></a>
							</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
<!--						<tr>
							<td width="50%" align="left" valign="top">
							<a href="../ListaDetalle/Event.aspx"><b><UI:CLabel runat="server" Text="Events" id=CLabel7 /></b></a>
							</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
-->						<tr>
							<td width="50%" valign="top">&nbsp;</td>
							<td width="50%" valign="top">&nbsp;</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
		<img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
	</body>
</HTML>
<script languaje=javascript>
	function expandCompress(img, rowName, level){
		var imgPlus = document.getElementById("imgPlus");
		var imgMinus = document.getElementById("imgMinus");
		var level = getControlLevel(rowName) + 1;
		var bExpand = false;

		if (img.src == imgPlus.src) {	
			img.src = imgMinus.src;
			bExpand = true;
			
		} else {
			img.src = imgPlus.src;			
		}
		allElements = document.getElementsByTagName('tr');
		for( i = 0; allElements[i] != null; i++ ) {
			var control = allElements[i];
			
			if (control.id != null && 
				control.id.indexOf(rowName + ".") == 0 && 
				control.id != rowName) {
				
				if (bExpand && getControlLevel(control.id) == level) {
					
					control.style.display = "inline";
				
				} else {
				
					control.style.display = "none";
					imgObj = document.getElementById("btnExpandCompress_" + control.id);
					
					if (imgObj != null)
						imgObj.src = imgPlus.src;
				}
			}
		}
	}
	
	function getControlLevel(sAncestorPath){
		var iCount = 0;
		for (var j = 0; j < sAncestorPath.length; j++) {
			if (sAncestorPath.charAt(j) == '.') {
				iCount ++;
			}			
		}
		return iCount;
	}	
	
</script>