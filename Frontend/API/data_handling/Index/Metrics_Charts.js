function updateLiveChart(canvasId, value, chartInstanceVar) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    // If chart doesn't exist, initialize it with Task Manager styling
    if (!window[chartInstanceVar]) {
        const ctx = canvas.getContext('2d');
        window[chartInstanceVar] = new Chart(ctx, {
            type: 'line',
            data: {
                
                labels: new Array(60).fill(''),
                datasets: [{
                    data: new Array(60).fill(0),
                    borderColor: '#107c10',
                    backgroundColor: 'rgba(16, 124, 16, 0.2)',
                    borderWidth: 3,
                    pointRadius: 0,
                    fill: true,
                    lineTension: 0,
                    borderCapStyle: 'round'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                layout: {
                    padding: {
                        top: 5,
                        bottom: 5
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.26)'
                        },
                        ticks: {
                            stepSize: 10,
                            color: '#666',
                            callback: (value) => value + '%'
                        }
                    },
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    let chart = window[chartInstanceVar];
    
    if (chart && chart.data && chart.data.datasets[0]) {
        chart.data.datasets[0].data.push(value);
        chart.data.datasets[0].data.shift();

        chart.data.labels.push('');
        chart.data.labels.shift();

        chart.update('none');
    }
}
