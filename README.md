# Xxl job admin 前端 - 基于Ant Design Pro

## 预备环境

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## 一些命令

注: 所有命令均可在`packge.json`里找到 

### 启动项目


使用mock数据(不连接后端)
```bash
npm start
```
连接后端(须在config/proxy.ts里配置后端地址)
```bash
npm run start:no-mock
```

### Build项目

```bash
npm run build
```

### 检查代码规范

```bash
npm run lint
```

```bash
npm run lint:fix
```

### 测试代码

```bash
npm test
```

## 部署相关 
nginx配置  

```
server {
    listen       80;
    server_name  localhost;

    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        # root   /usr/share/nginx/html;
        root   /usr/share/nginx/html/scheduler;
        index  index.html index.htm;
	try_files $uri $uri/ /index.html;
    }

    # 10.1.8.77 为后端ip 
    # 如果后端改了根路径   需要将xxl-job-admin 换成你修改后的路径 
		# 
    location /rest {
        proxy_pass http://10.1.8.77:8080/xxl-job-admin/rest/;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP         $remote_addr;
    }

    location /jobcode {
        proxy_pass http://10.1.8.77:8080/xxl-job-admin/jobcode;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP         $remote_addr;
    }

    location /xxl-job-admin/jobcode/save {
        proxy_pass http://10.1.8.77:8080/xxl-job-admin/jobcode/save;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP         $remote_addr;
    }

    location /xxl-job-admin/static {
        proxy_pass http://10.1.8.77:8080/xxl-job-admin/static;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP         $remote_addr;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

<++>

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
