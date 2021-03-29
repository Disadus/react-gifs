import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";

import Worker from "./worker";
import { genearate, parse } from "./parse-generate";

const createGlobalRef = (initial = null) => {
  const context = createContext({ current: initial });
  const useGlobalConstant = () => useContext(context);

  return useGlobalConstant;
};

const createSingleton = (constructor, destructor) => {
  const useGlobal = createGlobalRef();

  return () => {
    const ref = useGlobal();

    if (!ref.instance) {
      ref.instance = constructor();
    }

    useLayoutEffect(() => {
      ref.usageCount = (ref.usageCount || 0) + 1;

      return () => {
        ref.usageCount = ref.usageCount - 1;

        if (ref.usageCount === 0) {
          destructor && destructor(ref.instance);
          ref.instance = undefined;
        }
      };
    }, [ref]);

    return ref.instance;
  };
};

const useUpdatedRef = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

const useEventCallback = (callback) => {
  const ref = useUpdatedRef(callback);
  return useCallback((arg) => ref.current && ref.current(arg), []);
};

const useRaf = (callback, pause) => {
  const cb = useEventCallback(callback);

  useLayoutEffect(() => {
    if (!pause) {
      let id;
      let prev = null;

      const handleUpdate = () => {
        id = requestAnimationFrame((now) => {
          const dt = now - (prev || now);
          prev = now;

          cb(dt);
          handleUpdate();
        });
      };

      handleUpdate();

      return () => cancelAnimationFrame(id);
    }
  }, [pause, cb]);
};

const useAsyncEffect = (fn, deps) => {
  const cb = useEventCallback(fn);

  useEffect(() => {
    const controller = new AbortController();
    const dest = cb(controller);

    return () => {
      controller.abort();
      dest && dest();
    };
  }, [...deps]);
};

const useParser = (src, callback) => {
  const cb = useEventCallback(callback);

  useAsyncEffect(
    (controller) => {
      if (typeof src === "string") {
        parse(src, { signal: controller.signal })
          .then((raw) => genearate(raw))
          .then((info) => cb(info));
      }
    },
    [src]
  );
};

const useWorkerSingleton = createSingleton(
  () => new Worker(),
  (worker) => worker.terminate()
);

const useWorkerParser = (src, callback) => {
  const cb = useEventCallback(callback);
  const worker = useWorkerSingleton();

  useEffect(() => {
    if (typeof src === "string") {
      const handler = (e) => {
        const message = e.data || e;
        if (message.src === src) {
          cb(genearate(message));
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({ src, type: "parse" });

      return () => {
        worker.postMessage({ src, type: "cancel" });
        worker.removeEventListener("message", handler);
      };
    }
  }, [worker, src]);
};

const usePlayback = (state, updater) => {
  const delay = useRef(0);

  useRaf((dt) => {
    const { delays, index: currentIndex } = state;

    delay.current += dt;

    if (delay.current > delays[currentIndex]) {
      delay.current = delay.current % delays[currentIndex];
      updater();
    }
  }, !state.playing);
};

export { useRaf, createSingleton, useParser, useWorkerParser, usePlayback };