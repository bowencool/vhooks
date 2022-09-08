<script lang="tsx">
  import { computed, defineComponent } from 'vue';
  import { useCopy } from '@npm_bowen/vhooks';
  import { ElButton, ElTooltip } from 'element-plus';

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
        <ElTooltip effect="dark" content={tooltip.value} placement="top">
          <ElButton onClick={() => copy()}>复制</ElButton>
        </ElTooltip>
      );
    },
  });
</script>
