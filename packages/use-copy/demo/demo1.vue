<script lang="tsx">
  import { computed, defineComponent } from 'vue';
  import { useCopy } from 'vhooks';

  export default defineComponent({
    setup() {
      const { copied, copy, error } = useCopy({
        text: '要复制的文字',
      });

      const tooltip = computed(() => {
        if (error.value) {
          return `复制失败: ${error.value?.message}`;
        }
        if (copied.value) {
          return '复制成功';
        }
        return '点击复制';
      });
      return () => (
        <el-tooltip effect="dark" content={tooltip.value} placement="top">
          <el-button onClick={copy}>复制</el-button>
        </el-tooltip>
      );
    },
  });
</script>
