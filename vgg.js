let inputID = -1;
let poolingInputID = -1;
let filterID = -1;
let poolingMode = -1;
let inputIDList = ["building", "windflower", "child"];
let filterIDList = ["edge", "vertical", "horizontal"];
let poolingModeList = ["max", "avg"];

let convInputTooltip = d3
    .select("#conv-interactive-panel")
    .select(".input-tooltip");
convInputTooltip.style("display", "none");

let convOutputTooltip = d3.select("#conv-output").select(".output-tooltip");
convOutputTooltip.style("display", "none");

let poolInputTooltip = d3
    .select("#pool-interactive-panel")
    .select(".input-tooltip");
poolInputTooltip.style("display", "none");

let poolOutputTooltip = d3.select("#pool-output").select(".output-tooltip");
poolOutputTooltip.style("display", "none");

// -------------- page buttons --------------
d3.select("#back-button").on("click", () => {
    location.href = "./lamp.html";
});

d3.select("#change-model").on("click", function () {
    let modelList = d3.select("#model-list");
    modelList.attr("fold") == "true"
        ? modelList.classed("fold", false).attr("fold", false)
        : modelList.classed("fold", true).attr("fold", true);
});

d3.select("#chagne2vgg").on("click", () => {
    location.href = "./vgg.html";
});

d3.select("#change2model2").on("click", () => {
    location.href = "./model2.html";
});

d3.select("#change2model3").on("click", () => {
    location.href = "./model3.html";
});

d3.select("#change2model4").on("click", () => {
    location.href = "./model4.html";
});

// -------------- interactive panel (conv) --------------

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

d3.select("#conv-interactive-panel")
    .select(".conv-arrow")
    .on("click", function () {
        let outputSrc;
        if (filterID == -1 || inputID == -1) {
            alert("Finish your input selection & filter selection!");
        } else {
            outputSrc = `./image_archive/output/${filterIDList[filterID]}/${inputIDList[inputID]}_out.jpg`;
        }

        d3.select("#conv-output-img")
            .attr("src", outputSrc)
            .style("display", null);
    });

let pixels_row1 = [0, 0, 0];
let pixels_row2 = [0, 0, 0];
let pixels_row3 = [0, 0, 0];

// initialize
d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row1")
    .selectAll("rect")
    .data(pixels_row1, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 1)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row1")
    .selectAll("text")
    .data(pixels_row1, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 22)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row2")
    .selectAll("rect")
    .data(pixels_row2, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 42)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row2")
    .selectAll("text")
    .data(pixels_row2, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 62)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row3")
    .selectAll("rect")
    .data(pixels_row3, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 82)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#input-filter-conv")
    .select(".grid")
    .select(".row3")
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
        convInputTooltip.style("display", null);
        convOutputTooltip.style("display", null);
    })
    .on("mouseout", function () {
        //tooltip.style("display", "none");
        //outputTooltip.style("display", "none");
    })
    .on("mousemove.e1", function (e) {
        convInputTooltip.style("left", e.pageX - 7.5 + "px");
        convInputTooltip.style("top", e.pageY - 7.5 + "px");
        convOutputTooltip.style("left", e.pageX - 7.5 + 530 + 17 + "px");
        convOutputTooltip.style("top", e.pageY - 7.5 + 15 + "px");
    })
    .on("mousemove.e2", function (event) {
        let clickedX = event.offsetX;
        let clickedY = event.offsetY;

        let context = this.getContext("2d");
        let myImageData = context
            .getImageData(clickedX, clickedY, 3, 3)
            .data.filter((d, i) => i % 4 == 0);
        pixels_row1 = myImageData.slice(0, 3);
        pixels_row2 = myImageData.slice(3, 6);
        pixels_row3 = myImageData.slice(6, 9);

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row1")
            .selectAll("rect")
            .data(pixels_row1, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 1)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row1")
            .selectAll("text")
            .data(pixels_row1, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 22)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row2")
            .selectAll("rect")
            .data(pixels_row2, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 42)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row2")
            .selectAll("text")
            .data(pixels_row2, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 62)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row3")
            .selectAll("rect")
            .data(pixels_row3, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 82)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#input-filter-conv")
            .select(".grid")
            .select(".row3")
            .selectAll("text")
            .data(pixels_row3, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 102)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");
    });

// -------------- interactive panel (pool) --------------

d3.select("#pool-input-candidate")
    .selectAll("img")
    .on("click", function () {
        let targetCanvas = document.getElementById("pool-input");
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

        poolingInputID = inputIDList.indexOf(this.alt);
    });

d3.select("#pool-filter-candidate")
    .selectAll("img")
    .on("click", function () {
        poolingMode = poolingModeList.indexOf(this.alt);

        let selectedBorer = d3.select("#pool-filter-candidate").select("svg");
        selectedBorer.style("top", this.offsetTop - 5);
        selectedBorer.style("left", this.offsetLeft - 5);

        if (selectedBorer.attr("fold") == "true") {
            selectedBorer.classed("fold", false).attr("fold", false);
        }
    });

d3.select("#pool-interactive-panel")
    .select(".conv-arrow")
    .on("click", function () {
        let outputSrc;
        if (poolingMode == -1 || poolingInputID == -1) {
            alert("Finish your input selection & pooling mode selection!");
        } else {
            outputSrc = `./pool_generator/pool_output/${poolingModeList[poolingMode]}/${inputIDList[inputID]}_out.jpg`;
        }

        d3.select("#pool-output-img")
            .attr("src", outputSrc)
            .style("display", null);
    });

let pooling_pixels_row1 = [0, 0];
let pooling_pixels_row2 = [0, 0];

// initialize
d3.select("#pooling-process")
    .select(".grid")
    .select(".row1")
    .selectAll("rect")
    .data(pooling_pixels_row1, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 1)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#pooling-process")
    .select(".grid")
    .select(".row1")
    .selectAll("text")
    .data(pooling_pixels_row1, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 22)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#pooling-process")
    .select(".grid")
    .select(".row2")
    .selectAll("rect")
    .data(pooling_pixels_row2, (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 40 * i + 7)
    .attr("y", 42)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#pooling-process")
    .select(".grid")
    .select(".row2")
    .selectAll("text")
    .data(pooling_pixels_row2, (d) => d)
    .join("text")
    .attr("x", (d, i) => 40 * i + 19)
    .attr("y", 62)
    .text((d) => d / 256)
    .style("fill", (d) => (d > 128 ? "black" : "white"))
    .style("font-size", "small")
    .style("text-align", "center");

d3.select("#pool-input")
    .on("mouseover", function () {
        poolInputTooltip.style("display", null);
        poolOutputTooltip.style("display", null);
    })
    .on("mouseout", function () {
        //tooltip.style("display", "none");
        //outputTooltip.style("display", "none");
    })
    .on("mousemove.e1", function (e) {
        poolInputTooltip.style("left", e.pageX - 7.5 + "px");
        poolInputTooltip.style("top", e.pageY - 7.5 + "px");
        poolOutputTooltip.style("left", e.pageX - 7.5 + 530 + 17 + "px");
        poolOutputTooltip.style("top", e.pageY - 7.5 + 15 + "px");
    })
    .on("mousemove.e2", function (event) {
        let clickedX = event.offsetX;
        let clickedY = event.offsetY;

        let context = this.getContext("2d");
        let myImageData = context
            .getImageData(clickedX, clickedY, 2, 2)
            .data.filter((d, i) => i % 4 == 0);
        pooling_pixels_row1 = myImageData.slice(0, 2);
        pooling_pixels_row2 = myImageData.slice(2, 4);

        d3.select("#pooling-process")
            .select(".grid")
            .select(".row1")
            .selectAll("rect")
            .data(pooling_pixels_row1, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 1)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#pooling-process")
            .select(".grid")
            .select(".row1")
            .selectAll("text")
            .data(pooling_pixels_row1, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 22)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");

        d3.select("#pooling-process")
            .select(".grid")
            .select(".row2")
            .selectAll("rect")
            .data(pooling_pixels_row2, (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", (d, i) => 40 * i + 7)
            .attr("y", 42)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#pooling-process")
            .select(".grid")
            .select(".row2")
            .selectAll("text")
            .data(pooling_pixels_row2, (d) => d)
            .join("text")
            .attr("x", (d, i) => 40 * i + 11)
            .attr("y", 62)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");
    });

//------------------- Read paper ------------------------
/*
d3.select("#model-overview-paper").on("click", function () {
    let targetPaper = d3.select("#paper-abstract");
    targetPaper.attr("fold") == "true"
        ? targetPaper.classed("fold", false).attr("fold", false)
        : targetPaper.classed("fold", true).attr("fold", true);
});
*/
let sectionPaperPair = {
    "model-overview-paper": "paper-abstract",
    "input-paper": "paper-arc-input",
    "model-paper": "paper-arc-model",
};

d3.selectAll(".section-title-container")
    .selectAll("img")
    .on("click", function () {
        let targetPaper = d3.select("#" + sectionPaperPair[this.id]);
        targetPaper.attr("fold") == "true"
            ? targetPaper.classed("fold", false).attr("fold", false)
            : targetPaper.classed("fold", true).attr("fold", true);
    });

d3.text("./papers/VGG/abstract.txt").then(function (text) {
    d3.select("#paper-abstract").select(".paper-description").text(text);
});

d3.text("./papers/VGG/2_1_architecture.txt").then(function (text) {
    d3.select("#paper-arc-input").select(".paper-description").text(text);
});

d3.text("./papers/VGG/2_1_architecture.txt").then(function (text) {
    d3.select("#paper-arc-model").select(".paper-description").text(text);
});

// descriptions
d3.text("./description/model_overview.txt").then(function (text) {
    d3.select("#section-model-overview").select(".description").text(text);
});

d3.text("./description/input.txt").then(function (text) {
    d3.select("#section-input").select(".description").text(text);
});

d3.text("./description/vgg.txt").then(function (text) {
    d3.select("#section-model").select(".description").text(text);
});

d3.text("./description/model_overview.txt").then(function (text) {
    d3.select("#section-model").select(".description").text(text);
});

d3.text("./description/overall_pipeline.txt").then(function (text) {
    d3.select("#overall-pipeline").text(text);
});

d3.text("./description/conv.txt").then(function (text) {
    d3.select(".subsection.conv").select(".description").text(text);
});

d3.text("./description/conv2.txt").then(function (text) {
    d3.select("#conv-stride").text(text);
});

d3.text("./description/pooling.txt").then(function (text) {
    d3.select(".subsection.pooling").select(".description").text(text);
});

d3.text("./description/softmax.txt").then(function (text) {
    d3.select(".subsection.softmax").select(".description").text(text);
});

d3.text("./description/output.txt").then(function (text) {
    d3.select("#section-output").select(".description").text(text);
});
