
// interactive panel - conv

d3.select('#conv-input-candidate')
    .selectAll('img')
    .on('click', function () {
        let targetCanvas = document.getElementById("conv-input");
        let ctx = targetCanvas.getContext("2d");
        // clear convas
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

        let img = this;
        ctx.drawImage(img, 10, 10, targetCanvas.clientWidth - 20, targetCanvas.clientHeight - 20);
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

let pixels_row1 = [0, 0, 0];
let pixels_row2 = [0, 0, 0];
let pixels_row3 = [0, 0, 0];

// initialize
d3.select('#row1')
    .selectAll('rect')
    .data(pixels_row1, d => d)
    .join('rect')
    .attr('width', 30)
    .attr('height', 30)
    .attr('x', (d, i) => 40 * i + 7)
    .attr('y', 1)
    .style('fill', d => `rgb(${d},${d},${d})`);

d3.select('#row1')
    .selectAll('text')
    .data(pixels_row1, d => d)
    .join('text')
    .attr('x', (d, i) => 40 * i + 19)
    .attr('y', 22)
    .text(d => d / 256)
    .style('fill', d => (d > 128) ? 'black' : 'white')
    .style('font-size', 'small')
    .style('text-align', 'center');

d3.select('#row2')
    .selectAll('rect')
    .data(pixels_row2, d => d)
    .join('rect')
    .attr('width', 30)
    .attr('height', 30)
    .attr('x', (d, i) => 40 * i + 7)
    .attr('y', 42)
    .style('fill', d => `rgb(${d},${d},${d})`);

d3.select('#row2')
    .selectAll('text')
    .data(pixels_row2, d => d)
    .join('text')
    .attr('x', (d, i) => 40 * i + 19)
    .attr('y', 62)
    .text(d => d / 256)
    .style('fill', d => (d > 128) ? 'black' : 'white')
    .style('font-size', 'small')
    .style('text-align', 'center');

d3.select('#row3')
    .selectAll('rect')
    .data(pixels_row3, d => d)
    .join('rect')
    .attr('width', 30)
    .attr('height', 30)
    .attr('x', (d, i) => 40 * i + 7)
    .attr('y', 82)
    .style('fill', d => `rgb(${d},${d},${d})`);

d3.select('#row3')
    .selectAll('text')
    .data(pixels_row3, d => d)
    .join('text')
    .attr('x', (d, i) => 40 * i + 19)
    .attr('y', 102)
    .text(d => d / 256)
    .style('fill', d => (d > 128) ? 'black' : 'white')
    .style('font-size', 'small')
    .style('text-align', 'center');

d3.select('#conv-input')
    .on('click', function (event) {
        let clickedX = event.offsetX;
        let clickedY = event.offsetY;

        let context = this.getContext("2d");
        let myImageData = context.getImageData(clickedX, clickedY, 3, 3).data.filter((d, i) => (i % 4 == 0));
        pixels_row1 = myImageData.slice(0, 3);
        pixels_row2 = myImageData.slice(3, 6);
        pixels_row3 = myImageData.slice(6, 9);

        d3.select('#row1')
            .selectAll('rect')
            .data(pixels_row1, d => d)
            .join('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', (d, i) => 40 * i + 7)
            .attr('y', 1)
            .transition()
            .duration(500)
            .style('fill', d => `rgb(${d},${d},${d})`);

        d3.select('#row1')
            .selectAll('text')
            .data(pixels_row1, d => d)
            .join('text')
            .attr('x', (d, i) => 40 * i + 11)
            .attr('y', 22)
            .transition()
            .duration(500)
            .text(d => (d / 256).toFixed(2))
            .style('fill', d => (d > 128) ? 'black' : 'white')
            .style('font-size', 'small')
            .style('text-align', 'center');

        d3.select('#row2')
            .selectAll('rect')
            .data(pixels_row2, d => d)
            .join('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', (d, i) => 40 * i + 7)
            .attr('y', 42)
            .transition()
            .duration(500)
            .style('fill', d => `rgb(${d},${d},${d})`);

        d3.select('#row2')
            .selectAll('text')
            .data(pixels_row2, d => d)
            .join('text')
            .attr('x', (d, i) => 40 * i + 11)
            .attr('y', 62)
            .transition()
            .duration(500)
            .text(d => (d / 256).toFixed(2))
            .style('fill', d => (d > 128) ? 'black' : 'white')
            .style('font-size', 'small')
            .style('text-align', 'center');

        d3.select('#row3')
            .selectAll('rect')
            .data(pixels_row3, d => d)
            .join('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', (d, i) => 40 * i + 7)
            .attr('y', 82)
            .transition()
            .duration(500)
            .style('fill', d => `rgb(${d},${d},${d})`);

        d3.select('#row3')
            .selectAll('text')
            .data(pixels_row3, d => d)
            .join('text')
            .attr('x', (d, i) => 40 * i + 11)
            .attr('y', 102)
            .transition()
            .duration(500)
            .text(d => (d / 256).toFixed(2))
            .style('fill', d => (d > 128) ? 'black' : 'white')
            .style('font-size', 'small')
            .style('text-align', 'center');
    });