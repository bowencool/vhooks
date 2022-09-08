<script lang="tsx">
  import { computed, defineComponent, ref } from 'vue';
  import { useCopy } from 'vhooks';

  export default defineComponent({
    setup() {
      const message = ref('abc');
      const inputRef = ref();
      const { copied, copy, error } = useCopy({
        text: computed(() => `mk:${message.value}`),
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
          <el-input ref={inputRef} v-model={message.value}>
            {{
              append: () => (
                <el-tooltip effect="dark" content={tooltip.value} placement="top">
                  <el-button onClick={copy} type="primary">
                    复制
                  </el-button>
                </el-tooltip>
              ),
            }}
          </el-input>
        </>
      );
    },
  });
</script>
