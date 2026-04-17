// static/js/Line Chart.js
document.addEventListener('DOMContentLoaded', function () {
    const chartDom = document.getElementById('echartFlow');
    if (!chartDom) return;

    var myChart = echarts.init(chartDom);

    // ===================== 原始数据 =====================
    var years = ["1960", "1970", "1980", "1990", "2000", "2010", "2018", "2024"];
    var runoff = [820.5, 801.2, 783.4, 765.8, 832.1, 798.5, 1086, 862.1];
    var growth_rate = [null, -2.35, -2.22, -2.25, 8.66, -4.04, 36.01, -20.62];

    // ===================== 颜色 =====================
    var colorMap = [
        "#8e5360", "#bf7368", "#faa07c", "#ffcc97",
        "#ecbac7", "#bba6cf", "#8b8bc2", "#4863a0"
    ];

    // ===================== 动态排序堆叠面积图 =====================
    function getDynamicStackSeries(data, colors) {
        let series = [];
        let n = data.length;

        for (let i = 0; i < n; i++) {
            let serie = {
                name: years[i] + "年",
                type: 'line',
                smooth: true,
                stack: 'total',
                areaStyle: {
                    color: colors[i],
                    opacity: 0.9
                },
                lineStyle: { width: 0 },
                symbol: 'none',
                emphasis: { lineStyle: { width: 0 } },
                itemStyle: { color: colors[i], borderWidth: 0 },
                data: new Array(n).fill(0)
            };
            series.push(serie);
        }

        for (let t = 0; t < n; t++) {
            let list = [];
            for (let i = 0; i < n; i++) {
                list.push({ idx: i, val: i === t ? data[t] : 0 });
            }
            list.sort((a, b) => b.val - a.val);
            let base = 0;
            for (let item of list) {
                series[item.idx].data[t] = base + (item.idx === t ? data[t] : 0);
                base += item.idx === t ? data[t] : 0;
            }
        }
        return series;
    }

    var stackSeries = getDynamicStackSeries(runoff, colorMap);

    // ===================== 图表配置 =====================
    var option = {
        tooltip: {
            trigger: "axis",
            axisPointer: { type: 'cross' }
        },
        legend: { show: false },
        dataZoom: [
            { type: "inside" },
            { type: "slider", height: 20, bottom: 10 }
        ],
        xAxis: {
            type: "category",
            data: years,
            axisLabel: { rotate: 15, fontSize: 12 },
            axisLine: { show: true }
        },
        yAxis: [
            {
                name: "年均径流量",
                type: "value",
                nameTextStyle: { fontSize: 14, padding: [0, 20, 0, 0] },
                axisLabel: { fontSize: 12 }
            },
            {
                name: "增长率(%)",
                type: "value",
                position: "right",
                nameTextStyle: { fontSize: 14, padding: [0, 0, 0, 20] },
                axisLabel: { fontSize: 12, formatter: '{value} %' }
            }
        ],
        series: [
            ...stackSeries,
            {
                name: "间隔增长率(%)",
                type: "line",
                yAxisIndex: 1,
                data: growth_rate,
                smooth: true,
                symbol: "circle",
                symbolSize: 10,
                lineStyle: { width: 4, color: "#156FFC" },
                itemStyle: { color: "#156FFC" },
                z: 999,
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 11,
                    formatter: function (params) {
                        if (params.value == null) return '';
                        return params.value + ' %';
                    }
                }
            }
        ],
        grid: {
            left: '8%', right: '8%', bottom: '15%', top: '15%', containLabel: true
        }
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
});