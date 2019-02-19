# 你好，欢迎来到 rock-bottom

你有梦想
你有魂牵梦萦的人
...还是多努力吧 💪

![](readme/IMG_4338.jpg)

* **这个项目呢，是给自己用的一个小 demo ， 代码以及 git 相关的东西多有不善，反正不会有人光顾，对么🧐，那么，这个项目呢，是一个可以生成练习题的软件，有服务端和客户端，要是你真有闲心居然要使用的话，有已经部署到公网的 web api，也就是 github 项目的项目官网， 客户端的话是 react-native 的，不过只适配了 iOS ，总之呢，这样一个自用的小项目，写 md 也是为了让它完完整整的。（不过还是说一句吧，不要尝试在脱离客户端的情况下直接请求 api ）**

- - - -
# TODO
- [ ] 增加用户概念
- [ ] 增加通用题库练习生成(现有代码有实现过微量封装，只要继续微量封装，就可以摆脱单一性，面向更多类型的题目)
- [ ] 增强题目出现以及复现
- [ ] 优化生成练习速度
- [ ] 优化给出目标题目的速度
- [ ] 优化题目编号生成方案
- [ ] 优化题目的展现方式（Html —> PDF 或更佳，原来是因为 PDF 有些图片无法加载，务必避免踩坑）

- - - -

# 如果你真的要使用（也留给未来的我自己😭）
首先，要运行 fetchTask 中的可执行程序， 项目中是 mac 平台的，自行生成的话，在 fetchTask 目录下运行 `go build ./`就OK了， 本机的话运行大概30秒就好了（我也不知道多久会好的说😭），服务端运行的话可以开个 screen 一直运行， 会间隔 12小时 重复执行任务 ，不过这已经在作者的服务器部署好一次了，要是不愿意做，就别做了吧，接着，Web api 也是部署好了的，如果自行部署，在项目根目录运行命令 `yarn && yarn start`，会监听 `3000` 端口， 依赖了 MongoDB， 数据库中有 科目的 collection, 对应一个链接， 还有一个 classification 的 collection， 每一个对应一个代表详细分类的json，json 的形式大概如下（摘自部分真实数据）
```
“高中数学题库(MongoDB collection 的 key, 以下为上述 json)”： {
	"+算法与框图(一级分类)": {
      "+算法与程序框图(二级分类)": {
        "程序框图(三级分类，分类前无+号代表无字分类，值为对应链接)": "/gshuxue/lid/340",
        "输入语句、输出语句和赋值语句": "/gshuxue/lid/342",
        "算法案例": "/gshuxue/lid/343",
        "条件语句、循环语句": "/gshuxue/lid/346",
        "算法的概念": "/gshuxue/lid/339"
      },
      "+框图": {
        "流程图": "/gshuxue/lid/344",
        "结构图": "/gshuxue/lid/345"
      }
    }
}
```
除了上述情况，还有一些各例是不存在三级分类（再次摘自部分真实数据）
```
"初中英语题库": {
 "+词汇": {
      "单词、词组": {
        "null(无三级分类的情况下以null代替，实则是二级分类直接对应链接)": "/cyingyu/lid/3622"
      },
      "字母": {
        "null": "/cyingyu/lid/3634"
      },
      "语音": {
        "null": "/cyingyu/lid/3635"
      }
    },
}
```
然后就没有什么特别的东西了
# Web Api
## */api/get/subject*
获取所有科目及其对应链接
示例请求：::http://wangyijie.tk/api/get/subject::
返回：
```
{
  "subject": {
    "初中物理题库": "https://tiku.yixuela.com/cwuli",
    "初中化学题库": "https://tiku.yixuela.com/chuaxue",
    "高中英语题库": "https://tiku.yixuela.com/gyingyu",
    "高中历史题库": "https://tiku.yixuela.com/glishi",
    "高中地理题库": "https://tiku.yixuela.com/gdili",
    "初中地理题库": "https://tiku.yixuela.com/cdili",
    "初中英语题库": "https://tiku.yixuela.com/cyingyu",
    "高中物理题库": "https://tiku.yixuela.com/gwuli",
    "高中化学题库": "https://tiku.yixuela.com/ghuaxue",
    "初中语文题库": "https://tiku.yixuela.com/cyuwen",
    "初中数学题库": "https://tiku.yixuela.com/cshuxue",
    "高中生物题库": "https://tiku.yixuela.com/gshengwu",
    "初中政治题库": "https://tiku.yixuela.com/czhengzhi",
    "初中历史题库": "https://tiku.yixuela.com/clishi",
    "高中语文题库": "https://tiku.yixuela.com/gyuwen",
    "高中数学题库": "https://tiku.yixuela.com/gshuxue",
    "高中政治题库": "https://tiku.yixuela.com/gzhengzhi",
    "初中生物题库": "https://tiku.yixuela.com/cshengwu"
  }
}

```

## */api/get/classification?subject=‘%wd%’*
根据第一个 api 获取到的json的任何一个key来替换‘%wd%’，来得到具体的分类信息
示例请求：::http://wangyijie.tk/api/get/classification?subject=高中数学题库::
返回：
```
{
  "classification": {
    "+算法与框图": {
      "+算法与程序框图": {
        "程序框图": "/gshuxue/lid/340",
        "输入语句、输出语句和赋值语句": "/gshuxue/lid/342",
        "算法案例": "/gshuxue/lid/343",
        "条件语句、循环语句": "/gshuxue/lid/346",
        "算法的概念": "/gshuxue/lid/339"
      },
      "+框图": {
        "流程图": "/gshuxue/lid/344",
        "结构图": "/gshuxue/lid/345"
      }
    },
    "+集合与常用逻辑用语": {
      "+集合": {
        "集合间交、并、补的运算（用Venn图表示）": "/gshuxue/lid/138",
        "集合间的基本关系": "/gshuxue/lid/141",
        "集合的含义及表示": "/gshuxue/lid/148"
      },
      "+常用逻辑用语": {
        "简单的逻辑联结词": "/gshuxue/lid/177",
        "四种命题及其相互关系": "/gshuxue/lid/164",
        "充分条件与必要条件": "/gshuxue/lid/166",
        "真命题、假命题": "/gshuxue/lid/168",
        "全称量词与存在性量词": "/gshuxue/lid/176"
      }
    },
	...... ∞ more
}

```

## */api/user/get/range?fl=‘%wd% (like) ‘gshuxue’’&id=‘%wd%’&count=‘%wd%’*
获取要生成练习的目标题目的 id, 其中 fl 的值是上一个 api 每一个链接中的第一个被两个斜杠夹着的部分， 就像 _::gshuxue::_lid_176， id 则是 /gshuxue_lid/::176::，count是题目数量， 默认为 20， 这个可能比较慢，因为要检查所有题目的可用性, `//TODO`
示例请求：::http://wangyijie.tk/api/user/get/range?id=141&fl=gshuxue::
返回：
```
[
  244889,
  245730,
  245030,
  245438,
  245230,
  245880,
  245702,
  245721,
  245573,
  245561,
  245641,
  245448,
  245223,
  245321,
  244760,
  245475,
  245883,
  245504,
  245377,
  245606
]
```
在这里请求过的题目 id 都会被记录在数据库中的 user 表 中的 did 字段， 不会再一次出现，不过题目的出现以及复出现处理也许是一个`//TODO`

## */service/detail/get?title=‘%wd%’&id=‘%wds%.join(‘,’)’*
用于生成练习的，当然包含了题目·答案·分析， title 参数完全是可以自定义的，显示为练习最上面的大标题，id 参数是上一个 api 获取到的数组序列化成以半角逗号隔开的字符串(我这个 url 参数值是不是写得很形象🤪)，当然也可以是自己自由组合的，前提是题目 id 要存在， 生成器会忽略不存在的，该 api 也可能稍慢，待优化 `//TODO`
示例请求：::http://wangyijie.tk/service/detail/get?title=休闲练习&id=245573,245561,245641::(想输修仙练习的说，这输入法。。。)
返回：
```
{
  "do": "688.8287504015877wyj.do",
  "ta": "1325.0745550342224wyj.ta",
  "an": "271.16303812565604wyj.am"
}
```
do是在要获取题目时要用到的
ta是在要获取解析时要用到的
an是在要获取答案是要用到的
具体使用看下面
唯一码用到随机数的形式，待更新的生成方式 ,另外注意 hash 生成中的 / 符号 `//TODO`

## */service/detail/pdf?name=‘%wd% -> [‘an’, ‘ta, ‘do’]’*
name字段就是上一个 api 的任意一个 value 啦， 虽说是 pdf ，但是呢，
其实是 Html 😨 so, `//TODO`
示例请求：::http://wangyijie.tk/service/detail/pdf?name=688.8287504015877wyj.do.html::
返回：

![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.14.24.png)
然后该怎样怎样打印下来就行了
其中生成的题号下会有一个淡淡的长串数字，要是有题目有问题则可以通过这个题目 id 来检查或者报告 Bug

- - - -
# 当然是不可能这么麻烦的，是有客户端的呀
目前只适配 iOS 客户端，需先在 nativeClient 目录下执行 `yarn` 接着打开ios目录下的 Xcode 项目， 修改一下 Team 然后再 运行

## 看效果

![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.48.14.png) 
![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.48.57.png)

![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.49.55.png)


![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.50.04.png)
![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.50.21.png)
输入练习标题
![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.50.26.png)
这其实是一个加载动画

![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.50.41.png)
选择生成好的练习
![](readme/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-02-19%20%E4%B8%8B%E5%8D%885.50.52.png)
完成✅
