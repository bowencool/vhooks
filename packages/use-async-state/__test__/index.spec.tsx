import { flushPromises, mount } from '@vue/test-utils';
import sinon from 'sinon';
import { useAsyncState } from '../index';

jest.useFakeTimers();

afterEach(function () {
  sinon.restore();
});
describe('useAsyncState', () => {
  test('basic: loading & data', async () => {
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r('res');
          }, 200);
        }),
    );
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService);
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.pending).toBe(true);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe('res');
  });

  test('onSuccess & onComplete & defaultParams', async () => {
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r('res');
          }, 200);
        }),
    );
    const onSuccess = jest.fn();
    const onComplete = jest.fn();
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, {
          onSuccess,
          onComplete,
          defaultParams: [1, '2'],
        });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('res', [1, '2']);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith([1, '2']);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe('res');
  });

  test('manual & params & promiseResolve', async () => {
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r('res');
          }, 200);
        }),
    );
    const onSuccess = jest.fn();
    const onComplete = jest.fn();
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, {
          onSuccess,
          onComplete,
          manual: true,
        });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });

    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(0);
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onComplete).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    const promise = wrapper.vm.run('3', 4);
    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(200);
    await expect(promise).resolves.toBe('res');
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('res', ['3', 4]);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(['3', 4]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe('res');
  });

  test('manual & error & onError & promiseReject', async () => {
    const MSG = 'something wrong';
    const queryService = jest.fn(
      (num: number = 0) =>
        new Promise((r, j) => {
          setTimeout(() => {
            j(MSG);
          }, 200);
        }),
    );
    const onError = jest.fn();
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, { manual: true, onError });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    const promise = wrapper.vm.run(1);

    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    jest.advanceTimersByTime(200);
    await expect(promise).rejects.toBe(MSG);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(MSG, [1]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBe(MSG);
    expect(wrapper.vm.data).toBeUndefined();
  });

  test('loading delay & refreshOnWindowFocus', async () => {
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r('res');
          }, 200);
        }),
    );
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, {
          refreshOnWindowFocus: true,
          loadingDelay: 100,
        });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(true);

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(100);
    await flushPromises();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.pending).toBe(true);

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(100);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.pending).toBe(false);

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(100);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);

    let visibilityState: typeof document.visibilityState = 'visible';
    sinon.replaceGetter(document, 'visibilityState', () => visibilityState);

    visibilityState = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));

    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.loading).toBe(false);
  });

  test('pollingInterval & pollingWhenHidden & refreshOnWindowFocus', async () => {
    let count = 0;
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r(++count);
          }, 200);
        }),
    );
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, {
          pollingInterval: 1000,
          refreshOnWindowFocus: true,
          pollingWhenHidden: false,
        });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBeUndefined();

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe(1);

    // “快进”时间使得定时器回调被执行
    jest.advanceTimersByTime(800);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe(1);

    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeUndefined();
    expect(wrapper.vm.data).toBe(2);

    let visibilityState: typeof document.visibilityState = 'visible';
    sinon.replaceGetter(document, 'visibilityState', () => visibilityState);
    // document.addEventListener('visibilitychange', () => {
    //   console.log(document.visibilityState)
    // })

    visibilityState = 'hidden';
    document.dispatchEvent(new Event('visibilitychange'));

    jest.advanceTimersByTime(2000);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);

    visibilityState = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));

    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(3);
  });

  test('debounceInterval', async () => {
    const queryService = jest.fn(
      (...params: any[]) =>
        new Promise((r) => {
          setTimeout(() => {
            r('res');
          }, 200);
        }),
    );
    const wrapper = mount({
      setup() {
        return useAsyncState(queryService, {
          debounceInterval: 300,
        });
      },
      render() {
        return <span>{this.loading ? 'loading' : this.error}</span>;
      },
    });
    await flushPromises();

    expect(queryService).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);

    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);

    jest.advanceTimersByTime(100);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.pending).toBe(true);

    jest.advanceTimersByTime(200);
    wrapper.vm.run();
    wrapper.vm.run();
    wrapper.vm.run();
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);

    jest.advanceTimersByTime(300);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.pending).toBe(true);

    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(queryService).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pending).toBe(false);
  });
});
