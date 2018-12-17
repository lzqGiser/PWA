# adunion-hc


# 脚手架说明

> PWA demo


# 脚手架说明

> webpack脚手架（多页面版）

## 基本功能
> 脚手架  1.0版本，修改打包单页面应用为多页面应用，引入eslint工具，目前代码风格采用airbnb。

## 安装开发环境

```
# 安装项目依赖
npm install  or  yarn install

# 启动开发模式 本地地址：localhost:8080
npm run dev  or  yarn run dev

# 本地构建生产环境代码 （点评code会自动构建，发到code端代码本地无需构建）
npm run build  or  yarn run build

# 生产环境下查看 bundle analyzer report
npm run build --report
```

## 基本使用
### 页面目录
> 源代码全部位于src路径下，其中app中为页面基本内容，单个页面（html）新建一个文件名称（示例home），文件夹
下index.html是页面模版文件，index.js是js入口文件（类比main.js或app.js），脚手架会自动
以该文件夹名称作为最终输出的html页面名称（示例home文件夹中）。

### 开发模式下访问页面
> 开发模式下，脚手架自动打开浏览器页面后，输入页面名称。默认情况，执行npm run dev会自动打开home.html;

> 例如在localhost:8080打开页面，此时如果访问home，则输入localhost:8080/home.html就可以看到所访问的页面内容

### 开发环境下，如何自动打开当前开发页面？
> 开发模式下，往往RD开发的只是其中一个页面，所以在热更新的只打开开发页面就好。此时可以进行设置。脚手架工具的config目录下，
配置dev对象的defaultPage属性为页面名称相对路径（默认为'／home.html'）

> 如果你拥有多个页面，且需要频繁切换开发页面，此时如果每次都需要修改config文件的默认页面值比较麻烦，此时你可以使用
'-op/pageName' 来在命令行写入你要默认打开的页面名称；例如：执行npm run dev -op/home; 就会为您打开／home.html。如果没有写该参数，则
依旧会打开默认的页面；






