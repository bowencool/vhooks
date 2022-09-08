import type { UserConfig } from 'vitepress';

/* import path from 'path';
import fs from 'fs';
const INPUT_PATH = path.resolve(__dirname, '../../packages');
fs.readdirSync(`${INPUT_PATH}/components`)
  .filter((name) => !name.includes('.'))
  .forEach((name) => {
    let mdFile = `readme.md`;
    if (!fs.existsSync(`${INPUT_PATH}/components/${name}/${mdFile}`)) {
      mdFile = fs.readdirSync(`${INPUT_PATH}/components/${name}`).find((file) => file.endsWith('.md'));
    }
    if (mdFile) {
      const text = name.replace(/[-_]([a-z])/g, (_, $1) => $1.toUpperCase());
      const link = `/components/${name}/${mdFile.replace(/\.md$/, '')}`;
      components.push({
        text: text.replace(/^[a-z]/, ($1) => $1.toUpperCase()),
        link,
      });
    }
  }); */

const guide = [
  {
    text: '介绍',
    children: [
      { text: 'vhooks 是什么？', link: '/guide/intro' },
      // { text: '开始使用', link: '/guide/getting-started' },
      // { text: '配置', link: '/guide/configuration' },
      { text: '贡献指南', link: '/guide/contribution' },
      // { text: 'Todos', link: '/guide/todos' },
    ],
  },
];

const hooks = [
  {
    text: '组合式API',
    children: [
      { text: 'useAsyncState 异步状态管理', link: '/hooks/use-async-state/readme' },
      // { text: 'usePaging 分页器状态管理', link: '/hooks/use-paging/readme' },
      // { text: 'useInfiniteScroll 无限滚动状态管理', link: '/hooks/use-infinite-scroll/readme' },
      { text: 'useCopy 复制交互', link: '/hooks/use-copy/readme' },
      { text: 'useCountDown 倒计时交互', link: '/hooks/use-count-down/readme' },
    ],
  },
];

export const sidebar: UserConfig['themeConfig']['sidebar'] = {
  '/guide/': guide,
  '/hooks/': hooks,
  '/': guide,
};

export const nav: UserConfig['themeConfig']['nav'] = [
  { text: '指南', link: '/guide/intro', activeMatch: '^/$|^/guide/' },
  {
    text: '组合式API',
    link: hooks[0].children[0].link,
    activeMatch: '/hooks/',
  },
];
