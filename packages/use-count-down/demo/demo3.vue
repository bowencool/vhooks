<script lang="tsx">
  import { defineComponent } from 'vue';
  import { useCountDown } from '@bowencool/vhooks';

  export default defineComponent({
    setup() {
      const { calculated, pause, resume, reset, running, formattedText } = useCountDown({
        remain: 5000,
        manual: true,
        format: 'm:s:S',
        onEnd() {
          console.log('done');
        },
      });
      return () => (
        <>
          {running.value ? (
            <button key="p" onClick={pause}>
              Pause
            </button>
          ) : (
            <button key="resume" onClick={resume}>
              Start
            </button>
          )}
          <button onClick={reset}>Reset</button>
          {/* <pre>{formattedText.value}</pre> */}
          <div>
            <span class="block">{`${calculated.value.m}`.padStart(2, '0')}</span>
            <span class="colon">:</span>
            <span class="block">{`${calculated.value.s}`.padStart(2, '0')}</span>
            <span class="colon">:</span>
            <span class="block">{`${calculated.value.S}`.padStart(3, '0').slice(0, 2)}</span>
          </div>
        </>
      );
    },
  });
</script>

<style lang="scss" scoped>
  .block {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: #fff;
    background: var(--el-color-primary);
    border-radius: 50%;
  }
</style>
