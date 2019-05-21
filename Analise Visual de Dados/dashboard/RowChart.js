class RowChart extends BarChart {

    constructor(containerID,totalWidth,totalHeight){
	super(containerID,totalWidth,totalHeight);
	this.selectedBars = new Set([]);
    }
    
    setSelectionChangeCallback(f){
	this.selectionChangedCallback = f;
	this.updatePlot();
    }

    updateBars(){
	if(this.data == undefined)
	    return;

	//
	var bars = this.canvas
	    .selectAll(".bar")
	    .data(this.data);

	
	bars.exit().remove();
	var newBars = bars.enter()
	    .append("rect")
	    .merge(bars)
	    .attr("class","bar")
	    .attr("x", 0)
	    .attr("fill",(function(d){
		if(this.selectedBars.has(d.key))
		    return "orange";
		else
		    return "#e5f5f9";
	    }).bind(this))
	    .attr("stroke","black")
	    .attr("y", (function(d) { return this.yScale(d.key); }).bind(this))
	    .attr("height", (function(d) { return this.yScale.bandwidth(); }).bind(this))
	    .attr("width", d=>this.xScale(d.value))
	    //.on("mouseover", function(){ d3.select(this).attr("fill", "orange"); } )
	    //.on("mouseout", function(){ d3.select(this).attr("fill", "#e5f5f9"); } )
	    .on("click",(function(d){
		var temp = d3.select(d3.event.target);
		if(temp.attr("fill") == "#e5f5f9"){
		    temp.attr("fill","orange");
		    this.selectedBars.add(d.key);
		}
		else{
		    temp.attr("fill","#e5f5f9");
		    this.selectedBars.delete(d.key);
		}
		
		if(this.selectionChangedCallback) {
		    this.selectionChangedCallback(this.selectedBars);
		}		
	    }).bind(this));

	//labels
	var labels = this.canvas
	    .selectAll(".label")
	    .data(this.data);
	
	labels.exit().remove();
	labels.enter()
	    .append("text")
	    .merge(labels)
	    .attr("class","label")
	    .attr("x", 10)
	    .attr("y", (function(d) { return this.yScale(d.key)+this.yScale.bandwidth()/2; }).bind(this))
	    .attr("fill","black")
	    .style("font-weight","bold")
	    .style("pointer-events", "none")
	    .attr("alignment-baseline","middle")
	    .text(d=>d.key);	
    }

    updatePlot(){
	super.updateAxis();
	this.updateBars();
    }
}
