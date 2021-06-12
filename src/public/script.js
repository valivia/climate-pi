window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var lineChartData = {
    labels: [],
    datasets: [
        {
            label: "Humidity",
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
            fill: false,
            data: [],
            yAxisID: "Humidity",
            parsing: {
                xAxisKey: "Date",
                yAxisKey: "Humidity",
            }
            //tension: 0.4,
        },
        {
            label: "Temperature",
            borderColor: window.chartColors.blue,
            backgroundColor: window.chartColors.blue,
            fill: false,
            data: [],
            yAxisID: "Temperature",
            parsing: {
                xAxisKey: "Date",
                yAxisKey: "Temperature",
            }
            //tension: 0.4
        }
    ]
};

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    const graph = new Chart(ctx, {
        type: "line",
        data: lineChartData,
        options: {
            responsive: true,
            stacked: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            title: {
                display: true,
                text: 'Climate'
            },
            scales: {
                Humidity: {
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-Humidity",
                    pointRadius: 0,
                    suggestedMin: 40,
                    suggestedMax: 65,
                },
                Temperature: {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-Temperature",
                    pointRadius: 0,
                    suggestedMin: 20,
                    suggestedMax: 30,
                    gridLines: {
                        drawOnChartArea: false,
                    },
                },
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    function prepareData(data) {
        data.Date = new Date(data.Date);
        let min = data.Date.getMinutes()
        data.Date = `${data.Date.getHours() + 2}:${min < 10 ? `0${min}` : min}`

        return data;
    }

    function addData(label, data) {
        graph.data.labels = graph.data.labels.concat(label);
        graph.data.labels.shift();
        graph.data.datasets.forEach((dataset) => {
            dataset.data = dataset.data.concat(data);
            dataset.data.shift();
            console.log(`Dataset:`);
            console.log(dataset.data);
        });

        console.log(`Labels:`);
        console.log(graph.data.labels);
        graph.update();
    }

    function resetData() {
        console.log("Graph reset.");
        graph.data.labels = [];
        graph.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
    }

    var socket = io();

    socket.on('init', function (data) {
        if (graph.data.labels.length !== 0) { resetData(); }

        console.log("Loading data...");

        for (let i = 0; i < data.length; i++) {
            data[i] = prepareData(data[i]);
        }
        addData(data.Date, data)
    });

    socket.on('New Data', function (data) {
        data = prepareData(data);
        addData(data.Date, data)
    });
};