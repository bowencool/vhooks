<script lang="tsx">
  import { defineComponent } from 'vue';
  import dayjs from 'dayjs';
  import { useCountDown } from '@npm_bowen/vhooks';

  export default defineComponent({
    setup() {
      const now = dayjs();
      const tomorrow = now.add(1, 'day').startOf('day');

      const { calculated, formattedText } = useCountDown({
        remain: tomorrow.valueOf() - now.valueOf(),
      });
      return () => (
        <pre>
          距离明天还有 {formattedText.value}&nbsp;
          {JSON.stringify(calculated.value, null, 2)}
        </pre>
      );
    },
  });
</script>
