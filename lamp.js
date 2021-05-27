d3.select("#vgg-area").on("click", () => {
    location.href = "./vgg.html";
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
