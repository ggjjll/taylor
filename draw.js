let cw;
let ch;
let ctx = null;
let areaP = 0.8;

let n = 20;
let r = Math.PI / 2;
let type = 'cos';

function initCanvas() {
  let $canvas = document.getElementById('canvas');
  cw = $canvas.width = $canvas.offsetWidth;
  ch = $canvas.height = $canvas.offsetHeight;
  ctx = $canvas.getContext('2d');
  ctx.clearRect(0, 0, cw, ch);
  ctx.font = `${ch * areaP * 0.05}px serif`;
  draw();
}

window.onload = () => {
  addEvent();
  initCanvas();
};
window.onresize = initCanvas;

/**
 * 绘图相关
 * */
function draw() {
  ctx.save();
  ctx.translate((1 - areaP) / 2 * cw, 0.5 * ch);
  coordinateX();
  coordinateY();
  sinR();
  lineAndPoint();
  ctx.restore();
}

// 绘制坐标轴 X
function coordinateX() {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(cw * areaP, 0);
  ctx.stroke();
  ctx.closePath();
  for(let i = 0; i <= n; i ++) {
    // 竖线
    let p = i / n;
    let x = cw * areaP * p;
    let y = ch * areaP * 0.02;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    // 数字
    ctx.textAlign = 'center';
    if (0 === i) {
      x += ch * areaP * 0.02;
    }
    ctx.fillText(i, x, y + 30);
  }
}

// 绘制坐标轴 Y
function coordinateY() {
  ctx.beginPath();
  ctx.moveTo(ch * areaP * 0.02, - ch * areaP / 2);
  ctx.lineTo(0, - ch * areaP / 2);
  ctx.lineTo(0, ch * areaP / 2);
  ctx.lineTo(ch * areaP * 0.02, ch * areaP / 2);
  ctx.stroke();
  ctx.closePath();
  ctx.fillText(4, ch * areaP * 0.02 + 30, - ch * areaP / 2 + 10);
  ctx.fillText(-4, ch * areaP * 0.02 + 30, ch * areaP / 2 + 10);
}

// 获取点坐标
function getPoint(a, b) {
  let x = a / n * cw * areaP;
  let y = - ch * areaP * 0.5 * b / 4;
  return {x, y};
}

function sinR() {
  ctx.beginPath();
  ctx.strokeStyle = '#CC0033';
  ctx.lineWidth = 5;
  let num;
  if ('sin' === type) {
    num = Math.sin(r);
  } else {
    num = Math.cos(r);
  }
  let {x, y} = getPoint(0, num);
  ctx.moveTo(x, y);
  let {x: a, y: b} = getPoint(n, num);
  ctx.lineTo(a, b);
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.textAlign = 'right';
  ctx.fillText(`y=${type}(${r.toFixed(2)})`, a + 20, b - 20);
}

function lineAndPoint() {
  /**
   * sin(x) = E (-1)^(n-1)*x^(2*n+1)/(2*n+1)!
   * cos(x) = E (-1)^n*x^(2*n)/(2*n)！ + 1
   * */

  let points = [];
  ctx.strokeStyle = '#669999';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if ('sin' === type) {
    let an = r;
    let sum = r;
    let p = getPoint(1, an);
    p.num = an;
    points.push(p);
    let {x, y} = p;
    ctx.moveTo(x, y);
    for (let i = 2; i <= n; i ++) {
      an = - an * r * r / ((2 * i - 2) * (2 * i - 1));
      let p = getPoint(i, an);
      p.num = an;

      points.push(p);
      sum += an;
      let {x, y} = getPoint(i, sum);
      ctx.lineTo(x, y);
    }
  } else {
    let an = 1;
    let sum = 1;
    let p = getPoint(0, an);
    p.num = an;
    points.push(p);
    let {x, y} = p;
    ctx.moveTo(x, y);
    for (let i = 1; i <= n; i ++) {
      an = - an * r * r / ((2 * i - 1) * (2 * i));
      let p = getPoint(i, an);
      p.num = an;
      points.push(p);
      sum += an;
      let {x, y} = getPoint(i, sum);
      ctx.lineTo(x, y);
    }

  }
  ctx.stroke();
  ctx.closePath();
  drawPoint();

  function drawPoint() {
    ctx.storkeStyle = ctx.fillStyle = '#6600CC';
    for (let p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      ctx.textAlign = 'center';
      ctx.fillText(p.num.toFixed(3), p.x, p.y - 30);
    }
  }
}

/**
 * 数据相关
 * */
function addEvent() {
  let $type = document.getElementById('type');
  type = $type.value;
  $type.addEventListener('change', () => {
    type = $type.value;
    initCanvas();
  });
  let $r = document.getElementById('r');
  r = $r.value * Math.PI;
  $r.addEventListener('input', () => {
    r = $r.value;
    while (r < -1) {
      r += 2;
    }
    while (r > 1) {
      r -= 2;
    }
    r *= Math.PI;
    initCanvas();
  });
  let $n = document.getElementById('n');
  n = $n.value;
  $n.addEventListener('input', () => {
    n = $n.value;
    initCanvas();
  });
}