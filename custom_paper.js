// If absolute URL from the remote server is provided, configure the CORS
// header on that server.

var url = sessionStorage.getItem("paperURL");

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window["pdfjs-dist/build/pdf"];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//mozilla.github.io/pdf.js/build/pdf.worker.js";

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    canvas = document.getElementById("the-canvas"),
    ctx = canvas.getContext("2d");

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
        var desiredWidth = 750;
        var viewport = page.getViewport({ scale: 1 });
        var scale = desiredWidth / viewport.width;
        var scaledViewport = page.getViewport({ scale: scale });

        //var viewport = page.getViewport({ scale: scale });
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport,
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Update page counters
    document.getElementById("page_num").textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function queueSetRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
        pageNum = num;
    }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}
document.getElementById("prev").addEventListener("click", onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}
document.getElementById("next").addEventListener("click", onNextPage);

/**
 * Asynchronously downloads PDF.
 */

pdfjsLib
    .getDocument(url)
    .promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById("page_count").textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);
    })
    .catch((err) =>
        alert(
            "Sorry! We don't have direct access to the pdf. Try accessing the paper with the link provided below the banner."
        )
    );

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

// -------------- link-to-paper --------------
d3.select("#link-to-paper").select("a").attr("href", url);

// -------------- interactive panel (conv) --------------

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
    .attr("x", 5)
    .attr("y", 20)
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
        convOutputTooltip.style("left", e.pageX - 7.5 + 515 + "px");
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

// ----------------- interactive panel (pool)---------------
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
            .transition()
            .duration(200)
            .text((d) => (d / 256).toFixed(2))
            .style("fill", (d) => (d > 128 ? "black" : "white"))
            .style("font-size", "small")
            .style("text-align", "center");
    });

// ------------------------- descriptions ----------------------

d3.text("./description/common/conv.txt").then(function (text) {
    d3.select(".subsection.conv").select("#pre-conv").text(text);
});

d3.text("./description/common/pooling.txt").then(function (text) {
    d3.select(".subsection.pooling").select(".description").text(text);
});

d3.text("./description/common/softmax.txt").then(function (text) {
    d3.select(".subsection.softmax").select(".description").text(text);
});

d3.select("#conv-paper").on("click", () => {
    queueSetRenderPage(3);
});

d3.select("#pooling-paper").on("click", () => {
    queueSetRenderPage(4);
});

d3.select("#softmax-paper").on("click", () => {
    queueSetRenderPage(4);
});

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
