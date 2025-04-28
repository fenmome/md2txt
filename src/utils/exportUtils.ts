import { jsPDF } from 'jspdf';
import MarkdownIt from 'markdown-it';
import { asBlob } from 'html-docx-js-typescript';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

const A4_WIDTH = 210; // A4纸宽度（毫米）
const A4_HEIGHT = 297; // A4纸高度（毫米）
const MARGIN = 20; // 页边距（毫米）

export const convertToPDF = async (markdown: string): Promise<Uint8Array> => {
  // 将Markdown转换为HTML
  const html = md.render(markdown);
  
  // 创建一个临时div来渲染HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.style.width = `${A4_WIDTH - MARGIN * 2}mm`;
  tempDiv.style.padding = `${MARGIN}mm`;
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12pt';
  tempDiv.style.lineHeight = '1.5';
  
  // 添加基本样式
  const style = document.createElement('style');
  style.textContent = `
    h1 { font-size: 24pt; margin: 16pt 0; }
    h2 { font-size: 20pt; margin: 14pt 0; }
    h3 { font-size: 16pt; margin: 12pt 0; }
    p { margin: 8pt 0; }
    pre { background: #f5f5f5; padding: 8pt; border-radius: 4pt; }
    code { font-family: 'Courier New', monospace; }
    ul, ol { margin: 8pt 0; padding-left: 20pt; }
  `;
  tempDiv.appendChild(style);
  document.body.appendChild(tempDiv);

  // 创建PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 获取内容高度
  const contentHeight = tempDiv.offsetHeight;
  const pageHeight = A4_HEIGHT - MARGIN * 2;
  const pageCount = Math.ceil(contentHeight / pageHeight);

  // 分页处理
  for (let i = 0; i < pageCount; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    // 将HTML内容添加到PDF
    await pdf.html(tempDiv, {
      callback: function(pdf) {
        // 页面处理完成
      },
      x: MARGIN,
      y: MARGIN + (i * pageHeight),
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
    });
  }

  // 清理临时元素
  document.body.removeChild(tempDiv);

  // 返回PDF数据
  return new Uint8Array(pdf.output('arraybuffer'));
};

export const convertToWord = async (markdown: string): Promise<Uint8Array> => {
  // 将Markdown转换为HTML
  const html = md.render(markdown);
  
  // 添加样式
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: ${MARGIN}mm;
          }
          h1 { font-size: 24pt; margin: 16pt 0; }
          h2 { font-size: 20pt; margin: 14pt 0; }
          h3 { font-size: 16pt; margin: 12pt 0; }
          p { margin: 8pt 0; }
          pre { background: #f5f5f5; padding: 8pt; border-radius: 4pt; }
          code { font-family: 'Courier New', monospace; }
          ul, ol { margin: 8pt 0; padding-left: 20pt; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  // 转换为Word文档
  const blob = await asBlob(styledHtml, {
    orientation: 'portrait',
    margins: {
      top: MARGIN,
      right: MARGIN,
      bottom: MARGIN,
      left: MARGIN,
    },
  });

  // 转换Blob为Uint8Array
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}; 