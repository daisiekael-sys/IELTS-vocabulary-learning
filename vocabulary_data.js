// 按单元组织的词汇数据
const vocabularyByUnit = [
  {
    unit: "第一单元",
    categories: [
      {
        group: "增长",
        words: [
          {en: "increase", cn: "增加"},
          {en: "rise", cn: "增加"},
          {en: "raise", cn: "增加"},
          {en: "grow", cn: "生长，增长"},
          {en: "growth", cn: "增加，增长"},
          {en: "go up", cn: "上升，增长"},
          {en: "boost", cn: "促进，增加"},
          {en: "foster", cn: "养育，培养"},
          {en: "boom", cn: "使兴旺，繁荣"},
          {en: "promote", cn: "提升，促进"},
          {en: "upgrade", cn: "提升，上升"},
          {en: "greater", cn: "更大的"},
          {en: "more", cn: "更多的"},
          {en: "soar", cn: "猛增"},
          {en: "extra", cn: "额外的"},
          {en: "additional", cn: "额外的"}
        ]
      },
      {
        group: "激起",
        words: [
          {en: "promote", cn: "提升，促进"},
          {en: "improve", cn: "增进，增加"},
          {en: "advance", cn: "促进，提升"},
          {en: "prompt", cn: "促进，激起"},
          {en: "initiate", cn: "开始，发起"},
          {en: "encourage", cn: "鼓励，促进"},
          {en: "boost", cn: "促进，增加"},
          {en: "inspire", cn: "激发，产生"},
          {en: "motivate", cn: "刺激"},
          {en: "develop", cn: "开发，生长"},
          {en: "irritate", cn: "刺激"},
          {en: "incentive", cn: "激励，刺激"},
          {en: "stimulate", cn: "激励，刺激"},
          {en: "activate", cn: "触发"},
          {en: "drive", cn: "驱动"},
          {en: "enhance", cn: "提高，增加"},
          {en: "prosper", cn: "使繁荣，使成功"}
        ]
      },
      {
        group: "下降",
        words: [
          {en: "decrease", cn: "减少，减小"},
          {en: "decline", cn: "下降，减少"},
          {en: "reduce", cn: "减少，降低"},
          {en: "reduction", cn: "减少，缩小"},
          {en: "deduction", cn: "扣除，减除"},
          {en: "fall", cn: "下降"},
          {en: "downfall", cn: "下降"},
          {en: "drop", cn: "下降"},
          {en: "loss", cn: "亏损；减少"},
          {en: "cut", cn: "减少，降低"},
          {en: "diminish", cn: "变小；减少"},
          {en: "shrink", cn: "收缩，缩减"},
          {en: "alleviate", cn: "减轻，缓解"},
          {en: "less", cn: "较少的, 更少的"},
          {en: "lessen", cn: "减少；减轻"},
          {en: "relief", cn: "减轻，解除"}
        ]
      },
      {
        group: "削弱",
        words: [
          {en: "eliminate", cn: "消除, 排除"},
          {en: "diminish", cn: "变小；减少"},
          {en: "mitigate", cn: "减轻，缓和"},
          {en: "vanish", cn: "使消失"},
          {en: "disappear", cn: "消失"},
          {en: "loss", cn: "亏损；减少"},
          {en: "gone", cn: "离去的；用光的"},
          {en: "decrease", cn: "减少，减小"},
          {en: "eradicate", cn: "消灭，根除"}
        ]
      },
      {
        group: "复杂的",
        words: [
          {en: "complex", cn: "复杂的"},
          {en: "complicated", cn: "复杂的"},
          {en: "sophisticated", cn: "复杂的；精密的"},
          {en: "difficult", cn: "困难的，难懂的"},
          {en: "harsh", cn: "严厉的；严酷的"},
          {en: "tough", cn: "困难的"},
          {en: "hard", cn: "困难的"},
          {en: "elusive", cn: "难以捉摸的"},
          {en: "demanding", cn: "费心费力的"},
          {en: "complexity", cn: "复杂性"},
          {en: "challenging", cn: "富有挑战性的"},
          {en: "perplexing", cn: "使人困惑的"},
          {en: "comprehensive", cn: "广泛的，综合的"},
          {en: "intricacy", cn: "错综复杂；难以理解"}
        ]
      },
      {
        group: "简单的",
        words: [
          {en: "facilitate", cn: "使便利，减轻困难"},
          {en: "easy", cn: "容易的；不费力地"},
          {en: "convenient", cn: "方便的, 便利的"},
          {en: "straightforward", cn: "简单的；易懂的"},
          {en: "simplicity", cn: "简单"}
        ]
      },
      {
        group: "好处",
        words: [
          {en: "advantage", cn: "益处"},
          {en: "benefit", cn: "有益于；益处"},
          {en: "valuable", cn: "贵重的；有价值的"},
          {en: "wholesome", cn: "有益健康的"},
          {en: "helpful", cn: "有益的"},
          {en: "beneficial", cn: "有益的, 有利的"},
          {en: "advance", cn: "促进，提升"},
          {en: "improvement", cn: "增加，改进"},
          {en: "profit", cn: "有益；利益"},
          {en: "useful", cn: "有用的；有帮助的"},
          {en: "positive", cn: "积极的"},
          {en: "effective", cn: "有效的"},
          {en: "strength", cn: "长处"},
          {en: "value", cn: "价值；有价值"},
          {en: "usefulness", cn: "有用，有益"},
          {en: "treasure", cn: "珍宝"},
          {en: "precious", cn: "宝贵的，珍贵的"}
        ]
      },
      {
        group: "坏处",
        words: [
          {en: "disadvantage", cn: "不利，劣势"},
          {en: "shortcoming", cn: "短处，缺点"},
          {en: "shortage", cn: "不足；缺少"},
          {en: "weakness", cn: "弱点，缺点"},
          {en: "drawback", cn: "缺点，不利条件"},
          {en: "difficulty", cn: "困难，难度"},
          {en: "trouble", cn: "麻烦；烦恼"},
          {en: "troublesome", cn: "引起麻烦的"},
          {en: "burden", cn: "负担"},
          {en: "hurdle", cn: "障碍"},
          {en: "problem", cn: "问题，难题"},
          {en: "challenge", cn: "挑战，怀疑"},
          {en: "challenging", cn: "富有挑战性的"},
          {en: "demanding", cn: "费心费力的"},
          {en: "hardship", cn: "艰难，困苦"},
          {en: "obstacle", cn: "障碍，妨碍"},
          {en: "barrier", cn: "障碍，阻碍"},
          {en: "defect", cn: "缺点，缺陷；背叛"},
          {en: "adversity", cn: "困境"}
        ]
      },
      {
        group: "消极的",
        words: [
          {en: "negative", cn: "消极的"},
          {en: "pessimistic", cn: "悲观的"},
          {en: "passive", cn: "消极的"},
          {en: "inactive", cn: "不活跃的"}
        ]
      },
      {
        group: "重要的",
        words: [
          {en: "significant", cn: "重要的"},
          {en: "important", cn: "重要的"},
          {en: "crucial", cn: "重要的"},
          {en: "vital", cn: "极重要的"},
          {en: "chief", cn: "主要的，首要的"},
          {en: "major", cn: "主要的；重要的"},
          {en: "remarkable", cn: "异常的；引人注目的"},
          {en: "essential", cn: "基本的，必要的"},
          {en: "magnitude", cn: "重要性"}
        ]
      },
      {
        group: "基本的",
        words: [
          {en: "fundamental", cn: "基本的，重要的"},
          {en: "rudimentary", cn: "基本的, 初步的"},
          {en: "preliminary", cn: "初步的，开端的"},
          {en: "basic", cn: "基本的；基础的"},
          {en: "essential", cn: "基本的，必要的"},
          {en: "underlying", cn: "根本的, 基础的"},
          {en: "underlie", cn: "构成…的基础"},
          {en: "basis", cn: "基础"},
          {en: "base", cn: "基础"},
          {en: "ground", cn: "基础，根基"},
          {en: "root", cn: "根源，根基"},
          {en: "prime", cn: "基本的；主要的"}
        ]
      },
      {
        group: "优先",
        words: [
          {en: "priority", cn: "优先"},
          {en: "preference", cn: "优待"},
          {en: "supreme", cn: "最高的；最重要的"},
          {en: "supremacy", cn: "至高"}
        ]
      },
      {
        group: "首先 首要",
        words: [
          {en: "primary", cn: "主要的基本的；初级的"},
          {en: "leading", cn: "主要的"},
          {en: "major", cn: "主要的；重要的"},
          {en: "first", cn: "首先；优先"},
          {en: "firstly", cn: "首先"},
          {en: "original", cn: "原始的；最初的"},
          {en: "initial", cn: "最初的"},
          {en: "main", cn: "主要的，最重要的"},
          {en: "principal", cn: "最重要的；主要的"},
          {en: "paramount", cn: "最高的；首要的"},
          {en: "primitive", cn: "原始的，早期的"},
          {en: "origin", cn: "起点；来源"}
        ]
      },
      {
        group: "统治",
        words: [
          {en: "dominant", cn: "统治的；占优势的"},
          {en: "overbearing", cn: "专横的；压倒性的"},
          {en: "overwhelming", cn: "势不可挡的，压倒一切的"},
          {en: "major", cn: "主要的；重要的"},
          {en: "predominant", cn: "占主导地位的, 显著的"}
        ]
      },
      {
        group: "最后的",
        words: [
          {en: "eventually", cn: "终于, 最后"},
          {en: "end", cn: "结束，终止"},
          {en: "last", cn: "最后的，末尾的"},
          {en: "final", cn: "最后的, 最终的"},
          {en: "finally", cn: "终于；最后"},
          {en: "finish", cn: "完成；结束"}
        ]
      },
      {
        group: "持久的",
        words: [
          {en: "durable", cn: "耐用的，持久的"},
          {en: "lasting", cn: "持久的；永恒的"},
          {en: "chronic", cn: "慢性的；长期的"},
          {en: "duration", cn: "持续"},
          {en: "time", cn: "时间"},
          {en: "period", cn: "时期"}
        ]
      },
      {
        group: "每年",
        words: [
          {en: "annual", cn: "年度的；每年的"},
          {en: "yearly", cn: "每年的"}
        ]
      },
      {
        group: "不重要的",
        words: [
          {en: "trivial", cn: "不重要的"},
          {en: "peripheral", cn: "非本质的；次要的"},
          {en: "unimportant", cn: "不重要的，次要的"},
          {en: "minor", cn: "少数的，次要的"}
        ]
      },
      {
        group: "特别的",
        words: [
          {en: "extraordinary", cn: "非同寻常的"},
          {en: "rare", cn: "稀有的，罕见的"},
          {en: "unusual", cn: "不寻常的"},
          {en: "scarce", cn: "缺乏的，罕见的"},
          {en: "abnormal", cn: "反常的，异常的"},
          {en: "remarkable", cn: "异常的；引人注目的"},
          {en: "different", cn: "不同的，差异的"},
          {en: "unique", cn: "独有的；独特的"},
          {en: "special", cn: "特别的"},
          {en: "exceptional", cn: "例外的；独特的"},
          {en: "extreme", cn: "极端的；极度的"},
          {en: "unexpected", cn: "意外的"}
        ]
      }
    ]
  },
  {
    unit: "第二单元",
    categories: [
      {
        group: "普通的",
        words: [
          {en: "normal", cn: "正常的，标准的"},
          {en: "ordinary", cn: "普通的；平常的"},
          {en: "common", cn: "普通的；通常的"},
          {en: "usual", cn: "经常的，寻常的"},
          {en: "shared", cn: "共有的"},
          {en: "regular", cn: "定期的；常规的"},
          {en: "general", cn: "一般的，普通的"},
          {en: "typical", cn: "典型的"},
          {en: "average", cn: "平均的；普通的"},
          {en: "majority", cn: "多数"},
          {en: "mainly", cn: "主要地，大体上"},
          {en: "ubiquitous", cn: "普遍存在的"},
          {en: "universal", cn: "广泛的，普遍的"},
          {en: "standard", cn: "标准"},
          {en: "criteria", cn: "标准"}
        ]
      },
      {
        group: "并列",
        words: [
          {en: "and", cn: "和"},
          {en: "or", cn: "或"},
          {en: "as well as", cn: "也，又"},
          {en: "both", cn: "和，两个"},
          {en: "not only…but also…", cn: "和"},
          {en: "in addition", cn: "另外"},
          {en: "besides", cn: "而且, 还有"},
          {en: "plus", cn: "加，加上"},
          {en: "along with", cn: "连同...一起"},
          {en: "on the one hand…on the other hand", cn: "一方面…另一方面…"},
          {en: "either…or…", cn: "要么…要么…（二选一）"},
          {en: "neither…nor…", cn: "不…也不…"},
          {en: "moreover", cn: "此外；而且"},
          {en: "also", cn: "也；而且"}
        ]
      },
      {
        group: "现在",
        words: [
          {en: "nowadays", cn: "现今，当今"},
          {en: "today", cn: "现今，当今"},
          {en: "currently", cn: "当前，眼下"},
          {en: "recently", cn: "最近；新近"},
          {en: "now", cn: "现在, 目前"},
          {en: "modern", cn: "现在的；现代的"},
          {en: "new", cn: "新的，新近"}
        ]
      },
      {
        group: "区别变化",
        words: [
          {en: "differentiation", cn: "区别；分化"},
          {en: "different", cn: "不同的，差异的"},
          {en: "disparate", cn: "根本不同的"},
          {en: "distinction", cn: "区别，明显差别"},
          {en: "distinguish", cn: "辨别, 区别"},
          {en: "separate", cn: "使分离，分开"},
          {en: "differentiate", cn: "区分，区别"},
          {en: "variable", cn: "易变的，多变的"},
          {en: "vary", cn: "变化，改变"},
          {en: "variant", cn: "不同的；变种"},
          {en: "differ", cn: "使…不同"},
          {en: "variety", cn: "种类；变化"},
          {en: "variance", cn: "差异，不同，变化"},
          {en: "variation", cn: "变化，变动"},
          {en: "changes", cn: "变化，改变"},
          {en: "improvement", cn: "增加，改进"},
          {en: "development", cn: "发展"},
          {en: "discrimination", cn: "区别对待，区别"},
          {en: "diversity", cn: "差异，多样化"},
          {en: "divide", cn: "差异，区别"},
          {en: "discrepancy", cn: "差别，不一致"},
          {en: "subdivide", cn: "分割，再分"}
        ]
      },
      {
        group: "改变",
        words: [
          {en: "modify", cn: "修改，修饰"},
          {en: "change", cn: "改变，变化"},
          {en: "alter", cn: "改变，修改"},
          {en: "shift", cn: "转变，变化"},
          {en: "adjust", cn: "调整"},
          {en: "adjustment", cn: "调整，调节"},
          {en: "revise", cn: "修改"},
          {en: "edit", cn: "编辑"},
          {en: "amend", cn: "改善，修改"},
          {en: "switch", cn: "转换"},
          {en: "revision", cn: "修正，修改"},
          {en: "adapt", cn: "改编；使适应"}
        ]
      },
      {
        group: "适应",
        words: [
          {en: "adaption", cn: "适应，改编"},
          {en: "adapt", cn: "改编；使适应"},
          {en: "fit", cn: "使...合身；符合"},
          {en: "suit", cn: "适合于"},
          {en: "appropriate", cn: "适当的"}
        ]
      },
      {
        group: "影响",
        words: [
          {en: "affect", cn: "（负面）影响"},
          {en: "influence", cn: "影响"},
          {en: "effect", cn: "效果；影响"},
          {en: "disturb", cn: "打扰；妨碍"},
          {en: "impact", cn: "影响"}
        ]
      },
      {
        group: "创造",
        words: [
          {en: "create", cn: "创造"},
          {en: "coin", cn: "创造"},
          {en: "invent", cn: "发明创造"},
          {en: "design", cn: "设计"},
          {en: "make", cn: "制造"},
          {en: "making", cn: "制造"},
          {en: "erect", cn: "建立"},
          {en: "form", cn: "构成"},
          {en: "produce", cn: "生产；创作"},
          {en: "manufacture", cn: "制造"},
          {en: "production", cn: "生产，产品"},
          {en: "devise", cn: "设计；发明"},
          {en: "generate", cn: "生成，发生"}
        ]
      },
      {
        group: "释放",
        words: [
          {en: "release", cn: "释放；发布"},
          {en: "secrete", cn: "分泌"},
          {en: "discharge", cn: "放出，释放"},
          {en: "exude", cn: "渗出；流出"}
        ]
      },
      {
        group: "商品",
        words: [
          {en: "commodity", cn: "商品"},
          {en: "goods", cn: "商品"},
          {en: "product", cn: "产品"}
        ]
      },
      {
        group: "建立",
        words: [
          {en: "found", cn: "创立，建立"},
          {en: "set up", cn: "建立"},
          {en: "establish", cn: "建立, 成立"},
          {en: "build", cn: "建筑；建立"},
          {en: "initiate", cn: "开始，发起"},
          {en: "create", cn: "创造"},
          {en: "start up", cn: "建立"}
        ]
      },
      {
        group: "开始",
        words: [
          {en: "trigger", cn: "触发；引发"},
          {en: "begin", cn: "开始"},
          {en: "invoke", cn: "引起，唤起"},
          {en: "undertake", cn: "着手，开始"},
          {en: "commence", cn: "开始；着手"},
          {en: "start", cn: "开始"}
        ]
      },
      {
        group: "公司",
        words: [
          {en: "entity", cn: "公司实体"},
          {en: "company", cn: "公司"},
          {en: "firm", cn: "公司"},
          {en: "enterprise", cn: "公司"},
          {en: "organisation", cn: "组织"},
          {en: "commercial", cn: "商业的"},
          {en: "trading", cn: "贸易"},
          {en: "transaction", cn: "交易"},
          {en: "deal", cn: "交易"},
          {en: "retail", cn: "零售"},
          {en: "sale", cn: "出售"},
          {en: "corporate", cn: "公司法⼈的"},
          {en: "corporation", cn: "公司"},
          {en: "business", cn: "商业"},
          {en: "manufacturer", cn: "制造商"},
          {en: "group", cn: "群组"}
        ]
      },
      {
        group: "企业家",
        words: [
          {en: "entrepreneur", cn: "企业家"},
          {en: "boss", cn: "老板"},
          {en: "manager", cn: "经理"},
          {en: "director", cn: "主管"},
          {en: "employer", cn: "雇主，老板"},
          {en: "leader", cn: "领导人"}
        ]
      },
      {
        group: "员工",
        words: [
          {en: "labour", cn: "劳动力"},
          {en: "workforce", cn: "员工，劳动力"},
          {en: "worker", cn: "员工，工人"},
          {en: "employee", cn: "雇员，员工"},
          {en: "staff", cn: "职员"}
        ]
      },
      {
        group: "工作",
        words: [
          {en: "job", cn: "工作；职业"},
          {en: "profession", cn: "职业"},
          {en: "vocation", cn: "职业"},
          {en: "occupation", cn: "工作，职业"},
          {en: "career", cn: "事业"},
          {en: "work", cn: "工作"},
          {en: "employment", cn: "雇用，就业"}
        ]
      },
      {
        group: "用户",
        words: [
          {en: "consumer", cn: "顾客，消费者"},
          {en: "customer", cn: "顾客"},
          {en: "client", cn: "客户"},
          {en: "user", cn: "用户"}
        ]
      },
      {
        group: "居民",
        words: [
          {en: "resident", cn: "居民"},
          {en: "people", cn: "人，公民"},
          {en: "person", cn: "人"},
          {en: "public", cn: "公众"},
          {en: "citizen", cn: "公民，市民"},
          {en: "community", cn: "社区，团体"},
          {en: "neighbourhood", cn: "临近地区"},
          {en: "communal", cn: "公共的"},
          {en: "civic", cn: "城市的，公民的"},
          {en: "municipal", cn: "市政的"},
          {en: "nearby", cn: "附近的"},
          {en: "vicinity", cn: "附近，邻近"},
          {en: "ordinary people", cn: "普通人"},
          {en: "society", cn: "社会"},
          {en: "local", cn: "当地居民"},
          {en: "personal", cn: "个人的"},
          {en: "private", cn: "私有的，个人的"},
          {en: "individual", cn: "个人，个人的"},
          {en: "population", cn: "人口"},
          {en: "demographic", cn: "人口学，人口统计学"},
          {en: "societal", cn: "社会的"},
          {en: "inhabitant", cn: "居民"},
          {en: "human", cn: "人，人类"}
        ]
      },
      {
        group: "住所",
        words: [
          {en: "residence", cn: "住处"},
          {en: "habitat", cn: "栖息地，住处"},
          {en: "home", cn: "家"},
          {en: "house", cn: "住宅，房子"},
          {en: "family", cn: "家，家庭的"},
          {en: "existence", cn: "存在，生活"}
        ]
      },
      {
        group: "国内的",
        words: [
          {en: "domestic", cn: "国内的；家庭的"},
          {en: "native", cn: "本国的"},
          {en: "local", cn: "当地的"},
          {en: "national", cn: "国家的"},
          {en: "regional", cn: "地区的"}
        ]
      },
      {
        group: "城市",
        words: [
          {en: "urban", cn: "城市的"},
          {en: "town", cn: "城镇"},
          {en: "city", cn: "城市"},
          {en: "municipal", cn: "市政的"},
          {en: "metropolitan", cn: "大都会的"},
          {en: "skyscraper", cn: "摩天大楼"}
        ]
      }
    ]
  },
  {
    unit: "第三单元",
    categories: [
      {
        group: "乡村",
        words: [
          {en: "remote", cn: "遥远的；偏僻的"},
          {en: "rural", cn: "农村的"},
          {en: "rustic", cn: "乡村的"},
          {en: "countryside", cn: "乡下, 农村"},
          {en: "suburb", cn: "郊区, 城郊"},
          {en: "outskirts", cn: "郊区"},
          {en: "village", cn: "村庄"},
          {en: "suburban", cn: "郊区的"}
        ]
      },
      {
        group: "领域",
        words: [
          {en: "area", cn: "范围领域；地区"},
          {en: "field", cn: "领域；田地"},
          {en: "discipline", cn: "学科；训练；纪律"},
          {en: "domain", cn: "领域"},
          {en: "region", cn: "地区；范围"}
        ]
      },
      {
        group: "依赖",
        words: [
          {en: "reliance", cn: "依靠, 依赖"},
          {en: "responsible", cn: "负责的，可靠的"},
          {en: "liable", cn: "有责任的, 有义务的"},
          {en: "reliable", cn: "可靠的, 可信赖的"},
          {en: "credible", cn: "可靠的，可信的"},
          {en: "rely on", cn: "依靠"},
          {en: "depend on", cn: "依赖，依靠"},
          {en: "faith", cn: "信心；信任"},
          {en: "trust", cn: "信任，信赖"},
          {en: "confidence", cn: "信任，信心"},
          {en: "belief", cn: "相信，信赖"},
          {en: "believe", cn: "信任，相信"},
          {en: "trustworthy", cn: "值得信赖的, 可靠的"},
          {en: "dependent on", cn: "依赖于；依靠"}
        ]
      },
      {
        group: "怀疑",
        words: [
          {en: "skepticism", cn: "怀疑态度"},
          {en: "doubt", cn: "怀疑"}
        ]
      },
      {
        group: "责任",
        words: [
          {en: "responsibility", cn: "责任，责任感"},
          {en: "obligation", cn: "义务，责任"},
          {en: "duty", cn: "责任；职务"}
        ]
      },
      {
        group: "目标",
        words: [
          {en: "objective", cn: "目标"},
          {en: "goal", cn: "目标"},
          {en: "aim", cn: "目标"},
          {en: "target", cn: "目标"},
          {en: "purpose", cn: "目的；意图"},
          {en: "intention", cn: "意图，目的"}
        ]
      },
      {
        group: "停止",
        words: [
          {en: "cease", cn: "停止，终止"},
          {en: "stop", cn: "停止，中止"},
          {en: "interrupt", cn: "打断"},
          {en: "halt", cn: "停止"},
          {en: "quit", cn: "停止"},
          {en: "prevent", cn: "防止；阻止"},
          {en: "obstacle", cn: "障碍，妨碍"},
          {en: "hinder", cn: "阻碍；妨碍"},
          {en: "deter", cn: "制止，阻止"},
          {en: "impede", cn: "阻止；妨碍"},
          {en: "avoid", cn: "避免；避开"},
          {en: "escape", cn: "逃避，避免"},
          {en: "evitable", cn: "可避免的"},
          {en: "discourage", cn: "阻碍；使气馁"},
          {en: "prohibit", cn: "阻止，禁止"},
          {en: "inhibition", cn: "抑制"},
          {en: "counter", cn: "抵制；反对"},
          {en: "protect from", cn: "保护…不受…"},
          {en: "keep safe from", cn: "保护…不受…"},
          {en: "hold back", cn: "阻止，克制"}
        ]
      },
      {
        group: "抵制",
        words: [
          {en: "boycott", cn: "抵制"},
          {en: "oppose", cn: "反对，抵制"}
        ]
      },
      {
        group: "放弃",
        words: [
          {en: "abandon", cn: "放弃"},
          {en: "derelict", cn: "被抛弃的"},
          {en: "give up", cn: "放弃，停止"},
          {en: "forsake", cn: "放弃"},
          {en: "discard", cn: "丢弃；放弃"},
          {en: "sacrifice", cn: "牺牲，舍弃"}
        ]
      },
      {
        group: "限制阻挡",
        words: [
          {en: "restrict", cn: "限制；约束"},
          {en: "curb", cn: "限制，抑制"},
          {en: "limit", cn: "限度；限制"},
          {en: "restriction", cn: "约束，限制"},
          {en: "restraint", cn: "限制，约束"},
          {en: "constraint", cn: "限制，约束"},
          {en: "constrain", cn: "限制，约束"},
          {en: "confine", cn: "限制"},
          {en: "suppress", cn: "抑制，阻止"},
          {en: "hold", cn: "持有；约束，控制"},
          {en: "only", cn: "仅仅；唯一的"}
        ]
      },
      {
        group: "不可阻挡",
        words: [
          {en: "inevitable", cn: "不可避免的，不可阻挡的"}
        ]
      },
      {
        group: "聚焦集中",
        words: [
          {en: "concentration", cn: "专心；集中，集结"},
          {en: "pay attention to", cn: "注意，留意"},
          {en: "focus", cn: "集中，聚集"},
          {en: "emphasis", cn: "强调，重点"},
          {en: "restrict", cn: "限制；约束"},
          {en: "specialise", cn: "专门从事，专注"},
          {en: "gather", cn: "聚集"},
          {en: "accumulate", cn: "堆积；积累"},
          {en: "concentrate", cn: "专心；集中，聚集"}
        ]
      },
      {
        group: "有限的",
        words: [
          {en: "finite", cn: "有限的"},
          {en: "limited", cn: "有限的"}
        ]
      },
      {
        group: "无限的",
        words: [
          {en: "infinite", cn: "无限的，无穷的"}
        ]
      },
      {
        group: "名称定义",
        words: [
          {en: "so-called", cn: "所谓的，号称的"},
          {en: "known as", cn: "被称为"},
          {en: "---", cn: "破折号引出"},
          {en: "called", cn: "所谓的，被称作"},
          {en: "named", cn: "所谓的，被叫作"},
          {en: "regard as", cn: "把…认作"},
          {en: "title", cn: "称号"},
          {en: "term", cn: "术语，名称"},
          {en: "\"\"", cn: "引号"},
          {en: "definition", cn: "定义"}
        ]
      },
      {
        group: "出名的",
        words: [
          {en: "famous", cn: "著名的"},
          {en: "well-known", cn: "出名的"},
          {en: "familiar", cn: "熟悉的"},
          {en: "notoriety", cn: "声名狼藉"}
        ]
      },
      {
        group: "概念",
        words: [
          {en: "concept", cn: "概念；想法"},
          {en: "idea", cn: "主意；想法"},
          {en: "notion", cn: "概念"},
          {en: "belief", cn: "相信，信赖"},
          {en: "inspiration", cn: "灵感，想法"},
          {en: "definition", cn: "定义"}
        ]
      },
      {
        group: "引用",
        words: [
          {en: "quotation", cn: "引用"},
          {en: "quote", cn: "引用"},
          {en: "comment", cn: "评论"},
          {en: "cite", cn: "引用"},
          {en: "extract", cn: "摘录；提取"}
        ]
      },
      {
        group: "语言",
        words: [
          {en: "linguistic", cn: "语言的，语言学的"},
          {en: "language", cn: "语言"},
          {en: "word", cn: "单词，文字"},
          {en: "term", cn: "术语，名称"},
          {en: "literature", cn: "文学"},
          {en: "literacy", cn: "识字，文化"},
          {en: "context", cn: "上下文，语境"}
        ]
      },
      {
        group: "教育",
        words: [
          {en: "education", cn: "教育"},
          {en: "school", cn: "学校"},
          {en: "literacy", cn: "识字，文化"},
          {en: "institution", cn: "学院，机构"},
          {en: "academic", cn: "学术的，学者"}
        ]
      },
      {
        group: "交流",
        words: [
          {en: "communication", cn: "交流，通讯"},
          {en: "talk", cn: "谈话"},
          {en: "convey", cn: "传达；运送"},
          {en: "verbal", cn: "语言的，口头的"},
          {en: "speak", cn: "说话；陈述"},
          {en: "oral", cn: "口头的，口述的"},
          {en: "narrate", cn: "叙述"},
          {en: "transmit", cn: "传播，发射"},
          {en: "transmission", cn: "传送, 传播"}
        ]
      },
      {
        group: "交通运输",
        words: [
          {en: "transport", cn: "交通，运输"},
          {en: "commute", cn: "通勤"},
          {en: "travel", cn: "旅行，游历"},
          {en: "journey", cn: "旅行，旅程"},
          {en: "trip", cn: "旅行，旅途"},
          {en: "flight", cn: "航班，旅程"},
          {en: "tour", cn: "旅行, 游历"},
          {en: "voyage", cn: "航行；航程"},
          {en: "expedition", cn: "远征；探险"},
          {en: "move", cn: "移动；行动"},
          {en: "carry", cn: "运送，搬运"},
          {en: "convey", cn: "传达；运送"},
          {en: "bring", cn: "带来"},
          {en: "transfer", cn: "转移；转让；传递"},
          {en: "proceed", cn: "前进；行进"},
          {en: "deliver", cn: "传送；传递"},
          {en: "mobile", cn: "可移动的"},
          {en: "divert", cn: "转移"},
          {en: "distract", cn: "转移，分散"},
          {en: "transmit", cn: "传播，发射"},
          {en: "pass", cn: "移动；路过，经过"},
          {en: "send", cn: "传达，发送"},
          {en: "transit", cn: "运输，经过"},
          {en: "transition", cn: "过渡，转变"},
          {en: "delivery", cn: "传送，交付"},
          {en: "flow", cn: "流动"},
          {en: "movement", cn: "运动，移动"}
        ]
      },
      {
        group: "迁徙",
        words: [
          {en: "migration", cn: "迁徙，转移"},
          {en: "immigration", cn: "移民，移居"},
          {en: "migrate", cn: "迁徙"}
        ]
      },
      {
        group: "车辆",
        words: [
          {en: "vehicle", cn: "车辆"},
          {en: "car", cn: "汽车"},
          {en: "motor", cn: "马达，汽车"},
          {en: "traffic", cn: "交通；运输"}
        ]
      },
      {
        group: "进出口",
        words: [
          {en: "export", cn: "出口"},
          {en: "import", cn: "进口"},
          {en: "bring", cn: "带来"},
          {en: "take to", cn: "带来，运来"},
          {en: "introduce", cn: "引进；介绍"},
          {en: "smuggle", cn: "偷运，走私"},
          {en: "ship", cn: "运送；乘船"}
        ]
      },
      {
        group: "内部的",
        words: [
          {en: "internal", cn: "内部的"},
          {en: "inner", cn: "内部的"},
          {en: "interior", cn: "内部，内部的"},
          {en: "inside", cn: "内部；里面"}
        ]
      },
      {
        group: "外部的",
        words: [
          {en: "external", cn: "外部，外部的；表面的"},
          {en: "exterior", cn: "外部，外部的；外表的"},
          {en: "outside", cn: "外部，外部的"}
        ]
      }
    ]
  },
  {
    unit: "第四单元",
    categories: [
      {
        group: "证据线索",
        words: [
          {en: "evidence", cn: "证据；证明"},
          {en: "proof", cn: "证明；证据"},
          {en: "prove", cn: "证明"},
          {en: "clear", cn: "清楚的"},
          {en: "clarity", cn: "清楚，明晰"},
          {en: "hint", cn: "暗示；线索"},
          {en: "cue", cn: "暗示；线索"},
          {en: "clue", cn: "线索"}
        ]
      },
      {
        group: "数据",
        words: [
          {en: "data", cn: "数据"},
          {en: "information", cn: "信息；通知"},
          {en: "statistics", cn: "统计，统计学"}
        ]
      },
      {
        group: "快速的",
        words: [
          {en: "swift", cn: "迅速的"},
          {en: "rapid", cn: "快的，急速的"},
          {en: "quick", cn: "快的，迅速的"},
          {en: "immediately", cn: "立即，马上"},
          {en: "straightaway", cn: "立即，马上"},
          {en: "speed up", cn: "加快速度"},
          {en: "accelerate", cn: "加快速度，增速"},
          {en: "prompt", cn: "促进，激起"},
          {en: "rate", cn: "比率，速度，费率"},
          {en: "sudden", cn: "突然的；快速的"},
          {en: "breakneck", cn: "极快的，飞速的"},
          {en: "pop up", cn: "突然出现"}
        ]
      },
      {
        group: "保持；忍受",
        words: [
          {en: "undergo", cn: "经历，经受；忍受"},
          {en: "remain", cn: "留下，余留"},
          {en: "preserve", cn: "保存；保护；维持"},
          {en: "stay", cn: "停留；维持"},
          {en: "stick", cn: "粘住；坚持"},
          {en: "keep", cn: "保持；继续；保留"},
          {en: "retention", cn: "具有，保持，保留"},
          {en: "survive", cn: "幸存；活下来"},
          {en: "withstand", cn: "经受，承受"},
          {en: "tolerate", cn: "忍受；容忍"},
          {en: "bear", cn: "承受；忍受"},
          {en: "suffer", cn: "忍受；遭受；受苦"},
          {en: "face", cn: "面对；面临"},
          {en: "patient", cn: "忍耐的"},
          {en: "patience", cn: "耐性，耐心"}
        ]
      },
      {
        group: "因果",
        words: [
          {en: "thereby", cn: "从而，因此"},
          {en: "therefore", cn: "因此，所以"},
          {en: "because", cn: "因为"},
          {en: "hence", cn: "因此；今后"},
          {en: "as", cn: "因为；随着"},
          {en: "since", cn: "因为"},
          {en: "leading to", cn: "导致"},
          {en: "as a result", cn: "结果"},
          {en: "because of", cn: "因为，由于"},
          {en: "thanks to", cn: "由于，归功于"},
          {en: "due to", cn: "因为，由于"},
          {en: "owing to", cn: "由于，因为"},
          {en: "stem from", cn: "源于"},
          {en: "derive", cn: "得到，源于"},
          {en: "as a contributory factor", cn: "作为…的原因"}
        ]
      },
      {
        group: "原因",
        words: [
          {en: "reason", cn: "理由；原因"},
          {en: "cause", cn: "原因；导致"},
          {en: "for", cn: "为了"},
          {en: "why", cn: "为什么"},
          {en: "explain", cn: "解释"},
          {en: "explanation", cn: "解释，说明"}
        ]
      },
      {
        group: "帮助",
        words: [
          {en: "aid", cn: "帮助, 援助"},
          {en: "help", cn: "帮助"},
          {en: "assistance", cn: "帮助，援助"},
          {en: "support", cn: "支撑；支持"}
        ]
      },
      {
        group: "处理",
        words: [
          {en: "address", cn: "设法解决"},
          {en: "solution", cn: "解决，解决方法；溶解"},
          {en: "solve", cn: "解决；解答；溶解"},
          {en: "deal with", cn: "处理，对付"},
          {en: "overcome", cn: "战胜；克服"},
          {en: "defeat", cn: "击败，战胜"},
          {en: "handle", cn: "处理；操作"},
          {en: "settle", cn: "解决；安排；定居"},
          {en: "fix", cn: "安排，解决；修理"},
          {en: "figure out", cn: "解决；弄明白"},
          {en: "conquer", cn: "克服，征服"},
          {en: "manage", cn: "处理；管理"},
          {en: "tackle", cn: "解决；应付"},
          {en: "cope with", cn: "对付…"},
          {en: "confront", cn: "面对；遭遇"},
          {en: "dispose", cn: "处理；处置；安排"},
          {en: "disposal", cn: "处理"},
          {en: "resolution", cn: "解决，决心"},
          {en: "resolve", cn: "决心，解决"}
        ]
      },
      {
        group: "处理不当",
        words: [
          {en: "bungle", cn: "搞糟，完不成"},
          {en: "mishandle", cn: "处理不当"}
        ]
      },
      {
        group: "控制",
        words: [
          {en: "manipulate", cn: "操控，熟练控制"},
          {en: "manage", cn: "处理；管理"},
          {en: "steer", cn: "驾驶，掌舵"},
          {en: "governance", cn: "统治，管理，治理"},
          {en: "hold", cn: "持有；约束，控制"},
          {en: "dominate", cn: "支配；控制"},
          {en: "monopoly", cn: "垄断"},
          {en: "control", cn: "控制，管理"},
          {en: "rule", cn: "统治；支配"},
          {en: "regulate", cn: "规定；控制"},
          {en: "lead", cn: "领导；导致"},
          {en: "influence", cn: "影响"},
          {en: "take over", cn: "接收；接管"},
          {en: "power", cn: "能力；力量；势力"},
          {en: "reign", cn: "统治；支配"}
        ]
      },
      {
        group: "情感",
        words: [
          {en: "emotion", cn: "情感；情绪"},
          {en: "feeling", cn: "感觉；感情，情绪"},
          {en: "sense", cn: "感觉"},
          {en: "mood", cn: "情绪"},
          {en: "perceptual", cn: "知觉的"}
        ]
      },
      {
        group: "小孩",
        words: [
          {en: "infant", cn: "婴儿，幼儿"},
          {en: "baby", cn: "婴儿"},
          {en: "child", cn: "儿童，孩子"},
          {en: "kid", cn: "小孩"},
          {en: "children", cn: "孩子们"},
          {en: "young", cn: "年轻的"},
          {en: "juvenile", cn: "青少年"},
          {en: "childhood", cn: "童年"}
        ]
      },
      {
        group: "建筑",
        words: [
          {en: "structure", cn: "结构，建筑物"},
          {en: "construction", cn: "建造，结构"},
          {en: "building", cn: "建筑；建筑物"},
          {en: "construct", cn: "修建，建立"},
          {en: "build", cn: "建筑；建立"},
          {en: "making", cn: "制造"},
          {en: "constructing", cn: "建筑，构造"},
          {en: "framework", cn: "构架；结构"}
        ]
      },
      {
        group: "房产",
        words: [
          {en: "estate", cn: "财产；房产"},
          {en: "property", cn: "财产；性质"},
          {en: "real estate", cn: "房地产"}
        ]
      },
      {
        group: "危险",
        words: [
          {en: "risk", cn: "危险，风险"},
          {en: "crisis", cn: "危机"},
          {en: "danger", cn: "危险；威胁"},
          {en: "endanger", cn: "危及"},
          {en: "jeopardise", cn: "危及；损害"},
          {en: "hazard", cn: "危险"},
          {en: "threat", cn: "威胁，恐吓"},
          {en: "predator", cn: "捕食者，天敌"},
          {en: "offend", cn: "冒犯；进攻"},
          {en: "offensive", cn: "攻击的，冒犯的"},
          {en: "hostile", cn: "敌对的"},
          {en: "enemy", cn: "敌人"},
          {en: "foe", cn: "敌人，仇敌"}
        ]
      },
      {
        group: "地点",
        words: [
          {en: "location", cn: "位置，地点"},
          {en: "position", cn: "位置；职位"},
          {en: "spot", cn: "地点，场所，斑点"},
          {en: "site", cn: "位置，场所，地点"},
          {en: "place", cn: "地方，场所"},
          {en: "where", cn: "地点"}
        ]
      },
      {
        group: "法律",
        words: [
          {en: "legal", cn: "合法的；法定的"},
          {en: "lawyer", cn: "律师"},
          {en: "solicitor", cn: "初级律师"},
          {en: "law", cn: "法律"},
          {en: "act", cn: "法条法例"},
          {en: "legitimate", cn: "合法的"},
          {en: "judicial", cn: "法庭的"},
          {en: "legislation", cn: "法律法规；立法"}
        ]
      },
      {
        group: "法规",
        words: [
          {en: "regulation", cn: "规章规则；管理"},
          {en: "rule", cn: "统治；支配"},
          {en: "principle", cn: "原则准则；原理"},
          {en: "act", cn: "法条法例"},
          {en: "guideline", cn: "指导方针；准则"},
          {en: "instruction", cn: "命令；指示；说明"},
          {en: "policy", cn: "政策"},
          {en: "norm", cn: "规范"},
          {en: "contract", cn: "合同"}
        ]
      },
      {
        group: "方法流程",
        words: [
          {en: "process", cn: "过程，方法"},
          {en: "progress", cn: "进步，发展"},
          {en: "stride", cn: "进展"},
          {en: "phase", cn: "阶段"},
          {en: "procedure", cn: "程序，步骤"},
          {en: "approach", cn: "方法；入口"},
          {en: "way", cn: "方法；道路"},
          {en: "method", cn: "方法，办法"},
          {en: "practice", cn: "实践方法；练习"},
          {en: "exercise", cn: "运用；练习；运动"},
          {en: "mechanism", cn: "机制，方法；机械装置"}
        ]
      },
      {
        group: "大的",
        words: [
          {en: "enormous", cn: "巨大的"},
          {en: "tremendous", cn: "极大的"},
          {en: "vast", cn: "巨大的；大量的"},
          {en: "massive", cn: "巨大的；大量的"},
          {en: "large", cn: "巨大的；大规模的"},
          {en: "big", cn: "大的，硕大的"},
          {en: "huge", cn: "巨大的, 庞大的"},
          {en: "utmost", cn: "极限；最大可能"},
          {en: "maximum", cn: "最大值的, 最大量的"}
        ]
      },
      {
        group: "小的",
        words: [
          {en: "small", cn: "少的；不重要的"},
          {en: "little", cn: "小的；少量的"},
          {en: "minor", cn: "少数的，次要的"},
          {en: "tiny", cn: "极小的，微小的"},
          {en: "limited", cn: "有限的"},
          {en: "lacking", cn: "缺乏的，不足的"},
          {en: "deficiency", cn: "缺乏，不足"},
          {en: "scarce", cn: "缺乏的，罕见的"},
          {en: "less", cn: "较少的, 更少的"},
          {en: "minimise", cn: "把…减至最少"},
          {en: "minimal", cn: "最小的；极少的"},
          {en: "minimum", cn: "最小的；最低的"},
          {en: "absence", cn: "缺乏；缺席"}
        ]
      }
    ]
  },
  {
    unit: "第五单元",
    categories: [
      {
        group: "数量",
        words: [
          {en: "considerable", cn: "相当大的，相当多的"},
          {en: "plenty of", cn: "很多的"},
          {en: "many", cn: "许多的"},
          {en: "numerous", cn: "很多的，许多的"},
          {en: "a number of", cn: "许多，若干"},
          {en: "countless", cn: "无数的，多得数不清的"},
          {en: "a lot of", cn: "许多"},
          {en: "lots of", cn: "许多"},
          {en: "several", cn: "几个的；数个的"},
          {en: "a few/ a little", cn: "一些"},
          {en: "some", cn: "一些；大约"},
          {en: "various", cn: "各种各样的；多方面的"},
          {en: "multiple", cn: "多样的；许多的；多重的"},
          {en: "mass", cn: "大量；民众"},
          {en: "quantity of", cn: "大量"},
          {en: "quantity", cn: "数量"}
        ]
      },
      {
        group: "质量",
        words: [
          {en: "quality", cn: "质量，品质；特性"}
        ]
      },
      {
        group: "高级的",
        words: [
          {en: "superior", cn: "上级的；优秀的"},
          {en: "higher", cn: "高级的；上级的"},
          {en: "upper", cn: "上面的；较高的"},
          {en: "leading", cn: "主要的"},
          {en: "cutting edge", cn: "尖端科技的"},
          {en: "advanced", cn: "超前的, 先进的；高级的"},
          {en: "more", cn: "更多的"},
          {en: "leading edge", cn: "科技前沿的"},
          {en: "better", cn: "更好的"}
        ]
      },
      {
        group: "要求",
        words: [
          {en: "require", cn: "要求；需要；命令"},
          {en: "want", cn: "需要；缺少"},
          {en: "demand", cn: "需要；需求"},
          {en: "need", cn: "需要；需求"},
          {en: "call for", cn: "需要"},
          {en: "ask for", cn: "请求，要求"},
          {en: "necessary", cn: "必要的，必需的"}
        ]
      },
      {
        group: "环境相关",
        words: [
          {en: "environment", cn: "环境，周围状况"},
          {en: "surrounding", cn: "环境；周围的事物"},
          {en: "setting", cn: "环境；布置"},
          {en: "background", cn: "背景"},
          {en: "circumstance", cn: "环境, 条件, 情况"},
          {en: "atmosphere", cn: "气氛，环境；大气"},
          {en: "situation", cn: "情况；位置，环境"},
          {en: "condition", cn: "状况，环境；条件"},
          {en: "occasion", cn: "场合"},
          {en: "weather", cn: "天气；处境"},
          {en: "climate", cn: "气候"},
          {en: "carbon dioxide (CO2)", cn: "二氧化碳"},
          {en: "global warming", cn: "全球变暖"},
          {en: "climate change", cn: "气候变化"},
          {en: "eco-friendly", cn: "环境友好的"},
          {en: "conservation", cn: "保存，保护"},
          {en: "ecology", cn: "生态"},
          {en: "greenhouse", cn: "温室"},
          {en: "planet warm", cn: "全球变暖"},
          {en: "pollutant", cn: "污染物"},
          {en: "pollution", cn: "污染"},
          {en: "contaminate", cn: "污染"},
          {en: "contamination", cn: "污染"},
          {en: "smoke and fume", cn: "烟雾"},
          {en: "coal", cn: "煤"},
          {en: "charcoal", cn: "木炭"},
          {en: "fuel", cn: "燃料"},
          {en: "firewood", cn: "柴火"},
          {en: "sustainable", cn: "可持续发展的"},
          {en: "long-term", cn: "长期的"}
        ]
      },
      {
        group: "传统的",
        words: [
          {en: "convention", cn: "习俗，惯例"},
          {en: "conservative", cn: "保守的"},
          {en: "conservation", cn: "保护"},
          {en: "tradition", cn: "传统，惯例"},
          {en: "classic", cn: "古典的，传统的"},
          {en: "earlier", cn: "早的；初期的"},
          {en: "traditional", cn: "传统的，惯例的"},
          {en: "classical", cn: "古典的，经典的"}
        ]
      },
      {
        group: "微生物",
        words: [
          {en: "microbe", cn: "微生物"},
          {en: "virus", cn: "病毒"},
          {en: "germ", cn: "细菌"},
          {en: "bacteria", cn: "细菌"},
          {en: "fungi", cn: "真菌，单数：fungus"}
        ]
      },
      {
        group: "医疗",
        words: [
          {en: "medical", cn: "医学的；内科的"},
          {en: "health", cn: "健康；保健"},
          {en: "well-being", cn: "康乐；安康"},
          {en: "disease", cn: "疾病"},
          {en: "ailment", cn: "小病"},
          {en: "illness", cn: "疾病"},
          {en: "sickness", cn: "疾病"},
          {en: "symptom", cn: "症状"},
          {en: "infest", cn: "寄生"},
          {en: "plague", cn: "鼠疫；瘟疫"},
          {en: "cholera", cn: "霍乱"},
          {en: "polio", cn: "小儿麻痹"},
          {en: "malaria", cn: "疟疾"},
          {en: "tuberculosis (TB)", cn: "结核病"},
          {en: "ebola", cn: "埃博拉病毒"},
          {en: "epidemic", cn: "流行病"},
          {en: "pandemic", cn: "大流行，流行病"},
          {en: "outbreak", cn: "疾病大爆发"},
          {en: "diabetes", cn: "糖尿病"},
          {en: "heart disease", cn: "心脏病"},
          {en: "asthma", cn: "气喘，哮喘"},
          {en: "fitness", cn: "健康，健身"},
          {en: "activity", cn: "活动，运动"},
          {en: "exercise", cn: "运用；练习；运动"},
          {en: "dental", cn: "牙的；牙科的"},
          {en: "dentist", cn: "牙科医生"},
          {en: "doctor", cn: "医生；博士"},
          {en: "teeth", cn: "牙齿"},
          {en: "allergy", cn: "过敏"},
          {en: "pain", cn: "疼痛"},
          {en: "trauma", cn: "创伤"},
          {en: "disorder", cn: "紊乱，混乱"},
          {en: "syndrome", cn: "综合征"},
          {en: "health problem", cn: "健康问题，疾病"},
          {en: "physical problem", cn: "生理问题，疾病"},
          {en: "infect", cn: "感染"},
          {en: "infectious", cn: "传染的"},
          {en: "infection", cn: "传染；传染病"}
        ]
      },
      {
        group: "身体",
        words: [
          {en: "physical", cn: "身体的，生理的；物理的"},
          {en: "body", cn: "身体；主体"},
          {en: "organ", cn: "器官"},
          {en: "limb", cn: "四肢、肢体"}
        ]
      },
      {
        group: "治疗",
        words: [
          {en: "therapy", cn: "治疗，疗法"},
          {en: "treatment", cn: "治疗；处理，对待"},
          {en: "remedy", cn: "药物，治疗"},
          {en: "medicine", cn: "药；医学；内科"},
          {en: "medication", cn: "药物；药"},
          {en: "drug", cn: "药物；毒品"},
          {en: "cure", cn: "治愈；治疗"},
          {en: "against disease", cn: "抵抗疾病"}
        ]
      },
      {
        group: "物质",
        words: [
          {en: "compound", cn: "化合物"},
          {en: "substance", cn: "物质"},
          {en: "matter", cn: "物质，物体"},
          {en: "chemical", cn: "化学品"}
        ]
      },
      {
        group: "毒药",
        words: [
          {en: "toxic", cn: "有毒的"},
          {en: "poison", cn: "毒药"},
          {en: "drug", cn: "药物；毒品"}
        ]
      },
      {
        group: "免疫力",
        words: [
          {en: "immunity", cn: "免疫力"},
          {en: "immune", cn: "免疫的，有免疫力的"},
          {en: "resistance", cn: "抵抗，抵抗力"}
        ]
      },
      {
        group: "精神心智",
        words: [
          {en: "mental", cn: "精神的，心理的"},
          {en: "cognitive", cn: "认知的"},
          {en: "mind", cn: "智力；精神"},
          {en: "intellectual", cn: "智力的"},
          {en: "intelligence", cn: "智力，智慧；情报"},
          {en: "intelligent", cn: "聪明的"},
          {en: "gifted", cn: "有才华的；有天赋的"},
          {en: "talented", cn: "有才能的；多才的"},
          {en: "brain", cn: "大脑；智力"},
          {en: "smart", cn: "聪明的；得体的"}
        ]
      },
      {
        group: "可行的",
        words: [
          {en: "available", cn: "可用，可得到的"},
          {en: "viable", cn: "可行的"},
          {en: "feasible", cn: "可行的；可能的"},
          {en: "realistic", cn: "现实的，实际可行的；现实主义的"},
          {en: "workable", cn: "可行的；可使用的"},
          {en: "practical", cn: "实际的，实践的"},
          {en: "portable", cn: "便于携带的；轻便的"},
          {en: "conveyable", cn: "可传达的，可移动的"}
        ]
      },
      {
        group: "调查研究",
        words: [
          {en: "investigation", cn: "调查研究；侦查"},
          {en: "experiment", cn: "实验，试验"},
          {en: "test", cn: "检验；测试"},
          {en: "laboratory", cn: "实验室"},
          {en: "lab", cn: "实验室"},
          {en: "delve into", cn: "探索"},
          {en: "explore", cn: "探测；探索"},
          {en: "look into", cn: "观察；浏览"},
          {en: "inspect", cn: "检查；视察"},
          {en: "research", cn: "研究；探讨"},
          {en: "study", cn: "学习，研究"},
          {en: "learn", cn: "学习"},
          {en: "analyse", cn: "分析"},
          {en: "examine", cn: "仔细检查；考察"},
          {en: "enquiry", cn: "调查，询问"},
          {en: "find", cn: "找到，发现"},
          {en: "discover", cn: "发现"},
          {en: "realise", cn: "认识到；实现"},
          {en: "investigate", cn: "调查，研究"},
          {en: "diagnose", cn: "诊断"},
          {en: "analytical", cn: "分析的"},
          {en: "analysis", cn: "分析"}
        ]
      },
      {
        group: "发现",
        words: [
          {en: "detect", cn: "发现；发觉，查明"},
          {en: "find", cn: "找到，发现"},
          {en: "sought", cn: "寻找，seek 过去式"},
          {en: "search", cn: "搜索，寻找，探查"},
          {en: "look", cn: "看"}
        ]
      },
      {
        group: "专家学者",
        words: [
          {en: "researcher", cn: "研究员；调查者"},
          {en: "scientist", cn: "科学家"},
          {en: "investigator", cn: "调查者"},
          {en: "scholar", cn: "学者"},
          {en: "professor", cn: "教授"},
          {en: "specialist", cn: "专家，行家"},
          {en: "expert", cn: "专家"},
          {en: "lecturer", cn: "讲师，演讲者"},
          {en: "teacher", cn: "教师；导师"},
          {en: "faculty", cn: "全体教员；能力，才能"}
        ]
      }
    ]
  },
  {
    unit: "第六单元",
    categories: [
      {
        group: "课程",
        words: [
          {en: "lecture", cn: "演讲；讲课"},
          {en: "curriculum", cn: "总课程"},
          {en: "syllabus", cn: "教学大纲；课程表"},
          {en: "course", cn: "课程"}
        ]
      },
      {
        group: "能力",
        words: [
          {en: "expertise", cn: "专门知识，技能"},
          {en: "skill", cn: "技能，技巧；技术"},
          {en: "knowledge", cn: "了解，理解"},
          {en: "capable", cn: "能干的，有能力的；有才华的"},
          {en: "capacity", cn: "能力；容量"},
          {en: "ability", cn: "能力；力量"},
          {en: "competence", cn: "能力，技能"},
          {en: "faculty", cn: "全体教员；能力，才能"},
          {en: "capability", cn: "能力"}
        ]
      },
      {
        group: "容量",
        words: [
          {en: "volume", cn: "容量；体积"},
          {en: "capacity", cn: "能力；容量"}
        ]
      },
      {
        group: "参与",
        words: [
          {en: "involve", cn: "参与；牵扯；包含"},
          {en: "join", cn: "参加；连接；结合"},
          {en: "take part in", cn: "参加"},
          {en: "participate", cn: "参加，参与"},
          {en: "associate", cn: "联合"}
        ]
      },
      {
        group: "关联",
        words: [
          {en: "link", cn: "联系，关系，连接"},
          {en: "connect", cn: "连接；联合；关连"},
          {en: "correlation", cn: "相互的关系"},
          {en: "reflect", cn: "反射，反映"},
          {en: "relate", cn: "联系起来"},
          {en: "associate", cn: "联合"},
          {en: "join", cn: "参加；连接；结合"},
          {en: "attach", cn: "固定；附着，缠着"},
          {en: "connection", cn: "连接，联系"},
          {en: "relation", cn: "关系；亲属关系"},
          {en: "relative", cn: "相对的；有关系的"},
          {en: "relevant", cn: "有关的，切题的"}
        ]
      },
      {
        group: "整合",
        words: [
          {en: "integration", cn: "整合，混合；一体化"},
          {en: "combine", cn: "联合"},
          {en: "whole", cn: "整体的，全部的"},
          {en: "entire", cn: "全部的，整个的"},
          {en: "cumulative", cn: "累积的，渐增的"},
          {en: "put together", cn: "组成整体"},
          {en: "reinforce", cn: "增强；加强"},
          {en: "integrity", cn: "整合，完全；诚实"},
          {en: "integral", cn: "构成整体所必需的"},
          {en: "mixture", cn: "混合；混合物"},
          {en: "hybrid", cn: "混合的；杂交的"},
          {en: "combination", cn: "结合，组合"},
          {en: "integrate", cn: "结合成为整体；融入"}
        ]
      },
      {
        group: "一致的",
        words: [
          {en: "consistent", cn: "一贯的，一致的，符合的"},
          {en: "uniform", cn: "一律的，全都相同的"},
          {en: "compatible", cn: "可以并存的，协调的"},
          {en: "persistent", cn: "持续的；不断的"},
          {en: "constant", cn: "始终如一的；不断的"},
          {en: "corresponding", cn: "符合的，一致的；对应的"},
          {en: "accordance", cn: "一致，和谐，符合"},
          {en: "conform", cn: "符合，使一致，遵守"},
          {en: "coherence", cn: "连贯性，一致性"},
          {en: "stable", cn: "稳定的；牢固的"},
          {en: "unchanged", cn: "无变化的"},
          {en: "stability", cn: "稳定，稳固"}
        ]
      },
      {
        group: "矛盾的",
        words: [
          {en: "incompatible", cn: "不协调的，不相配的"},
          {en: "contradictory", cn: "矛盾的"},
          {en: "paradox", cn: "矛盾，相悖"},
          {en: "inconsistent", cn: "不一致的，不协调的"},
          {en: "disputable", cn: "有争议的"},
          {en: "controversial", cn: "有争议的"}
        ]
      },
      {
        group: "合作和谐的",
        words: [
          {en: "cooperative", cn: "合作的，协作的"},
          {en: "cooperation", cn: "合作"},
          {en: "coordinate", cn: "协调，协作"},
          {en: "harmony", cn: "协调；和谐"},
          {en: "work together", cn: "一起工作"},
          {en: "support", cn: "支撑；支持"},
          {en: "coordination", cn: "协调，和谐"},
          {en: "team", cn: "合作"},
          {en: "teamwork", cn: "团队合作"},
          {en: "mediation", cn: "调解，调停"},
          {en: "interaction", cn: "合作；相互作用"}
        ]
      },
      {
        group: "冲突干涉",
        words: [
          {en: "conflict", cn: "冲突，斗争"},
          {en: "compete", cn: "竞赛；竞争"},
          {en: "intervention", cn: "介入，干涉，干预"},
          {en: "interference", cn: "干涉，介入"}
        ]
      },
      {
        group: "暴力侵犯",
        words: [
          {en: "violent", cn: "暴力的，粗暴的；剧烈的"},
          {en: "fierce", cn: "凶猛的；暴躁的；猛烈的"},
          {en: "aggressive", cn: "好斗的，挑衅的，侵略的"},
          {en: "violate", cn: "侵犯；违反"},
          {en: "attack", cn: "攻击，进攻；抨击"}
        ]
      }
    ]
  }
];
