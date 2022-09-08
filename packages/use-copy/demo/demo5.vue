<script lang="tsx">
  import { computed, defineComponent, ref } from 'vue';
  import { useCopy } from 'vhooks';

  export default defineComponent({
    setup() {
      const domRef = ref();
      const { copied, copy, error } = useCopy({
        text: domRef,
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
          <fieldset>
            <legend>选中区域</legend>
            <div ref={domRef}>
              <h1>标题</h1>
              <i>斜体</i>
              <img src="https://dummyimage.com/60x30/92cbff/fff" alt="img" />
            </div>
          </fieldset>
          <el-tooltip effect="dark" content={tooltip.value} placement="top">
            <el-button onClick={copy} type="primary">
              复制
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content={tooltip.value} placement="top">
            <el-button onClick={() => copy({ html: true })} type="primary">
              复制其 innerHTML
            </el-button>
          </el-tooltip>
        </>
      );
    },
  });
</script>
