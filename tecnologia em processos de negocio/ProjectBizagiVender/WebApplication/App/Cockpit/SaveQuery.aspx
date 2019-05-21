<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page Language="C#" AutoEventWireup="false" CodeBehind="SaveQuery.aspx.cs" Inherits="BizAgiBPM.App.Cockpit.SaveQuery" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Save Analysis Query</title>
    <link href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <link href="../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Analysis/GraphicReports.css" type="text/css" rel="stylesheet" />
    <link href="../../css/Admin/Common.css" rel="stylesheet" type="text/css"/>
    <%WriteHead();%>
    <script type="text/javascript" language="javaScript" src="../../js/Analysis/SlicerPanel.js" ></script>
    <script type="text/javascript" language="javascript" src="../../js/Analysis/jquery/jquery.js"></script>    
    <script type="text/javascript" language="javascript" src="../../js/Cockpit/SaveQuery.js" ></script>
</head>
<body >
    <form id="form1" method="post" runat="server" >
        <br />
        <div style="text-align:center;">

            <b><asp:Label CssClass="header" ID="lblTitle" runat="server" Text="Save Analysis Query"></asp:Label></b>
            <p />
            
            <!-- Name, description, Time filter -->
            <table class='Analysis_TableFilled' style="width:90%;"  align="center" cellpadding="5" >
						
                <tr>
                    <td style="width:100px; text-align:left;"><asp:Label ID="lblQueryName" runat="server" Text="Query Name"></asp:Label></td>
                    <td style="text-align:left"><asp:TextBox ID="txtQueryName" runat="server" MaxLength="50" Width="250px"></asp:TextBox></td>
                </tr>
                <tr>
                    <td style="width:100px; text-align:left"><asp:Label ID="lblQueryDescription" runat="server" Text="Description"></asp:Label></td>
                    <td style="text-align:left"><asp:TextBox TextMode="MultiLine"  Width="250px" Height="28px" ID="txtQueryDescription" runat="server" MaxLength="200"
                                                    onKeyUp="javascript:ValidateMultlineChar(this,200);" onChange="javascript:ValidateMultlineChar(this,200);"></asp:TextBox></td>

                </tr>
                
                <asp:PlaceHolder ID="phTimeFilter" runat="server">

                    <tr >
                        <td style="width:100px; text-align:left"><asp:Label ID="lblTimeFilter" runat="server" Text="Time Filter"></asp:Label></td>
                        <td style="text-align:left">
                            <table style="padding:2; " cellspacing="0"   >
                                <tr >
                                    <td id="FixR_1D" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >1D    <input type="hidden"    id="HidFixR_1D" runat="server" />   </td>
                                    <td id="FixR_5D" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >5D    <input type="hidden"    id="HidFixR_5D" runat="server" />   </td>
                                    <td id="FixR_1M" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >1M    <input type="hidden"    id="HidFixR_1M" runat="server" />   </td>
                                    <td id="FixR_3M" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >3M    <input type="hidden"    id="HidFixR_3M" runat="server" />   </td>
                                    <td id="FixR_6M" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >6M    <input type="hidden"    id="HidFixR_6M" runat="server" />   </td>
                                    <td id="FixR_1Y" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >1Y    <input type="hidden"    id="HidFixR_1Y" runat="server" />   </td>
                                    <td id="FixR_YTD" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >YTD  <input type="hidden"    id="HidFixR_YTD" runat="server" />  </td>
                                    <td id="FixR_Max" class="Analysis_CellNoSelected" onmouseover="this.className='Analysis_CellSelected';" onmouseout="ShowCurFixedRange();" onmousedown="SelectFixedRange(this.id);" >Max  <input type="hidden"    id="HidFixR_Max" runat="server" />  </td>
                                </tr>
                            </table>
                            <input type="hidden" id="HidFixR_Today" runat="server" />
                            <input type="hidden" id="FixR_CurSelection" runat="server" />
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="width:100px;"></td>
                        <td style="text-align:left">
                            <table style="width:270px">
                                <tr>
                                    <td >
                                        <asp:Label ID="lblFrom" runat="server" Text="From:  " Font-Bold="true" ></asp:Label>
                                        <asp:Label ID="txtFrom" runat="server" Text="1/ene/2009"></asp:Label>
                                    </td>
                                    <td >
                                        <asp:Label ID="lblTo" runat="server" Text="To:  " Font-Bold="true"></asp:Label>
                                        <asp:Label ID="txtTo" runat="server" Text="19/jul/2009"></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                
                </asp:PlaceHolder>
                
            </table>
            
            <br />
            
            <!-- Query Source -->
            <table class='Analysis_TableFilled' align="center" style="width:90%;background:#E6E6E6;border-bottom:0; padding-left:10px">
                <tr>                    
                    <td style="width:100px; text-align:left;"  colspan="2" >
                        <table style="margin-left:5px;">
                            <tr>
                                <td>
                                    <asp:Label ID="lblQuerySource" runat="server" Text="Query Source"></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table class='Analysis_TableFilled' align="center" style="width:90%;background:#F1F1F1">
                <tr>
                    <td style="text-align:left">
                        <table id="tblReportSource" runat="server" style="margin-left:5px;width:100%">
                            
                            <tr style="height:5px">
                                <td colspan="2"></td>
                            </tr>
                            
                            <tr>
                                <td style="width:100px;text-align:left"> 
                                    <asp:Label ID="lblReport" runat="server" Text="Report:  " Font-Bold="true" ></asp:Label>                                    
                                </td>
                                <td style="text-align:left">
                                    <asp:Label ID="txtReport" runat="server" Text="Process Analytics"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:100px;text-align:left">
                                    <asp:Label ID="lblProcess" runat="server" Text="Process:  " Font-Bold="true"></asp:Label>
                                </td>
                                <td style="text-align:left">
                                    <asp:Label ID="txtProcess" runat="server" Text="LoansRequest 1.0"></asp:Label> 
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                
            </table>
            <br />

            <!-- Buttons -->
            <table style="width:90%;" align="center" class="buttonsTable">
			    <tr >														
			    
				    <td style="width:120px;text-align:left">
					    <UI:CWPHtmlInputButton runat="server" type="button" value="BtnSave" name="btnSave" ID="btnSave" onclick="buttonSave_onclick();" />
				    </td>
				    
				    <td style="width:120px;text-align:left">
					    <UI:CWPHtmlInputButton runat="server" type="button" value="BtnCancel" name="btnCancel" ID="btnCancel" onclick="buttonCancel_onclick();" />
				    </td>
				    <td></td>
			    </tr>
		    </table>
            
            <input type="hidden" id="hidErrorMessage" runat="server" />
            <input type="hidden" id="hidIsPosback" runat="server" />
            <asp:label id="hidConfirmationMessage" runat="server" style="display: none" Text="The query has been succesfully saved."></asp:label>

        </div>
    </form>
</body>
</html>
