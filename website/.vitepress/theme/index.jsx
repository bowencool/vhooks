import DefaultTheme from 'vitepress/theme';
import DemoContainer from './DemoContainer.vue';
import { Loading } from '@element-plus/icons-vue';

import './custom.scss';

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('DemoContainer', DemoContainer);
    app.component('icon-loading', Loading);
  },
};
