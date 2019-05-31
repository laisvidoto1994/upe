<!--   NO BORRAR -->
<!--   EXISTE PARA COMPATIBILIDAD CON BANCAFE  -->

<%@ Page language="c#" Codebehind="Menu.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Analisis.Menu" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
	<HEAD>
		<title>Menu</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
		
		<%WriteHead();%>
		<script language="JavaScript" src="../../js/implementation.js"></script>
	</HEAD>
	<body bgcolor="navy" background="../../img/barra/fondo.gif">
		<table width="50%" border="0" cellspacing="0" cellpadding="0" align="center">
			<TR>
				<TD align="middle" height="30"></TD>
			</TR>
			<tr>
				<td align="middle"><img src="../../img/barra/Analisis.gif"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td align="middle" bgcolor="#0a2785"><b><font color="#e2ccef" face="Tahoma, Verdana, Arial" size="2">Eficiencia</font></b></td>
			</tr>
			<tr>
				<td align="left"><a target="main" href="vistaolap.aspx?v=1&amp;n=Eficiencia por Producto&amp;fn=CasosProducto.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Por 
							Producto </font></a>
				</td>
			</tr>
			<tr>
				<td align="left"><a target="main" href="vistaolap.aspx?v=2&amp;n=Eficiencia por Regional&amp;fn=CasosRadicados.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Por 
							Regional</font></a></td>
			</tr>
			<tr>
				<td align="left">
					<p><a target="main" href="vistaolap.aspx?v=3&amp;n=Eficiencia por Sucursal&amp;fn=CasosSucursal.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Por 
								Sucursal</font></a></p>
				</td>
			</tr>
			<tr>
				<td align="left"><a target="main" href="vistaolap.aspx?v=4&amp;n=Eficiencia por Area&amp;fn=DesempenoUsuarios.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Por 
							Area</font></a></td>
			</tr>
			<tr>
				<td align="middle">&nbsp;</td>
			</tr>
			<tr>
				<td align="middle" bgcolor="#0a2785"><font face="Tahoma, Verdana, Arial" size="2" color="#e2ccef"><b>Tendencias</b></font></td>
			</tr>
			<tr>
				<td align="left"><a target="main" href="vistaolap.aspx?v=5&amp;n=Tendencia por Producto&amp;fn=ProgresoCasosFinal.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">
							Por Producto</font></a></td>
			</tr>
			<tr>
				<td align="middle">&nbsp;</td>
			</tr>
			<tr>
				<td align="middle" bgcolor="#0a2785"><b><font face="Tahoma, Verdana, Arial" size="2" color="#e2ccef">Cumplimiento</font></b></td>
			</tr>
			<tr>
				<td>
					<p><a target="main" href="vistaolap.aspx?v=6&amp;n=Cumplimiento por Producto&amp;fn=EstimadosTiemposSolucion.htm"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Por 
								Producto</font></a></p>
				</td>
			</tr>
			<tr>
				<td align="middle">&nbsp;</td>
			</tr>
			<tr>
				<td>
					<p>&nbsp;</p>
				</td>
			</tr>
			<tr>
				<td align="middle">&nbsp;</td>
			</tr>
			<tr>
				<td>
					<p>&nbsp;</p>
				</td>
			</tr>
			<tr>
				<td align="middle"><a href="../../menu.aspx"><font face="Tahoma, Verdana, Arial" size="2" color="#ffffff">Regresar</font></a></td>
			</tr>
		</table>
	</body>
</HTML>
