
// interactive panel - conv

d3.select('.conv')
    .select('.input-candidate')
    .selectAll('img')
    .on('click', function () {
        let targetCanvas = document.getElementById("conv-input");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(img, 10, 10, targetCanvas.clientWidth, targetCanvas.clientHeight);
    });
