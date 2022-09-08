import { tryOnScopeDispose } from '@vueuse/shared';
import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';
import type { CalculatedDuration } from './functions';
import { calculateDuration, formatDuration } from './functions';

// #region duration
export type Duration = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};
// #endregion duration

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const getDuration = (durationMs: number): Duration => {
  const days = Math.floor(durationMs / DAY);
  const hours = Math.floor((durationMs % DAY) / HOUR);
  const minutes = Math.floor((durationMs % HOUR) / MINUTE);
  const seconds = Math.floor((durationMs % MINUTE) / SECOND);
  const milliseconds = Math.floor(durationMs % SECOND);
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

// #region define
type CountDownPropsBase = {
  /**
   * @description 初始剩余毫秒数
   */
  remain: number;
  onEnd?: () => void;
  format?: string;
  onChange?: (t: Duration) => void;
};
type CountDownProps<Controls extends boolean> = CountDownPropsBase & {
  /**
   * @description 手动开始，默认自动开始
   */
  manual?: Controls;
};
type CountDownReturnBase = {
  remain: Ref<number>;
  calculated: ComputedRef<CalculatedDuration>;
  formattedText: Ref<string | undefined>;
  running: Ref<boolean>;
};
type CountDownReturnControlls = {
  resume: () => void;
  pause: () => void;
  reset: () => void;
};
function useCountDown(props: CountDownProps<false>): CountDownReturnBase;
function useCountDown(props: CountDownProps<true>): CountDownReturnBase & CountDownReturnControlls;

// #endregion define
function useCountDown(props: CountDownProps<boolean>) {
  // 程序辅助用的
  const { format = 'DD:HH:mm:ss' } = props;
  const enableMilliseconds = /S/.test(format);
  const until = ref<number>(0);
  // 剩余毫秒数
  const remain = ref<number>(props.remain || 0);
  const handle = ref<number>(0);
  const running = ref<boolean>(false);
  // const remainObj = computed(() => );
  const calculated = computed(() => calculateDuration(getDuration(remain.value), format));
  const formattedText = computed(() => formatDuration(calculated.value, format));
  // const formattedText = ref<string>();

  // watch(remain, (a) => {
  //   console.log('remain changed to:', a);
  // });

  function updateRemain() {
    let remainMs = until.value ? until.value - Date.now() : remain.value;
    if (enableMilliseconds) {
      if (remainMs <= 0) remainMs = 0;
      remain.value = remainMs;
    } else {
      remainMs = Math.ceil(remainMs / SECOND) * SECOND;
      if (remainMs <= 0) remainMs = 0;
      remain.value = remainMs;
    }
  }

  function counting() {
    // console.log('counting');
    updateRemain();
    if (remain.value <= 0) {
      stop();
      props.onEnd?.();
      return;
    }
    if (enableMilliseconds) {
      handle.value = window.requestAnimationFrame(counting);
    }
  }

  function resume() {
    // console.log('resume');
    if (running.value) return;
    running.value = true;
    until.value = Date.now() + remain.value;
    if (enableMilliseconds) {
      counting();
    } else {
      handle.value = window.setInterval(counting, SECOND);
    }
  }
  function pause() {
    cancelAnimationFrame(handle.value);
    clearInterval(handle.value);
    running.value = false;
    // console.log('cleared');
  }
  function stop() {
    pause();
    remain.value = 0;
    // console.log('stoped');
  }
  function reset() {
    pause();
    remain.value = props.remain || 0;
  }
  tryOnScopeDispose(pause);
  const base: CountDownReturnBase = {
    remain,
    running,
    calculated,
    formattedText,
  };
  if (!props.manual) {
    // console.log('auto started');
    resume();
    return base;
  }
  return { ...base, resume, pause, reset };
}
export * from './functions';
export { useCountDown };
