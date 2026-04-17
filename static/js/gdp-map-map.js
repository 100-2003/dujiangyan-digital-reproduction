// 初始化图表 - 都江堰灌区GDP及增长率
// 路径: static/js/gdp-map-map.js
// 数据源: ../app01/Data/都江堰灌区GDP及增长率数据.csv

document.addEventListener('DOMContentLoaded', function() {
    const chartDom = document.getElementById('main');
    if (!chartDom) {
        console.error("未找到ID为 'main' 的图表容器");
        return;
    }

    const myChart = echarts.init(chartDom);

    // -------------- 从 CSV 文件读取数据 --------------
    // Flask 项目中 Data 文件夹的路径
    const csvPath = '../app01/Data/都江堰灌区GDP及增长率数据.csv';

    // 存放解析结果
    let cityNames = [];
    let cityData = [];     // 灌溉面积矩阵
    let gdpGrowthRate = [];// GDP增长率数组

    // -------------- 开始读取 CSV --------------
    fetch(csvPath)
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split('\n').filter(line => line.trim() !== '');

            // 第一行是表头，跳过
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',').map(p => p.trim());

                // 城市名 (第一列)
                const cityName = parts[0];
                cityNames.push(cityName);

                // 提取 2020-2024 灌溉面积数据 (columns 索引 1,3,5,7,9)
                const areaData = [
                    parseFloat(parts[1]),  // 2020
                    parseFloat(parts[3]),  // 2021
                    parseFloat(parts[5]),  // 2022
                    parseFloat(parts[7]),  // 2023
                    parseFloat(parts[9])   // 2024
                ];
                cityData.push(areaData);
            }

            // -------------- 手动计算 GDP 增长率 --------------
            // 格式：[2020, 2021, 2022, 2023, 2024]
            const gdp2020 = 30212;
            const gdp2021 = 32895;
            const gdp2022 = 35946;
            const gdp2023 = 37883;
            const gdp2024 = 42051;

            gdpGrowthRate = [
                null, // 2019
                ((gdp2021 - gdp2020) / gdp2020).toFixed(4), // 2020
                ((gdp2022 - gdp2021) / gdp2021).toFixed(4), // 2021
                ((gdp2023 - gdp2022) / gdp2022).toFixed(4), // 2022
                ((gdp2024 - gdp2023) / gdp2023).toFixed(4)  // 2023
            ];

            // -------------- 构建 ECharts 系列 --------------
            const series = [];

            // 1. 各城市灌溉面积柱状图
            for (let i = 0; i < cityNames.length; i++) {
                series.push({
                    name: cityNames[i],
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        color: ['#7788B4', '#E3AE98', '#B9D2C8', '#A5A3C3', '#CC5536', '#EBA48F', '#EDBF97'][i]
                    },
                    data: cityData[i],
                    label: { show: false }
                });
            }

            // 2. GDP增长率折线图
            series.push({
                name: 'GDP增长率',
                type: 'line',
                yAxisIndex: 1,
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: { color: '#73B44D', width: 3 },
                itemStyle: { color: '#73B44D' },
                data: gdpGrowthRate,
                smooth: true
            });

            // -------------- ECharts 配置 --------------
            const option = {
                title: {
                    text: '都江堰灌区各城市灌溉面积及GDP增长率对比',
                    left: 'center',
                    textStyle: { color: '#2A6A60' }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function(params) {
                        let res = params[0].name + '<br/>';
                        for (let i = 0; i < params.length; i++) {
                            if (params[i].seriesType === 'bar') {
                                res += params[i].marker + params[i].seriesName + '：' + params[i].value + ' 万亩<br/>';
                            } else {
                                res += params[i].marker + params[i].seriesName + '：' + (params[i].value !== null ? (params[i].value * 100).toFixed(2) + '%' : '暂无数据') + '<br/>';
                            }
                        }
                        return res;
                    }
                },
                legend: {
                    data: cityNames.concat(['GDP增长率']),
                    top: 30,
                    textStyle: { color: '#2A6A60' }
                },
                grid: { left: '5%', right: '12%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: ['2020', '2021', '2022', '2023', '2024'],
                    axisLine: { lineStyle: { color: '#4A9A8F' } },
                    axisLabel: { color: '#2A6A60' }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '灌溉面积 (万亩)',
                        position: 'left',
                        axisLine: { lineStyle: { color: '#7788B4' } },
                        axisLabel: { color: '#2A6A60' },
                        nameTextStyle: { color: '#2A6A60' }
                    },
                    {
                        type: 'value',
                        name: 'GDP增长率',
                        position: 'right',
                        axisLine: { lineStyle: { color: '#73B44D' } },
                        axisLabel: { formatter: (v) => (v * 100).toFixed(1) + '%', color: '#2A6A60' },
                        nameTextStyle: { color: '#2A6A60' }
                    }
                ],
                series: series
            };

            myChart.setOption(option);
        })
        .catch(err => {
            console.error('CSV 文件加载失败：', err);
            alert('无法读取 CSV 文件，请检查路径：' + csvPath);
        });

    // 窗口自适应
    window.addEventListener('resize', () => myChart.resize());
});