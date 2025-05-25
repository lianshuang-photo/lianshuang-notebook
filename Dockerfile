# 使用Python 3.12作为基础镜像
FROM python:3.12-slim

WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TZ=Asia/Shanghai

# 安装依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY server/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码
COPY server/ /app/server/
COPY web/dist/ /app/web/dist/
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# 初始化数据库和静态文件
RUN cd /app/server && \
    python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py collectstatic --noinput

# 创建超级管理员
RUN cd /app/server && \
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'lsnote123')" | python manage.py shell

# 暴露端口
EXPOSE 8000 80

# 启动服务
CMD ["bash", "-c", "cd /app/server && gunicorn server.wsgi:application --bind 0.0.0.0:8000"] 
 
 