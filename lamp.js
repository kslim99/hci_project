d3.select("#vgg-area").on("click", () => {
    location.href = "./vgg.html";
});

d3.select("#add-paper-area")
    .select("img")
    .on("click", () => {
        location.href = "./custom_paper.html";
    });
