// 文件路径: static/js/BambooTimeline.js
// 依赖: 无外部依赖，纯原生JavaScript + CSS
// 功能: 竹简卷轴式时间轴组件，所有文字直接显示在背景图片上，无白色背景层，文字严格限制在卷轴内

class BambooTimeline {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`容器 #${containerId} 未找到`);
            return;
        }

        // 默认配置
        this.options = {
            title: options.title || '◉ 治水华章 · 都江堰年谱 ◉',
            subtitle: options.subtitle || '─────── 千年灌溉文明 · 天府之源 ───────',
            backgroundImage: options.backgroundImage || 'https://img.picui.cn/free/2024/10/14/670c4c6a6c8f8.jpg',
            ...options
        };

        // 时间轴数据
        this.timelineData = options.data || [
            {
                year: '前256年',
                title: '李冰始建',
                desc: '秦昭王末年<br>创建都江堰',
                detailTitle: '🏯 前256年 · 李冰始建都江堰',
                detailDesc: '秦昭王末年，蜀郡守李冰主持创建都江堰，采用"无坝引水"技术，以鱼嘴分水、飞沙堰溢洪、宝瓶口引水三大主体构成，开创天府之国千年基业。',
                important: true
            },
            {
                year: '汉代',
                title: '灌溉扩展',
                desc: '灌区达70万亩<br>设堰官管理',
                detailTitle: '🌾 汉代 · 灌溉体系扩展',
                detailDesc: '西汉时期，都江堰灌区面积达70万亩，朝廷设立"堰官"专司管理，建立岁修制度，奠定了成都平原农业基础。',
                important: false
            },
            {
                year: '公元662年',
                title: '飞沙堰建成',
                desc: '三大主体成型<br>灌区150万亩',
                detailTitle: '💧 662年 · 飞沙堰建成',
                detailDesc: '唐代进一步完善都江堰工程，飞沙堰正式建成，三大主体（鱼嘴、飞沙堰、宝瓶口）完全成型，灌区面积扩展至150万亩。',
                important: true
            },
            {
                year: '宋代',
                title: '岁修完善',
                desc: '竹笼改石砌<br>岁修制度化',
                detailTitle: '📜 宋代 · 岁修制度完善',
                detailDesc: '宋代将竹笼结构改为石砌，岁修制度更加完善，制定"深淘滩、低作堰"六字诀治水原则，灌区面积达150万亩。',
                important: false
            },
            {
                year: '明清',
                title: '全面加固',
                desc: '石砌结构<br>灌区300万亩',
                detailTitle: '🏛️ 明清 · 全面加固',
                detailDesc: '明清两代对都江堰进行全面修缮，石砌结构更加坚固，制定"遇弯截角、逢正抽心"八字方针，灌区面积达300万亩。',
                important: false
            },
            {
                year: '2000年',
                title: '世界遗产',
                desc: '列入世界遗产<br>灌区超千万亩',
                detailTitle: '🏆 2000年 · 列入世界遗产',
                detailDesc: '都江堰被联合国教科文组织列入世界文化遗产名录，灌区面积达1164万亩，惠及3000万人口，成为全国第一大灌区。',
                important: true
            }
        ];

        this.init();
    }

    // 生成样式 - 所有文字严格限制在卷轴内，自动换行
    generateStyles() {
        return `
            <style>
                .bamboo-timeline {
                    position: relative;
                    width: 100%;
                    background-image: url('${this.options.backgroundImage}');
                    background-size: cover;
                    background-position: center 30%;
                    background-repeat: no-repeat;
                    border-radius: 4px 45px 45px 4px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,240,180,0.4);
                    /* 调整内边距，严格限制内容在卷轴内 */
                    padding: 35px 40px 45px 40px;
                    font-family: '华文楷书', '楷体', 'KaiTi', 'Georgia', 'Times New Roman', serif;
                    /* 隐藏超出卷轴的内容 */
                    overflow: hidden;
                }
                
                /* 移除半透明遮罩，让背景图片完全展现 */
                .bamboo-timeline::before {
                    display: none;
                }
                
                .bamboo-timeline .timeline-title {
                    text-align: center;
                    margin-bottom: 25px;
                    position: relative;
                    z-index: 2;
                    /* 限制标题在卷轴内 */
                    max-width: 90%;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .bamboo-timeline .timeline-title h2 {
                    font-size: 28px;
                    font-weight: bold;
                    color: #FDF0D8;
                    letter-spacing: 6px;
                    text-shadow: 3px 3px 6px #2c1e12, 0 0 8px rgba(0,0,0,0.7);
                    display: inline-block;
                    padding: 8px 20px;
                    background: transparent;
                    font-family: '华文楷书', 'KaiTi', serif;
                    border-bottom: 2px solid rgba(210, 170, 100, 0.6);
                    /* 标题自动换行 */
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.4;
                }
                
                .bamboo-timeline .timeline-title p {
                    font-size: 14px;
                    color: #FFF3E0;
                    letter-spacing: 2px;
                    margin-top: 10px;
                    background: transparent;
                    text-shadow: 1px 1px 3px #3a2a1a;
                    font-weight: 500;
                    display: inline-block;
                    padding: 0 10px;
                    /* 副标题自动换行 */
                    white-space: normal;
                    word-wrap: break-word;
                }
                
                .bamboo-timeline .timeline-container {
                    position: relative;
                    padding: 15px 0 15px;
                    z-index: 2;
                    /* 限制时间轴容器在卷轴内 */
                    max-width: 100%;
                }
                
                .bamboo-timeline .timeline-line {
                    position: absolute;
                    top: 42px;
                    left: 5%;
                    right: 5%;
                    height: 4px;
                    background: linear-gradient(90deg, #D4A373, #F7D98C, #C97E3A, #D4A373);
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    z-index: 1;
                }
                
                .bamboo-timeline .timeline-nodes {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    z-index: 3;
                    /* 调整节点间距，适配卷轴宽度 */
                    gap: 8px;
                    padding: 0 2%;
                }
                
                .bamboo-timeline .timeline-node {
                    text-align: center;
                    /* 缩小节点宽度，确保6个节点在卷轴内 */
                    width: 130px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                    background: transparent;
                    border-radius: 12px;
                    padding: 6px 4px;
                    /* 节点内文字自动换行 */
                    white-space: normal;
                    word-wrap: break-word;
                }
                
                .bamboo-timeline .timeline-node:hover {
                    transform: translateY(-6px);
                }
                
                .bamboo-timeline .node-marker {
                    width: 26px;
                    height: 12px;
                    background: #CD7A3C;
                    border-radius: 6px;
                    margin: 0 auto 10px;
                    transition: all 0.3s;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    border-bottom: 1px solid #F0C48E;
                }
                
                .bamboo-timeline .timeline-node:hover .node-marker {
                    background: #E68A2E;
                    transform: scaleX(1.2);
                    box-shadow: 0 0 8px rgba(230, 138, 46, 0.6);
                }
                
                .bamboo-timeline .node-marker.important {
                    width: 30px;
                    height: 16px;
                    background: #D9531E;
                    position: relative;
                }
                
                .bamboo-timeline .node-marker.important::after {
                    content: "⚜️";
                    position: absolute;
                    top: -18px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 14px;
                    color: #FFD966;
                    text-shadow: 0 0 2px #b45f1b;
                }
                
                .bamboo-timeline .node-year {
                    font-size: 16px;
                    font-weight: bold;
                    color: #FFEFC0;
                    margin: 6px 0 4px;
                    letter-spacing: 1px;
                    background: transparent;
                    display: inline-block;
                    padding: 2px 6px;
                    text-shadow: 2px 2px 4px #2f241b;
                    /* 年份自动换行 */
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
                }
                
                .bamboo-timeline .node-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #F7E5B5;
                    margin: 4px 0;
                    background: transparent;
                    display: inline-block;
                    padding: 2px 8px;
                    text-shadow: 2px 2px 3px #2f2a1f;
                    letter-spacing: 1px;
                    /* 标题自动换行，一行放不下拆两行 */
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
                    max-width: 100%;
                }
                
                .bamboo-timeline .node-desc {
                    font-size: 12px;
                    color: #FEF0D0;
                    line-height: 1.4;
                    margin-top: 4px;
                    background: transparent;
                    display: inline-block;
                    padding: 2px 4px;
                    text-shadow: 1px 1px 2px #3b2c1c;
                    font-weight: 500;
                    /* 描述自动换行，一行放不下拆两行 */
                    white-space: pre-line;
                    word-wrap: break-word;
                    line-height: 1.4;
                    max-width: 100%;
                }
                
                .bamboo-timeline .node-detail {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(25, 18, 8, 0.92);
                    backdrop-filter: blur(5px);
                    border: 1px solid #D4A373;
                    border-radius: 16px;
                    padding: 12px 16px;
                    width: 220px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    box-shadow: 0 12px 22px rgba(0,0,0,0.4);
                    z-index: 20;
                    font-family: 'Segoe UI', '华文楷书', '楷体', sans-serif;
                    color: #FD8D3C !important;
                    /* 详情框自动换行 */
                    white-space: pre-line;
                    word-wrap: break-word;
                }
                
                .bamboo-timeline .timeline-node:hover .node-detail {
                    opacity: 1;
                    visibility: visible;
                    bottom: calc(100% + 15px);
                }
                
                .bamboo-timeline .node-detail h4 {
                    color: #FD8D3C !important;
                    font-size: 14px;
                    margin-bottom: 8px;
                    border-left: 3px solid #E0A56B;
                    padding-left: 10px;
                    font-weight: bold;
                    /* 详情标题自动换行 */
                    white-space: normal;
                    word-wrap: break-word;
                    line-height: 1.3;
                }
                
                .bamboo-timeline .node-detail p {
                    font-size: 12px;
                    color: #FD8D3C !important;
                    line-height: 1.5;
                    /* 详情描述自动换行 */
                    white-space: pre-line;
                    word-wrap: break-word;
                }
                
                /* 确保所有元素无白色背景 */
                .bamboo-timeline, .bamboo-timeline * {
                    background-color: transparent !important;
                }
                
                /* 详情框保持深色半透明背景，非白色 */
                .bamboo-timeline .node-detail {
                    background-color: #E0F3DB !important;
                }
                
                @media (max-width: 1100px) {
                    .bamboo-timeline .timeline-nodes { gap: 6px; }
                    .bamboo-timeline .timeline-node { width: 115px; }
                    .bamboo-timeline .node-title { font-size: 16px; }
                    .bamboo-timeline .node-year { font-size: 14px; }
                    .bamboo-timeline .node-desc { font-size: 11px; }
                }
                
                @media (max-width: 900px) {
                    .bamboo-timeline { padding: 30px 25px 40px 25px; overflow-x: auto; }
                    .bamboo-timeline .timeline-nodes { min-width: 750px; justify-content: flex-start; gap: 15px; }
                    .bamboo-timeline .timeline-node { width: 120px; flex-shrink: 0; }
                    .bamboo-timeline .timeline-title h2 { font-size: 24px; letter-spacing: 3px; }
                }
                
                @media (max-width: 640px) {
                    .bamboo-timeline .timeline-title h2 { font-size: 20px; }
                    .bamboo-timeline .node-title { font-size: 15px; }
                    .bamboo-timeline .node-year { font-size: 12px; }
                    .bamboo-timeline .node-desc { font-size: 10px; }
                }
                
                .bamboo-timeline::-webkit-scrollbar {
                    height: 6px;
                    background: #3e2a1c;
                    border-radius: 10px;
                }
                .bamboo-timeline::-webkit-scrollbar-thumb {
                    background: #C68B4A;
                    border-radius: 10px;
                }
            </style>
        `;
    }

    // 生成HTML结构
    generateHTML() {
        let nodesHtml = '';

        this.timelineData.forEach(node => {
            nodesHtml += `
                <div class="timeline-node">
                    <div class="node-marker ${node.important ? 'important' : ''}"></div>
                    <div class="node-year">${node.year}</div>
                    <div class="node-title">${node.title}</div>
                    <div class="node-desc">${node.desc}</div>
                    <div class="node-detail">
                        <h4>${node.detailTitle || node.title}</h4>
                        <p>${node.detailDesc || node.desc}</p>
                    </div>
                </div>
            `;
        });

        return `
            <div class="bamboo-timeline">
                <div class="timeline-title">
                    <h2>${this.options.title}</h2>
                    <p>${this.options.subtitle}</p>
                </div>
                <div class="timeline-container">
                    <div class="timeline-line"></div>
                    <div class="timeline-nodes">
                        ${nodesHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // 初始化组件
    init() {
        this.container.innerHTML = this.generateStyles() + this.generateHTML();
        this.handleBackgroundFallback();
    }

    // 背景图片加载失败时的降级处理
    handleBackgroundFallback() {
        const timelineDiv = this.container.querySelector('.bamboo-timeline');
        if (!timelineDiv) return;
        const imgUrl = this.options.backgroundImage;
        if (!imgUrl) return;
        const tester = new Image();
        tester.onerror = () => {
            timelineDiv.style.backgroundImage = "url('https://picsum.photos/id/128/1600/900')";
            timelineDiv.style.backgroundColor = '#8b6946';
        };
        tester.src = imgUrl;
    }

    // 更新数据
    updateData(newData) {
        this.timelineData = newData;
        this.container.innerHTML = this.generateStyles() + this.generateHTML();
        this.handleBackgroundFallback();
    }

    // 更新标题
    updateTitle(title, subtitle) {
        if (title) this.options.title = title;
        if (subtitle) this.options.subtitle = subtitle;
        this.container.innerHTML = this.generateStyles() + this.generateHTML();
        this.handleBackgroundFallback();
    }

    // 更新背景图片
    updateBackground(imagePath) {
        this.options.backgroundImage = imagePath;
        this.container.innerHTML = this.generateStyles() + this.generateHTML();
        this.handleBackgroundFallback();
    }

    // 销毁组件
    destroy() {
        this.container.innerHTML = '';
    }
}

// 导出组件（支持多种模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BambooTimeline;
}

// 如果直接通过script标签引入，挂载到window对象
if (typeof window !== 'undefined') {
    window.BambooTimeline = BambooTimeline;
}