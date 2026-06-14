import type { PersonaContent, PersonaId } from "@/lib/content/schema";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

type PersonaTranslation = DeepPartial<PersonaContent>;

export const personaTranslations: Record<PersonaId, { zh: PersonaTranslation }> = {
  developer: {
    zh: {
      label: "软件开发者",
      profile: {
        name: "Jordan Vale",
        title: "产品型软件工程师",
        tagline: "为需要可靠软件的团队构建克制、耐用的工具。",
        bio: "Jordan Vale 是该模板中的开发者演示人物。资料重点展示产品工程、前端系统和务实的 AI 集成。",
        location: "美国加州旧金山",
        affiliation: "独立工作者",
        interests: ["产品工程", "前端架构", "开发者工具", "AI 工作流"],
        contact: [{ label: "邮箱", value: "jordan@example.com", href: "mailto:jordan@example.com", preferred: true }],
        links: [
          { label: "GitHub", href: "https://github.com", kind: "github" },
          { label: "LinkedIn", href: "https://linkedin.com", kind: "linkedin" }
        ]
      },
      homepage: {
        sections: [
          { id: "interests", type: "skills-interests", enabled: true, title: "关注方向" }
        ],
        stats: [
          { label: "精选作品", value: "3" },
          { label: "核心方向", value: "4" },
          { label: "模板路由", value: "9" }
        ],
        timeline: [
          {
            title: "首席工程师",
            organization: "Example Product Studio",
            period: "2023 至今",
            summary: "负责内部工具的前端架构和 AI 辅助工作流。"
          },
          {
            title: "高级软件工程师",
            organization: "Demo Cloud",
            period: "2019-2023",
            summary: "为产品团队构建 Web 平台、设计系统和部署流程。"
          }
        ]
      },
      projects: [
        {
          slug: "portfolio-template",
          title: "模块化作品集模板",
          subtitle: "可复用的个人网站架构",
          summary: "一个类型化、内容驱动的网站模板，包含模块化首页和可扩展的 AI 助手。",
          description: "该项目是当前模板的基线：内容存放在文件中，展示层由组件构成，路由已经为后续更深入的内容做好准备。",
          role: "模板架构与全栈实现",
          period: "2026",
          problem: "许多个人网站把简介、作品内容和助手行为写进一次性的页面代码，难以复用和验证。",
          approach: [
            "将人物内容、渲染组件和助手编排拆分为类型化模块。",
            "保持首版实现对静态部署友好，同时为 AI 服务商接入留下清晰钩子。",
            "让首页区块和详情页在缺少内容时也能优雅降级。"
          ],
          outcomes: [
            "一个可构建的 Next.js 模板，具备可复用路由和类型化本地内容。",
            "一个能引用资料、项目、笔记、发表和联系来源的可溯源助手界面。",
            "一套可适配学术、开发者和创作者资料的内容模型。"
          ],
          highlights: ["配置驱动首页", "类型化人物内容", "OpenAI 兼容助手钩子"],
          tags: ["Next.js", "TypeScript", "Tailwind"]
        },
        {
          slug: "team-ops-dashboard",
          title: "团队运营仪表盘",
          summary: "一个克制的仪表盘概念，用于跟踪产品工作而不过度增加流程负担。",
          description: "该演示项目用于展示作品卡片、标签、状态和详情页路由。",
          role: "产品工程师",
          period: "2025",
          problem: "团队需要快速了解运营状态，但仪表盘常常变成噪音很大的状态墙。",
          approach: [
            "优先考虑可快速浏览的状态、克制的信息层级和直接的后续操作入口。",
            "围绕重复运营评审而不是一次性展示来组织页面。"
          ],
          outcomes: [
            "展示该模板如何呈现产品工程项目的简洁示例。",
            "可复用的项目元数据可同时服务检索、卡片和详情页。"
          ],
          highlights: ["运营体验", "仪表盘模式", "可复用项目卡片"],
          tags: ["仪表盘", "产品工程"]
        }
      ],
      publications: [
        {
          title: "面向 AI 辅助工作的耐用界面设计",
          authors: ["Jordan Vale"],
          venue: "Demo Product Engineering Notes",
          year: 2026,
          abstract: "一条示例公开写作记录，讨论如何构建可检查、可回退、且不依赖隐藏状态的 AI 产品界面。",
          links: [{ label: "相关笔记", href: "/notes/template-architecture-notes" }],
          tags: ["AI 工作流", "产品工程", "界面"]
        }
      ],
      notes: [
        {
          slug: "template-architecture-notes",
          title: "关于可复用个人网站架构的笔记",
          date: "2026-04-20",
          summary: "简要说明为什么要拆分内容、渲染和未来的助手编排。",
          body: "可复用模板最适合让内容、路由和展示层保持松耦合。",
          sections: [
            {
              heading: "内容应该可迁移",
              body: "个人网站模板不应该在每次所有者更换角色、项目或发表时都要求重写页面组件。类型化内容让渲染器和助手共享同一个事实来源。"
            },
            {
              heading: "助手行为需要来源边界",
              body: ["助手应先从公开内容中检索，再组织答案。", "当事实缺失时，正确答案是说明不确定性并给出有用路径，而不是即兴补全。"]
            },
            {
              heading: "展示保持模块化",
              body: "同一份项目和笔记记录应同时支持卡片、详情页、简历摘要和检索片段，而不需要复制文案。"
            }
          ],
          tags: ["架构", "模板"],
          readingLevel: "intermediate",
          audience: "正在改造该模板的开发者"
        }
      ],
      faq: [
        {
          question: "Jordan 主要做什么类型的工作？",
          answer: "Jordan 关注产品工程、前端架构、开发者工具和 AI 工作流。",
          category: "background"
        }
      ],
      ai: {
        tone: "直接、务实，并基于来源。",
        style: "用简洁答案回答，引用公开来源标签，并在有帮助时引导访问者前往项目或联系页面。",
        allowedBehavior: ["总结公开项目", "解释技术关注方向", "建议站内链接"],
        forbiddenBehavior: ["编造客户细节", "做出招聘或合同承诺"],
        routingGuidance: ["作品集问题引导到 /projects", "档期或合作问题引导到 /contact"],
        uncertaintyPolicy: "如果内容没有包含某个细节，请说明公开网站未提供该信息。"
      }
    }
  },
  academic: {
    zh: {
      label: "学术研究者",
      profile: {
        name: "Mira Chen",
        title: "理论物理学生",
        tagline: "关注理论物理、数学结构与清晰解释之间的交汇处。",
        portrait: {
          src: "/images/profile/portrait-placeholder.svg",
          alt: "为 Mira Chen 预留的未来头像或学习场景照片位置。",
          caption: "头像占位图。请在确认适合公开发布后替换为真实照片。",
          placeholder: true,
          replacePath: "/public/images/profile/portrait.jpg",
          note: "当有合适的公开照片时，可将当前占位图替换为克制、安静的人像或学习场景照片。"
        },
        bio: "我学习理论物理，也特别在意抽象观念如何通过缓慢阅读、精确记号与耐心解释而变得真正可理解。公开写作与页面内容主要围绕数学结构展开，但我同样重视表达的清晰度：困难的思想不仅值得欣赏，也值得被认真地讲清楚。",
        personalNote: {
          enabled: true,
          title: "更个人的一点说明",
          body: [
            "我的学习方式很大一部分建立在耐心之上：慢慢读，重新画图，写下被省略的步骤，并检验一个解释在完全展开之后是否仍然成立。",
            "我喜欢数学结构从一种漂亮的形式变成真正的思考工具的时刻。很多笔记、小的代码实验和研究问题，都是从那里开始的。"
          ]
        },
        aboutSections: [
          {
            heading: "我如何学习",
            body: "我的很多工作是在安静的节奏里完成的：逐行阅读，把论证改写成自己的记号，并检验一条优雅的结论在每一步都展开之后是否仍然成立。"
          },
          {
            heading: "我为何被理论吸引",
            body: [
              "我尤其喜欢那些物理直觉与形式结构彼此校正、彼此照亮的问题。",
              "对我来说，愿意陪一个困难概念走足够长的时间，直到它的内部逻辑真正清楚，是研究中很重要的训练。"
            ]
          },
          {
            heading: "工作之外的节奏",
            body: "在正式课程之外，我会持续整理长篇笔记，回到基础文本，也会做一些小规模的计算性实验，帮助自己把抽象结构变得更容易检查和说明。"
          }
        ],
        interests: ["理论物理", "数学物理", "对称性与几何", "科学计算"],
        links: [
          { label: "笔记", href: "/notes", kind: "website" },
          { label: "联系", href: "/contact", kind: "website" }
        ],
        contact: [{ label: "联系页面", value: "/contact", href: "/contact", preferred: true }]
      },
      homepage: {
        sections: [
          { id: "gallery", type: "gallery-preview", enabled: true, title: "照片札记" },
          { id: "interests", type: "skills-interests", enabled: true, title: "研究主题" },
          { id: "people", type: "people-preview", enabled: false, title: "相关人物" }
        ],
        stats: [
          { label: "研究主题", value: "4" },
          { label: "当前笔记", value: "1" },
          { label: "公开联系入口", value: "1" }
        ],
        timeline: [
          {
            title: "当前重点",
            organization: "独立阅读与研究准备",
            period: "现在",
            summary: "以数学细节、概念一致性和解释清晰度为中心推进学习与研究准备。"
          }
        ]
      },
      projects: [],
      publications: [],
      notes: [
        {
          slug: "reading-physics-slowly",
          title: "缓慢地读物理",
          date: "2026-05-12",
          summary: "关于为什么困难材料只有在被重写、检查和耐心解释后，才会真正变得可用的一则短笔记。",
          body: "很多最有价值的学习，恰恰发生在把紧凑推导重新展开成一整本中间步骤笔记的时候。",
          sections: [
            {
              heading: "重建过程本身就是理解",
              body: "如果一段文本推进得太快，我通常会通过把省略的步骤自己补出来而真正学到东西，而不是逼自己读得更快。"
            },
            {
              heading: "记笔记是一种思考方式",
              body: "长篇笔记并不是研究准备之外的附属品，它往往正是我辨认自己真正理解了什么、又还没有理解什么的最好方法。"
            }
          ],
          tags: ["学习方法", "物理笔记"],
          readingLevel: "introductory",
          audience: "想了解我如何接近理论问题的读者"
        }
      ],
      gallery: [
        {
          id: "portrait-placeholder",
          title: "未来头像",
          description: "为适合公开发布的人像或学习场景照片预留的位置。这还不是真实个人照片。",
          alt: "未来公开头像的占位卡片。",
          category: "academic",
          tags: ["占位", "头像"],
          caption: "TODO：确认照片适合公开使用后再替换为真实头像。"
        },
        {
          id: "workspace-placeholder",
          title: "未来学习空间札记",
          description: "为书桌、笔记本、黑板或其他适合公开的学习场景图片预留的位置。",
          alt: "未来学习或工作空间照片的占位卡片。",
          category: "workspace",
          tags: ["占位", "学习"],
          caption: "TODO：只有在安全且有助于公开呈现时才添加真实学习空间图片。"
        },
        {
          id: "campus-placeholder",
          title: "未来校园或活动照片",
          description: "为校园、讨论班或学术活动图片预留的位置，前提是上下文和权限都适合公开。",
          alt: "未来校园或学术活动照片的占位卡片。",
          category: "campus",
          tags: ["占位", "校园"],
          caption: "TODO：不要在没有明确公开许可的情况下添加合影或可识别他人的照片。"
        }
      ],
      people: [],
      faq: [
        {
          question: "Mira 主要在做什么？",
          answer: "Mira 关注理论物理，也特别关心数学结构、缓慢阅读与清晰解释之间的关系。",
          category: "background"
        }
      ],
      ai: {
        tone: "平静、准确、谨慎。",
        style: "基于公开材料回答，避免过度推断；若去读笔记或联系页面更合适，也应直接引导过去。",
        allowedBehavior: ["总结公开资料", "推荐相关页面", "引用来源标签"],
        forbiddenBehavior: ["编造私人承诺", "声称能访问未公开信息"],
        routingGuidance: ["写作或学习方式问题引导到 /notes", "正式联系请求引导到 /contact"],
        uncertaintyPolicy: "如果内容文件中没有某个事实，请说明公开材料未提供该信息。"
      }
    }
  }
};
