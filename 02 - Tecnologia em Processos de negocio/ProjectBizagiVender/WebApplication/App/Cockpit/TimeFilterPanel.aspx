<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TimeFilterPanel.aspx.cs"
    Inherits="BizAgiBPM.App.Cockpit.TimeFilterPanel" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Business Activity Monitor</title>
    <link rel="stylesheet" type="text/css" href="../../css/WorkPortal/BAWindow.css" />
    <link rel="stylesheet" type="text/css" href="../../css/estilos.css" />
    <link rel="stylesheet" type="text/css" href="../../css/Analysis/GraphicReports.css" />
    <link rel="stylesheet" type="text/css" href="../../css/Admin/Common.css" />
    <link rel="stylesheet" type="text/css" href="../../css/calendar.css" />
    <link rel="stylesheet" type="text/css" href="../../css/Analysis/DateSlider/dateslider.css" />
    <link rel="stylesheet" type="text/css" href="../../css/Jq/ui191/no-theme/jquery-ui-1.9.1.custom.css" />
    <%WriteHead();%>
    <script type="text/javascript" src="../../js/Analysis/DateSlider/prototype.js"></script>
    <script type="text/javascript" src="../../js/Analysis/DateSlider/scriptaculous.js?load=effects,dragdrop"></script>
    <script type="text/javascript" src="../../js/Analysis/DateSlider/date-en-US.js"></script>
    <script type="text/javascript" src="../../js/Analysis/DateSlider/dateslider.js"></script>
    <script type="text/javascript" src="../../js/Analysis/jquery/jquery-1.8.2.js"></script>
    <script type="text/javascript" language="JavaScript">      var j$ = $.noConflict(true);</script>
    <script type="text/javascript" src="../../js/Analysis/TimeFilterPanel.js"></script>
</head>
<body>
    <form id="Form1" runat="server">
    <!-- Time Filter-->
    <br />
    <div class='Analysis_TableFilled' style="width: 100%">
        <div align="left">
            <div align="left" style="width: 25%; position: relative; float: left; padding-top: 5px;">
                <!-- Fixed date range menu -->
                <div style="padding: 2;">
                    <span id="FixR_1D" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">1D
                    </span><span id="FixR_5D" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">5D
                    </span><span id="FixR_1M" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">1M
                    </span><span id="FixR_3M" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">3M
                    </span><span id="FixR_6M" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">6M
                    </span><span id="FixR_1Y" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">1Y
                    </span><span id="FixR_YTD" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">YTD
                    </span><span id="FixR_Max" class="Analysis_CellNoSelected" onmousedown="SelectFixedRange(this.id);"
                        onmouseover="OverFixedRange(this.id);" onmouseout="OutFixedRange(this.id);">Max
                    </span>
                </div>
            </div>
            <div style="width: 30%; position: relative; float: left;">
                <div style="padding: 2;">
                    <div>
                        <span>
                            <asp:Label ID="lblFrom" runat="server" Text="FROM:"></asp:Label>
                        </span><span>
                            <asp:PlaceHolder runat="server" ID="phDateFrom"></asp:PlaceHolder>
                        </span>
                    </div>
                </div>
            </div>
            <div style="width: 30%; position: relative; float: left;">
                <div style="padding: 2;">
                    <div>
                        <span>
                            <asp:Label ID="lblTo" runat="server" Text="TO:"></asp:Label>
                        </span><span>
                            <asp:PlaceHolder runat="server" ID="phDateTo"></asp:PlaceHolder>
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <div style="width: 100%">
                    <div id="slider-container" style="width: 800px; overflow: hidden; float: left; clear: both">
                        <div id="divTimeLine">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text" id="popupcalendar">
    </div>
    <input type="hidden" id="HidFixR_1D" runat="server" />
    <input type="hidden" id="HidFixR_5D" runat="server" />
    <input type="hidden" id="HidFixR_1M" runat="server" />
    <input type="hidden" id="HidFixR_3M" runat="server" />
    <input type="hidden" id="HidFixR_6M" runat="server" />
    <input type="hidden" id="HidFixR_1Y" runat="server" />
    <input type="hidden" id="HidFixR_Max" runat="server" />
    <input type="hidden" id="HidFixR_YTD" runat="server" />
    <input type="hidden" id="HidFixR_Today" runat="server" />
    <input type="hidden" id="HidMinSliderYear" runat="server" />
    <input type="hidden" id="HidMaxSliderYear" runat="server" />
    </form>
</body>
</html>
