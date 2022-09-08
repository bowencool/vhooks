import MarkdownIt from 'markdown-it';
import { UserConfig } from 'vitepress';
import markdownItCheckbox from 'markdown-it-checkbox';
import markdownItDemo from './markdown/plugin/markdown-it-demo';
import { nav, sidebar } from './menus';

export const config: UserConfig = {
  // base: '/vhooks/',
  lang: 'zh-CN',
  title: process.env.npm_package_name,
  description: process.env.npm_package_description,

  // https://vitepress.vuejs.org/guide/markdown.html#advanced-configuration
  markdown: {
    lineNumbers: true,
    config: (md: MarkdownIt) => {
      md.use(markdownItCheckbox);
      md.use(markdownItDemo);
    },
  },

  themeConfig: {
    nav: [
      ...nav,
      // {
      //   text: '发布日志',
      //   // link: '/changelog',
      //   link: 'https://gitlab.mockuai.com/fe-infra/element-pp/-/blob/online/changelog.md',
      // },
      // {
      //   text: 'Github',
      //   link: 'https://github.com/todo',
      // },
    ],
    sidebar,
  },
  // themeConfig: {
  //   sidebar: false,
  //   nav: [
  //     { text: '首页', link: '/', exact: true },
  //     { text: '指南', link: '/guide/contribution', activeMatch: '^/guide/' },
  //   ],
  // },
};
