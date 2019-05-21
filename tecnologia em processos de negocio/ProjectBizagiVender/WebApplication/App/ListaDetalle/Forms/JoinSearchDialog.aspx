<%@ Page language="c#" Codebehind="JoinSearchDialog.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.JoinSearchDialog" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>JoinSearchDialog</title> 
		<!-- <% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppListaDetalleFormsJoinSearch_JoinSearch")); %> -->

		
		<!--#include file="../../../include/BizAgiMeta.inc"-->
	</HEAD>
	<frameset rows="0,*" framespacing="0" frameborder="NO">
		<frame name="main" src="Empty.aspx" border="0">
		<frame name="header" src="JoinSearch.aspx?<%= Request.QueryString %>" frameborder="NO" scrolling="yes">
	</frameset>
</HTML>
