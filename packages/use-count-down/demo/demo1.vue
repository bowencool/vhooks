<script lang="tsx">
  import { defineComponent } from 'vue';
  import dayjs from 'dayjs';
  import { useCountDown } from '@bowencool/vhooks';

  export default defineComponent({
    setup() {
      const now = dayjs();
      const tomorrow = now.add(1, 'day').startOf('day');

      const { calculated, formattedText } = useCountDown({
        remain: tomorrow.valueOf() - now.valueOf(),
      });
      return () => (
        <pre>
          {formattedText.value} left until tomorrow.
          {JSON.stringify(calculated.value, null, 2)}
        </pre>
      );
    },
  });
</script>
