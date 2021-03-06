const canvas = document.querySelector(".canvas");
const tools = document.querySelector(".tools");
const colors = document.querySelector(".colors");
const widths = document.querySelector(".widths");

// 获取 tools 元素的位置信息
const {height: toolsH} = tools.getBoundingClientRect();
// 获取 document 元素的宽高
const {clientWidth, clientHeight} = document.documentElement;
canvas.width = clientWidth;
canvas.height = clientHeight - toolsH;
// canvas 设置
let ctx = canvas.getContext("2d");
ctx.lineJoin = "round"; // 修改两线段之间的连接

// tools
let color = "blank"; // 默认颜色
let width = 10;
getColor();
getWidth();
// 切换颜色
colors.addEventListener("click", getColor);
widths.addEventListener("click", getWidth);

// 控制绘画的属性
let painting = false;
let lastPosition;

// 切换粗细
function getWidth(e){
    width = e ? window.getComputedStyle(e.target, "::after")["width"] : width;
    ctx.lineWidth = parseInt(width);
    console.log(parseInt(width))

}

// 切换颜色
function getColor(e){
    // 获取点击元素的 bg-color
    color = e ? window.getComputedStyle(e.target, null)["background-color"] : color;
    ctx.strokeStyle = color;
}

// painting
// 判断当前是否能使用 触摸 事件
const flag = "ontouchstart" in document.documentElement;
flag ? phonePainting() : windowPainting();

// 移动端绘画
function phonePainting() {
    canvas.addEventListener("touchstart", (e) => {
        painting = true;
        lastPosition = [e.clientX, e.clientY - 100];
    });
    canvas.addEventListener("touchmove", (e) => {
        const {clientX, clientY} = e.touches[0];
        draw(lastPosition, clientX, clientY - 100);
        lastPosition = [clientX, clientY - 100];
    });
}

// PC端绘画
function windowPainting() {
    canvas.addEventListener("mousedown", (e) => {
        painting = true;
        lastPosition = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener("mousemove", (e) => {
        if (painting) {
            const {offsetX, offsetY} = e;
            draw(lastPosition, offsetX, offsetY);
            lastPosition = [offsetX, offsetY];
        }
    });

    canvas.addEventListener("mouseup", noPainting);

    canvas.addEventListener("mouseleave", noPainting);
}

// 关闭绘画
function noPainting() {
    painting = false;
}


// 绘画
function draw(lastPosition, newX, newY) {
    ctx.beginPath();
    ctx.moveTo(lastPosition[0], lastPosition[1]);
    ctx.lineTo(newX, newY);
    ctx.closePath();
    ctx.stroke();
}
