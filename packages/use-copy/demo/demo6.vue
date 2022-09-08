<script lang="tsx">
  import { computed, defineComponent, ref } from 'vue';
  import { useCopy } from '@bowencool/vhooks';
  import { ElButton, ElTooltip } from 'element-plus';

  export default defineComponent({
    setup() {
      const { copied, copy, error } = useCopy({
        text: '<h1>Hello World</h1>',
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
        <>
          <div>text: {'<h1>Hello World</h1>'}</div>
          <ElTooltip effect="dark" content={tooltip.value} placement="top">
            <ElButton onClick={() => copy()} type="primary">
              复制
            </ElButton>
          </ElTooltip>
          <ElTooltip effect="dark" content={tooltip.value} placement="top">
            <ElButton onClick={() => copy({ html: true })} type="primary">
              复制原始 html
            </ElButton>
          </ElTooltip>
        </>
      );
    },
  });
</script>
