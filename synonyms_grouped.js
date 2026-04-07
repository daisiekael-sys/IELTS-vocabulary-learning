// 高频同义替换与学术词汇分组
const synonymsGrouped = [
  {
    group: "增加",
    words: [
      {en: "increase", cn: "增加"},
      {en: "rise", cn: "上升"},
      {en: "raise", cn: "提高"},
      {en: "grow", cn: "增长"},
      {en: "growth", cn: "增长"},
      {en: "go up", cn: "上升"},
      {en: "boost", cn: "提升"},
      {en: "foster", cn: "促进"},
      {en: "boom", cn: "繁荣"},
      {en: "promote", cn: "促进"},
      {en: "upgrade", cn: "升级"},
      {en: "greater", cn: "更大的"},
      {en: "more", cn: "更多的"},
      {en: "soar", cn: "猛增"},
      {en: "extra", cn: "额外的"},
      {en: "additional", cn: "额外的"}
    ]
  },
  {
    group: "促进",
    words: [
      {en: "promote", cn: "促进"},
      {en: "improve", cn: "改善"},
      {en: "advance", cn: "推进"},
      {en: "prompt", cn: "促使"},
      {en: "initiate", cn: "启动"},
      {en: "encourage", cn: "鼓励"},
      {en: "boost", cn: "提升"},
      {en: "inspire", cn: "激励"},
      {en: "motivate", cn: "激励"},
      {en: "develop", cn: "发展"},
      {en: "irritate", cn: "刺激"},
      {en: "incentive", cn: "激励"},
      {en: "stimulate", cn: "刺激"},
      {en: "activate", cn: "激活"},
      {en: "drive", cn: "推动"},
      {en: "enhance", cn: "增强"},
      {en: "prosper", cn: "繁荣"}
    ]
  },
  {
    group: "减少",
    words: [
      {en: "decrease", cn: "减少"},
      {en: "decline", cn: "下降"},
      {en: "reduce", cn: "减少"},
      {en: "reduction", cn: "减少"},
      {en: "deduction", cn: "扣除"},
      {en: "fall", cn: "下降"},
      {en: "downfall", cn: "垮台"},
      {en: "drop", cn: "下降"},
      {en: "loss", cn: "损失"},
      {en: "cut", cn: "削减"},
      {en: "diminish", cn: "减少"},
      {en: "shrink", cn: "收缩"},
      {en: "alleviate", cn: "减轻"},
      {en: "less", cn: "更少的"},
      {en: "lessen", cn: "减少"},
      {en: "relief", cn: "缓解"},
      {en: "eliminate", cn: "消除"},
      {en: "mitigate", cn: "减轻"},
      {en: "vanish", cn: "消失"},
      {en: "disappear", cn: "消失"},
      {en: "gone", cn: "消失的"},
      {en: "eradicate", cn: "根除"}
    ]
  },
  {
    group: "复杂",
    words: [
      {en: "complex", cn: "复杂的"},
      {en: "complicated", cn: "复杂的"},
      {en: "sophisticated", cn: "复杂的"},
      {en: "difficult", cn: "困难的"},
      {en: "harsh", cn: "严酷的"},
      {en: "tough", cn: "艰难的"},
      {en: "hard", cn: "困难的"},
      {en: "elusive", cn: "难以捉摸的"},
      {en: "demanding", cn: "要求高的"},
      {en: "complexity", cn: "复杂性"},
      {en: "challenging", cn: "具有挑战性的"},
      {en: "perplexing", cn: "令人困惑的"},
      {en: "comprehensive", cn: "全面的"},
      {en: "intricacy", cn: "复杂性"}
    ]
  },
  {
    group: "简单",
    words: [
      {en: "facilitate", cn: "促进"},
      {en: "easy", cn: "容易的"},
      {en: "convenient", cn: "方便的"},
      {en: "straightforward", cn: "直接的"},
      {en: "simplicity", cn: "简单性"}
    ]
  },
  {
    group: "优势",
    words: [
      {en: "advantage", cn: "优势"},
      {en: "benefit", cn: "好处"},
      {en: "valuable", cn: "有价值的"},
      {en: "wholesome", cn: "有益健康的"},
      {en: "helpful", cn: "有帮助的"},
      {en: "beneficial", cn: "有益的"},
      {en: "advance", cn: "进步"},
      {en: "improvement", cn: "改进"},
      {en: "profit", cn: "利润"},
      {en: "useful", cn: "有用的"},
      {en: "positive", cn: "积极的"},
      {en: "effective", cn: "有效的"},
      {en: "strength", cn: "优势"},
      {en: "value", cn: "价值"},
      {en: "usefulness", cn: "有用性"},
      {en: "treasure", cn: "财富"},
      {en: "precious", cn: "珍贵的"}
    ]
  },
  {
    group: "劣势",
    words: [
      {en: "disadvantage", cn: "劣势"},
      {en: "shortcoming", cn: "缺点"},
      {en: "shortage", cn: "短缺"},
      {en: "weakness", cn: "弱点"},
      {en: "drawback", cn: "缺点"},
      {en: "difficulty", cn: "困难"},
      {en: "trouble", cn: "麻烦"},
      {en: "troublesome", cn: "麻烦的"},
      {en: "burden", cn: "负担"},
      {en: "hurdle", cn: "障碍"},
      {en: "problem", cn: "问题"},
      {en: "challenge", cn: "挑战"},
      {en: "challenging", cn: "具有挑战性的"},
      {en: "demanding", cn: "要求高的"},
      {en: "hardship", cn: "困难"},
      {en: "obstacle", cn: "障碍"},
      {en: "barrier", cn: "障碍"},
      {en: "defect", cn: "缺陷"},
      {en: "adversity", cn: "逆境"},
      {en: "negative", cn: "消极的"},
      {en: "pessimistic", cn: "悲观的"},
      {en: "passive", cn: "被动的"},
      {en: "inactive", cn: "不活跃的"}
    ]
  },
  {
    group: "重要",
    words: [
      {en: "significant", cn: "重要的"},
      {en: "important", cn: "重要的"},
      {en: "crucial", cn: "关键的"},
      {en: "vital", cn: "至关重要的"},
      {en: "chief", cn: "主要的"},
      {en: "major", cn: "主要的"},
      {en: "remarkable", cn: "显著的"},
      {en: "essential", cn: "必要的"},
      {en: "magnitude", cn: "重要性"},
      {en: "fundamental", cn: "基础的"}
    ]
  },
  {
    group: "基础",
    words: [
      {en: "rudimentary", cn: "基础的"},
      {en: "preliminary", cn: "初步的"},
      {en: "basic", cn: "基本的"},
      {en: "essential", cn: "必要的"},
      {en: "underlying", cn: "潜在的"},
      {en: "underlie", cn: "构成基础"},
      {en: "basis", cn: "基础"},
      {en: "base", cn: "基础"},
      {en: "ground", cn: "基础"},
      {en: "root", cn: "根源"}
    ]
  },
  {
    group: "主要",
    words: [
      {en: "prime", cn: "主要的"},
      {en: "priority", cn: "优先事项"},
      {en: "preference", cn: "偏好"},
      {en: "supreme", cn: "最高的"},
      {en: "supremacy", cn: "至高无上"},
      {en: "primary", cn: "主要的"},
      {en: "leading", cn: "领先的"},
      {en: "major", cn: "主要的"},
      {en: "first", cn: "第一的"},
      {en: "firstly", cn: "首先"},
      {en: "original", cn: "原始的"},
      {en: "initial", cn: "初始的"},
      {en: "main", cn: "主要的"},
      {en: "principal", cn: "主要的"},
      {en: "paramount", cn: "首要的"},
      {en: "primitive", cn: "原始的"},
      {en: "origin", cn: "起源"},
      {en: "dominant", cn: "主导的"},
      {en: "overbearing", cn: "专横的"},
      {en: "overwhelming", cn: "压倒性的"},
      {en: "predominant", cn: "主要的"}
    ]
  },
  {
    group: "最终",
    words: [
      {en: "eventually", cn: "最终"},
      {en: "end", cn: "结束"},
      {en: "last", cn: "最后的"},
      {en: "final", cn: "最终的"},
      {en: "finally", cn: "最终"},
      {en: "finish", cn: "完成"}
    ]
  },
  {
    group: "持久",
    words: [
      {en: "durable", cn: "持久的"},
      {en: "lasting", cn: "持久的"},
      {en: "chronic", cn: "长期的"},
      {en: "duration", cn: "持续时间"},
      {en: "time", cn: "时间"},
      {en: "period", cn: "时期"},
      {en: "annual", cn: "年度的"},
      {en: "yearly", cn: "每年的"}
    ]
  },
  {
    group: "次要",
    words: [
      {en: "trivial", cn: "琐碎的"},
      {en: "peripheral", cn: "外围的"},
      {en: "unimportant", cn: "不重要的"},
      {en: "minor", cn: "次要的"}
    ]
  },
  {
    group: "特殊",
    words: [
      {en: "extraordinary", cn: "非凡的"},
      {en: "rare", cn: "罕见的"},
      {en: "unusual", cn: "不寻常的"},
      {en: "scarce", cn: "稀少的"},
      {en: "abnormal", cn: "异常的"},
      {en: "remarkable", cn: "显著的"},
      {en: "different", cn: "不同的"},
      {en: "unique", cn: "独特的"},
      {en: "special", cn: "特殊的"},
      {en: "exceptional", cn: "例外的"},
      {en: "extreme", cn: "极端的"},
      {en: "unexpected", cn: "意外的"}
    ]
  },
  {
    group: "正常",
    words: [
      {en: "normal", cn: "正常的"},
      {en: "ordinary", cn: "普通的"},
      {en: "common", cn: "常见的"},
      {en: "usual", cn: "通常的"},
      {en: "shared", cn: "共享的"},
      {en: "regular", cn: "常规的"},
      {en: "general", cn: "一般的"},
      {en: "typical", cn: "典型的"},
      {en: "average", cn: "平均的"},
      {en: "majority", cn: "大多数"},
      {en: "mainly", cn: "主要地"},
      {en: "ubiquitous", cn: "普遍存在的"},
      {en: "universal", cn: "普遍的"},
      {en: "standard", cn: "标准的"},
      {en: "criteria", cn: "标准"}
    ]
  },
  {
    group: "连接词",
    words: [
      {en: "and", cn: "和"},
      {en: "or", cn: "或"},
      {en: "as well as", cn: "以及"},
      {en: "both", cn: "两者都"},
      {en: "not only…but also…", cn: "不仅…而且…"},
      {en: "in addition", cn: "此外"},
      {en: "besides", cn: "此外"},
      {en: "plus", cn: "加上"},
      {en: "along with", cn: "与…一起"},
      {en: "on the one hand…on the other hand", cn: "一方面…另一方面"},
      {en: "either…or…", cn: "要么…要么…"},
      {en: "neither…nor…", cn: "既不…也不…"},
      {en: "moreover", cn: "此外"},
      {en: "also", cn: "也"}
    ]
  },
  {
    group: "时间",
    words: [
      {en: "nowadays", cn: "如今"},
      {en: "today", cn: "今天"},
      {en: "currently", cn: "当前"},
      {en: "recently", cn: "最近"},
      {en: "now", cn: "现在"},
      {en: "modern", cn: "现代的"},
      {en: "new", cn: "新的"}
    ]
  },
  {
    group: "差异",
    words: [
      {en: "differentiation", cn: "区分"},
      {en: "different", cn: "不同的"},
      {en: "disparate", cn: "不同的"},
      {en: "distinction", cn: "区别"},
      {en: "distinguish", cn: "区分"},
      {en: "separate", cn: "分开"},
      {en: "differentiate", cn: "区分"},
      {en: "variable", cn: "可变的"},
      {en: "vary", cn: "变化"},
      {en: "variant", cn: "变体"},
      {en: "differ", cn: "不同"},
      {en: "variety", cn: "多样性"},
      {en: "variance", cn: "差异"},
      {en: "variation", cn: "变化"},
      {en: "changes", cn: "变化"},
      {en: "improvement", cn: "改进"},
      {en: "development", cn: "发展"},
      {en: "discrimination", cn: "歧视"},
      {en: "diversity", cn: "多样性"},
      {en: "divide", cn: "划分"},
      {en: "discrepancy", cn: "差异"},
      {en: "subdivide", cn: "细分"}
    ]
  },
  {
    group: "改变",
    words: [
      {en: "modify", cn: "修改"},
      {en: "change", cn: "改变"},
      {en: "alter", cn: "改变"},
      {en: "shift", cn: "转变"},
      {en: "adjust", cn: "调整"},
      {en: "adjustment", cn: "调整"},
      {en: "revise", cn: "修订"},
      {en: "edit", cn: "编辑"},
      {en: "amend", cn: "修改"},
      {en: "switch", cn: "切换"},
      {en: "adapt", cn: "适应"},
      {en: "adaption", cn: "适应"},
      {en: "revision", cn: "修订"}
    ]
  },
  {
    group: "适应",
    words: [
      {en: "adapt", cn: "适应"},
      {en: "fit", cn: "适合"},
      {en: "suit", cn: "适合"},
      {en: "appropriate", cn: "适当的"}
    ]
  },
  {
    group: "影响",
    words: [
      {en: "affect", cn: "影响"},
      {en: "influence", cn: "影响"},
      {en: "effect", cn: "效果"},
      {en: "disturb", cn: "打扰"},
      {en: "impact", cn: "影响"}
    ]
  },
  {
    group: "创建",
    words: [
      {en: "create", cn: "创建"},
      {en: "coin", cn: "创造"},
      {en: "invent", cn: "发明"},
      {en: "design", cn: "设计"},
      {en: "make", cn: "制作"},
      {en: "making", cn: "制作"},
      {en: "erect", cn: "建立"},
      {en: "form", cn: "形成"},
      {en: "produce", cn: "生产"},
      {en: "manufacture", cn: "制造"},
      {en: "production", cn: "生产"},
      {en: "devise", cn: "设计"},
      {en: "generate", cn: "产生"}
    ]
  },
  {
    group: "释放",
    words: [
      {en: "release", cn: "释放"},
      {en: "secrete", cn: "分泌"},
      {en: "discharge", cn: "排放"},
      {en: "exude", cn: "渗出"}
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
      {en: "found", cn: "建立"},
      {en: "set up", cn: "建立"},
      {en: "establish", cn: "建立"},
      {en: "build", cn: "建造"},
      {en: "initiate", cn: "启动"},
      {en: "create", cn: "创建"},
      {en: "start up", cn: "启动"},
      {en: "trigger", cn: "触发"},
      {en: "begin", cn: "开始"},
      {en: "invoke", cn: "调用"},
      {en: "undertake", cn: "承担"},
      {en: "commence", cn: "开始"},
      {en: "start", cn: "开始"}
    ]
  },
  {
    group: "企业",
    words: [
      {en: "entity", cn: "实体"},
      {en: "company", cn: "公司"},
      {en: "firm", cn: "公司"},
      {en: "enterprise", cn: "企业"},
      {en: "organisation", cn: "组织"},
      {en: "commercial", cn: "商业的"},
      {en: "trading", cn: "贸易的"},
      {en: "transaction", cn: "交易"},
      {en: "deal", cn: "交易"},
      {en: "retail", cn: "零售"},
      {en: "sale", cn: "销售"},
      {en: "corporate", cn: "公司的"},
      {en: "corporation", cn: "公司"},
      {en: "business", cn: "商业"},
      {en: "manufacturer", cn: "制造商"},
      {en: "group", cn: "集团"}
    ]
  },
  {
    group: "企业家",
    words: [
      {en: "entrepreneur", cn: "企业家"},
      {en: "boss", cn: "老板"},
      {en: "manager", cn: "经理"},
      {en: "director", cn: " director"},
      {en: "employer", cn: "雇主"},
      {en: "leader", cn: "领导"}
    ]
  },
  {
    group: "劳动力",
    words: [
      {en: "labour", cn: "劳动力"},
      {en: "workforce", cn: "劳动力"},
      {en: "worker", cn: "工人"},
      {en: "employee", cn: "雇员"},
      {en: "staff", cn: "员工"}
    ]
  },
  {
    group: "工作",
    words: [
      {en: "job", cn: "工作"},
      {en: "profession", cn: "职业"},
      {en: "vocation", cn: "职业"},
      {en: "occupation", cn: "职业"},
      {en: "career", cn: "职业"},
      {en: "work", cn: "工作"},
      {en: "employment", cn: "就业"}
    ]
  },
  {
    group: "消费者",
    words: [
      {en: "consumer", cn: "消费者"},
      {en: "customer", cn: "顾客"},
      {en: "client", cn: "客户"},
      {en: "user", cn: "用户"}
    ]
  },
  {
    group: "居民",
    words: [
      {en: "resident", cn: "居民"},
      {en: "people", cn: "人们"},
      {en: "person", cn: "人"},
      {en: "public", cn: "公众"},
      {en: "citizen", cn: "公民"},
      {en: "community", cn: "社区"},
      {en: "neighbourhood", cn: "邻里"},
      {en: "communal", cn: "社区的"},
      {en: "civic", cn: "公民的"},
      {en: "municipal", cn: "市政的"},
      {en: "nearby", cn: "附近的"},
      {en: "vicinity", cn: "附近"},
      {en: "ordinary people", cn: "普通人"},
      {en: "society", cn: "社会"},
      {en: "local", cn: "当地的"},
      {en: "personal", cn: "个人的"},
      {en: "private", cn: "私人的"},
      {en: "individual", cn: "个人"},
      {en: "population", cn: "人口"},
      {en: "demographic", cn: "人口统计学的"},
      {en: "societal", cn: "社会的"},
      {en: "inhabitant", cn: "居民"},
      {en: "human", cn: "人类"}
    ]
  },
  {
    group: "居住",
    words: [
      {en: "residence", cn: "住所"},
      {en: "habitat", cn: "栖息地"},
      {en: "home", cn: "家"},
      {en: "house", cn: "房子"},
      {en: "family", cn: "家庭"},
      {en: "existence", cn: "存在"},
      {en: "domestic", cn: "国内的"},
      {en: "native", cn: "本地的"},
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
      {en: "metropolitan", cn: "大都市的"},
      {en: "skyscraper", cn: "摩天大楼"}
    ]
  },
  {
    group: "农村",
    words: [
      {en: "remote", cn: "偏远的"},
      {en: "rural", cn: "农村的"},
      {en: "rustic", cn: "乡村的"},
      {en: "countryside", cn: "乡村"},
      {en: "suburb", cn: "郊区"},
      {en: "outskirts", cn: "郊区"},
      {en: "village", cn: "村庄"},
      {en: "suburban", cn: "郊区的"}
    ]
  },
  {
    group: "区域",
    words: [
      {en: "area", cn: "区域"},
      {en: "field", cn: "领域"},
      {en: "discipline", cn: "学科"},
      {en: "domain", cn: "领域"},
      {en: "region", cn: "地区"}
    ]
  },
  {
    group: "依赖",
    words: [
      {en: "reliance", cn: "依赖"},
      {en: "responsible", cn: "负责的"},
      {en: "liable", cn: "有责任的"},
      {en: "reliable", cn: "可靠的"},
      {en: "credible", cn: "可信的"},
      {en: "rely on", cn: "依赖"},
      {en: "depend on", cn: "依赖"},
      {en: "faith", cn: "信任"},
      {en: "trust", cn: "信任"},
      {en: "confidence", cn: "信心"},
      {en: "belief", cn: "信念"},
      {en: "believe", cn: "相信"},
      {en: "trustworthy", cn: "值得信赖的"},
      {en: "dependent on", cn: "依赖"}
    ]
  },
  {
    group: "怀疑",
    words: [
      {en: "skepticism", cn: "怀疑"},
      {en: "doubt", cn: "怀疑"}
    ]
  },
  {
    group: "责任",
    words: [
      {en: "responsibility", cn: "责任"},
      {en: "obligation", cn: "义务"},
      {en: "duty", cn: "职责"}
    ]
  },
  {
    group: "目标",
    words: [
      {en: "objective", cn: "目标"},
      {en: "goal", cn: "目标"},
      {en: "aim", cn: "目标"},
      {en: "target", cn: "目标"},
      {en: "purpose", cn: "目的"},
      {en: "intention", cn: "意图"}
    ]
  },
  {
    group: "停止",
    words: [
      {en: "cease", cn: "停止"},
      {en: "stop", cn: "停止"},
      {en: "interrupt", cn: "打断"},
      {en: "halt", cn: "停止"},
      {en: "quit", cn: "退出"}
    ]
  },
  {
    group: "阻止",
    words: [
      {en: "prevent", cn: "防止"},
      {en: "obstacle", cn: "障碍"},
      {en: "hinder", cn: "阻碍"},
      {en: "deter", cn: "阻止"},
      {en: "impede", cn: "阻碍"},
      {en: "avoid", cn: "避免"},
      {en: "escape", cn: "逃避"},
      {en: "evitable", cn: "可避免的"},
      {en: "discourage", cn: "阻止"},
      {en: "prohibit", cn: "禁止"},
      {en: "inhibition", cn: "抑制"},
      {en: "counter", cn: " counter"},
      {en: "protect from", cn: "保护免受"},
      {en: "keep safe from", cn: "保持安全"},
      {en: "hold back", cn: "阻止"}
    ]
  },
  {
    group: "抵制",
    words: [
      {en: "boycott", cn: "抵制"},
      {en: "oppose", cn: "反对"}
    ]
  },
  {
    group: "放弃",
    words: [
      {en: "abandon", cn: "放弃"},
      {en: "derelict", cn: "废弃的"},
      {en: "give up", cn: "放弃"},
      {en: "forsake", cn: "放弃"},
      {en: "discard", cn: "丢弃"},
      {en: "sacrifice", cn: "牺牲"}
    ]
  },
  {
    group: "限制",
    words: [
      {en: "restrict", cn: "限制"},
      {en: "curb", cn: "遏制"},
      {en: "limit", cn: "限制"},
      {en: "limitation", cn: "限制"},
      {en: "restriction", cn: "限制"},
      {en: "restraint", cn: "约束"},
      {en: "constraint", cn: "约束"},
      {en: "constrain", cn: "约束"},
      {en: "confine", cn: "限制"},
      {en: "suppress", cn: "压制"},
      {en: "hold", cn: "保持"},
      {en: "only", cn: "只有"},
      {en: "inevitable", cn: "不可避免的"}
    ]
  },
  {
    group: "集中",
    words: [
      {en: "concentration", cn: "集中"},
      {en: "pay attention to", cn: "关注"},
      {en: "focus", cn: "专注"},
      {en: "emphasis", cn: "强调"},
      {en: "restrict", cn: "限制"},
      {en: "specialise", cn: "专门化"},
      {en: "gather", cn: "聚集"},
      {en: "accumulate", cn: "积累"},
      {en: "concentrate", cn: "集中"}
    ]
  },
  {
    group: "有限",
    words: [
      {en: "finite", cn: "有限的"},
      {en: "limited", cn: "有限的"}
    ]
  },
  {
    group: "无限",
    words: [
      {en: "infinite", cn: "无限的"}
    ]
  },
  {
    group: "所谓",
    words: [
      {en: "so-called", cn: "所谓的"},
      {en: "known as", cn: "被称为"},
      {en: "---", cn: "---"},
      {en: "called", cn: "被称为"},
      {en: "named", cn: "被命名为"},
      {en: "regard as", cn: "视为"},
      {en: "title", cn: "标题"},
      {en: "term", cn: "术语"},
      {en: "\"\"", cn: "\"\""},
      {en: "definition", cn: "定义"}
    ]
  },
  {
    group: "著名",
    words: [
      {en: "famous", cn: "著名的"},
      {en: "well-known", cn: "著名的"},
      {en: "familiar", cn: "熟悉的"},
      {en: "notoriety", cn: "恶名"}
    ]
  },
  {
    group: "概念",
    words: [
      {en: "concept", cn: "概念"},
      {en: "idea", cn: "想法"},
      {en: "notion", cn: "概念"},
      {en: "belief", cn: "信念"},
      {en: "inspiration", cn: "灵感"},
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
      {en: "extract", cn: "摘录"}
    ]
  },
  {
    group: "语言",
    words: [
      {en: "linguistic", cn: "语言的"},
      {en: "language", cn: "语言"},
      {en: "word", cn: "单词"},
      {en: "term", cn: "术语"},
      {en: "literature", cn: "文学"},
      {en: "literacy", cn: "读写能力"},
      {en: "context", cn: "语境"}
    ]
  },
  {
    group: "教育",
    words: [
      {en: "education", cn: "教育"},
      {en: "school", cn: "学校"},
      {en: "literacy", cn: "读写能力"},
      {en: "institution", cn: "机构"},
      {en: "academic", cn: "学术的"}
    ]
  },
  {
    group: "交流",
    words: [
      {en: "communication", cn: "交流"},
      {en: "talk", cn: "谈话"},
      {en: "convey", cn: "传达"},
      {en: "verbal", cn: "口头的"},
      {en: "speak", cn: "说话"},
      {en: "oral", cn: "口头的"},
      {en: "narrate", cn: "叙述"},
      {en: "transmit", cn: "传递"},
      {en: "transmission", cn: "传递"}
    ]
  },
  {
    group: "交通",
    words: [
      {en: "transport", cn: "运输"},
      {en: "commute", cn: "通勤"},
      {en: "travel", cn: "旅行"},
      {en: "journey", cn: "旅程"},
      {en: "trip", cn: "旅行"},
      {en: "flight", cn: "航班"},
      {en: "tour", cn: "旅游"},
      {en: "voyage", cn: "航行"},
      {en: "expedition", cn: "探险"}
    ]
  },
  {
    group: "移动",
    words: [
      {en: "move", cn: "移动"},
      {en: "carry", cn: "携带"},
      {en: "convey", cn: "传达"},
      {en: "bring", cn: "带来"},
      {en: "transfer", cn: "转移"},
      {en: "proceed", cn: "进行"},
      {en: "deliver", cn: "交付"},
      {en: "mobile", cn: "移动的"},
      {en: "divert", cn: "转移"},
      {en: "distract", cn: "分散"},
      {en: "transmit", cn: "传递"},
      {en: "pass", cn: "传递"},
      {en: "send", cn: "发送"},
      {en: "transit", cn: "运输"},
      {en: "transition", cn: "过渡"},
      {en: "delivery", cn: "交付"},
      {en: "flow", cn: "流动"},
      {en: "movement", cn: "移动"}
    ]
  },
  {
    group: "迁移",
    words: [
      {en: "migration", cn: "迁移"},
      {en: "immigration", cn: "移民"},
      {en: "migrate", cn: "迁移"}
    ]
  },
  {
    group: "车辆",
    words: [
      {en: "vehicle", cn: "车辆"},
      {en: "car", cn: "汽车"},
      {en: "motor", cn: "发动机"},
      {en: "traffic", cn: "交通"}
    ]
  },
  {
    group: "进出口",
    words: [
      {en: "export", cn: "出口"},
      {en: "import", cn: "进口"},
      {en: "bring", cn: "带来"},
      {en: "take to", cn: "带到"},
      {en: "introduce", cn: "引入"},
      {en: "smuggle", cn: "走私"},
      {en: "ship", cn: "运输"}
    ]
  },
  {
    group: "内部",
    words: [
      {en: "internal", cn: "内部的"},
      {en: "inner", cn: "内部的"},
      {en: "interior", cn: "内部"},
      {en: "inside", cn: "里面"}
    ]
  },
  {
    group: "外部",
    words: [
      {en: "external", cn: "外部的"},
      {en: "exterior", cn: "外部"},
      {en: "outside", cn: "外面"}
    ]
  },
  {
    group: "证据",
    words: [
      {en: "evidence", cn: "证据"},
      {en: "proof", cn: "证明"},
      {en: "prove", cn: "证明"},
      {en: "clear", cn: "清晰的"},
      {en: "clarity", cn: "清晰"},
      {en: "hint", cn: "提示"},
      {en: "cue", cn: "线索"},
      {en: "clue", cn: "线索"},
      {en: "data", cn: "数据"},
      {en: "information", cn: "信息"},
      {en: "statistics", cn: "统计"}
    ]
  },
  {
    group: "快速",
    words: [
      {en: "swift", cn: "迅速的"},
      {en: "rapid", cn: "快速的"},
      {en: "quick", cn: "快速的"},
      {en: "immediately", cn: "立即"},
      {en: "straightaway", cn: "立即"},
      {en: "speed up", cn: "加速"},
      {en: "accelerate", cn: "加速"},
      {en: "prompt", cn: "迅速的"},
      {en: "rate", cn: "速度"},
      {en: "sudden", cn: "突然的"},
      {en: "breakneck", cn: "极快的"},
      {en: "pop up", cn: "突然出现"}
    ]
  },
  {
    group: "经历",
    words: [
      {en: "undergo", cn: "经历"}
    ]
  },
  {
    group: "保持",
    words: [
      {en: "remain", cn: "保持"},
      {en: "preserve", cn: "保存"},
      {en: "stay", cn: "保持"},
      {en: "stick", cn: "坚持"},
      {en: "keep", cn: "保持"},
      {en: "retention", cn: "保留"}
    ]
  },
  {
    group: "忍受",
    words: [
      {en: "survive", cn: "生存"},
      {en: "withstand", cn: "承受"},
      {en: "tolerate", cn: "容忍"},
      {en: "bear", cn: "忍受"},
      {en: "suffer", cn: "遭受"},
      {en: "face", cn: "面对"},
      {en: "patient", cn: "耐心的"},
      {en: "patience", cn: "耐心"}
    ]
  },
  {
    group: "因此",
    words: [
      {en: "thereby", cn: "因此"},
      {en: "therefore", cn: "因此"},
      {en: "because", cn: "因为"},
      {en: "hence", cn: "因此"},
      {en: "as", cn: "因为"},
      {en: "since", cn: "因为"},
      {en: "leading to", cn: "导致"},
      {en: "as a result", cn: "结果"},
      {en: "because of", cn: "因为"},
      {en: "thanks to", cn: "多亏"},
      {en: "due to", cn: "由于"},
      {en: "owing to", cn: "由于"},
      {en: "stem from", cn: "源于"},
      {en: "derive", cn: "衍生"},
      {en: "as a contributory factor", cn: "作为促成因素"}
    ]
  },
  {
    group: "原因",
    words: [
      {en: "reason", cn: "原因"},
      {en: "cause", cn: "原因"},
      {en: "for", cn: "因为"},
      {en: "why", cn: "为什么"},
      {en: "explain", cn: "解释"},
      {en: "explanation", cn: "解释"}
    ]
  },
  {
    group: "帮助",
    words: [
      {en: "aid", cn: "帮助"},
      {en: "help", cn: "帮助"},
      {en: "assistance", cn: "协助"},
      {en: "support", cn: "支持"}
    ]
  },
  {
    group: "解决",
    words: [
      {en: "address", cn: "解决"},
      {en: "solution", cn: "解决方案"},
      {en: "solve", cn: "解决"},
      {en: "deal with", cn: "处理"},
      {en: "overcome", cn: "克服"},
      {en: "defeat", cn: "击败"},
      {en: "handle", cn: "处理"},
      {en: "settle", cn: "解决"},
      {en: "fix", cn: "修复"},
      {en: "figure out", cn: "找出"},
      {en: "conquer", cn: "征服"},
      {en: "manage", cn: "管理"},
      {en: "tackle", cn: "处理"},
      {en: "cope with", cn: "应对"},
      {en: "confront", cn: "面对"},
      {en: "dispose", cn: "处理"},
      {en: "disposal", cn: "处理"},
      {en: "resolution", cn: "解决"},
      {en: "resolve", cn: "解决"}
    ]
  },
  {
    group: "处理不当",
    words: [
      {en: "bungle", cn: "搞砸"},
      {en: "mishandle", cn: "处理不当"}
    ]
  },
  {
    group: "管理",
    words: [
      {en: "manipulate", cn: "操纵"},
      {en: "manage", cn: "管理"},
      {en: "steer", cn: "引导"},
      {en: "governance", cn: "治理"},
      {en: "hold", cn: "持有"},
      {en: "dominate", cn: "主导"},
      {en: "monopoly", cn: "垄断"},
      {en: "control", cn: "控制"},
      {en: "rule", cn: "统治"},
      {en: "regulate", cn: "监管"},
      {en: "lead", cn: "领导"},
      {en: "influence", cn: "影响"},
      {en: "take over", cn: "接管"},
      {en: "power", cn: "权力"},
      {en: "reign", cn: "统治"}
    ]
  },
  {
    group: "情感",
    words: [
      {en: "emotion", cn: "情感"},
      {en: "feeling", cn: "感觉"},
      {en: "sense", cn: "感觉"},
      {en: "mood", cn: "心情"},
      {en: "perceptual", cn: "感知的"}
    ]
  },
  {
    group: "儿童",
    words: [
      {en: "infant", cn: "婴儿"},
      {en: "baby", cn: "婴儿"},
      {en: "child", cn: "孩子"},
      {en: "kid", cn: "孩子"},
      {en: "children", cn: "孩子们"},
      {en: "young", cn: "年轻的"},
      {en: "juvenile", cn: "青少年"},
      {en: "childhood", cn: "童年"}
    ]
  },
  {
    group: "结构",
    words: [
      {en: "structure", cn: "结构"},
      {en: "construction", cn: "建设"},
      {en: "building", cn: "建筑"},
      {en: "construct", cn: "建造"},
      {en: "build", cn: "建造"},
      {en: "making", cn: "制作"},
      {en: "constructing", cn: "建造"},
      {en: "framework", cn: "框架"}
    ]
  },
  {
    group: "房地产",
    words: [
      {en: "estate", cn: "房地产"},
      {en: "property", cn: "财产"},
      {en: "real estate", cn: "房地产"}
    ]
  },
  {
    group: "风险",
    words: [
      {en: "risk", cn: "风险"},
      {en: "crisis", cn: "危机"},
      {en: "danger", cn: "危险"},
      {en: "endanger", cn: "危及"},
      {en: "jeopardise", cn: "危害"},
      {en: "hazard", cn: "危险"},
      {en: "threat", cn: "威胁"}
    ]
  },
  {
    group: "捕食者",
    words: [
      {en: "predator", cn: "捕食者"}
    ]
  },
  {
    group: "冒犯",
    words: [
      {en: "offend", cn: "冒犯"},
      {en: "offensive", cn: "冒犯的"},
      {en: "hostile", cn: "敌对的"},
      {en: "enemy", cn: "敌人"},
      {en: "foe", cn: "敌人"}
    ]
  },
  {
    group: "位置",
    words: [
      {en: "location", cn: "位置"},
      {en: "position", cn: "位置"},
      {en: "spot", cn: "地点"},
      {en: "site", cn: "地点"},
      {en: "place", cn: "地方"},
      {en: "where", cn: "哪里"}
    ]
  },
  {
    group: "法律",
    words: [
      {en: "legal", cn: "法律的"},
      {en: "lawyer", cn: "律师"},
      {en: "solicitor", cn: "律师"},
      {en: "law", cn: "法律"},
      {en: "act", cn: "法案"},
      {en: "legitimate", cn: "合法的"},
      {en: "judicial", cn: "司法的"},
      {en: "legislation", cn: "立法"},
      {en: "regulation", cn: "法规"},
      {en: "rule", cn: "规则"},
      {en: "principle", cn: "原则"},
      {en: "guideline", cn: "指南"},
      {en: "instruction", cn: "指令"},
      {en: "policy", cn: "政策"},
      {en: "norm", cn: "规范"},
      {en: "contract", cn: "合同"}
    ]
  },
  {
    group: "过程",
    words: [
      {en: "process", cn: "过程"},
      {en: "progress", cn: "进步"},
      {en: "stride", cn: "进步"},
      {en: "phase", cn: "阶段"},
      {en: "procedure", cn: "程序"}
    ]
  },
  {
    group: "方法",
    words: [
      {en: "approach", cn: "方法"},
      {en: "way", cn: "方式"},
      {en: "method", cn: "方法"},
      {en: "practice", cn: "实践"},
      {en: "exercise", cn: "练习"},
      {en: "mechanism", cn: "机制"}
    ]
  },
  {
    group: "巨大",
    words: [
      {en: "enormous", cn: "巨大的"},
      {en: "tremendous", cn: "巨大的"},
      {en: "vast", cn: "广阔的"},
      {en: "massive", cn: "巨大的"},
      {en: "large", cn: "大的"},
      {en: "big", cn: "大的"},
      {en: "huge", cn: "巨大的"},
      {en: "utmost", cn: "最大的"},
      {en: "maximum", cn: "最大的"}
    ]
  },
  {
    group: "小",
    words: [
      {en: "small", cn: "小的"},
      {en: "little", cn: "小的"},
      {en: "minor", cn: "次要的"},
      {en: "tiny", cn: "微小的"},
      {en: "limited", cn: "有限的"},
      {en: "lacking", cn: "缺乏的"},
      {en: "deficiency", cn: "不足"},
      {en: "scarce", cn: "稀少的"},
      {en: "less", cn: "更少的"},
      {en: "minimise", cn: "最小化"},
      {en: "minimal", cn: "最小的"},
      {en: "minimum", cn: "最小值"},
      {en: "absence", cn: "缺席"}
    ]
  },
  {
    group: "大量",
    words: [
      {en: "considerable", cn: "相当大的"},
      {en: "plenty of", cn: "大量的"},
      {en: "many", cn: "许多"},
      {en: "numerous", cn: "众多的"},
      {en: "a number of", cn: "许多"},
      {en: "countless", cn: "无数的"},
      {en: "a lot of", cn: "许多"},
      {en: "lots of", cn: "许多"},
      {en: "several", cn: "几个"},
      {en: "a few/ a little", cn: "一些"},
      {en: "some", cn: "一些"},
      {en: "various", cn: "各种的"},
      {en: "multiple", cn: "多个的"},
      {en: "mass", cn: "大量"},
      {en: "quantity of", cn: "数量"},
      {en: "quantity", cn: "数量"}
    ]
  },
  {
    group: "质量",
    words: [
      {en: "quality", cn: "质量"},
      {en: "superior", cn: "优越的"},
      {en: "higher", cn: "更高的"},
      {en: "upper", cn: "上部的"},
      {en: "leading", cn: "领先的"},
      {en: "cutting edge", cn: "前沿的"},
      {en: "advanced", cn: "先进的"},
      {en: "more", cn: "更多的"},
      {en: "leading edge", cn: "前沿"},
      {en: "better", cn: "更好的"}
    ]
  },
  {
    group: "需要",
    words: [
      {en: "require", cn: "需要"},
      {en: "want", cn: "想要"},
      {en: "demand", cn: "需求"},
      {en: "need", cn: "需要"},
      {en: "call for", cn: "需要"},
      {en: "ask for", cn: "要求"},
      {en: "necessary", cn: "必要的"}
    ]
  },
  {
    group: "环境",
    words: [
      {en: "environment", cn: "环境"},
      {en: "surrounding", cn: "周围环境"},
      {en: "setting", cn: "设置"},
      {en: "background", cn: "背景"},
      {en: "circumstance", cn: "情况"},
      {en: "atmosphere", cn: "氛围"},
      {en: "situation", cn: "情况"},
      {en: "condition", cn: "条件"},
      {en: "occasion", cn: "场合"}
    ]
  },
  {
    group: "天气",
    words: [
      {en: "weather", cn: "天气"},
      {en: "climate", cn: "气候"}
    ]
  },
  {
    group: "环保",
    words: [
      {en: "carbon dioxide (CO2)", cn: "二氧化碳"},
      {en: "global warming", cn: "全球变暖"},
      {en: "climate change", cn: "气候变化"},
      {en: "eco-friendly", cn: "环保的"},
      {en: "conservation", cn: "保护"},
      {en: "ecology", cn: "生态学"},
      {en: "greenhouse", cn: "温室"},
      {en: "planet warm", cn: "地球变暖"},
      {en: "pollutant", cn: "污染物"},
      {en: "pollution", cn: "污染"},
      {en: "contaminate", cn: "污染"},
      {en: "contamination", cn: "污染"},
      {en: "smoke and fume", cn: "烟雾"},
      {en: "coal", cn: "煤"},
      {en: "charcoal", cn: "木炭"},
      {en: "fuel", cn: "燃料"},
      {en: "firewood", cn: "柴火"},
      {en: "sustainable", cn: "可持续的"},
      {en: "long-term", cn: "长期的"}
    ]
  },
  {
    group: "传统",
    words: [
      {en: "convention", cn: "传统"},
      {en: "conservative", cn: "保守的"},
      {en: "conservation", cn: "保护"},
      {en: "tradition", cn: "传统"},
      {en: "classic", cn: "经典的"},
      {en: "earlier", cn: "早期的"},
      {en: "traditional", cn: "传统的"},
      {en: "classical", cn: "古典的"}
    ]
  },
  {
    group: "微生物",
    words: [
      {en: "microbe", cn: "微生物"},
      {en: "virus", cn: "病毒"},
      {en: "germ", cn: "细菌"},
      {en: "bacteria", cn: "细菌"},
      {en: "fungi", cn: "真菌"}
    ]
  },
  {
    group: "医疗",
    words: [
      {en: "medical", cn: "医疗的"},
      {en: "health", cn: "健康"},
      {en: "well-being", cn: "幸福"},
      {en: "disease", cn: "疾病"},
      {en: "ailment", cn: "疾病"},
      {en: "illness", cn: "疾病"},
      {en: "sickness", cn: "疾病"},
      {en: "symptom", cn: "症状"},
      {en: "infest", cn: "感染"},
      {en: "plague", cn: "瘟疫"},
      {en: "cholera", cn: "霍乱"},
      {en: "polio", cn: "小儿麻痹症"},
      {en: "malaria", cn: "疟疾"},
      {en: "tuberculosis (TB)", cn: "肺结核"},
      {en: "ebola", cn: "埃博拉"},
      {en: "epidemic", cn: "流行病"},
      {en: "pandemic", cn: "大流行病"},
      {en: "outbreak", cn: "爆发"},
      {en: "diabetes", cn: "糖尿病"},
      {en: "heart disease", cn: "心脏病"},
      {en: "asthma", cn: "哮喘"}
    ]
  },
  {
    group: "健康",
    words: [
      {en: "fitness", cn: "健康"},
      {en: "activity", cn: "活动"},
      {en: "exercise", cn: "锻炼"},
      {en: "dental", cn: "牙科的"},
      {en: "dentist", cn: "牙医"},
      {en: "doctor", cn: "医生"},
      {en: "teeth", cn: "牙齿"},
      {en: "allergy", cn: "过敏"},
      {en: "pain", cn: "疼痛"},
      {en: "trauma", cn: "创伤"},
      {en: "disorder", cn: "障碍"},
      {en: "syndrome", cn: "综合征"},
      {en: "health problem", cn: "健康问题"},
      {en: "physical problem", cn: "身体问题"}
    ]
  },
  {
    group: "感染",
    words: [
      {en: "infect", cn: "感染"},
      {en: "infectious", cn: "传染性的"},
      {en: "infection", cn: "感染"}
    ]
  },
  {
    group: "身体",
    words: [
      {en: "physical", cn: "身体的"},
      {en: "body", cn: "身体"},
      {en: "organ", cn: "器官"},
      {en: "limb", cn: "肢体"}
    ]
  },
  {
    group: "治疗",
    words: [
      {en: "therapy", cn: "疗法"},
      {en: "treatment", cn: "治疗"},
      {en: "remedy", cn: " remedy"},
      {en: "medicine", cn: "药物"},
      {en: "medication", cn: "药物"},
      {en: "drug", cn: "药物"},
      {en: "cure", cn: "治愈"},
      {en: "against disease", cn: "对抗疾病"}
    ]
  },
  {
    group: "物质",
    words: [
      {en: "compound", cn: "化合物"},
      {en: "substance", cn: "物质"},
      {en: "matter", cn: "物质"},
      {en: "chemical", cn: "化学物质"},
      {en: "toxic", cn: "有毒的"},
      {en: "poison", cn: "毒药"},
      {en: "drug", cn: "药物"}
    ]
  },
  {
    group: "免疫",
    words: [
      {en: "immunity", cn: "免疫力"},
      {en: "immune", cn: "免疫的"},
      {en: "resistance", cn: "抵抗力"}
    ]
  },
  {
    group: "心理",
    words: [
      {en: "mental", cn: "心理的"},
      {en: "cognitive", cn: "认知的"},
      {en: "mind", cn: "心灵"},
      {en: "intellectual", cn: "智力的"},
      {en: "intelligence", cn: "智力"},
      {en: "intelligent", cn: "聪明的"}
    ]
  }
];

// 转换为扁平结构，用于与现有系统兼容
const synonymsFlat = [];
synonymsGrouped.forEach(group => {
  group.words.forEach(word => {
    synonymsFlat.push({
      cn: word.cn,
      en: word.en,
      group: group.group
    });
  });
});