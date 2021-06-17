window.chartColors = {
    red: 'rgb(255, 59, 82)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(4, 112, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var temperatureData = {
    labels: [],
    datasets: [
        {
            label: "Temperature",
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
            fill: false,
            // tension: .4,
            data: [],
            yAxisID: "Temperature",
            parsing: {
                xAxisKey: "Date",
                yAxisKey: "Temperature",
            }
        }
    ]
};

var humidityData = {
    labels: [],
    datasets: [
        {
            label: "Humidity",
            borderColor: window.chartColors.blue,
            backgroundColor: window.chartColors.blue,
            fill: false,
            data: [],
            yAxisID: "Humidity",
            parsing: {
                xAxisKey: "Date",
                yAxisKey: "Humidity",
            }
        }
    ]
};

window.onload = function () {
    var temp = document.getElementById("temperatureCanvas").getContext("2d");
    var hum = document.getElementById("humidityCanvas").getContext("2d");

    const humGraph = new Chart(hum, {
        type: "line",
        data: humidityData,
        options: {
            responsive: true,
            stacked: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                Humidity: {
                    type: "linear",
                    display: true,
                    position: "left",
                    pointRadius: 0,
                    suggestedMin: 40,
                    suggestedMax: 65,
                },
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });

    const tempGraph = new Chart(temp, {
        type: "line",
        data: temperatureData,
        options: {
            responsive: true,
            stacked: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                Temperature: {
                    type: "linear",
                    display: true,
                    position: "left",
                    pointRadius: 0,
                    suggestedMin: 20,
                    suggestedMax: 30,
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
        data.Date = `${data.Date.getDay()} - ${data.Date.getHours() + 2}:${min < 10 ? `0${min}` : min}`

        return data;
    }

    function updateStats(data) {
        let last = data[data.length - 1];
        if (last === undefined) {
            last = data
        }
        $("#lastTemp").html(last.Temperature);
        $("#lastHum").html(last.Humidity);


        console.log(tempGraph.data.datasets[0].data[0]);

        let yesterday = tempGraph.data.datasets[0].data[0];
        $("#yesterdayTemp").html(yesterday.Temperature);
        $("#yesterdayHum").html(yesterday.Humidity);
    }

    function addData(label, data, graph) {
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
        updateStats(data);
        graph.update();
    }

    function resetData(graph) {
        console.log("Graph reset.");
        graph.data.labels = [];
        graph.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
    }

    var socket = io();

    socket.on('init', function (data) {
        if (tempGraph.data.labels.length !== 0) { resetData(tempGraph); resetData(humGraph); }

        console.log("Loading data...");

        for (let i = 0; i < data.length; i++) {
            data[i] = prepareData(data[i]);
        }
        addData(data.Date, data, tempGraph);
        addData(data.Date, data, humGraph);
    });

    socket.on('new data', function (data) {
        data = prepareData(data);
        addData(data.Date, data, tempGraph);
        addData(data.Date, data, humGraph);
    });

    socket.on('average', function (data) {
        console.log(data);
    });
};