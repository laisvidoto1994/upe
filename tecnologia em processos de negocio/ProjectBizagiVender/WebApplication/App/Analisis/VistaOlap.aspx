<%@ Page language="c#" Codebehind="VistaOlap.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Analisis.VistaOlap" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
	<head>
		<title>VistaOlap</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
		<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
	</head>
	<body>
		<% Header(); %>
		<table width="100%" border="0" cellspacing="2" cellpadding="2">
			<tr>
				<td align="middle">
					<table width="90%" border="0" cellspacing="2" cellpadding="2">
						<tr>
							<td class="header">
								<%=sVista%>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<%if (A.ReadQFInt("v", 0) == 1) {%>
		<!--<b>Hola Hola</b>-->
		<!-- #include file="vistas/CasosProducto.htm" -->
		<%} else if (A.ReadQFInt("v", 0) == 2) {%>
		<!-- #include file="vistas/CasosRadicados.htm" -->
		<%} else if (A.ReadQFInt("v", 0) == 3) {%>
		<!-- #include file="vistas/CasosSucursal.htm" -->
		<%} else if (A.ReadQFInt("v", 0) == 4) {%>
		<!-- #include file="vistas/DesempenoUsuarios.htm" -->
		<%} else if (A.ReadQFInt("v", 0) == 5) {%>
		<!-- #include file="vistas/ProgresoCasosFinal.htm" -->
		<%} else if (A.ReadQFInt("v", 0) == 6) {%>
		<!-- #include file="vistas/EstimadosTiemposSolucion.htm" -->
		<%}%>
		<%//Server.Transfer("vistas/" + A.ReadQF("fn", 8/*vbString*/, "CasosProducto.htm"));%>
		<%//Server.Execute("vistas/" + A.ReadQF("fn", 8/*vbString*/, "CasosProducto.htm"));%>
		<%//Server.Execute("vistas/CasosProducto.aspx")%>
		<%//DrawForm()%>
	</body>
</html>
