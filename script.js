/* =========================================================
   AI 工具导航站 - 交互脚本
   功能：1. 导航栏当前页高亮
         2. 工具库搜索过滤（按名称/简介/分类）
         3. 首页搜索框跳转到工具库并自动带关键词
         4. 收藏工具功能（★ 按钮 + 我的收藏栏 + localStorage 持久化）
   ========================================================= */

// ---------- 1. 导航栏当前页高亮 ----------
// 每个页面的 <body> 都带 data-page 属性（如 data-page="tools"），
// 导航链接带 data-target，值相同就加 .active 高亮
document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.dataset.target === document.body.dataset.page) {
        link.classList.add('active');
    }
});

// ---------- 2. 工具库搜索过滤 ----------
// 只有工具库页面有搜索框（id=toolSearch），先判断它是否存在
var searchInput = document.getElementById('toolSearch');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        var keyword = this.value.trim().toLowerCase();  // 关键词转小写
        var anyVisible = false;

        // 遍历每一张工具卡
        document.querySelectorAll('.tool-card').forEach(function (card) {
            // data-keywords 是工具的名称+分类（写在 HTML 里）
            var text = card.dataset.keywords.toLowerCase();
            var match = text.indexOf(keyword) !== -1;   // 包含即匹配
            card.style.display = match ? '' : 'none';   // 不匹配就隐藏
            if (match) anyVisible = true;
        });

        // 隐藏没有匹配结果的分类区块标题
        document.querySelectorAll('.cat-section').forEach(function (section) {
            // 区块内只要还有可见卡片就保留区块，全被隐藏就整个区块藏起来
            var hasVisible = Array.from(section.querySelectorAll('.tool-card'))
                .some(function (c) { return c.style.display !== 'none'; });
            section.style.display = hasVisible ? '' : 'none';
        });

        // 全部隐藏时显示"没有找到"提示
        var noResult = document.getElementById('noResult');
        if (noResult) {
            noResult.style.display = anyVisible ? 'none' : 'block';
        }
    });
}

// ---------- 3. 首页搜索跳转 ----------
// 只有首页有 form（id=homeSearchForm），提交时跳 tools.html?q=关键词
var homeForm = document.getElementById('homeSearchForm');
if (homeForm) {
    homeForm.addEventListener('submit', function (event) {
        event.preventDefault();  // 阻止表单默认刷新
        var keyword = document.getElementById('homeSearch').value.trim();
        if (keyword) {
            window.location.href = 'tools.html?q=' + encodeURIComponent(keyword);
        }
    });
}

// ---------- 4. 工具库接收 URL 参数并自动搜索 ----------
// 从 tools.html?q=xxx 里把 xxx 取出来，填进搜索框并触发过滤
function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

var toolSearchInput = document.getElementById('toolSearch');
var urlKeyword = getQueryParam('q');
if (toolSearchInput && urlKeyword) {
    toolSearchInput.value = urlKeyword;
    // 手动触发一次 input 事件，让过滤逻辑跑起来
    toolSearchInput.dispatchEvent(new Event('input'));
}

// ---------- 5. 收藏工具功能 ----------
// 用 localStorage 保存收藏，key 是 favTools
// 存储格式：JSON 数组，每一项是 { name: 工具名, url: 链接 }
// 首页和工具库共用同一个 key，所以两边的收藏状态是同步的

var FAV_KEY = 'favTools';   // localStorage 的存储键名

// 读取收藏列表：解析 localStorage 里的 JSON，没有或出错就返回空数组
function getFavs() {
    try {
        var data = localStorage.getItem(FAV_KEY);   // 取出字符串
        return data ? JSON.parse(data) : [];        // 有内容才解析，否则空数组
    } catch (e) {
        return [];                                  // 解析失败也返回空数组，防止页面报错
    }
}

// 保存收藏列表：把数组转成 JSON 字符串写回 localStorage
function saveFavs(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

// 判断某个工具是否已收藏（按工具名判断）
function isFav(name) {
    return getFavs().some(function (f) { return f.name === name; });
}

// 切换收藏状态：已收藏就移除，未收藏就加入；返回切换后的状态（true=已收藏）
function toggleFav(name, url) {
    var favs = getFavs();
    var idx = -1;
    for (var i = 0; i < favs.length; i++) {
        if (favs[i].name === name) { idx = i; break; }   // 找到同名工具
    }
    if (idx !== -1) {
        favs.splice(idx, 1);          // 找到了就删掉（取消收藏）
        saveFavs(favs);
        return false;
    } else {
        favs.push({ name: name, url: url });   // 没找到就加进去（收藏）
        saveFavs(favs);
        return true;
    }
}

// 给页面里每一张工具卡添加 ★ 按钮，并恢复已收藏的状态
function initFavButtons() {
    var cards = document.querySelectorAll('.tool-card');
    cards.forEach(function (card) {
        // 从卡片的 .tool-name 元素读工具名，从 .tool-link 读链接地址
        var nameEl = card.querySelector('.tool-name');
        var linkEl = card.querySelector('.tool-link');
        if (!nameEl || !linkEl) return;      // 安全保护：缺关键元素就跳过这张卡
        var name = nameEl.textContent.trim();
        var url = linkEl.getAttribute('href');

        // 创建 ★ 按钮
        var btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.textContent = '★';
        btn.title = '点击收藏/取消收藏';     // 鼠标悬停时的小提示
        if (isFav(name)) {                   // 如果之前已收藏，恢复金色样式
            btn.classList.add('faved');
            card.classList.add('faved');
        }

        // 点击按钮：切换收藏 → 更新按钮样式 → 刷新收藏栏
        btn.addEventListener('click', function () {
            var faved = toggleFav(name, url);
            btn.classList.toggle('faved', faved);   // 有/无 faved 类切换金色
            card.classList.toggle('faved', faved);  // 卡片边框也跟着高亮
            renderFavBar();                          // 刷新"我的收藏"栏
        });

        card.appendChild(btn);   // 把按钮放进卡片里
    });
}

// 渲染"我的收藏"栏：把收藏列表显示出来，并提供取消收藏按钮
function renderFavBar() {
    var bar = document.getElementById('favBar');
    var list = document.getElementById('favList');
    if (!bar || !list) return;            // 页面没有收藏栏就跳过
    var favs = getFavs();
    if (favs.length === 0) {              // 没有收藏时整个栏隐藏
        bar.style.display = 'none';
        return;
    }
    bar.style.display = '';               // 有收藏就显示
    list.innerHTML = '';                  // 先清空旧的列表再重建
    favs.forEach(function (f) {
        var item = document.createElement('div');
        item.className = 'fav-item';

        var link = document.createElement('a');
        link.href = f.url;                // 指向工具官网
        link.target = '_blank';           // 新窗口打开
        link.textContent = f.name;        // 显示工具名

        var rmBtn = document.createElement('button');
        rmBtn.className = 'fav-remove';
        rmBtn.textContent = '取消';
        rmBtn.addEventListener('click', function () {
            toggleFav(f.name, f.url);     // 取消收藏
            renderFavBar();               // 重绘收藏栏
            // 同步页面上对应工具卡的 ★ 状态
            document.querySelectorAll('.tool-card').forEach(function (card) {
                var n = card.querySelector('.tool-name');
                if (n && n.textContent.trim() === f.name) {
                    var b = card.querySelector('.fav-btn');
                    if (b) b.classList.remove('faved');
                    card.classList.remove('faved');
                }
            });
        });

        item.appendChild(link);
        item.appendChild(rmBtn);
        list.appendChild(item);
    });
}

// 页面加载完成后执行：给所有工具卡加按钮 + 渲染收藏栏
initFavButtons();
renderFavBar();
