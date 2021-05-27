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
        var desiredWidth = 800;
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
pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById("page_count").textContent = pdfDoc.numPages;

    // Initial/first page rendering
    renderPage(pageNum);
});

// -------------- interactive panel (conv) --------------

let inputID = -1;
let filterID = -1;
let inputIDList = ["building", "windflower", "child"];
let filterIDList = ["edge", "vertical", "horizontal"];

let tooltip = d3.select("#input-tooltip").style("display", "none");

let outputTooltip = d3.select("#output-tooltip");

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
        outputTooltip.style("left", e.pageX - 7.5 + 530 + "px");
        outputTooltip.style("top", e.pageY - 7.5 + "px");
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

d3.text("./description/conv.txt").then(function (text) {
    d3.select("#section-model").select(".description").text(text);
});

d3.text("./description/conv.txt").then(function (text) {
    d3.select(".subsection.conv").select(".description").text(text);
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
