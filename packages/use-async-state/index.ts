import type { DeepReadonly, Ref } from 'vue';
import { readonly, ref } from 'vue';
import {
  abortableAsync,
  debounceAsync,
  debounceAsyncResult,
  throttleAsyncResult,
  withRetryAsync,
} from 'high-order-async-utilities';
import { useIntervalFn, useEventListener, useDebounce, useThrottleFn } from '@vueuse/core';

export type UseAsyncStateOptions<R, P extends any[]> = {
  /**
   * @description 默认 false。 即在初始化时自动执行 service；如果设置为 true，则需要手动调用 run 触发执行。
   */
  manual?: boolean;
  /**
   * @description 默认参数，数组形式
   */
  defaultParams?: P;
  /**
   * @description 成功时回调
   */
  onSuccess?: (arg0: R, arg1: P) => void;
  /**
   * @description 失败时回调
   */
  onError?: (arg0: any, arg1: P) => void;
  /**
   * @description 完成时回调
   */
  onComplete?: (arg0: P) => void;
  /**
   * @description 轮询间隔，单位为毫秒。设置后，将进入轮询模式，定时触发 run
   */
  pollingInterval?: number;
  /**
   * @description 在页面隐藏时，是否继续轮询。默认为 true，即不会停止轮询；如果设置为 false , 在页面隐藏时会暂时停止轮询，页面重新显示时继续上次轮询
   */
  pollingWhenHidden?: boolean;
  /**
   * @description 在屏幕重新获取焦点或重新显示时，是否重新发起请求。默认为 false，即不会重新发起请求；如果设置为 true，在屏幕重新聚焦或重新显示时，会重新发起请求。
   */
  refreshOnWindowFocus?: boolean;
  /**
   * @description 屏幕重新聚焦，如果每次都重新发起请求，不是很好，我们需要有一个时间间隔，在当前时间间隔内，不会重新发起请求
   * 需要配和 refreshOnWindowFocus 使用。默认5000
   */
  focusTimespan?: number;
  /**
   * @description 可以延迟 loading 变成 true 的时间，有效防止闪烁
   */
  loadingDelay?: number;
  /**
   * @description 防抖间隔, 单位为毫秒，设置后，请求进入防抖模式。
   */
  debounceInterval?: number;
  /**
   * @description （执行频率过高时或执行时间不均匀）取最后一次执行的异步任务结果。默认 false, 推荐开启
   * 详情： https://bowencool.github.io/async-utilities/functions/debounceAsyncResult/readme.html
   */
  debounceResult?: boolean;
  /**
   * @description 取第一次执行的异步任务结果并忽略在此期间的任何执行。默认 false, 跟 debounceResult、debounceInterval 互斥。
   * 详情： https://bowencool.github.io/async-utilities/functions/throttleAsyncResult/readme.html
   */
  throttleResult?: boolean | Parameters<typeof throttleAsyncResult>[1];
  /**
   * @description 自动重试，
   * 详情： https://bowencool.github.io/async-utilities/functions/withRetryAsync/readme.html
   */
  autoRetry?: Parameters<typeof withRetryAsync>[1];
  /**
   * @description 超时自动失败，error 会是一个 TimeoutError
   */
  timeout?: number /* | Parameters<typeof abortableAsync>[1] */;
};
export type UseAsyncStateReturnType<R, P extends any[]> = {
  /**
   * @description 任务结果
   */
  data: Ref<R | undefined> /* | DeepReadonly<Ref<R | undefined>> */;
  /**
   * @description 当前调用的参数列表。比如：展示“未搜索到 {params} 相关数据”
   */
  params: Ref<P | undefined> /* | DeepReadonly<Ref<R | undefined>> */;
  /**
   * @description 给页面渲染的 loading，根据 loadingDelay 优化
   */
  loading: DeepReadonly<Ref<boolean>>;
  /**
   * @description 任务执行中抛出的错误
   */
  error: DeepReadonly<Ref<unknown | undefined>>;
  /**
   * @description 手动触发 service 执行，参数会传递给 service；
   */
  run: (...p: P) => Promise<R>;
  /**
   * @description 取消当前任务，需要运行环境支持 AbortController，error 会是一个 AbortError 。如果有定时器，也会暂定。
   */
  cancel?: () => void;
  /**
   * @description 暂停定时器
   */
  pause?: () => void;
  /**
   * @description 恢复定时器（并立即执行一次）
   */
  resume?: () => void;
  /**
   * @description 任务是否正在执行，不受 loadingDelay 影响
   */
  pending: DeepReadonly<Ref<boolean>>;
};

/**
 * @description 管理异步状态，通常用于网络请求。
 */
export function useAsyncState<R, P extends any[]>(
  /**
   * @description 异步任务
   */
  service: (...p: P) => Promise<R>,
  options: UseAsyncStateOptions<R, P> = {},
): UseAsyncStateReturnType<R, P> {
  const {
    manual = false,
    defaultParams,
    onSuccess,
    onError,
    onComplete,
    pollingInterval = 0,
    pollingWhenHidden = true,
    refreshOnWindowFocus = false,
    focusTimespan = 5000,
    loadingDelay = 0,
    debounceInterval = 0,
    timeout = 0,
    debounceResult = false,
    throttleResult = false,
    autoRetry,
  } = options;

  const data = ref<R>();
  const params = ref<P>();
  const error = ref<any>();
  const pending = ref<boolean>(false);
  // const loading = ref<boolean>(false);
  const loading = useDebounce(pending, loadingDelay);

  // const { stop: clearDelay, start: startDelay } = useTimeoutFn(
  //   () => {
  //     loading.value = true;
  //   },
  //   loadingDelay,
  //   { immediate: false },
  // );

  let controller: AbortController;

  /**
   * 作用于 service 的不会执行 run, 从而不会引起 loading、error 等内部状态变化，且不会执行 onSuccess、onError 等回调。
   * 作用于 run 相反。当然也不是绝对，总之，关键是看需不需要让外部感知。
   */
  if (autoRetry) {
    service = withRetryAsync(service, autoRetry);
  }
  if (debounceResult) {
    service = debounceAsyncResult(service);
  }

  let run = async function _run(..._params: P): Promise<R> {
    try {
      // clearDelay();
      // if (typeof loadingDelay === 'number' && loadingDelay > 0) {
      //   startDelay();
      // } else {
      //   loading.value = true;
      // }
      pending.value = true;
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
      }
      const rez = await abortableAsync(service, { timeout, signal: controller?.signal })(..._params);
      data.value = rez;
      error.value = undefined;
      onSuccess?.(rez, _params);
      return rez;
    } catch (err) {
      data.value = undefined;
      error.value = err;
      onError?.(err, _params);
      throw err;
    } finally {
      // clearDelay();
      // loading.value = false;
      pending.value = false;
      onComplete?.(_params);
      params.value = _params;
    }
  };
  if (typeof debounceInterval === 'number' && debounceInterval > 0) {
    run = debounceAsync(run, debounceInterval);
  } else if (throttleResult && !debounceResult) {
    run = throttleAsyncResult(run, typeof throttleResult === 'object' ? throttleResult : undefined);
  }
  function _runWithDefaultParams() {
    // 内部防重复
    if (pending.value) return;
    const _params = params.value || defaultParams || ([] as unknown as P);
    run(..._params);
  }

  let pause: (() => void) | undefined;
  let resume: (() => void) | undefined;

  if (typeof pollingInterval === 'number' && pollingInterval > 0) {
    const pausable = useIntervalFn(_runWithDefaultParams, pollingInterval, {
      immediate: !manual,
      immediateCallback: true,
    });
    pause = pausable.pause;
    resume = pausable.resume;
  } else if (!manual) {
    _runWithDefaultParams();
  }
  if (refreshOnWindowFocus) {
    const onWindowFoucs = useThrottleFn(_runWithDefaultParams, focusTimespan, false);
    useEventListener(window, 'focus', onWindowFoucs);
  }
  if (!pollingWhenHidden) {
    useEventListener(document, 'visibilitychange', () => {
      const visibility = document.visibilityState;
      if (visibility === 'hidden') {
        pause?.();
      } /* if (visibility === 'visible') */ else {
        resume?.();
      }
    });
  }

  return {
    params,
    data,
    loading,
    pending: readonly(pending),
    error: readonly(error),
    run,
    pause,
    resume,
    cancel() {
      pause?.();
      controller?.abort();
    },
  };
}
