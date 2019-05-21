<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="Category.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Radicar.Category" %>
<HTML>
	<HEAD>
		<title>Category Selection</title> 
		<!--#include file="../../include/BizAgiMeta.inc"-->
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<script language="JavaScript" src="../../js/CatMenu.js"></script>
		
		<% Header(); %>
		<script language="javascript">
		var bOnSubmit = false;
		function VerifyForm() { 
			if (bOnSubmit) { 
				alert("<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %>");
				return false; 
			} 	
			bOnSubmit = true; 
			document.getElementById("frmCat").submit(); 
			document.body.style.cursor="wait"; 
			return true;
		}
		</script>
		<style>
			A{
			text-decoration:none;			
			}
			A:hover{
			text-decoration:none;			
			}
		</style>
	</HEAD>
	<body onload="BAonload()">
		<%WriteHead();%>
		
		<script language="javascript">
				BASetLocationFromMain("");
		</script>
		
		<% BizAgi.UI.WFBiz.CMagicForm.dCategory(System.Convert.ToInt32(Request.QueryString["idApp"]), true, this); %>
		
	</body>
</HTML>
