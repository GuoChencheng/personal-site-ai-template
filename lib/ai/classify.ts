import type { QueryClass } from "@/lib/ai/types";

const classKeywords: Array<{ queryClass: QueryClass; keywords: string[] }> = [
  {
    queryClass: "collaboration-contact",
    keywords: ["contact", "email", "collaborate", "collaboration", "hire", "available", "availability", "reach", "meeting", "联系", "邮箱", "合作", "招聘", "可用", "会议"]
  },
  {
    queryClass: "projects",
    keywords: ["project", "portfolio", "build", "built", "work", "demo", "tool", "dashboard", "template", "项目", "作品", "构建", "工具", "仪表盘", "模板"]
  },
  {
    queryClass: "publications-writings",
    keywords: ["publication", "paper", "writing", "note", "article", "blog", "read", "research", "venue", "发表", "论文", "写作", "笔记", "文章", "阅读", "研究"]
  },
  {
    queryClass: "site-navigation",
    keywords: ["where", "page", "link", "navigate", "find", "cv", "resume", "about", "route", "site", "gallery", "photo", "album", "people", "mentor", "collaborator", "哪里", "页面", "链接", "导航", "找到", "简历", "关于", "网站", "相册", "照片", "人物", "导师", "合作者"]
  },
  {
    queryClass: "profile-background",
    keywords: ["who", "background", "profile", "bio", "about", "focus", "interest", "affiliation", "location", "mentor", "advisor", "collaborator", "lab", "谁", "背景", "资料", "简介", "关注", "兴趣", "机构", "所在地", "主要", "导师", "顾问", "合作者", "实验室"]
  }
];

const outOfScopeKeywords = [
  "password",
  "private",
  "secret",
  "salary",
  "medical",
  "diagnosis",
  "legal advice",
  "investment",
  "bank",
  "credit card"
];

export function classifyQuery(query: string): QueryClass {
  const normalized = query.toLowerCase();
  if (!normalized.trim()) return "out-of-scope";
  if (outOfScopeKeywords.some((keyword) => normalized.includes(keyword))) return "out-of-scope";
  if (normalized.includes("what kind of work") || normalized.includes("work does") || normalized.includes("work on")) {
    return "profile-background";
  }

  let best: { queryClass: QueryClass; score: number } = { queryClass: "profile-background", score: 0 };
  for (const item of classKeywords) {
    const score = item.keywords.reduce((total, keyword) => total + (normalized.includes(keyword) ? 1 : 0), 0);
    if (score > best.score) best = { queryClass: item.queryClass, score };
  }

  return best.score > 0 ? best.queryClass : "out-of-scope";
}
