const dataInput = document.querySelector('#dataInput');
const chartType = document.querySelector('#chartType');
const chartColor = document.querySelector('#chartColor');
const generateBtn = document.querySelector('#generateBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const sampleBtn = document.querySelector('#sampleBtn');
const canvas = document.querySelector('#chartCanvas');
const ctx = canvas.getContext('2d');
const statusMsg = document.querySelector('#statusMsg');

function parseData(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [label, value] = line.split(',').map(s => s.trim());
      return { label, value: Number(value) };
    })
    .filter(item => item.label && !isNaN(item.value));
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBarChart(data, color) {
  const padding = 50;
  const chartW = canvas.width - padding * 2;
  const chartH = canvas.height - padding * 2;
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = chartW / data.length - 16;

  ctx.strokeStyle = '#ccc';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  data.forEach((item, i) => {
    const barHeight = (item.value / maxVal) * chartH;
    const x = padding + i * (chartW / data.length) + 8;
    const y = canvas.height - padding - barHeight;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth / 2, canvas.height - padding + 18);
    ctx.fillText(item.value, x + barWidth / 2, y - 6);
  });
}

function drawLineChart(data, color) {
  const padding = 50;
  const chartW = canvas.width - padding * 2;
  const chartH = canvas.height - padding * 2;
  const maxVal = Math.max(...data.map(d => d.value));
  const stepX = chartW / (data.length - 1 || 1);

  ctx.strokeStyle = '#ccc';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((item, i) => {
    const x = padding + i * stepX;
    const y = canvas.height - padding - (item.value / maxVal) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  data.forEach((item, i) => {
    const x = padding + i * stepX;
    const y = canvas.height - padding - (item.value / maxVal) * chartH;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x, canvas.height - padding + 18);
  });
}

function drawPieChart(data, baseColor) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 50;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = -Math.PI / 2;

  data.forEach((item, i) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const hue = (i * 360) / data.length;

    ctx.fillStyle = i === 0 ? baseColor : `hsl(${hue}, 55%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    const midAngle = startAngle + sliceAngle / 2;
    const labelX = cx + Math.cos(midAngle) * (radius + 20);
    const labelY = cy + Math.sin(midAngle) * (radius + 20);

    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, labelX, labelY);

    startAngle += sliceAngle;
  });
}

function generateChart() {
  const data = parseData(dataInput.value);

  if (data.length === 0) {
    statusMsg.textContent = 'Enter valid data as label,value pairs.';
    clearCanvas();
    downloadBtn.style.display = 'none';
    return;
  }

  statusMsg.textContent = '';
  clearCanvas();

  const color = chartColor.value;
  const type = chartType.value;

  if (type === 'bar') drawBarChart(data, color);
  if (type === 'line') drawLineChart(data, color);
  if (type === 'pie') drawPieChart(data, color);

  downloadBtn.style.display = 'inline-block';
}

generateBtn.addEventListener('click', generateChart);

sampleBtn.addEventListener('click', () => {
  dataInput.value = 'Jan,45\nFeb,60\nMar,38\nApr,72\nMay,55';
  generateChart();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});