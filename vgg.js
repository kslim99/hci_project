//opened papers
let openedPapers = new Set();
let topZIndex = 0;

// interactive panel selections
let inputID = -1;
let poolingInputID = -1;
let filterID = -1;
let poolingMode = -1;

// interactive panel selection list
let inputIDList = ["building", "windflower", "child"];
let filterIDList = ["edge", "vertical", "horizontal"];
let poolingModeList = ["max", "avg"];

// pooled pixel value
let pooled_pixel = 0.0;

// tool tips
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

// canvas paddings
const convInputCanvasPadding = 5;
const poolInputCanvasPadding = 10;

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

d3.select("#change2alexnet").on("click", () => {
    location.href = "./alexnet.html";
});

d3.select("#change2googlenet").on("click", () => {
    location.href = "./googlenet.html";
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
            5,
            5,
            targetCanvas.clientWidth - 10,
            targetCanvas.clientHeight - 10
        );

        inputID = inputIDList.indexOf(this.alt);

        d3.select("#conv-state-message")
            .select(".input-not-selected")
            .classed("fold", true);
        d3.select("#conv-state-message")
            .select(".input-selected")
            .classed("fold", false);
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
            5,
            5,
            targetCanvas.clientWidth - 10,
            targetCanvas.clientHeight - 10
        );

        filterID = filterIDList.indexOf(this.alt);

        d3.select("#conv-state-message")
            .select(".filter-not-selected")
            .classed("fold", true);
        d3.select("#conv-state-message")
            .select(".filter-selected")
            .classed("fold", false);
    });

d3.select("#conv-interactive-panel")
    .select(".operation-arrow")
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

//pooled vale
d3.select("#pooled-pixel")
    .select("g")
    .selectAll("rect")
    .data([pooled_pixel], (d) => d)
    .join("rect")
    .attr("width", 30)
    .attr("height", 30)
    .style("fill", (d) => `rgb(${d},${d},${d})`);

d3.select("#pooled-pixel")
    .select("g")
    .selectAll("text")
    .data([pooled_pixel], (d) => d)
    .join("text")
    .text((d) => (d / 256).toFixed(2))
    .attr("x", 4)
    .attr("y", 19)
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
        convOutputTooltip.style("left", e.pageX - 7.5 + 525 + "px");
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

        d3.select("#pooling-state-message")
            .select(".input-not-selected")
            .classed("fold", true);
        d3.select("#pooling-state-message")
            .select(".input-selected")
            .classed("fold", false);
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

        d3.select("#pooling-state-message")
            .select(".pooling-not-selected")
            .classed("fold", true);
        d3.select("#pooling-state-message")
            .select(".pooling-selected")
            .classed("fold", false);
    });

d3.select("#pool-interactive-panel")
    .select(".operation-arrow")
    .on("click", function () {
        let outputSrc;
        if (poolingMode == -1 || poolingInputID == -1) {
            alert("Finish your input selection & pooling mode selection!");
        } else {
            outputSrc = `./pool_generator/pool_output/${poolingModeList[poolingMode]}/${inputIDList[poolingInputID]}_out.jpg`;
        }

        d3.select("#pool-output-img")
            .attr("src", outputSrc)
            .style("display", null);

        console.log(outputSrc);
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

        let pooledOffsetX =
            this.offsetLeft +
            poolInputCanvasPadding +
            (e.pageX - (this.offsetLeft + poolInputCanvasPadding)) / 2 +
            580;
        let pooledOffsetY =
            this.offsetTop +
            poolInputCanvasPadding +
            (e.pageY - (this.offsetTop + poolInputCanvasPadding)) / 2 +
            55;
        poolOutputTooltip.style("left", pooledOffsetX + "px");
        poolOutputTooltip.style("top", pooledOffsetY + "px");
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

        let all_pixels = [
            pooling_pixels_row1[0],
            pooling_pixels_row1[1],
            pooling_pixels_row2[0],
            pooling_pixels_row2[1],
        ];
        if (poolingMode == 0) {
            //max pooling
            let max_pixel = 0;
            for (let i = 0; i < all_pixels.length; i++) {
                if (max_pixel < all_pixels[i]) {
                    max_pixel = all_pixels[i];
                }
            }
            pooled_pixel = max_pixel;
        } else if (poolingMode == 1) {
            //avg pooling
            let total = 0;
            for (let i = 0; i < all_pixels.length; i++) {
                total += all_pixels[i];
            }
            pooled_pixel = total / grades.length;
        }

        d3.select("#pooled-pixel")
            .select("svg")
            .selectAll("rect")
            .data([pooled_pixel], (d) => d)
            .join("rect")
            .attr("width", 30)
            .attr("height", 30)
            .transition()
            .duration(200)
            .style("fill", (d) => `rgb(${d},${d},${d})`);

        d3.select("#pooled-pixel")
            .select("svg")
            .selectAll("text")
            .data([pooled_pixel], (d) => d)
            .join("text")
            .attr("x", 4)
            .attr("y", 19)
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");
    });

// ------------------ How to Use -----------------
d3.select("#conv-interactive-panel")
    .select(".how-to-icon")
    .on("click", function () {
        document.getElementById("conv-how-to").style.top =
            this.offsetTop - 740 / 1.702 + "px";
        document.getElementById("conv-how-to").style.left =
            this.offsetLeft - 740 + "px";

        let inputPaperHelp = d3.select("#conv-how-to");
        inputPaperHelp.attr("fold") == "true"
            ? inputPaperHelp.classed("fold", false).attr("fold", false)
            : inputPaperHelp.classed("fold", true).attr("fold", true);
    });

d3.select("#pool-interactive-panel")
    .select(".how-to-icon")
    .on("click", function () {
        document.getElementById("pool-how-to").style.top =
            this.offsetTop - 740 / 1.702 + "px";
        document.getElementById("pool-how-to").style.left =
            this.offsetLeft - 740 + "px";

        let inputPaperHelp = d3.select("#pool-how-to");
        inputPaperHelp.attr("fold") == "true"
            ? inputPaperHelp.classed("fold", false).attr("fold", false)
            : inputPaperHelp.classed("fold", true).attr("fold", true);
    });

// ----------- Model Structure Image --------------

d3.select("#model-struct").on("mouseover", function () {
    let modelstructImg = document.getElementById("model-struct");
    let modelstructImgWidth = modelstructImg.width;
    let modelstructImgHeight = modelstructImg.height;
    let modelstructImgTop = modelstructImg.offsetTop;
    let modelstructImgLeft = modelstructImg.offsetLeft;

    let plusConv = document.getElementById("plus-conv");
    let plusPool = document.getElementById("plus-pool");
    let plusFC = document.getElementById("plus-fc");
    debugger;

    plusConv.style.top = modelstructImgTop + modelstructImgHeight * 0.6 + "px";
    plusPool.style.top = modelstructImgTop + modelstructImgHeight * 0.6 + "px";
    plusFC.style.top = modelstructImgTop + modelstructImgHeight * 0.55 + "px";

    document.getElementById("plus-wrapper").style.display = null;
});
/*
d3.select("#model-struct").on("mouseout", function () {
    document.getElementById("plus-wrapper").style.display = "none";
});
*/

/*
d3.select("#model-overview-paper").on("click", function () {
    let targetPaper = d3.select("#paper-abstract");
    targetPaper.attr("fold") == "true"
        ? targetPaper.classed("fold", false).attr("fold", false)
        : targetPaper.classed("fold", true).attr("fold", true);
});
*/

//------------------- Read paper ------------------------
let sectionPaperPair = {
    "model-overview-paper": "paper-abstract",
    "input-paper": "paper-arc-input",
    "model-paper": "paper-arc-model",
    "output-paper": "paper-arc-output",
};

let paperSectionPair = {
    "paper-abstract": "section-model-overview",
    "paper-arc-input": "section-input",
    "paper-arc-model": "section-model",
    "paper-arc-output": "section-output",
};

d3.selectAll(".section-title-container")
    .select(".paper-closed")
    .on("click", function () {
        let targetPaper = d3.select("#" + sectionPaperPair[this.id]);
        targetPaper.classed("fold", false).attr("fold", false);

        let sectionname = "section-" + this.id.substr(0, this.id.length - 6);
        d3.select("#" + sectionname)
            .select(".paper-opened")
            .style("display", "inline");
        d3.select(this).style("display", "none");

        openedPapers.add(sectionPaperPair[this.id]);
        topZIndex++;
        targetPaper.style("z-index", topZIndex);

        d3.select("#paper-list-container").style("display", "block");
    });

d3.selectAll(".paper-group")
    .select(".fold-paper")
    .on("click", function () {
        let paperGroup = d3.select(this).attr("papergroup");
        let targetPaper = d3.select("#" + paperGroup);
        targetPaper.classed("fold", true).attr("fold", true).style("z-indx", 0);

        let sectionArea = d3.select("#" + paperSectionPair[paperGroup]);
        sectionArea.select(".paper-opened").style("display", "none");
        sectionArea.select(".paper-closed").style("display", "inline");

        if (openedPapers.delete(paperGroup) == true) {
            if (openedPapers.size == 0) {
                topZIndex = 0;
                d3.select("#paper-list-container").style("display", "none");
            }
        }
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

d3.text("./papers/VGG/output.txt").then(function (text) {
    d3.select("#paper-arc-output").select(".paper-description").text(text);
});

// descriptions
d3.text("./description/VGG/model_overview.txt").then(function (text) {
    d3.select("#section-model-overview").select(".description").text(text);
});

d3.text("./description/VGG/input.txt").then(function (text) {
    d3.select("#section-input").select(".description").text(text);
});

d3.text("./description/VGG/vgg.txt").then(function (text) {
    d3.select("#section-model").select(".description").text(text);
});

d3.text("./description/VGG/model_overview.txt").then(function (text) {
    d3.select("#section-model").select(".description").text(text);
});

d3.text("./description/VGG/overall_pipeline.txt").then(function (text) {
    d3.select("#overall-pipeline").text(text);
});

d3.text("./description/common/conv.txt").then(function (text) {
    d3.select(".subsection.conv").select(".description").text(text);
});

d3.text("./description/common/pooling.txt").then(function (text) {
    d3.select(".subsection.pooling").select(".description").text(text);
});

d3.text("./description/common/softmax.txt").then(function (text) {
    d3.select(".subsection.softmax").select(".description").text(text);
});

d3.text("./description/VGG/output.txt").then(function (text) {
    d3.select("#section-output").select(".description").text(text);
});
