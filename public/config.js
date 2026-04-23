// 共享配置文件
const config = {
    // 颜色配置
    colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        accent: '#e74c3c',
        background: '#f5f5f5',
        text: '#333333',
        success: '#27ae60',
        warning: '#f39c12',
        info: '#3498db'
    },
    // 字体配置
    fonts: {
        family: 'Arial, sans-serif',
        size: {
            small: '12px',
            normal: '14px',
            large: '16px',
            xlarge: '20px',
            xxlarge: '24px'
        }
    },
    // 布局配置
    layout: {
        containerWidth: '80%',
        maxWidth: '1200px',
        padding: '20px',
        margin: '0 auto'
    },
    // 按钮配置
    buttons: {
        backButton: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '12px',
            padding: '5px 10px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        }
    },
    // 标题配置
    headings: {
        h1: {
            textAlign: 'center',
            margin: '0',
            paddingTop: '10px',
            marginBottom: '30px',
            color: '#2c3e50'
        }
    },
    // 导航配置 (👇 这里的路径已更新为英文，确保 GitHub 链接有效)
    navigation: {
        pages: [
            {
                id: 'center',
                name: '学习中心',
                path: 'index.html', // 对应你创建的 index.html
                icon: '🏠'
            },
            {
                id: 'ebbinghaus',
                name: '艾宾浩斯宇宙版',
                path: 'ebbinghaus.html', // 对应重命名后的文件
                icon: '🌌'
            },
            {
                id: 'synonyms',
                name: '高频同义替换',
                path: 'synonyms.html', // 对应重命名后的文件
                icon: '🔄'
            },
            {
                id: 'microbe',
                name: '微生物词汇',
                path: 'microbe.html', // 对应重命名后的文件
                icon: '🦠'
            }
        ]
    }
};

// 应用配置到页面
function applyConfig() {
    // 不应用全局样式，保持HTML文件中定义的深色主题
    // 只加载配置数据，不修改样式
    console.log('Config loaded');
}

// 加载配置
if (typeof window !== 'undefined') {
    window.config = config;
    window.applyConfig = applyConfig;
}