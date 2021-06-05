d3.select("#vgg-area").on("click", () => {
    location.href = "./vgg.html";
});

d3.select("#alexnet-area").on("click", () => {
    location.href = "./alexnet.html";
});

d3.select("#googlenet-area").on("click", () => {
    location.href = "./googlenet.html";
});

d3.select("#add-paper-area")
    .select("img")
    .on("click", () => {
        let inputPaperField = d3.select("#submit-paper-field");
        inputPaperField.attr("fold") == "true"
            ? inputPaperField.classed("fold", false).attr("fold", false)
            : inputPaperField.classed("fold", true).attr("fold", true);
    });

d3.select("#submit-paper").on("click", () => {
    let paperURL = document.getElementById("paper-url").value;
    sessionStorage.setItem("paperURL", paperURL);
    location.href = "./custom_paper.html";
});

d3.select("#how-to-add-paper").on("click", () => {
    let inputPaperHelp = d3.select("#how-to-use");
    inputPaperHelp.attr("fold") == "true"
        ? inputPaperHelp.classed("fold", false).attr("fold", false)
        : inputPaperHelp.classed("fold", true).attr("fold", true);
});
