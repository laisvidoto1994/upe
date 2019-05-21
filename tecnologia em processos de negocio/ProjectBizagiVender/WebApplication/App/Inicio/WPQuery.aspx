<%@ Page language="c#" Codebehind="WPQuery.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.WPQuery" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPQuery</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
    <script language="JavaScript" src="../../js/WorkPortal/WPToolBarMenu.js"></script>	
	<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
    <script language="JavaScript" src="../../js/scripts.js"></script>	
	<script language=javascript src="../../js/WorkPortal/WPTree.js"></script>
	<script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
	<script language="JavaScript" src="../../js/BizAgiAJAX.js"></script>
	
	<link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">
	<link rel="stylesheet" href="../../css/WorkPortal/WPContextMenu.css" type="text/css">

	<script language="javascript">
		function editStoredQuery(){
			if (idCM != null){
				var idStoredQuery = idCM - 40000;
				LoadMainPage("../ListaDetalle/SaveQuery.aspx?idStoredQuery="+idStoredQuery+"&idQueryForm=-1");
			}
		}

		function deleteStoredQuery(){
				var idStoredQuery = idCM - 40000;
					var return_value = confirm('<% Response.Write(CResourceManager.RM.GetString("ConfirmDelete"));%>');

					if (return_value == true) {			
						var sURL = "../ListaDetalle/QueryForm.aspx?idStoredQueryDel="+idStoredQuery+"&idQueryForm=-1";
						callAjaxURL(sURL, null);
						
						setTimeout("LoadMainPage('../ListaDetalle/listaitems.aspx?I_processState=Running')", 1000);
                        setTimeout("window.location.reload()", 1000);
					}
		}

		function deleteCube(){
				var idCube = idCM - 70000;
					var return_value = confirm('<% Response.Write(CResourceManager.RM.GetString("ConfirmDelete"));%>');

					if (return_value == true) {				
						var sURL = "../Ajax/AJAXGateway.aspx?action=3&idCube="+idCube;
						callAjaxURL(sURL, null);
						setTimeout("window.location.reload()", 1000);
					}
		}
    </script>
  </head>
  <body class="BAMnColor LeftTabBg"  onload="initContextMenu(); expandTree();" > 
		<%=TreePageHTML%>
		<%=TreePageContextMenu%>
    <img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
    <img src="../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
	<img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
	

  </body>
</html>
