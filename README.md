# 创客新媒 — 学生新媒体组织官网

技术栈：React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Supabase（Auth / Database / Storage），前端部署在 Vercel。

---

## 快速开始（Demo 模式，零配置）

```bash
npm install
npm run dev
```

未配置 Supabase 时项目自动运行在 **Demo 模式**：数据存在 `localStorage`，注册、登录、上传图片、编辑资料均可在本地体验。

---

# Supabase + Vercel 部署完全指南（零基础版）

跟着下面步骤走即可上线，全程约 20~40 分钟。

## 第 1 步：注册 Supabase

1. 打开 [https://supabase.com](https://supabase.com)
2. 用 **GitHub 账号**（或邮箱）注册 / 登录
3. 国内可正常访问控制台；免费额度对学生组织完全够用

## 第 2 步：创建项目

1. 控制台首页点「**New project / 新建项目**」
2. 项目名：`chuangke-xinmei`
3. 设置一个**数据库密码**（自己保存好，部署网站用不到，但要留底）
4. 区域选 **Northeast Asia (Tokyo)** 或 **Southeast Asia (Singapore)**（离国内近）
5. 等待约 2 分钟，项目初始化完成

## 第 3 步：初始化数据库（一键 SQL）

1. 左侧菜单点「**SQL Editor**」→「New query」
2. 用记事本打开项目里的 [supabase/schema.sql](./supabase/schema.sql)，**全部复制**粘贴进去
3. 点「**Run**」，看到 Success 即完成

这一个脚本会自动创建：

- `members` 表（部员信息）和 `works` 表（作品）
- **注册触发器**：新用户注册后自动在 members 表建档（含姓名、届别）
- 全部 **RLS 行级安全策略**（公开可读、仅本人可写、届别不可改）
- 三个**公开存储桶**：`avatars` / `backgrounds` / `works` 及读写策略（含图片类型与 5/10/20MB 大小限制）
- Realtime 实时同步配置

## 第 4 步：关闭邮箱验证（学生组织建议关闭）

Supabase 默认要求新用户点邮件确认链接，这会导致注册后无法自动登录。学生内部网站建议关闭：

1. 左侧菜单「**Authentication**」→「**Providers** / Sign In Providers」
2. 点开「**Email**」
3. 关闭「**Confirm email**」开关 → Save

> 想保留邮箱验证也行，但注册后需先去邮箱点确认链接才能登录，系统会给出中文提示。

## 第 5 步：获取密钥并填到本地

1. 左侧菜单「**Project Settings**（齿轮图标）→ **API**」
2. 找到两个值：
   - **Project URL**：`https://xxxxxxxx.supabase.co`
   - **anon public** 密钥（一长串字符，公开密钥，可用于前端）
3. 在项目根目录把 `.env.example` 复制为 `.env.local`，填入：

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi....你的anon密钥
```

4. 本地运行 `npm run dev`，注册一个账号试试——数据已经真实写入 Supabase

> ⚠️ `.env.local` 已在 `.gitignore` 中，不会被提交。anon key 是前端公开标识，安全靠 RLS 策略保障，泄露不影响安全。

## 第 6 步：注册 Vercel 并导入项目

1. 打开 [https://vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 先把本项目代码推送到你自己的 GitHub 仓库
3. Vercel 控制台点「**Add New → Project**」→ 选择该仓库 →「Import」
4. 框架会自动识别为 **Vite**（Build Command `npm run build`、Output Directory `dist` 均已在 [vercel.json](./vercel.json) 配好，无需修改）

## 第 7 步：在 Vercel 配置环境变量

在部署设置页展开「**Environment Variables**」，添加两条（与本地 `.env.local` 相同）：

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

点「**Deploy**」，1~2 分钟后得到正式网址：`https://你的项目名.vercel.app` 🎉

## 第 8 步：在 Supabase 允许该网址（重要）

为了让登录跳转和图片显示正常：

1. Supabase 控制台 →「**Authentication → URL Configuration**」
2. **Site URL** 填你的 Vercel 主域名，如 `https://chuangke-xinmei.vercel.app`
3. **Redirect URLs** 添加 `https://chuangke-xinmei.vercel.app/**`

## 第 9 步：后续更新

- **方式一（推荐）**：`git push` 到 GitHub，Vercel 会自动重新部署
- **方式二（命令行）**：
  ```bash
  npm run vercel:login   # 首次登录（浏览器授权）
  npm run deploy         # 构建并部署到生产环境
  npm run deploy:preview # 只生成预览地址，不影响正式站
  ```

---

## 数据库表结构

### members（部员表）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid PK | 等于 `auth.users.id`，注册时触发器自动建档 |
| `name` | text | 姓名 / 昵称 |
| `avatar` | text | 头像公开 URL |
| `batch` | int4 | 届别年份（如 2026），注册后不可修改 |
| `role` | text | 角色，默认「部员」 |
| `bio` | text | 一句话签名 |
| `description` | text | 自我介绍长文 |
| `tags` | text[] | 技能标签数组 |
| `social_links` | jsonb | 社交链接 `[{platform, url}]` |
| `background_image` | text | 个人主页背景图 URL |
| `email` | text | 邮箱 |
| `created_at` | timestamptz | 注册时间 |

### works（作品表）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | uuid PK | 自动生成 |
| `member_id` | uuid FK → members.id | 作者 |
| `title` | text | 标题 |
| `type` | enum | `photo` / `poster` / `video` |
| `image_url` | text | 图片公开 URL |
| `description` | text | 作品描述 |
| `created_at` | timestamptz | 发布时间 |

### Storage 存储桶（均为公开读）

| 桶 | 路径 | 写权限 | 限制 |
|---|---|---|---|
| `avatars` | `{uid}/avatar.jpg` | 仅本人 | jpeg/png/webp/gif，≤ 5MB |
| `backgrounds` | `{uid}/bg.jpg` | 仅本人 | jpeg/png/webp/gif，≤ 10MB |
| `works` | `{uid}/{workId}.jpg` | 仅本人 | jpeg/png/webp/gif，≤ 20MB |

## RLS 安全策略摘要

- **members**：所有人可读；只能插入/更新 `id = auth.uid()` 的记录；更新时 `batch` 不得变化；禁止删除
- **works**：所有人可读；`member_id = auth.uid()` 才能增删改
- **storage**：三个桶所有人可读；只有路径首段 uid 等于登录用户才能写，并校验类型与大小

## 实时同步

四个数据 hooks 全部基于 Supabase Realtime（`postgres_changes`）：

- 新成员注册 → 所有打开星光墙的人立刻看到
- 编辑资料 → 个人主页、星光墙实时更新
- 发布/删除作品 → 作品墙、个人主页实时更新

（schema.sql 已把两张表加入 `supabase_realtime` 发布，无需额外设置。）

---

## 可用脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | 类型检查 + 生产构建（输出 `dist/`） |
| `npm run preview` | 本地预览构建产物 |
| `npm run vercel:login` | 登录 Vercel CLI |
| `npm run deploy` | 构建并部署到 Vercel 生产环境 |
| `npm run deploy:preview` | 部署预览版本 |

## 项目结构

```
src/
  supabase/       Supabase 客户端 + auth/database/storage 封装
  hooks/          数据 hooks（Realtime 实时订阅；无配置时走 Demo）
  context/        AuthContext
  pages/          页面（首页/星光墙/个人主页/作品墙/登录注册/个人中心）
  components/     通用组件
  lib/            Demo 模式 localStorage 存储
  types/          TypeScript 类型
supabase/schema.sql  数据库一键初始化脚本（表+触发器+RLS+存储桶）
vercel.json      Vercel 部署配置（SPA 重写 + 缓存头）
.env.example     环境变量模板（复制为 .env.local 填写）
```

## 常见问题

**Q: 注册提示「邮箱尚未完成验证」？**
- 按第 4 步在 Authentication → Email 里关闭 Confirm email；或先去邮箱点确认链接

**Q: 注册成功但星光墙看不到自己？**
- schema.sql 没执行或触发器缺失。重新执行一次 schema.sql（脚本幂等，可反复运行）

**Q: 图片上传报权限错误？**
- 检查 SQL 是否完整执行（Storage 部分）、文件类型是否为 jpeg/png/webp/gif、大小是否超限
- Supabase 控制台 → Storage 里应能看到 avatars / backgrounds / works 三个 public 桶

**Q: 页面数据不实时更新？**
- schema.sql 的 Realtime 发布段落没生效；重新执行该脚本，或在控制台 Database → Replication 中确认两张表已加入 supabase_realtime

**Q: Vercel 部署后是空白页？**
- 90% 是环境变量没配：Vercel → 项目 → Settings → Environment Variables 补两条后重新 Deploy

**Q: 登录后跳转异常 / 回调报错？**
- 检查第 8 步的 Site URL 与 Redirect URLs 是否包含你的 Vercel 域名

---

> 创客新媒 · Create · Media · Beyond
