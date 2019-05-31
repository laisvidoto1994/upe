<%@ Page language="c#" Codebehind="FrameCache.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.FrameCache" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN">
<HEAD>
	
</HEAD>
<frameset rows="64,*" framespacing="0" frameborder="NO">
	<frame name="header" src="CCaching.aspx?<% Response.Write(Request.QueryString.ToString()); %>" frameborder="NO" scrolling="no">
	<frame name="main" src="FavoritesSearch.aspx" border="0">
</frameset>
