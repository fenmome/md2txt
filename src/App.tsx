import React, { useState, ChangeEvent, useEffect } from 'react';
import { Layout, Card, Input, Button, message, Typography, Space, Select } from 'antd';
import { CopyOutlined, ClearOutlined, GlobalOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import * as marked from 'marked';
import { useTranslation } from 'react-i18next';
import './App.css';

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
  const [markdown, setMarkdown] = useState('');
  const [text, setText] = useState('');
  const { t, i18n } = useTranslation();

  // 根据浏览器语言设置默认语言
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = ['zh', 'en'].includes(browserLang) ? browserLang : 'en';
    i18n.changeLanguage(defaultLang);
  }, [i18n]);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);
    setText(mdToText(newMarkdown));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    message.success(t('copySuccess'));
  };

  const handleClear = () => {
    setMarkdown('');
    setText('');
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <>
      <Helmet>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2364356627109311" crossOrigin="anonymous"></script>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Helmet>
      <Layout className="app-layout">
        <Header className="app-header">
          <div className="header-content">
            <Title level={3} className="app-title">{t('header.title')}</Title>
            <Select
              className="language-selector"
              value={i18n.language}
              onChange={handleLanguageChange}
              suffixIcon={<GlobalOutlined />}
            >
              <Option value="zh">{t('header.language.zh')}</Option>
              <Option value="en">{t('header.language.en')}</Option>
            </Select>
          </div>
        </Header>
        <Content className="app-content">
          <Space direction="vertical" size="large" className="content-space">
            <Card className="input-card">
              <Title level={4} className="card-title">{t('input.title')}</Title>
              <TextArea
                className="markdown-input"
                value={markdown}
                onChange={handleMarkdownChange}
                placeholder={t('input.placeholder')}
                autoSize={{ minRows: 10, maxRows: 20 }}
              />
            </Card>
            <Card className="output-card">
              <Title level={4} className="card-title">{t('output.title')}</Title>
              <div className="button-group">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<CopyOutlined />} 
                    onClick={handleCopy}
                    className="action-button"
                  >
                    {t('buttons.copy')}
                  </Button>
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={handleClear}
                    className="action-button"
                  >
                    {t('buttons.clear')}
                  </Button>
                </Space>
              </div>
              <TextArea
                className="text-output"
                value={text}
                readOnly
                autoSize={{ minRows: 10, maxRows: 20 }}
              />
            </Card>
            <Card className="description-card">
              <Title level={4} className="card-title">{t('websiteDescription.title')}</Title>
              <Paragraph className="description-text">
                {t('websiteDescription.content')}
              </Paragraph>
            </Card>
          </Space>
        </Content>
        <Footer className="app-footer">
          MD2TXT ©{new Date().getFullYear()} {t('footer')}
        </Footer>
      </Layout>
    </>
  );
};

export default App;
