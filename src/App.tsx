import React, { useState, ChangeEvent } from 'react';
import { Layout, Card, Input, Button, message, Typography, Space, Select } from 'antd';
import { CopyOutlined, ClearOutlined, GlobalOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import * as marked from 'marked';
import { useTranslation } from 'react-i18next';

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

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
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
