// GDPdata.js - 修正版（增长率2020年为空，2021开始显示）
document.addEventListener('DOMContentLoaded', function () {
    const chartDom = document.getElementById('echartGDP');
    if (!chartDom) {
        console.error('未找到图表容器 #echartGDP');
        return;
    }
    const myChart = echarts.init(chartDom);

    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const cityNames = ['成都', '德阳', '绵阳', '遂宁', '乐山', '内江', '眉山'];
    const cityColors = ['#7788B4', '#E3AE98', '#B9D2C8', '#A5A3C3', '#CC5536', '#EBA48F', '#EDBF97'];

    const cityData = [
    [11717, 19917, 20818, 22075, 23511, 24764],
    [2404,  2657,  2817,  3014,  3265,  3387],
    [3010,  3350,  3627,  4039,  4344,  4401],
    [1403,  1520,  1615,  1719,  1870,  2002],
    [2003,  2205,  2307,  2419,  2533,  2502],
    [1445,  1606,  1657,  1827,  1936,  2051],
    [1424,  1548,  1658,  1777,  1890,  2009]
];

    // ✅ 核心修改：2020年用 null 表示无数据，后面依次对应
    const gdpGrowthRate = [
        null,     // 2020 无增长率
        8.87,     // 2021
        5.94,     // 2022
        8.71,     // 2023
        6.75,     // 2024
        5.01      // 2025
    ];

    const series = [];
    for (let i = 0; i < cityNames.length; i++) {
        series.push({
            name: cityNames[i],
            type: 'bar',
            yAxisIndex: 0,
            itemStyle: {
                color: cityColors[i],
                borderRadius: [4, 4, 0, 0]
            },
            data: cityData[i],
            barWidth: 10,
            barGap: 0.1
        });
    }

    series.push({
        name: 'GDP增长率',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: { color: '#D4A373', width: 2.5 },
        itemStyle: { color: '#B85C1A', borderColor: '#fff', borderWidth: 1 },
        data: gdpGrowthRate,
        label: {
            show: true,
            position: 'top',
            formatter: (params) => params.value + '%',
            fontSize: 10,
            color: '#B85C1A',
            fontWeight: 'bold'
        }
    });

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(255,248,225,0.95)',
            borderColor: '#B87C4E',
            borderWidth: 1,
            textStyle: { fontSize: 12, color: '#2A6A60' },
            formatter: function(params) {
                let result = params[0].axisValue + '<br/>';
                for (let i = 0; i < params.length; i++) {
                    if (params[i].seriesName === 'GDP增长率') {
                        // 处理 null 数据不显示
                        if (params[i].value == null) continue;
                        result += params[i].marker + params[i].seriesName + ': ' + params[i].value + '%<br/>';
                    } else {
                        result += params[i].marker + params[i].seriesName + ': ' + params[i].value + '亿元<br/>';
                    }
                }
                return result;
            }
        },
        legend: {
            data: cityNames.concat(['GDP增长率']),
            top: 0,
            left: 'center',
            itemWidth: 12,
            itemHeight: 10,
            textStyle: { fontSize: 11, color: '#2A6A60' }
        },
        grid: { left: 55, right: 65, top: 55, bottom: 25, containLabel: true },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { fontSize: 11, color: '#2A6A60' },
            axisLine: { lineStyle: { color: '#86B8AD' } },
            axisTick: { show: false }
        },
        yAxis: [
            {
                type: 'value',
                name: 'GDP（亿元）',
                nameTextStyle: { fontSize: 11, color: '#2A6A60' },
                axisLabel: { fontSize: 10, color: '#2A6A60' },
                splitLine: { lineStyle: { color: '#C8DDD6', type: 'dashed' } }
            },
            {
                type: 'value',
                name: 'GDP增长率',
                nameTextStyle: { fontSize: 11, color: '#2A6A60' },
                position: 'right',
                axisLabel: { formatter: (v) => v + '%', fontSize: 10, color: '#2A6A60' },
                splitLine: { show: false },
                min: 0,
                max: 12
            }
        ],
        series: series,
        backgroundColor: 'transparent'
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize()); // 修复拼写错误
});