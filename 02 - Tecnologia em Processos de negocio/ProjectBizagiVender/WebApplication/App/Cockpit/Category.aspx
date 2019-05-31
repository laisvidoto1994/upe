<%@ Page language="c#" Codebehind="Category.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Cockpit.Category" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>Category Selection</title>
        <!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
    <!--[if lte IE 8]> <style type="text/css"> #floater1Div { position: absolute; bottom: auto; right: auto; top: expression( ( -10 - floater1Div.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' ); left: expression( ( -20 - floater1Div.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' ); } #divClose { bottom: -3px; left: 0; } </style> <![endif]-->
    <!--[if lte IE 7]> <link href="../../css/estilos.css" type="text/css" rel="stylesheet" /> <![endif]-->
	</head>
	<body MS_POSITIONING="FlowLayout" onload="BAonload()">
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript">

			function verifyForm() {
				var i;
				for (i=1; i < 100; i++)
				{
					if (document.getElementsByName("idCat" + i.toString()).length > 0)
					{
						if (eval("document.frmCategory.idCat" + i.toString() + ".selectedIndex") == 0)//(document.frmProblema.idCat1.selectedIndex == 0)) 
						{
							setHelp("<% Response.Write(CResourceManager.RM.GetString("ClientValidationTitle1")); %>", "<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage1")); %>", 3);
							return false;
						}
					}
					else
						return true;
				}
				
			}

			function showProbDesc(sSrcList, sDestList, iFormIndex, iDestComp) {
				//Encontrar la longitud de los arreglos
				var iDestArrLen = eval("arr" + sDestList + ".length");

				//Encontramos el valor del elemento seleccionado
				var iSelValue = eval("document.forms[" + iFormIndex + "]." + sSrcList + ".options[document.forms[" + iFormIndex + "]." + sSrcList + ".selectedIndex].value")
				
				if (iSelValue == "") {
					setHelp(document.sDefHelpTitle, document.sDefHelpText, document.iDefHelpType);
				}

				//Recorremos el arreglo destino
				for (var i = 0; i < iDestArrLen; i++) {

					//Ubicar el campo deseado en el arreglo destino
					if ((eval("arr" + sDestList + "[i][" + iDestComp + "] == '" + iSelValue + "'")) || (eval("arr" + sDestList + "[i][" + iDestComp + "] == '" + "'"))) {
						eval("setHelp('"<% Response.Write(CResourceManager.RM.GetString("CockpitCategory_CaseDescription")); %>"', arr" + sDestList + "[i][0],1)");
						break;
					}
				}
			}
			
			function getWfClass() {
				var iWfClassId = 0;

				if (verifyForm()) {
					for (var i = 1; ; i++) {
						//alert(eval("document.forms[0].idCat" + 10));
						//alert(document.all(eval("document.forms[0].idCat" + i)));
						if (eval("document.forms[0].idCat" + i) == null) {
							break;

						} else {
							iWfClassId = eval("document.forms[0].idCat" + i + ".options[document.forms[0].idCat" + i + ".selectedIndex].value");
						}
					}
					
					//alert(iWfClassId);
					window.open('../Log/graphicqueryframe.aspx?mode=bi&sMeasure=BottleNecks&iWfClassId=' + iWfClassId, '', 'fullscreen=yes,scrollbars=auto,menubar=yes,toolbar=yes');
				}
			}

		</script>
		<% Header(); %>
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="center">
					<form name="frmCategory" method="GET" action="../Log/graphicqueryframe.aspx" onSubmit="return verifyForm();">
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td colspan="3" class="header">
									<UI:CLabel runat="server" Text="SelectCategory" />
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<% Ballon(CResourceManager.RM.GetString("SelectCategory"), ""); %>
								</td>
							</tr>
							<tr>
								<td colspan="3">
									<% BizAgi.UI.WFBiz.CMagicForm.dCategory(System.Convert.ToInt32(Request.QueryString["idApp"]), true, this); %>
								</td>
							</tr>
							<tr>
								<td width="30%">&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
							<tr>
								<td width="30%">&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
						</table>
						<table width="90%" border="0" cellspacing="2" cellpadding="2">
							<tr>
								<td align="left">
									<UI:CHtmlInputButton type="button" class="sbttn" name="btnGraphicQuery" id="btnGraphicQuery" value="BtnQuery" onclick="getWfClass();" runat="server">
									<!--<input class="sbttn" type="submit" value="Siguiente &gt;&gt;" onClick="openWindowFullScreen('../Log/graphicqueryframe.aspx?mode=bi', 'no', 'no', 'no');" tabindex="4">-->
								</td>
								<td align="right" width="15%">&nbsp;</td>
							</tr>
						</table>
					</form>
				</td>
			</tr>
		</table>
		<script language="javascript">
			document.getElementsByName("idCat1").item(0).focus();
			changeOption('idCat1','idCat2','0');
		</script>
	</body>
</html>
