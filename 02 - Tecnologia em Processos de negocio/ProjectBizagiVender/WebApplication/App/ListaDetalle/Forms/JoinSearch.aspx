<%@ Page language="c#" Codebehind="JoinSearch.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.JoinSearch" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>JoinSearch</title>
				<!--	<% Response.Write(BizAgi.UI.WFBase.CResourceManager.RM.GetString("AppListaDetalleFormsJoinSearchDialog_JoinSearchDialog")); %> -->
				
				
<!--#include file="../../../include/BizAgiMeta.inc"-->
		
		<link rel="stylesheet" href="../../../css/estilos.css" type="text/css">
	</HEAD>
	<body MS_POSITIONING="GridLayout">
		<form id="Form1" method="post" runat="server">
			<TABLE id="Table1" cellSpacing="1" cellPadding="1" width="300" border="0" align="center">
				<TR>
					<TD align="middle">Busqueda</TD>
					<TD>
						<asp:TextBox id="txtSearch" runat="server"></asp:TextBox>
						<asp:Button id="btnSearch" runat="server" Text="Buscar"></asp:Button></TD>
				</TR>
				<TR>
					<TD align="middle" colSpan="2">&nbsp;</TD>
				</TR>
				<TR>
					<TD align="middle" colSpan="2">
						<asp:DataGrid id="DataGridSearch" runat="server" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" BackColor="White" CellPadding="4" GridLines="Vertical" ForeColor="Black" AllowPaging="True">
							<SelectedItemStyle Font-Bold="True" ForeColor="White" BackColor="#CE5D5A"></SelectedItemStyle>
							<AlternatingItemStyle BackColor="White"></AlternatingItemStyle>
							<ItemStyle BackColor="#F7F7DE"></ItemStyle>
							<HeaderStyle Font-Bold="True" ForeColor="White" BackColor="#6B696B"></HeaderStyle>
							<FooterStyle BackColor="#CCCC99"></FooterStyle>
							<Columns>
								<asp:ButtonColumn Text="Sel" CommandName="Select"></asp:ButtonColumn>
							</Columns>
							<PagerStyle HorizontalAlign="Right" ForeColor="Black" BackColor="#F7F7DE" Mode="NumericPages"></PagerStyle>
						</asp:DataGrid></TD>
				</TR>
				<TR>
					<TD></TD>
					<TD></TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
