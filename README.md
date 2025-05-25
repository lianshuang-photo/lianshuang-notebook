# LS笔记（LSNote）

## 项目介绍

LS笔记是一个现代化的markdown笔记应用，提供美观直观的用户界面和强大的功能。

主要特点：
1. **美观现代的UI**：基于TailwindCSS的响应式设计
2. **强大的笔记管理**：支持分组、权限管理和分享
3. **AI辅助功能**：笔记摘要、内容问答和写作辅助
4. **多用户支持**：用户角色和权限系统
5. **Markdown支持**：完整的Markdown编辑和渲染

## 技术栈

前端：
- Vue 3
- TailwindCSS
- Vite

后端：
- Django REST Framework
- SQLite/PostgreSQL
- JWT认证

## 快速开始

### Docker方式

最简单的方式是使用Docker Compose：

```bash
git clone https://github.com/yourusername/lsnote.git
cd lsnote
docker-compose up -d
```

然后访问 http://localhost

### 手动安装

1. 后端设置

```bash
cd lsnote/server
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

2. 前端设置

```bash
cd lsnote/web
npm install
npm run dev
```

## 用户角色

1. **普通用户**：创建和管理自己的笔记和笔记分组
2. **管理员用户**：可以看到全部用户的笔记和笔记分组，并可以为其他用户分配权限
3. **超级管理员**：系统配置权限，如配置第三方登录

## 功能说明

### 笔记管理

- 创建、编辑、删除笔记
- 笔记分组管理
- 笔记权限控制

### AI功能

- 笔记摘要生成
- 基于笔记内容的问答
- AI辅助写作
 
### 用户管理

- 用户注册和登录
- 第三方登录支持
- 用户偏好设置

## 贡献

欢迎提交Issue或Pull Request来完善项目。

## 安全配置

在将项目部署到生产环境或上传到公共仓库前，请确保以下安全措施：

### 环境变量

创建一个`.env`文件（不要提交到版本控制）包含以下配置：

```
# Django设置
DEBUG=0
DJANGO_SETTINGS_MODULE=server.settings
SECRET_KEY=your_secret_key_here  # 生成新的密钥

# 数据库路径
DB_PATH=/app/data

# 时区设置
TZ=Asia/Shanghai

# AI服务设置 
AI_API_KEY=your_api_key_here  # 你的AI API密钥
```

### 敏感数据

- 所有数据库文件 (`*.sqlite3`) 已被 .gitignore 排除
- 确保不要提交 `/data` 目录中的实际数据
- Docker部署时使用命名卷而非绑定挂载，防止数据泄露

### Docker安全

使用命名卷存储数据:
```yaml
volumes:
  - lsnote_data:/app/data/  # 使用命名卷，不要使用本地目录挂载
```

## 许可证

[MIT License](LICENSE) 
 
 