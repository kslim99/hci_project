
// interactive panel - conv

d3.select('#conv-input-candidate')
    .selectAll('img')
    .on('click', function () {
        let targetCanvas = document.getElementById("conv-input");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(img, 0, 0, targetCanvas.clientWidth, targetCanvas.clientHeight);
    });

d3.select('#conv-filter-candidate')
    .selectAll('img')
    .on('click', function () {
        let targetCanvas = document.getElementById("conv-filter");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(img, 10, 10, targetCanvas.clientWidth - 20, targetCanvas.clientHeight - 20);
    });

d3.select('#conv-arrow')
    .on('click', function () {
        /*
        let imgSpot = document.getElementById("conv-output-img");
        imgSpot.src == './image_archive/edge_output/building_out.jpg';
        */
    });

d3.select('#conv-input')
    .on('click', function (event) {
        console.log(event);
        let clickedX = event.offsetX;
        let clickedY = event.offsetY;

        let context = this.getContext("2d");
        let myImageData = context.getImageData(clickedX, clickedY, 3, 3).data;
        let pixels = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                pixels[i][j] = myImageData[4 * (i * 3 + j)]
            }
        }
        console.log(pixels);
    });