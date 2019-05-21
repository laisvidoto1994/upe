<%@ Page language="c#" Codebehind="WPTree.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Inicio.WPTree" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>WPTree</title>
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
	<link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">

    
    <script languaje=javascript>
    var iUrgentCases = <%=iCaseTotal %>;	    
	</script>
  </head>
  <body class="BAMnColor LeftTabBg"  onload="expandTree();"> 
    <%= sFolderTree %>
    <img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
    <img src="../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
	<img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
	
	<SCRIPT LANGUAGE="Javascript1.2">
	    BAUpdateToolbar(iUrgentCases);
	</script>
  </body>
</html>
