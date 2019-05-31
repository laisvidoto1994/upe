<%@ Page Language="c#" CodeBehind="WPQueryDetail.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.ListaDetalle.WPQueryDetail" %>

<html>
<head>
    <title>Case List</title>
    <% if (Request.QueryString["x2xl"] == null || Request.QueryString["x2xl"] == string.Empty || Request.QueryString["x2xl"] != "true")
       { %>
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" />
    <% } %>
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
    <script language="javascript" type="text/javascript" src="../../js/WorkPortal/WPDragCases.js"></script>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onload="BALoaDDPage()">
    <%  if (Request.QueryString["x2xl"] == null ||
            Request.QueryString["x2xl"] == string.Empty ||
            Request.QueryString["x2xl"] != "true")
        {

            Header();
        }%>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <% DrawGrid(); %>
            </td>
        </tr>
        <tr>
            <td align="left">
                <table>
                    <tr>
                        <td rowspan="2">
                            <img src="../../img/WorkPortal/Folders/FolderConfigure.png">
                        </td>
                        <td>
                            <b>
                                <%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPSmartFolder")%>: </b>
                            <%=FolderName %>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <%=String.Format(BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPFolderClick"),String.Format("<a href=\"{0}\">",FolderLink),"</a> ")%>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
