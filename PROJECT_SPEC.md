# PROJECT SPEC
## Project Name
Modular Personal Website Template with AI-Powered Personal Knowledge Assistant

## 1. Product Vision
Build a production-quality, modular personal website template system that supports both traditional personal homepage features and an integrated AI assistant.

The site should allow visitors to:
- browse the owner's profile, projects, writings, publications, and contact info
- ask natural-language questions about the owner's public materials
- receive grounded answers based on the site's content and configurable owner instructions
- be routed to relevant pages, links, or contact actions

The project should be reusable as a template for different users, not just a one-off website.

## 2. Core Product Goals
The system must:
1. provide a high-quality modular personal website
2. support multiple content types (profile, projects, posts, publications, FAQs)
3. include an AI assistant page and global chat entry
4. use source-grounded retrieval over the owner's public materials
5. support configurable answering style and behavior
6. support inexpensive external LLM providers through a provider abstraction layer
7. be deployable as a modern frontend app with a lightweight backend/API layer

## 3. Primary Use Cases
### A. Standard personal website
- About me
- Projects
- Resume/CV
- Notes/blog
- Publications
- Contact

### B. AI-guided visitor interaction
- “What does this person work on?”
- “Summarize this project for a beginner.”
- “Which article should I read first?”
- “What collaborations are they interested in?”
- “How can I contact them?”

### C. Site navigation assistant
The AI assistant should not only answer questions but also direct visitors to relevant pages and links.

## 4. Target Users
- students
- researchers
- PhD applicants
- developers
- creators with personal portfolios

## 5. Non-goals for MVP
Do NOT build:
- full multi-user auth
- payment system
- complex admin dashboard with role management
- large database-backed CMS
- fine-tuning pipeline
- advanced analytics platform

These can be left as extension hooks.

## 6. Tech Stack
Use:
- Next.js
- TypeScript
- Tailwind CSS
- file-based content (Markdown/JSON/YAML)
- a lightweight server/API layer for AI orchestration
- clean component architecture

Prefer static-friendly architecture where possible.

## 7. Site Architecture
### Top-level routes
- /
- /about
- /projects
- /projects/[slug]
- /publications
- /notes
- /notes/[slug]
- /cv
- /contact
- /ask

### Global UI
- navbar
- footer
- theme switcher
- command/quick navigation if helpful
- global “Ask My AI” entry

## 8. Modular Section System
Create reusable sections/components:
- Navbar
- Hero
- AboutSummary
- Stats
- SkillsOrInterests
- FeaturedProjects
- ExperienceTimeline
- PublicationsPreview
- LatestNotes
- ContactCTA
- Footer

Requirements:
- each section must be enable/disable configurable
- section order should be configurable on the homepage
- section variants should be supported where reasonable
- missing data should degrade gracefully

## 9. Content Model
Design a reusable content schema.

### Profile
- name
- title
- tagline
- avatar
- bio
- location
- affiliation
- interests
- links
- contact channels

### Projects
- slug
- title
- subtitle
- summary
- full description
- tags
- links
- images
- featured
- date
- status

### Publications
- title
- authors
- venue
- year
- abstract
- links
- tags

### Notes/Posts
- slug
- title
- date
- summary
- body
- tags
- reading level

### FAQ / AI seed content
- question
- answer
- category

### AI instructions
- tone
- style
- allowed behavior
- forbidden behavior
- routing guidance
- uncertainty policy

## 10. AI Assistant Requirements
Build a personal knowledge assistant that:
- answers based on the owner’s public materials
- does not fabricate missing facts
- can summarize projects, notes, and publications
- can introduce the owner
- can recommend relevant reading paths
- can route users to pages and contact methods
- can politely refuse questions outside scope

### Assistant positioning
The assistant represents the owner’s public materials, but should not impersonate the owner for private or formal commitments.

## 11. AI System Design
Implement a simple but clean RAG-style pipeline.

### Required stages
1. accept visitor query
2. classify the query
3. retrieve relevant sources from local site content
4. compose a structured prompt from:
   - assistant system role
   - owner instructions
   - retrieved content
   - safety/behavior rules
5. call a configurable LLM provider
6. return:
   - answer
   - relevant source references
   - suggested next links/actions

### Query classes
At minimum:
- profile/background
- projects
- publications/writings
- site navigation
- collaboration/contact
- out-of-scope

## 12. Provider Abstraction Layer
Do not hardcode one provider.

Implement a provider interface supporting:
- provider name
- base URL
- API key via env
- model name
- request adapter
- response adapter

Target MVP support:
- OpenAI-compatible provider abstraction
- DeepSeek-compatible integration path
- future-friendly architecture for adding other providers

## 13. AI UX
### Global entry
- floating chat button or navbar entry

### Dedicated page
`/ask` page with:
- welcome text
- suggested questions
- chat panel
- source references area
- quick links

### Suggested questions
Seed with useful examples.

### Source transparency
Show the content sources used for the answer when available.

## 14. Safety and Trust Requirements
The assistant must:
- never invent publications, projects, or affiliations
- clearly say when information is unavailable
- answer only from site-provided/public content
- avoid private commitments on behalf of the owner
- avoid high-risk professional advice
- redirect formal requests to real contact channels

## 15. Admin / Configuration Layer
Implement a lightweight configuration system for the owner.

The owner should be able to edit:
- profile data
- homepage section order
- projects/posts/publications
- AI instructions
- suggested questions
- provider config via environment/config files

A full admin UI is optional for MVP; file-based config is sufficient.

## 16. Design System
Create a clean, premium, reusable visual system:
- excellent typography hierarchy
- responsive layout
- consistent spacing and card language
- dark/light mode
- good empty/loading/error states
- modern but restrained style
- suitable for both academic and developer personas

Support at least two demo personas:
1. academic researcher
2. developer / builder

## 17. Required Deliverables
By the end of MVP, the repo must include:
- working multi-page website
- modular homepage system
- AI assistant page
- content retrieval pipeline
- provider abstraction layer
- two demo content presets
- README
- setup instructions
- environment example
- deployment notes

## 18. Quality Bar
Before considering a batch complete:
- app builds successfully
- no major type errors
- no obvious broken navigation
- key pages render with demo data
- AI route handles success, empty retrieval, and provider failure
- code is organized and readable
- README is updated

## 19. Working Style for Codex
Important:
- Work in large coherent batches, not tiny micro-edits.
- Do not stop after every small step.
- Only stop at meaningful batch boundaries.
- Make reasonable assumptions when blocked by minor choices.
- Ask only when a decision is irreversible or product-defining.
- Prefer completing a rough but working vertical slice over leaving many half-finished parts.
- After each batch, provide:
  1. what was built
  2. files changed
  3. remaining risks
  4. exact commands to run
  5. next recommended batch

## 20. First milestone priority
Prioritize in this order:
1. repo scaffold + design system + routing
2. modular homepage + content model
3. projects/notes/publications pages
4. /ask page UI + AI API route skeleton
5. retrieval pipeline + provider abstraction
6. polish + docs + demo content
