// 古卷治水华章 · 都江堰词云（终极放大+强对比版）
const wordData = [
    // 🔥 核心词：纯白/最大号（最强对比，绝对看清）
    { name: '都江堰', value: 150, color: '#FA9FB5', weight: 260, fontFamily: '华文楷书, KaiTi, serif' },
    { name: '李冰', value: 130, color: '#FC8D59', weight: 240, fontFamily: '华文楷书, KaiTi, serif' },

    // 主体词汇（白色/浅金色系）
    { name: '天府之国', value: 95, color: '#FFFACD', weight: 180 },
    { name: '世界遗产', value: 90, color: '#FFF8DC', weight: 170 },
    { name: '灌溉文明', value: 85, color: '#FFE4B5', weight: 160 },
    { name: '鱼嘴', value: 80, color: '#DEB887', weight: 150 },
    { name: '飞沙堰', value: 78, color: '#F0E68C', weight: 145 },
    { name: '宝瓶口', value: 76, color: '#FFD700', weight: 140 },
    { name: '无坝引水', value: 72, color: '#F5DEB3', weight: 130 },
    { name: '道法自然', value: 68, color: '#FFFACD', weight: 120 },
    { name: '岷江', value: 64, color: '#48D1CC', weight: 110 },
    { name: '千年工程', value: 58, color: '#F4A460', weight: 100 },

    // 细节词汇（保证能看清，不再太小）
    { name: '岁修', value: 52, color: '#F5F5DC', weight: 80 },
    { name: '离堆', value: 50, color: '#D2B48C', weight: 75 },
    { name: '三石人', value: 48, color: '#DEB887', weight: 70 },
    { name: '玉垒山', value: 36, color: '#D2B48C', weight: 65 },
    { name: '引水', value: 30, color: '#F5F5DC', weight: 60 },
    { name: '灌区', value: 36, color: '#8FBC8F', weight: 55 },
    { name: '都江', value: 38, color: '#F5F5DC', weight: 50 },
    { name: '深淘滩', value: 46, color: '#F5F5DC', weight: 45 },
    { name: '低作堰', value: 44, color: '#F5F5DC', weight: 40 }
];

document.addEventListener('DOMContentLoaded', function() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts 未加载');
        return;
    }

    const container = document.getElementById('echartWordcloud');
    if (!container) {
        console.error('未找到容器 #echartWordcloud');
        return;
    }

    // 背景图保持不变
    container.style.backgroundImage = "url('images/2-001.jpg')";
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";

    const wordChart = echarts.init(container);

    wordChart.setOption({
        tooltip: {
            show: true,
            formatter: (params) => params.name,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#000',
            textStyle: { fontFamily: 'KaiTi', fontSize: 24 }
        },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            width: '100%',
            height: '100%',
            sizeRange: [40, 260], // 全局放大范围
            rotationRange: [-15, 15], // 几乎水平，更易读
            gridSize: 5, // 紧凑排列，给大字留空间
            shrinkToFit: true,

            textStyle: {
                fontFamily: '华文楷书, KaiTi, serif',
                fontWeight: 'bold',
                // 核心逻辑：直接用数据里的颜色（白/金/绿），对抗背景水纹
                color: function(params) {
                    return params.data.color || '#FFFFFF';
                }
            },

            data: wordData.map(item => ({
                name: item.name,
                value: item.weight,
                weight: item.weight,
                color: item.color
            })),

            emphasis: {
                focus: 'self',
                textStyle: {
                    textShadowBlur: 20,
                    textShadowColor: 'rgba(0,0,0,0.7)',
                    fontWeight: 'bolder'
                }
            }
        }]
    });

    window.addEventListener('resize', () => wordChart.resize());
    console.log('词云已优化：字体超大、颜色纯白，背景水印不影响阅读');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wordData };
}