let inputID = -1;
let filterID = -1;
let inputIDList = ["building", "windflower", "child"];
let filterIDList = ["edge", "vertical", "horizontal"];

let tooltip = d3.select("#input-tooltip").style("display", "none");

let outputTooltip = d3.select("#output-tooltip");

// interactive panel - conv

d3.select("#conv-input-candidate")
    .selectAll("img")
    .on("click", function () {
        let targetCanvas = document.getElementById("conv-input");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(
            img,
            10,
            10,
            targetCanvas.clientWidth - 20,
            targetCanvas.clientHeight - 20
        );

        inputID = inputIDList.indexOf(this.alt);
    });

d3.select("#conv-filter-candidate")
    .selectAll("img")
    .on("click", function () {
        let targetCanvas = document.getElementById("conv-filter");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(
            img,
            10,
            10,
            targetCanvas.clientWidth - 20,
            targetCanvas.clientHeight - 20
        );

        filterID = filterIDList.indexOf(this.alt);
    });

d3.select("#conv-arrow").on("click", function () {
    let outputSrc;
    if (filterID == -1 || inputID == -1) {
        alert("Finish your input selection & filter selection!");
    } else {
        outputSrc = `./image_archive/output/${filterIDList[filterID]}/${inputIDList[inputID]}_out.jpg`;
    }

    d3.select("#conv-output-img").attr("src", outputSrc).style("display", null);
});

let pixels_row1 = [0, 0, 0];
let pixels_row2 = [0, 0, 0];
let pixels_row3 = [0, 0, 0];

// initialize
d3.select("#row1")
    .selectAll("rect")
    .data(pixels_row1, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 1)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#row1")
    .selectAll("text")
    .data(pixels_row1, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 22)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#row2")
    .selectAll("rect")
    .data(pixels_row2, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 42)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#row2")
    .selectAll("text")
    .data(pixels_row2, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 62)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#row3")
    .selectAll("rect")
    .data(pixels_row3, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 82)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#row3")
    .selectAll("text")
    .data(pixels_row3, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 102)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#conv-input")
    .on("mouseover", function () {
        tooltip.style("display", null);
        //outputTooltip.style("display", null);
    })
    .on("mouseout", function () {
        tooltip.style("display", "none");
        //outputTooltip.style("display", "none");
    })
    .on("mousemove", function (e) {
        tooltip.style("left", e.pageX - 7.5 + "px");
        tooltip.style("top", e.pageY - 7.5 + "px");
        outputTooltip.style("left", e.pageX + "px");
        outputTooltip.style("top", e.pageY + "px");
    })
    .on("click", function (event) {
        let clickedX = event.offsetX;
        let clickedY = event.offsetY;

        let context = this.getContext("2d");
        let myImageData = context
            .getImageData(clickedX, clickedY, 3, 3)
            .data.filter((d, i) => i % 4 == 0);
        pixels_row1 = myImageData.slice(0, 3);
        pixels_row2 = myImageData.slice(3, 6);
        pixels_row3 = myImageData.slice(6, 9);

        d3.select("#row1")
            .selectAll("rect")
            .data(pixels_row1, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 1)
            .transition()
            .duration(500)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#row1")
            .selectAll("text")
            .data(pixels_row1, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 22)
            .transition()
            .duration(500)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");

        d3.select("#row2")
            .selectAll("rect")
            .data(pixels_row2, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 42)
            .transition()
            .duration(500)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#row2")
            .selectAll("text")
            .data(pixels_row2, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 62)
            .transition()
            .duration(500)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");

        d3.select("#row3")
            .selectAll("rect")
            .data(pixels_row3, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 82)
            .transition()
            .duration(500)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#row3")
            .selectAll("text")
            .data(pixels_row3, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 102)
            .transition()
            .duration(500)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");
    });

//------------------- Read paper ------------------------
d3.select("#model-overview-paper").on("click", function () {
    let targetPaper = d3.select("#paper-abstract");
    targetPaper.attr("fold") == "true"
        ? targetPaper.classed("fold", false).attr("fold", false)
        : targetPaper.classed("fold", true).attr("fold", true);
});
