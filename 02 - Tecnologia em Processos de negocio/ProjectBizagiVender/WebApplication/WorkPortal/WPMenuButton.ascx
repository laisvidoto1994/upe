<%@ Control Language="c#" AutoEventWireup="false" Codebehind="WPMenuButton.ascx.cs" Inherits="BizAgiBPM.WorkPortal.WPMenuButton" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<a href="#" onclick="javascript:BAOpenWPMenu(this,'<%=menuItem%>');" >		
	<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString(menuDisplayNameResource) %>
</a>

