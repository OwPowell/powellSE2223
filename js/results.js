// Graph CSV data using chart.js

async function getData() {
    const response = await fetch('./data/Research-Data.csv');
    const data = await response.text(); // CSV in TEXT format
    const table = data.split("\n").slice(1); // split into rows and cut 0th row

    const xImage = []; // image number
    const yCount = []; // % error for litter count
    const yPixel = []; // % error for pixel coverage

    table.forEach(row =>  {
        const columns = row.split(','); // split each row into columns
        const image = columns[0];
        xImage.push(image);
        const count = columns[1];
        yCount.push(count);
        const pixel = columns[2];
        yPixel.push(pixel);
    });

    return {xImage, yCount, yPixel};
}

async function createChart() {
    const data = await getData(); // createChart() waits until data is got

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        labels: data.xImage,
        datasets: [
            {
                label: 'Litter Count % Error',
                data: data.yCount,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            },
            {
                label: 'Pixel Coverage % Error',
                data: data.yPixel,
                backgroundColor: 'rgba(0, 200, 64, 0.2)',
                borderColor: 'rgba(0, 156, 132, 1)',
                borderWidth: 2
            }
        ]
    },
    options: {
        responsive: true,                   // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Image Number',
                    font: {
                        size: 20
                    },
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Percent Error',
                    font: {
                        size: 20
                    },
                }
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: 'Litter Count and Pixel Coverage Percent Errors per Image',
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'top'
            }
        }
    }
});
}

createChart();