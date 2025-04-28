import React, { useState, ChangeEvent } from 'react';
import { Layout, Card, Input, Button, message, Typography, Space, Select } from 'antd';
import { CopyOutlined, ClearOutlined, GlobalOutlined, DownloadOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import * as marked from 'marked';
import { useTranslation } from 'react-i18next';
import { convertToPDF, convertToWord } from './utils/exportUtils';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function mdToText(md: string): string {
  const html = marked.parse(md);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

const App: React.FC = () => {
  const [md, setMd] = useState('');
  const [text, setText] = useState('');
  const { t, i18n } = useTranslation();

  const handleConvert = () => {
    if (!md.trim()) {
      message.warning(t('messages.inputRequired'));
      return;
    }
    setText(mdToText(md));
    message.success(t('messages.converted'));
  };

  const handleCopy = () => {
    if (!text) {
      message.warning(t('messages.nothingToCopy'));
      return;
    }
    navigator.clipboard.writeText(text);
    message.success(t('messages.copied'));
  };

  const handleClear = () => {
    setMd('');
    setText('');
    message.success(t('messages.cleared'));
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const steps = t('instructions.steps', { returnObjects: true }) as string[];

  const handleExportPDF = async () => {
    try {
      const pdfBuffer = await convertToPDF(md);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('PDF导出成功');
    } catch (error) {
      message.error('PDF导出失败');
      console.error(error);
    }
  };

  const handleExportWord = async () => {
    try {
      const wordBuffer = await convertToWord(md);
      const blob = new Blob([wordBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('Word导出成功');
    } catch (error) {
      message.error('Word导出失败');
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossOrigin="anonymous"></script>
      </Helmet>
      <Layout>
        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <Title level={2} style={{ margin: 0 }}>{t('header')}</Title>
            <Select
              defaultValue={i18n.language}
              style={{ width: 120 }}
              onChange={handleLanguageChange}
              prefix={<GlobalOutlined />}
            >
              <Option value="en">{t('language.en')}</Option>
              <Option value="zh">{t('language.zh')}</Option>
            </Select>
          </div>
        </Header>

        <Content>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={4}>{t('input.title')}</Title>
                <TextArea
                  value={md}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMd(e.target.value)}
                  placeholder={t('input.placeholder')}
                  autoSize={{ minRows: 6, maxRows: 12 }}
                />
              </div>

              <Space wrap>
                <Button type="primary" onClick={handleConvert}>
                  {t('buttons.convert')}
                </Button>
                <Button icon={<ClearOutlined />} onClick={handleClear}>
                  {t('buttons.clear')}
                </Button>
              </Space>

              <div>
                <Title level={4}>{t('output.title')}</Title>
                <TextArea
                  value={text}
                  readOnly
                  placeholder={t('output.placeholder')}
                  autoSize={{ minRows: 6, maxRows: 12 }}
                />
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  style={{ marginTop: 16 }}
                  disabled={!text}
                >
                  {t('buttons.copy')}
                </Button>
              </div>

              <Space>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={handleExportPDF}
                >
                  {t('buttons.exportPDF')}
                </Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={handleExportWord}
                >
                  {t('buttons.exportWord')}
                </Button>
              </Space>
            </Space>
          </Card>

          <Card style={{ marginTop: 24 }}>
            <Title level={4}>{t('instructions.title')}</Title>
            <Paragraph>
              {steps.map((step: string, index: number) => (
                <React.Fragment key={index}>
                  {index + 1}. {step}
                  <br />
                </React.Fragment>
              ))}
            </Paragraph>
          </Card>
        </Content>

        <Footer>
          {t('footer')} ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </>
  );
};

export default App;
