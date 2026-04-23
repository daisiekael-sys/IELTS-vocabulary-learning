// 艾宾浩斯学习页面逻辑
const storage = require('../../utils/storage.js');

// 艾宾浩斯复习间隔（分钟）
const REVIEW_INTERVALS = [20, 60, 540, 1440, 2880, 8640, 44640]; // 20分钟, 1小时, 9小时, 1天, 2天, 6天, 31天

// 雅思词汇数据 - 9个分类共475词（从原版网页迁移）
const WORD_DATA = {
  mixed: [], // 混合类将在初始化时填充
  tech: [
    { en: 'advanced science', cn: '尖端科学' },
    { en: 'scientific invention', cn: '科学发明' },
    { en: 'exert a far-reaching impact on …', cn: '对 … 产生一种深远的影响' },
    { en: 'double-edged sword', cn: '双刃剑' },
    { en: 'earth-shaking changes', cn: '翻天覆地的改变' },
    { en: 'pave the way for the future development', cn: '为未来的发展铺平道路' },
    { en: 'energy crisis', cn: '能源危机' },
    { en: 'depletion of resources', cn: '能源消耗' },
    { en: 'milestone', cn: '里程碑' },
    { en: 'sophisticated equipment', cn: '尖端设备' },
    { en: 'technical innovation', cn: '科技创新' },
    { en: 'expediency', cn: '权宜之计' },
    { en: 'antithetical', cn: '与 背道而驰的' },
    { en: 'over-commercialized', cn: '过渡商业化的' },
    { en: 'a heated discussion', cn: '热烈的讨论' },
    { en: 'exhaust gas', cn: '废气' },
    { en: 'disastrous', cn: '灾难性的' },
    { en: 'overshadow', cn: '使 相形见绌' },
    { en: 'substitute', cn: '取代' },
    { en: 'usher in', cn: '引领' },
    { en: 'speedy and comfortable', cn: '既快捷又舒适' },
    { en: 'opposite forces', cn: '负面影响' },
    { en: 'a fatal breakdown', cn: '致命故障' },
    { en: 'potential hazards', cn: '潜在危险' },
    { en: 'pose a threat to', cn: '对 有一种威胁' },
    { en: 'promote related industries', cn: '促进相关产业发展' },
    { en: 'accelerate', cn: '加速' },
    { en: 'means of transportation', cn: '交通方式' },
    { en: 'transportation tools', cn: '交通工具' },
    { en: 'social status', cn: '社会地位' },
    { en: 'environmentally-friendly resources', cn: '环保的能源' },
    { en: 'compared to/with …', cn: '与 …相比' },
    { en: 'alternative fuel', cn: '可替代燃料' },
    { en: 'sustainable development', cn: '可持续性发展' },
    { en: 'scientific exploration', cn: '科学探索' },
    { en: 'air travel', cn: '航空旅行' },
    { en: 'ridiculous', cn: '可笑的' },
    { en: 'absurd', cn: '荒唐的' },
    { en: 'cure-all solution', cn: '万能良药' },
    { en: 'overcome difficulties', cn: '克服困难' },
    { en: 'make progress', cn: '取得进步' },
    { en: 'a sense of national pride', cn: '民族自豪感' },
    { en: 'unprecedented', cn: '前所未有的' },
    { en: 'soaring', cn: '不断上升的' },
    { en: 'give a great push to the economic growth', cn: '极大地推动了经济发展' },
    { en: 'aggravate', cn: '使恶化' },
    { en: 'optimize', cn: '优化' },
    { en: 'see dramatic breakthroughs', cn: '取得突破性进展' },
    { en: 'scientific and technological development', cn: '科技发展' },
    { en: 'innovation capability', cn: '创新能力' }
  ],
  culture: [
    { en: 'cultural insights', cn: '文化视角' },
    { en: 'learn about the would', cn: '了解世界' },
    { en: 'a thrilling experience', cn: '一种令人激动的经历' },
    { en: 'abstract', cn: '抽象的' },
    { en: 'concrete', cn: '具体的' },
    { en: 'move somebody to tears', cn: '使 感动落泪' },
    { en: 'get relaxed and entertained', cn: '得到放松和娱乐' },
    { en: 'venue', cn: '场所' },
    { en: 'has its value', cn: '有其自己价值' },
    { en: 'inspiration', cn: '灵感' },
    { en: 'scope of knowledge', cn: '知识面' },
    { en: 'spread knowledge', cn: '传播知识' },
    { en: 'lasting artistic works', cn: '永恒的艺术作品' },
    { en: 'abstruse', cn: '深奥的' },
    { en: 'break with old customs', cn: '抛弃传统' },
    { en: 'carry down from generation to generation', cn: '代代相传' },
    { en: 'advocate the new lifestyle.', cn: '倡导新的生活方式' },
    { en: 'entertainment', cn: '娱乐' },
    { en: 'be different from', cn: '与 不同' },
    { en: 'direct experience', cn: '直接经验' },
    { en: 'echo', cn: '共识' },
    { en: "satiate people's psychological demands", cn: '满足心理需求' },
    { en: 'attach more importance to', cn: '更重视' },
    { en: 'spiritual enhancement', cn: '精神升华' },
    { en: 'a mirror of', cn: '是 的一面镜子' },
    { en: 'determinant', cn: '决定性因素' },
    { en: 'eclipse', cn: '使 相形见绌' },
    { en: 'contribute to', cn: '有助于' },
    { en: 'a sense of cool and satisfaction', cn: '一种惬意的感觉' },
    { en: 'pastimes', cn: '消遣方式' },
    { en: 'nurture imagination', cn: '培养想象力' },
    { en: 'meditation', cn: '沉思' },
    { en: 'an essence of immortality', cn: '永恒的精髓' },
    { en: 'instructive', cn: '有启发性的' },
    { en: 'edification', cn: '熏陶' },
    { en: "arouse one's curiosity about something", cn: '引发某人对某事的好奇心' },
    { en: "enrich one's knowledge", cn: '丰富某人知识' },
    { en: 'value of knowledge', cn: '知识的价值' },
    { en: 'cultural differences', cn: '文化差异性' },
    { en: 'time is fleeting and art is long', cn: '时光飞逝 ，艺术永恒' },
    { en: 'cultural diversity', cn: '文化多元化' },
    { en: 'cultural treasures', cn: '文化宝藏' },
    { en: 'cross-cultural communication', cn: '跨文化交流' },
    { en: 'cultural reconstruction', cn: '文化重建' },
    { en: 'spiritual civilization', cn: '精神文明' },
    { en: 'heritage', cn: '遗产' },
    { en: 'achievements of art', cn: '艺术成就' },
    { en: 'tear down', cn: '拆除' },
    { en: 'humane historical sites', cn: '人文历史遗址' },
    { en: 'preserve the cultural relics', cn: '保护文化遗产' },
    { en: 'blueprint', cn: '蓝图' },
    { en: 'skyscraper', cn: '摩天大楼' },
    { en: 'high-rise office buildings', cn: '高层写字楼' },
    { en: 'city construction', cn: '城市建设' },
    { en: 'well-structured', cn: '结构良好的' },
    { en: 'crystallization', cn: '结晶' },
    { en: 'visual enjoyment', cn: '视觉享受' },
    { en: 'driving force', cn: '驱动力' },
    { en: 'reconstruct', cn: '重建' },
    { en: 'destruct', cn: '破坏' },
    { en: 'architectural industry', cn: '建筑工业' },
    { en: 'map out', cn: '制定出' },
    { en: 'city designing', cn: '城市设计' },
    { en: 'beautify our life', cn: '美化我们的生活' },
    { en: 'human civilization', cn: '人类文明' },
    { en: 'cradle of culture', cn: '文化摇篮' },
    { en: 'mainstream culture', cn: '主流文化' },
    { en: 'cultural traditions', cn: '文化传统' },
    { en: 'national pride', cn: '民族自豪' },
    { en: 'local customs and practices', cn: '风土人情' },
    { en: "attract people's eyes", cn: '吸引人们的眼球' },
    { en: 'artistic taste', cn: '艺术品味' },
    { en: 'cornerstone', cn: '基石' },
    { en: 'be closely interrelated with …', cn: '与 …有密切关系' },
    { en: 'adhere to the tradition', cn: '坚持传统' },
    { en: 'architectural vandalism', cn: '破坏建筑行为' },
    { en: 'carry forward', cn: '弘扬' },
    { en: 'cultural needs', cn: '文化需求' },
    { en: 'reputation', cn: '声望' },
    { en: 'maintain the world peace', cn: '维护世界和平' },
    { en: 'artistic reflection', cn: '艺术反映' },
    { en: 'give publicity to', cn: '宣传' },
    { en: 'burden', cn: '负担' },
    { en: 'cause irreversible damage', cn: '造成不可逆转的损失' },
    { en: 'national identity and value', cn: '民族特性和价值观' },
    { en: 'remove prejudice and misunderstanding', cn: '消除偏见和误解' },
    { en: 'symbol', cn: '象征' },
    { en: 'artistic standards', cn: '艺术水准' },
    { en: 'enjoy great popularity', cn: '广受欢迎' },
    { en: 'cultural devolution', cn: '文化退化' }
  ],
  work: [
    { en: 'ambitious', cn: '雄心壮志的 、野心勃勃的' },
    { en: 'adaptability', cn: '适应性' },
    { en: 'adapt oneself to …', cn: '使自己适应 …' },
    { en: 'prosperity', cn: '繁荣' },
    { en: 'be disadvantageous to', cn: '对 不利' },
    { en: 'flow of personnel', cn: '人才流动' },
    { en: 'mechanism of personnel flow', cn: '人才流动机制' },
    { en: 'survival of the fittest', cn: '适者生存' },
    { en: 'a sense of accomplishment', cn: '成就感' },
    { en: 'potentiality', cn: '潜能' },
    { en: 'learn to cooperate and compromise', cn: '学习合作和妥协' },
    { en: 'be deeply impressed with …', cn: '对 … 印象很深' },
    { en: 'company philosophy', cn: '企业文化' },
    { en: 'flexibility', cn: '灵活性' },
    { en: 'competitive', cn: '竞争激烈的' },
    { en: 'arena', cn: '舞台' },
    { en: 'team-work spirit', cn: '团队合作精神' },
    { en: 'treasure opportunity', cn: '珍惜机会' },
    { en: 'a fat salary', cn: '收入颇丰' },
    { en: 'a harmonious interpersonal relationship', cn: '和谐的人际关系' },
    { en: 'a sense of responsibility', cn: '责任感' },
    { en: 'material gains', cn: '物质待遇' },
    { en: 'promising future', cn: '光明的前途' },
    { en: 'bright prospect', cn: '光明的前景' },
    { en: 'a challenging job', cn: '一份具有挑战性的工作' },
    { en: 'turning point', cn: '转折点' },
    { en: 'be closely related to', cn: '与 息息相关' },
    { en: 'get advanced in the society', cn: '出人头地' },
    { en: 'a decent job', cn: '一份体面的工作' },
    { en: 'chance of promotion', cn: '升迁机会' },
    { en: 'stability and satisfaction', cn: '稳定感和满足感' },
    { en: 'keep skills fresh and up-to-date', cn: '使技能可以不断更新' },
    { en: "expand one's horizon", cn: '开阔视野' },
    { en: 'balance work and life', cn: '平衡工作和生活' },
    { en: 'from-nine-to-five', cn: '朝九晚五一族' },
    { en: 'shoulder/undertake one\'s responsibility', cn: '承担起自己的责任' },
    { en: 'upgrade oneself', cn: '提升自我' },
    { en: 'a well-paid job', cn: '高收入工作' },
    { en: 'creative work', cn: '创造性工作' },
    { en: 'stand up to / meet the challenge', cn: '迎接挑战' },
    { en: 'realize the value of life', cn: '实现人生价值' },
    { en: "enrich one's social experience", cn: '丰富一个人的社会阅历' },
    { en: "cultivate one's independence and toughness", cn: '培养自己的独立性和坚韧性' },
    { en: 'seek for personal development', cn: '追求个人发展' },
    { en: "display one's talent", cn: '展示才能' },
    { en: 'a sense of self-fulfillment', cn: '自我实现感' },
    { en: 'promotion opportunity', cn: '提升机会' },
    { en: "meet one's personalized needs", cn: '满足某人个性化需求' },
    { en: "define one's role", cn: '确定自己的角色' },
    { en: 'social recognition', cn: '社会认可' },
    { en: 'accumulate experience', cn: '获取经验' },
    { en: 'inspiring', cn: '鼓舞人心的' },
    { en: 'motivation', cn: '动机' },
    { en: 'workaholic', cn: '工作狂' },
    { en: 'working environment', cn: '工作环境' },
    { en: 'work overtime', cn: '加班' },
    { en: "improve one's capabilities", cn: '提高某人能力' },
    { en: "develop one's talents", cn: '培养才智' },
    { en: 'ideal workplace', cn: '理想工作场所' },
    { en: 'master interpersonal skills', cn: '掌握人际交往技能' }
  ],
  traffic: [
    { en: 'automobile industry', cn: '汽车工业' },
    { en: 'boost the economic development', cn: '促进经济发展' },
    { en: 'levy the tax', cn: '征税' },
    { en: 'modernization', cn: '现代化' },
    { en: 'be viewed as', cn: '被视为是' },
    { en: 'be concerned about', cn: '对 担忧/关注' },
    { en: 'pollution-free fuel', cn: '无污染燃料' },
    { en: 'luxury', cn: '奢侈品' },
    { en: 'chronic lead poisoning', cn: '慢性铅中毒' },
    { en: 'fill with', cn: '使 充斥着' },
    { en: 'popularization of cars', cn: '汽车普及' },
    { en: 'lay more emphasis on …', cn: '把重心放在 …' },
    { en: 'observe traffic regulations', cn: '遵守交通规则' },
    { en: 'break traffic regulations', cn: '违反交通规则' },
    { en: 'get stuck in traffic', cn: '遇上堵车' },
    { en: 'rush hour', cn: '上下班高峰时间' },
    { en: 'ease the traffic pressure', cn: '缓解交通压力' },
    { en: 'pedestrian', cn: '行人' },
    { en: 'pavement', cn: '人行道' },
    { en: 'zebra crossing', cn: '斑马线' },
    { en: 'overspeed', cn: '超速行驶' },
    { en: 'bottleneck', cn: '交通堵塞地区' },
    { en: 'settle down effective laws', cn: '制定出积极有效的法律' },
    { en: 'impose restrictions on …', cn: '对 … 实施限制' },
    { en: 'short-sighted', cn: '目光短浅的' },
    { en: 'non-renewable resources', cn: '不可再生资源' },
    { en: 'carbon dioxide', cn: '二氧化碳' },
    { en: 'a pillar industry', cn: '支柱产业' },
    { en: 'make full use of', cn: '充分利用' },
    { en: 'road networks', cn: '公路网' },
    { en: 'speed limits', cn: '限速' },
    { en: 'enhance the quality of life', cn: '提高生活质量' },
    { en: 'pay a heavy price', cn: '付出惨痛的代价' },
    { en: 'promote the development of relative industries', cn: '促进相关产业发展' },
    { en: 'traffic engineering', cn: '交通运输工程' },
    { en: 'the number of car ownership', cn: '汽车拥有量' },
    { en: 'call for', cn: '需要' },
    { en: 'overcrowded', cn: '过度拥挤的' },
    { en: 'violator', cn: '违规者' },
    { en: 'headache', cn: '令人头痛的事' },
    { en: 'traffic accidents', cn: '交通事故' },
    { en: 'head-way', cn: '进展' },
    { en: 'conflict with', cn: '与 相冲突' },
    { en: 'major cause', cn: '主要原因' },
    { en: 'be replaced by', cn: '被 所取代' },
    { en: 'provide convenience for', cn: '为 提供便利' },
    { en: 'curb', cn: '限制' },
    { en: 'dilemma', cn: '进退两难' },
    { en: 'encourage somebody to do something', cn: '鼓励某人去做某事' },
    { en: 'energy-saving', cn: '节能的' }
  ],
  media: [
    { en: 'paparazzi', cn: '狗仔队' },
    { en: 'mass media', cn: '大众媒体' },
    { en: 'entertainment', cn: '娱乐' },
    { en: 'journalism', cn: '新闻业' },
    { en: 'journal', cn: '期刊' },
    { en: 'the latest news', cn: '最新消息' },
    { en: 'exclusive news', cn: '独家新闻' },
    { en: 'news agency', cn: '新闻社' },
    { en: 'news blockout', cn: '新闻封锁' },
    { en: 'news censorship', cn: '新闻审查' },
    { en: 'freedom of the press', cn: '新闻自由' },
    { en: 'coverage', cn: '新闻报道' },
    { en: 'do reportage on', cn: '报导' },
    { en: 'hit the headlines', cn: '上头条' },
    { en: 'issue', cn: '出版 、发行' },
    { en: 'newsstand', cn: '报摊' },
    { en: 'free-lancer writer', cn: '自由撰稿人' },
    { en: 'chief editor', cn: '总编' },
    { en: 'editorial', cn: '社论' },
    { en: 'newsworthy', cn: '值得报道的' },
    { en: 'barometer', cn: '晴雨表' },
    { en: 'the barometer of public opinion', cn: '舆论的晴雨表' },
    { en: 'live broadcast', cn: '直播' },
    { en: 'quiz show', cn: '智力竞争节目' },
    { en: 'game show', cn: '游戏节目' },
    { en: 'variety show', cn: '综合节目' },
    { en: 'talk show', cn: '脱口秀' },
    { en: 'sitcom', cn: '情景喜剧' },
    { en: 'soap opera', cn: '肥皂剧' },
    { en: 'movie star', cn: '电影明星' },
    { en: 'movie king', cn: '影帝' },
    { en: 'movie queen', cn: '影后' },
    { en: 'affair', cn: '绯闻' },
    { en: 'celebrity', cn: '名人' },
    { en: 'fame', cn: '名声' },
    { en: 'rise to fame', cn: '声名鹊起' },
    { en: 'fan', cn: '粉丝' },
    { en: "invade one's privacy", cn: '侵扰了 … 的隐私' },
    { en: 'misleading', cn: '误导性的' },
    { en: 'cheating', cn: '欺骗性的' },
    { en: 'popularity', cn: '知名度' },
    { en: 'scandal', cn: '丑闻' },
    { en: 'sensational', cn: '轰动的' },
    { en: 'prevalent', cn: '普遍的 、流行的' },
    { en: 'imperative', cn: '重要的 、必要的' },
    { en: 'audience ratings', cn: '收视率' },
    { en: 'propaganda', cn: '宣传' },
    { en: 'be influenced/swayed by', cn: '受 诱导' },
    { en: "purify one's soul", cn: '净化心灵' },
    { en: 'live in a virtual world', cn: '生活在一个虚拟世界中' },
    { en: 'be a great comfort to somebody', cn: '对 来说是一个巨大安慰' },
    { en: 'meet different tastes', cn: '满足不同口味' },
    { en: 'provide somebody with something', cn: '给 提供' },
    { en: 'follow the fashion blindly', cn: '盲目追逐时尚' },
    { en: 'commit crimes', cn: '犯罪' },
    { en: 'be inconceivable to someone', cn: '对 来说是难以想象的' },
    { en: 'impressive', cn: '给人印象深刻的' },
    { en: 'right to know', cn: '知情权' },
    { en: 'in the disguise of …', cn: '打着 … 的幌子' },
    { en: 'endanger/threaten social stability and safety', cn: '危害社会稳定和安全' },
    { en: 'information era', cn: '信息时代' },
    { en: 'keep one informed about something', cn: '使人们了解' },
    { en: 'audience/viewers', cn: '观众' },
    { en: 'have unhealthy and harmful effects on …', cn: '对 …有不良影响' },
    { en: 'information-explosion society', cn: '信息爆炸的社会' },
    { en: 'influential', cn: '有影响的' },
    { en: 'revolutionize the way we acquire information', cn: '彻底改变了我们获取信息的方式' },
    { en: 'blessing', cn: '福' },
    { en: 'curse', cn: '祸' },
    { en: 'various thrilling programs', cn: '各种各样激动人心的节目' },
    { en: 'poor-quality programs', cn: '低质量节目' },
    { en: 'ever-accelerated', cn: '不断发展的' },
    { en: 'exaggerate', cn: '夸张' },
    { en: 'enjoyable', cn: '令人享受的' },
    { en: 'fashionable', cn: '时尚的' },
    { en: 'electromagnetic radiation', cn: '电磁辐射' },
    { en: 'psychological illnesses', cn: '心理疾病' },
    { en: 'isolated', cn: '孤僻的' },
    { en: 'unimaginative', cn: '缺乏想象力的' },
    { en: 'unsociable', cn: '不好社交的' },
    { en: "deprive somebody of one's imagination and creativity", cn: '使 … 丧失了想象力和创造力' },
    { en: "jeopardize one's health", cn: '危害健康' },
    { en: 'be exposed to …', cn: '了解到 … 接触到 …' },
    { en: 'find its way into every family', cn: '进入千家万户' },
    { en: 'global village', cn: '地球村' },
    { en: 'be indulged in', cn: '沉溺于' },
    { en: 'be addicted to', cn: '对 上瘾' },
    { en: 'be fascinated by', cn: '被 所吸引' },
    { en: 'be dependent on …', cn: '依赖 …' },
    { en: 'second-hand information', cn: '二手信息' },
    { en: 'go astray', cn: '误入歧途' },
    { en: 'embark on the criminal road', cn: '走上犯罪道路' },
    { en: 'irresistible', cn: '无法抵制的' },
    { en: 'hallmark', cn: '标志' },
    { en: 'create topics of discussion', cn: '制造交谈话题' },
    { en: 'critical thinking', cn: '批判性思维' },
    { en: 'powerful means of communication', cn: '有力的交流工具' },
    { en: 'main cause', cn: '主因' },
    { en: 'tempting', cn: '有诱惑力的' },
    { en: 'reliable', cn: '可靠的' },
    { en: 'family attachment', cn: '家庭归属感' },
    { en: 'mutual understanding', cn: '相互了解' },
    { en: 'alienation of affection', cn: '感情疏远' },
    { en: 'be sick of', cn: '对 厌倦' },
    { en: 'generation gap', cn: '代沟' },
    { en: 'exchanges of feelings', cn: '感情交流' },
    { en: 'emotional bond', cn: '感情纽带' },
    { en: 'strengthen family ties', cn: '加强家庭纽带关系' },
    { en: 'be detached from reality', cn: '与现实隔绝' },
    { en: 'distinguish right from wrong', cn: '明辨是非' },
    { en: 'edifying', cn: '有教育意义的' },
    { en: 'couch potato', cn: '电视迷' },
    { en: 'be harmful to', cn: '对 有害' },
    { en: 'imitate', cn: '模仿' },
    { en: 'inexpressible', cn: '难以形容的' },
    { en: 'physical and mental health', cn: '身心健康' },
    { en: "stimulate one's imagination and creativity", cn: '激发某人想象力和创造力' },
    { en: 'unwholesome lifestyle.', cn: '不健康的生活方式' },
    { en: 'a great deal of information', cn: '大量的信息' },
    { en: 'disinteresting', cn: '令人索然无味的' }
  ],
  society: [
    { en: 'urbanization', cn: '城市化' },
    { en: 'centralization', cn: '集中化' },
    { en: 'imbalance', cn: '不平衡' },
    { en: 'in the long run', cn: '从长远角度而言' },
    { en: 'infrastructure', cn: '基础设施' },
    { en: 'booming', cn: '繁荣发展的' },
    { en: 'tertiary industry', cn: '第三产业' },
    { en: 'tranquility', cn: '宁静' },
    { en: 'revenue', cn: '税收' },
    { en: 'commercialization', cn: '商业化' },
    { en: 'traffic congestion', cn: '交通拥挤' },
    { en: 'water scarcity', cn: '水短缺' },
    { en: 'the environmental pollution', cn: '环境污染' },
    { en: 'over-industrialization', cn: '过度工业化' },
    { en: 'over-crowdedness', cn: '过度拥挤' },
    { en: 'unemployment', cn: '失业' },
    { en: 'wealth distribution', cn: '财富分配' },
    { en: 'social instability', cn: '社会动荡' },
    { en: 'urban construction', cn: '城市建设' },
    { en: 'population explosion', cn: '人口激增' },
    { en: 'a rising crime rate', cn: '犯罪率上升' },
    { en: 'drain of energy and resources', cn: '能源和资源消耗' },
    { en: 'offer more job opportunities', cn: '提供更多的就业机会' },
    { en: 'a rapid pace of life', cn: '快节奏生活' },
    { en: 'stress-related illnesses', cn: '与压力有关的疾病' },
    { en: 'high cost of living', cn: '高额生活费用' },
    { en: 'pastoral life', cn: '田园生活' },
    { en: 'class polarization', cn: '阶级两极分化' },
    { en: 'social welfare', cn: '社会福利' },
    { en: 'give special care to', cn: '给予 特殊关照' },
    { en: 'urban sprawl', cn: '城市扩张' },
    { en: 'convenient transportation means', cn: '便捷的交通工具' },
    { en: 'better medical services', cn: '更好的医疗服务' },
    { en: 'pressure of modern life in city', cn: '城市生活压力' },
    { en: 'be vulnerable to', cn: '易于患上' },
    { en: 'melting pot', cn: '熔炉' },
    { en: 'on the brink of', cn: '处于 边缘' },
    { en: 'pollutant', cn: '污染性物质' },
    { en: 'waste disposal', cn: '废物处理' },
    { en: 'put the blame on …', cn: '归咎于 …' },
    { en: 'be attributable to', cn: '归因为' },
    { en: 'ways of consumption', cn: '消费方式' },
    { en: 'suffer heavy losses', cn: '遭受重大损失' },
    { en: 'citizen', cn: '居民' },
    { en: 'be confronted with', cn: '面临着' },
    { en: 'breed crimes', cn: '滋生犯罪' },
    { en: 'vicious cycle', cn: '恶性循环' },
    { en: 'a feasible measure', cn: '一种可行的措施' },
    { en: 'give priority to', cn: '优先考虑' },
    { en: 'city planners', cn: '城市规划者' }
  ],
  animal: [
    { en: 'vivisection', cn: '活体解剖' },
    { en: 'perform . experiments on animals', cn: '在动物身上做试验' },
    { en: 'test animals', cn: '用于实验的动物' },
    { en: 'be subjected to experiments', cn: '被迫接受试验' },
    { en: 'animal rights', cn: '动物权利' },
    { en: 'clinical research', cn: '临床研究' },
    { en: 'cruel', cn: '残忍的' },
    { en: 'extremist', cn: '极端主义者' },
    { en: 'medical research', cn: '医学研究' },
    { en: 'origin of species', cn: '物种起源' },
    { en: 'alternative method', cn: '替代的方法' },
    { en: 'biological diversity', cn: '生物多样性' },
    { en: 'natural balance', cn: '自然平衡' },
    { en: 'equilibrium of ecosystem', cn: '生态平衡' },
    { en: 'coexistence', cn: '共存' },
    { en: 'endangered animals', cn: '濒危动物' },
    { en: 'diversity of species', cn: '物种多样性' },
    { en: 'shameless', cn: '令人羞愧的' },
    { en: 'barbaric', cn: '野蛮的' },
    { en: 'live and let live', cn: '活着就是与万物共存' },
    { en: 'meaningless', cn: '没有意义的' },
    { en: 'dominant species', cn: '优势物种' },
    { en: 'laboratory', cn: '实验室' },
    { en: 'vaccine', cn: '疫苗' },
    { en: 'infringement', cn: '践踏' },
    { en: 'right to live', cn: '生存权' },
    { en: 'torture', cn: '折磨' },
    { en: 'anti-science', cn: '反科学的' },
    { en: 'life-threatening diseases', cn: '危及生命的疾病' },
    { en: 'scientific gains', cn: '科学成果' },
    { en: 'an ever-lasting theme', cn: '一个永恒的主题' },
    { en: 'evolution', cn: '进化' },
    { en: 'computer simulation', cn: '电脑模拟' },
    { en: 'groundless', cn: '没有理由的' },
    { en: 'humane', cn: '人道的' },
    { en: 'medical technology', cn: '医疗技术' },
    { en: 'anatomy', cn: '解剖' },
    { en: 'equal', cn: '公平的' },
    { en: 'unreliable', cn: '不可信赖的' },
    { en: 'valid', cn: '有效的 、正当的' }
  ],
  spellError: [
    { en: 'analysis', cn: '分析' },
    { en: 'apologize', cn: '道歉' },
    { en: 'bureaucracy', cn: '官僚主义' },
    { en: 'calendar', cn: '日历' },
    { en: 'decision', cn: '决定' },
    { en: 'definitely', cn: '明确地' },
    { en: 'efficient', cn: '效率高的' },
    { en: 'government', cn: '政府' },
    { en: 'height', cn: '高度' },
    { en: 'knowledge', cn: '知识' },
    { en: 'library', cn: '图书馆' },
    { en: 'necessary', cn: '必要的' },
    { en: 'pronunciation', cn: '发音' },
    { en: 'psychology', cn: '心理学' },
    { en: 'receive', cn: '接收' }
  ]
};

Page({
  data: {
    stats: {
      totalMaster: 0,
      totalError: 0,
      progress: 0
    },
    categoryStats: {},
    currentCategory: '',
    isReviewMode: false,
    currentWord: null,
    currentIndex: 0,
    totalWords: 0,
    learningProgress: 0,
    showCn: false,
    reviewList: []
  },

  wordQueue: [],
  ebbinghausData: null,

  onLoad() {
    this.initMixedCategory();
    this.loadData();
    this.calculateStats();
  },

  // 初始化混合类（合并所有分类词汇）
  initMixedCategory() {
    if (WORD_DATA.mixed.length === 0) {
      const allWords = [];
      Object.keys(WORD_DATA).forEach(key => {
        if (key !== 'mixed') {
          allWords.push(...WORD_DATA[key]);
        }
      });
      WORD_DATA.mixed = allWords;
    }
  },

  onShow() {
    this.loadData();
    this.calculateStats();
    this.updateReviewList();
  },

  // 加载数据
  loadData() {
    this.ebbinghausData = storage.getEbbinghausData();
  },

  // 计算统计
  calculateStats() {
    const data = this.ebbinghausData;
    const masterMap = data.masterMap || {};
    const errors = data.errors || [];
    
    // 计算分类统计
    const categoryStats = {};
    let totalWords = 0;
    let masteredWords = 0;
    
    Object.keys(WORD_DATA).forEach(category => {
      const words = WORD_DATA[category];
      const categoryMastered = words.filter(w => masterMap[w.en] >= 7).length;
      categoryStats[category] = words.length;
      totalWords += words.length;
      masteredWords += categoryMastered;
    });
    
    const progress = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
    
    this.setData({
      'stats.totalMaster': masteredWords,
      'stats.totalError': errors.length,
      'stats.progress': progress,
      categoryStats
    });
  },

  // 选择分类
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ 
      currentCategory: category,
      showCn: false
    });
    this.loadCategoryWords(category);
  },

  // 加载分类单词
  loadCategoryWords(category) {
    const words = WORD_DATA[category] || [];
    const categoryNames = {
      mixed: '混合类（全部词汇）',
      tech: '科技类',
      culture: '文化类',
      work: '工作类',
      traffic: '交通类',
      media: '媒体类',
      society: '社会类',
      animal: '动物保护类',
      spellError: '易拼错高频词'
    };
    
    // 根据艾宾浩斯数据排序单词
    this.wordQueue = words.map(word => ({
      ...word,
      categoryName: categoryNames[category],
      reviewLevel: this.ebbinghausData.masterMap[word.en] || 0,
      nextReview: this.ebbinghausData.memory[word.en] || 0
    })).sort((a, b) => {
      // 优先显示需要复习的单词
      const now = Date.now();
      const aDue = a.nextReview <= now ? 1 : 0;
      const bDue = b.nextReview <= now ? 1 : 0;
      if (aDue !== bDue) return bDue - aDue;
      return a.reviewLevel - b.reviewLevel;
    });
    
    this.setData({
      totalWords: this.wordQueue.length,
      currentIndex: 0,
      learningProgress: 0
    });
    
    this.showNextWord();
  },

  // 显示下一个单词
  showNextWord() {
    if (this.wordQueue.length === 0 || this.data.currentIndex >= this.wordQueue.length) {
      this.setData({ currentWord: null });
      return;
    }
    
    const word = this.wordQueue[this.data.currentIndex];
    const progress = ((this.data.currentIndex + 1) / this.wordQueue.length) * 100;
    
    this.setData({
      currentWord: word,
      learningProgress: progress,
      showCn: false
    });
  },

  // 切换中文显示
  toggleCnReveal() {
    this.setData({ showCn: !this.data.showCn });
  },

  // 标记忘记
  markForget() {
    this.processAnswer('forget');
  },

  // 标记模糊
  markVague() {
    this.processAnswer('vague');
  },

  // 标记记住
  markRemember() {
    this.processAnswer('remember');
  },

  // 处理答案
  processAnswer(result) {
    const word = this.data.currentWord;
    if (!word) return;
    
    const data = this.ebbinghausData;
    const now = Date.now();
    
    if (result === 'remember') {
      // 增加复习等级
      data.masterMap[word.en] = (data.masterMap[word.en] || 0) + 1;
      data.stats.totalMaster = (data.stats.totalMaster || 0) + 1;
      
      // 设置下次复习时间
      const reviewLevel = data.masterMap[word.en];
      if (reviewLevel < REVIEW_INTERVALS.length) {
        const interval = REVIEW_INTERVALS[reviewLevel - 1] * 60 * 1000; // 转换为毫秒
        data.memory[word.en] = now + interval;
      }
    } else if (result === 'vague') {
      // 保持当前等级，稍后复习
      data.memory[word.en] = now + 5 * 60 * 1000; // 5分钟后
    } else {
      // 忘记 - 重置等级
      data.masterMap[word.en] = 0;
      data.errors.push({
        word: word.en,
        time: now
      });
      data.stats.totalError = (data.stats.totalError || 0) + 1;
      data.memory[word.en] = now + 20 * 60 * 1000; // 20分钟后
    }
    
    // 保存数据
    storage.saveEbbinghausData(data);
    this.ebbinghausData = data;
    
    // 显示下一个单词
    this.setData({
      currentIndex: this.data.currentIndex + 1
    });
    
    setTimeout(() => {
      this.showNextWord();
      this.calculateStats();
    }, 300);
  },

  // 切换学习模式
  toggleLearningMode() {
    this.setData({
      isReviewMode: !this.data.isReviewMode
    });
    
    if (this.data.currentCategory) {
      this.loadCategoryWords(this.data.currentCategory);
    }
  },

  // 重置分类
  resetCategory() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置该分类的学习进度吗？',
      success: (res) => {
        if (res.confirm) {
          const data = this.ebbinghausData;
          const words = WORD_DATA[this.data.currentCategory] || [];
          
          words.forEach(word => {
            delete data.masterMap[word.en];
            delete data.memory[word.en];
          });
          
          storage.saveEbbinghausData(data);
          this.ebbinghausData = data;
          this.loadCategoryWords(this.data.currentCategory);
          this.calculateStats();
          
          wx.showToast({
            title: '已重置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 更新复习列表
  updateReviewList() {
    const data = this.ebbinghausData;
    const now = Date.now();
    const reviewList = [];
    
    Object.keys(WORD_DATA).forEach(category => {
      WORD_DATA[category].forEach(word => {
        const nextReview = data.memory[word.en] || 0;
        if (nextReview > 0 && nextReview <= now) {
          const level = data.masterMap[word.en] || 0;
          reviewList.push({
            en: word.en,
            cn: word.cn,
            dueText: `第${level + 1}次复习`,
            category
          });
        }
      });
    });
    
    this.setData({ reviewList });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '艾宾浩斯记忆训练 - 科学记忆雅思词汇',
      path: '/pages/ebbinghaus/ebbinghaus'
    };
  }
});
