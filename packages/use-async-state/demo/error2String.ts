type PlainObject = Record<string, any>;
type PlainObjectOf<T> = Record<string, T>;

export function isPlainObject(obj: any): obj is PlainObject {
  return obj && obj.constructor === Object;
}

export function error2String(err: unknown) {
  if (typeof err === 'string') {
    return err;
  }
  if (err instanceof Error) {
    return `${err.name}: ${err.message}`;
  }
  if (isPlainObject(err)) {
    const key = ['message', 'msg', 'error', 'err_msg', 'error_message'];
    for (const k of key) {
      if (k in err) {
        return err[k];
      }
    }
  }
  return JSON.stringify(err);
}
