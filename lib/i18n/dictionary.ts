import type { Locale } from "@/lib/i18n/types";

export const dictionaries = {
  en: {
    language: {
      label: "Language",
      english: "EN",
      chinese: "中文"
    },
    nav: {
      about: "About",
      gallery: "Gallery",
      people: "People",
      projects: "Projects",
      publications: "Publications",
      notes: "Notes",
      cv: "CV",
      contact: "Contact",
      editor: "Editor",
      ask: "Ask AI"
    },
    common: {
      viewWork: "View work",
      askAssistant: "Ask the assistant",
      email: "Email",
      contact: "Contact",
      links: "Links",
      tags: "Tags",
      status: "Status",
      date: "Date",
      period: "Period",
      role: "Role",
      noLinks: "No external links are configured yet."
    },
    footer: {
      note: "Public notes, selected work, and contact routes collected in one calm, source-grounded profile."
    },
    home: {
      publicProfile: "Public profile",
      affiliation: "Affiliation",
      location: "Location",
      focus: "Focus",
      aboutEyebrow: "About",
      aboutTitle: "Study, research, and explanation held in one restrained public profile.",
      aboutLink: "Read the full profile",
      galleryTitle: "Photo notes",
      galleryDescription: "A quiet visual layer for portraits, academic places, study spaces, and public-safe moments.",
      viewGallery: "View gallery",
      peopleTitle: "Related people",
      peopleDescription: "Mentors, collaborators, labs, and peers are listed only when the public content verifies the relationship.",
      viewPeople: "View people",
      interestsDescription: "Current themes that shape the work and the reading behind it.",
      featuredProjects: "Featured projects",
      featuredProjectsDescription: "Selected public work and structured project records.",
      allProjects: "All projects",
      experience: "Experience",
      experienceDescription: "A concise view of current work and recent trajectories.",
      selectedPublications: "Selected publications",
      viewPublications: "View publications",
      latestNotes: "Latest notes",
      allNotes: "All notes",
      ctaTitle: "Start with the public materials.",
      ctaDescription: "Use the assistant for a grounded overview, then continue to the notes or contact page when a direct source is more useful."
    },
    pages: {
      about: {
        eyebrow: "About",
        title: "A quieter account of how I work",
        personalNote: "A more personal note",
        relatedPeople: "Related people",
        relatedPeopleEmpty: "No mentors, collaborators, or academic connections are listed yet because the current public content does not verify specific people.",
        interests: "Interests",
        publicLinks: "Public links"
      },
      gallery: {
        eyebrow: "Gallery",
        title: "Photo album",
        description: "A public-safe visual layer for portraits, academic places, workspace notes, and events. Placeholder cards are labeled until real assets are added.",
        featured: "Featured",
        all: "All photos",
        emptyTitle: "No gallery items configured",
        emptyDescription: "Add public-safe image records in the editor or content files. Avoid photos that reveal private details or include identifiable people without permission.",
        placeholder: "Placeholder",
        metadata: "Photo details"
      },
      people: {
        eyebrow: "People",
        title: "Related people",
        description: "A conservative public list of mentors, collaborators, advisors, lab connections, and peers. The site only lists people when the relationship is verified in public content.",
        emptyTitle: "No related people listed yet",
        emptyDescription: "The current public content does not verify specific mentors, collaborators, or advisors. Add people only after confirming names, roles, affiliations, and links are suitable for publication.",
        relationship: "Relationship",
        affiliation: "Affiliation",
        publicLink: "Public link",
        categories: "Categories"
      },
      projects: {
        eyebrow: "Projects",
        title: "Selected work",
        description: "Public project records, research artifacts, or working documents can be collected here when they are ready to share.",
        emptyTitle: "No projects configured",
        emptyDescription: "This profile does not currently list public project records. For now, the notes page is the best place to follow the work in progress.",
        emptyAction: "Ask about available public material",
        problem: "Problem",
        approach: "Approach",
        outcomes: "Outcomes",
        highlights: "Highlights",
        facts: "Project facts"
      },
      notes: {
        eyebrow: "Notes",
        title: "Writing and updates",
        description: "Short-form public writing that the assistant can summarize and cite.",
        emptyTitle: "No notes configured",
        emptyDescription: "Add notes to the active persona to give visitors and the assistant more public context.",
        emptyAction: "Browse projects instead"
      },
      publications: {
        eyebrow: "Publications",
        title: "Public materials",
        description: "Papers, talks, essays, and other public materials can be listed here when formal outputs are available.",
        emptyTitle: "No publications configured",
        emptyDescription: "Formal publications are not listed here yet. Notes and the profile pages remain the current public sources for the assistant.",
        emptyAction: "Read notes"
      },
      cv: {
        eyebrow: "CV",
        profile: "Profile",
        focusAreas: "Focus areas",
        experience: "Experience",
        entries: "entries",
        selectedProjects: "Selected Projects",
        viewAll: "View all",
        publicMaterials: "Public Materials",
        download: "Download CV",
        downloadHint: "Add a PDF path to enable a real download."
      },
      contact: {
        eyebrow: "Contact",
        title: "Use the public contact channels.",
        description: "Use the public contact route for formal questions, collaboration, or anything that should not be inferred from the site alone.",
        preferred: "Preferred",
        empty: "No public contact channels are configured for this persona yet."
      },
      editor: {
        eyebrow: "Editor",
        title: "Visual content editor",
        description: "Import, draft, preview, and export profile, homepage, project, note, publication, contact, FAQ, and assistant settings without adding a CMS."
      }
    },
    ask: {
      eyebrow: "Assistant",
      title: "Ask about the public materials",
      description: "The assistant retrieves local site content first, then uses the configured AI provider when available. If provider configuration is missing or fails, it returns a grounded local fallback.",
      browseProjects: "Browse projects",
      trustBoundary: "Trust boundary",
      panelTitle: "Ask the public site",
      panelDescription: "Answers are grounded in the configured profile, projects, notes, publications, FAQ, and assistant rules for {name}.",
      suggestedQuestions: "Suggested questions",
      inputLabel: "Ask a question",
      placeholder: "Ask about public projects, writing, background, navigation, or contact...",
      send: "Ask",
      sending: "Asking",
      loading: "Retrieving sources and composing an answer...",
      sources: "Sources",
      networkError: "The assistant could not be reached. Check the local dev server and try again."
    },
    ai: {
      emptyQuestion: "Ask a question about the public profile, projects, publications, notes, navigation, or contact options.",
      emptyQuestionError: "Question is required.",
      tooLong: "Please ask a shorter question about the public site materials.",
      invalidJson: "The request body must be valid JSON.",
      missingKey: "No API key is configured. Set {env} to enable LLM-generated answers.",
      providerFailure: "The AI provider could not complete the request, so a grounded local fallback answer was returned.",
      outOfScope: "I can only answer from {name}'s public site materials. For private details, formal commitments, or high-risk advice, please use the contact page instead.",
      insufficient: "The public site does not specify enough information to answer that. Try asking about {name}'s profile, projects, publications, notes, or contact options.",
      contact: "For collaboration, availability, hiring, or formal requests, use the public contact channel: {label} ({value}). I cannot make commitments on {name}'s behalf.",
      contactNoChannel: "For collaboration, availability, hiring, or formal requests, use the contact page. I cannot make commitments on {name}'s behalf.",
      navigation: "Useful site routes include About for profile context, Projects for work samples, Notes and Publications for writing, CV for experience, Contact for formal outreach, and Ask for grounded questions.",
      profilePrefix: "{name} is listed as {title}.",
      affiliation: "Affiliation: {value}.",
      interests: "Public focus areas include {value}.",
      sourcesUsed: "Sources used: {value}.",
      projectPrefix: "Relevant public project material:",
      writingPrefix: "Relevant public writing:",
      noProjectMatch: "The public site has project material, but I could not match that question to a specific project. Start with the projects page.",
      noWritingMatch: "The public site does not list matching publications or notes for that question."
    },
    labels: {
      readingLevel: {
        introductory: "introductory",
        intermediate: "intermediate",
        advanced: "advanced"
      },
      status: {
        planned: "planned",
        active: "active",
        paused: "paused",
        complete: "complete"
      },
      galleryCategory: {
        academic: "academic",
        campus: "campus",
        travel: "travel",
        "daily-life": "daily life",
        events: "events",
        workspace: "workspace"
      },
      peopleCategory: {
        mentor: "mentor",
        collaborator: "collaborator",
        lab: "lab",
        peer: "peer",
        advisor: "advisor",
        other: "other"
      }
    }
  },
  zh: {
    language: {
      label: "语言",
      english: "EN",
      chinese: "中文"
    },
    nav: {
      about: "关于",
      gallery: "相册",
      people: "人物",
      projects: "项目",
      publications: "发表",
      notes: "笔记",
      cv: "简历",
      contact: "联系",
      editor: "编辑器",
      ask: "问 AI"
    },
    common: {
      viewWork: "查看作品",
      askAssistant: "询问助手",
      email: "邮件",
      contact: "联系",
      links: "链接",
      tags: "标签",
      status: "状态",
      date: "日期",
      period: "周期",
      role: "角色",
      noLinks: "暂未配置外部链接。"
    },
    footer: {
      note: "将公开笔记、选定工作与联系入口整理在同一个克制、可溯源的个人页面中。"
    },
    home: {
      publicProfile: "公开资料",
      affiliation: "机构",
      location: "所在地",
      focus: "关注方向",
      aboutEyebrow: "关于",
      aboutTitle: "把学习、研究与解释放在同一个克制的公开页面中。",
      aboutLink: "阅读完整资料",
      galleryTitle: "照片札记",
      galleryDescription: "为头像、学术场景、学习空间和适合公开的片段保留一个安静的视觉层。",
      viewGallery: "查看相册",
      peopleTitle: "相关人物",
      peopleDescription: "只有在公开内容能够验证关系时，才列出导师、合作者、实验室和同伴信息。",
      viewPeople: "查看人物",
      interestsDescription: "这些主题构成了当前的阅读方向与思考重心。",
      featuredProjects: "精选项目",
      featuredProjectsDescription: "整理过的公开工作与结构化项目记录。",
      allProjects: "全部项目",
      experience: "经历",
      experienceDescription: "用简洁方式展示当前重心与近阶段轨迹。",
      selectedPublications: "代表性发表",
      viewPublications: "查看发表",
      latestNotes: "最新笔记",
      allNotes: "全部笔记",
      ctaTitle: "从公开材料开始。",
      ctaDescription: "可以先让助手给出基于来源的概览，再去阅读笔记或使用联系页面。"
    },
    pages: {
      about: {
        eyebrow: "关于",
        title: "关于我如何学习与工作",
        personalNote: "更个人的一点说明",
        relatedPeople: "相关人物",
        relatedPeopleEmpty: "当前公开内容还没有验证具体导师、合作者或学术连接，因此暂不列出人物卡片。",
        interests: "兴趣方向",
        publicLinks: "公开链接"
      },
      gallery: {
        eyebrow: "相册",
        title: "照片相册",
        description: "用于公开安全展示头像、学术场景、学习空间和活动片段。占位卡会保持明确标注，直到加入真实素材。",
        featured: "精选",
        all: "全部照片",
        emptyTitle: "尚未配置相册项目",
        emptyDescription: "可在编辑器或内容文件中添加适合公开的图片记录。请避免暴露私人信息，或在没有许可的情况下发布可识别他人的照片。",
        placeholder: "占位",
        metadata: "照片信息"
      },
      people: {
        eyebrow: "人物",
        title: "相关人物",
        description: "用于保守地展示导师、合作者、顾问、实验室连接和同伴。只有当公开内容验证关系时才列出。",
        emptyTitle: "尚未列出相关人物",
        emptyDescription: "当前公开内容还没有验证具体导师、合作者或顾问。请只在确认姓名、角色、机构和链接适合公开后添加。",
        relationship: "关系",
        affiliation: "机构",
        publicLink: "公开链接",
        categories: "分类"
      },
      projects: {
        eyebrow: "项目",
        title: "代表作品",
        description: "当有适合公开的研究材料、项目记录或工作文档时，可以在这里集中整理。",
        emptyTitle: "尚未配置项目",
        emptyDescription: "当前页面还没有公开项目记录。此阶段若想了解工作脉络，最适合先阅读笔记页面。",
        emptyAction: "询问现有公开材料",
        problem: "问题",
        approach: "方法",
        outcomes: "结果",
        highlights: "亮点",
        facts: "项目信息"
      },
      notes: {
        eyebrow: "笔记",
        title: "文章与更新",
        description: "这些短文和更新可以被助手总结并作为来源引用。",
        emptyTitle: "尚未配置笔记",
        emptyDescription: "添加笔记后，访问者和助手都会获得更多公开上下文。",
        emptyAction: "先浏览项目"
      },
      publications: {
        eyebrow: "发表",
        title: "公开材料",
        description: "当有正式论文、演讲、文章或其他公开成果时，可以在这里统一列出。",
        emptyTitle: "尚未配置发表",
        emptyDescription: "这里暂时还没有正式发表。当前可公开引用的主要材料仍是个人资料页与笔记页。",
        emptyAction: "阅读笔记"
      },
      cv: {
        eyebrow: "简历",
        profile: "资料",
        focusAreas: "关注方向",
        experience: "经历",
        entries: "条",
        selectedProjects: "精选项目",
        viewAll: "查看全部",
        publicMaterials: "公开材料",
        download: "下载简历",
        downloadHint: "配置 PDF 路径后可启用真实下载。"
      },
      contact: {
        eyebrow: "联系",
        title: "使用公开联系渠道。",
        description: "如果是正式问题、合作意向或不应由站点内容代为推断的事项，请直接使用这里的公开联系入口。",
        preferred: "推荐",
        empty: "该人物尚未配置公开联系渠道。"
      },
      editor: {
        eyebrow: "编辑器",
        title: "可视化内容编辑器",
        description: "无需引入 CMS，即可导入、草拟、预览并导出资料、首页、项目、笔记、发表、联系、FAQ 和助手设置。"
      }
    },
    ask: {
      eyebrow: "助手",
      title: "询问公开材料",
      description: "助手会先检索本地网站内容；如果已配置 AI 服务商，再调用模型生成答案。缺少配置或服务失败时，会返回有来源依据的本地兜底答案。",
      browseProjects: "浏览项目",
      trustBoundary: "可信边界",
      panelTitle: "询问公开网站",
      panelDescription: "答案基于 {name} 的资料、项目、笔记、发表、FAQ 和助手规则。",
      suggestedQuestions: "推荐问题",
      inputLabel: "输入问题",
      placeholder: "询问公开项目、文章、背景、导航或联系信息...",
      send: "提问",
      sending: "提问中",
      loading: "正在检索来源并生成答案...",
      sources: "来源",
      networkError: "无法连接助手。请检查本地开发服务器后重试。"
    },
    ai: {
      emptyQuestion: "请询问公开资料、项目、发表、笔记、导航或联系选项。",
      emptyQuestionError: "问题不能为空。",
      tooLong: "请缩短问题，并聚焦公开网站材料。",
      invalidJson: "请求正文必须是有效 JSON。",
      missingKey: "尚未配置 API Key。设置 {env} 后即可启用模型生成答案。",
      providerFailure: "AI 服务商未能完成请求，因此返回了有来源依据的本地兜底答案。",
      outOfScope: "我只能根据 {name} 的公开网站材料回答。涉及私人细节、正式承诺或高风险建议时，请使用联系页面。",
      insufficient: "公开网站没有提供足够信息来回答这个问题。可以改问 {name} 的资料、项目、发表、笔记或联系方式。",
      contact: "如需合作、档期、聘用或正式沟通，请使用公开联系渠道：{label}（{value}）。我不能代表 {name} 做出承诺。",
      contactNoChannel: "如需合作、档期、聘用或正式沟通，请使用联系页面。我不能代表 {name} 做出承诺。",
      navigation: "可用页面包括：关于页面查看背景，项目页面查看作品，笔记和发表页面查看写作，简历页面查看经历，联系页面用于正式沟通，Ask 页面用于有来源依据的问题。",
      profilePrefix: "{name} 的公开身份是：{title}。",
      affiliation: "机构：{value}。",
      interests: "公开关注方向包括：{value}。",
      sourcesUsed: "使用来源：{value}。",
      projectPrefix: "相关公开项目材料：",
      writingPrefix: "相关公开写作材料：",
      noProjectMatch: "公开网站包含项目材料，但没有匹配到具体项目。建议从项目页面开始查看。",
      noWritingMatch: "公开网站没有列出与该问题匹配的发表或笔记。"
    },
    labels: {
      readingLevel: {
        introductory: "入门",
        intermediate: "中级",
        advanced: "高级"
      },
      status: {
        planned: "计划中",
        active: "进行中",
        paused: "暂停",
        complete: "已完成"
      },
      galleryCategory: {
        academic: "学术",
        campus: "校园",
        travel: "旅行",
        "daily-life": "日常",
        events: "活动",
        workspace: "学习空间"
      },
      peopleCategory: {
        mentor: "导师",
        collaborator: "合作者",
        lab: "实验室",
        peer: "同伴",
        advisor: "顾问",
        other: "其他"
      }
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function interpolate(template: string, values: Record<string, string | number | undefined>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value ?? "")), template);
}
