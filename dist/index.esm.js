import React, { useReducer, useCallback, useEffect, useRef, useLayoutEffect, forwardRef } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

const reducer = function (state, action) {
  if (action === void 0) {
    action = {};
  }

  if (typeof action === "function") {
    action = action(state);
  }

  const isLoadedChange = action.loaded && state.loaded !== action.loaded;
  const {
    playing,
    ...rest
  } = action;
  const copy = { ...state,
    ...rest
  };

  if (isLoadedChange) {
    Object.assign(copy, {
      playing: copy.autoPlay && copy.loaded
    });
  }

  if (action.delays != null || action.frames != null) {
    Object.assign(copy, {
      length: copy.frames.length
    });

    if (process.env.NODE_ENV !== "production") {
      if (copy.frames.length !== copy.delays.length) throw Error("frames and delays have different sizes");
    }
  }

  if (action.index != null || action.frames != null) {
    Object.assign(copy, {
      index: copy.length === 0 ? 0 : (copy.length + copy.index) % copy.length
    });
  }

  if (action.playing != null) {
    Object.assign(copy, copy.loaded ? {
      playing
    } : {
      autoPlay: playing
    });
  }

  return copy;
};

const initializer = stateOrFn => reducer({
  autoPlay: true,
  playing: false,
  frames: [],
  delays: [],
  index: 0,
  length: 0,
  loaded: false
}, stateOrFn);

const usePlayerState = stateOrFn => {
  return useReducer(reducer, stateOrFn, initializer);
};

var code = "function e(e){var r={exports:{}};return e(r,r.exports),r.exports}var r=e((function(e,r){Object.defineProperty(r,\"__esModule\",{value:!0}),r.loop=r.conditional=r.parse=void 0;r.parse=function e(r,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:n;if(Array.isArray(t))t.forEach((function(t){return e(r,t,n,a)}));else if(\"function\"==typeof t)t(r,n,a,e);else{var i=Object.keys(t)[0];Array.isArray(t[i])?(a[i]={},e(r,t[i],n,a[i])):a[i]=t[i](r,n,a,e)}return n};r.conditional=function(e,r){return function(t,n,a,i){r(t,n,a)&&i(t,e,n,a)}};r.loop=function(e,r){return function(t,n,a,i){for(var o=[],s=t.pos;r(t,n,a);){var d={};if(i(t,e,n,d),t.pos===s)break;s=t.pos,o.push(d)}return o}}})),t=e((function(e,r){Object.defineProperty(r,\"__esModule\",{value:!0}),r.readBits=r.readArray=r.readUnsigned=r.readString=r.peekBytes=r.readBytes=r.peekByte=r.readByte=r.buildStream=void 0;r.buildStream=function(e){return{data:e,pos:0}};var t=function(){return function(e){return e.data[e.pos++]}};r.readByte=t;r.peekByte=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return function(r){return r.data[r.pos+e]}};var n=function(e){return function(r){return r.data.subarray(r.pos,r.pos+=e)}};r.readBytes=n;r.peekBytes=function(e){return function(r){return r.data.subarray(r.pos,r.pos+e)}};r.readString=function(e){return function(r){return Array.from(n(e)(r)).map((function(e){return String.fromCharCode(e)})).join(\"\")}};r.readUnsigned=function(e){return function(r){var t=n(2)(r);return e?(t[1]<<8)+t[0]:(t[0]<<8)+t[1]}};r.readArray=function(e,r){return function(t,a,i){for(var o=\"function\"==typeof r?r(t,a,i):r,s=n(e),d=new Array(o),c=0;c<o;c++)d[c]=s(t);return d}};r.readBits=function(e){return function(r){for(var t=function(e){return e.data[e.pos++]}(r),n=new Array(8),a=0;a<8;a++)n[7-a]=!!(t&1<<a);return Object.keys(e).reduce((function(r,t){var a=e[t];return a.length?r[t]=function(e,r,t){for(var n=0,a=0;a<t;a++)n+=e[r+a]&&Math.pow(2,t-a-1);return n}(n,a.index,a.length):r[t]=n[a.index],r}),{})}}})),n=e((function(e,n){Object.defineProperty(n,\"__esModule\",{value:!0}),n.default=void 0;var a={blocks:function(e){for(var r=[],n=e.data.length,a=0,i=(0,t.readByte)()(e);0!==i&&i;i=(0,t.readByte)()(e)){if(e.pos+i>=n){var o=n-e.pos;r.push((0,t.readBytes)(o)(e)),a+=o;break}r.push((0,t.readBytes)(i)(e)),a+=i}for(var s=new Uint8Array(a),d=0,c=0;c<r.length;c++)s.set(r[c],d),d+=r[c].length;return s}},i=(0,r.conditional)({gce:[{codes:(0,t.readBytes)(2)},{byteSize:(0,t.readByte)()},{extras:(0,t.readBits)({future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}})},{delay:(0,t.readUnsigned)(!0)},{transparentColorIndex:(0,t.readByte)()},{terminator:(0,t.readByte)()}]},(function(e){var r=(0,t.peekBytes)(2)(e);return 33===r[0]&&249===r[1]})),o=(0,r.conditional)({image:[{code:(0,t.readByte)()},{descriptor:[{left:(0,t.readUnsigned)(!0)},{top:(0,t.readUnsigned)(!0)},{width:(0,t.readUnsigned)(!0)},{height:(0,t.readUnsigned)(!0)},{lct:(0,t.readBits)({exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}})}]},(0,r.conditional)({lct:(0,t.readArray)(3,(function(e,r,t){return Math.pow(2,t.descriptor.lct.size+1)}))},(function(e,r,t){return t.descriptor.lct.exists})),{data:[{minCodeSize:(0,t.readByte)()},a]}]},(function(e){return 44===(0,t.peekByte)()(e)})),s=(0,r.conditional)({text:[{codes:(0,t.readBytes)(2)},{blockSize:(0,t.readByte)()},{preData:function(e,r,n){return(0,t.readBytes)(n.text.blockSize)(e)}},a]},(function(e){var r=(0,t.peekBytes)(2)(e);return 33===r[0]&&1===r[1]})),d=(0,r.conditional)({application:[{codes:(0,t.readBytes)(2)},{blockSize:(0,t.readByte)()},{id:function(e,r,n){return(0,t.readString)(n.blockSize)(e)}},a]},(function(e){var r=(0,t.peekBytes)(2)(e);return 33===r[0]&&255===r[1]})),c=(0,r.conditional)({comment:[{codes:(0,t.readBytes)(2)},a]},(function(e){var r=(0,t.peekBytes)(2)(e);return 33===r[0]&&254===r[1]})),u=[{header:[{signature:(0,t.readString)(3)},{version:(0,t.readString)(3)}]},{lsd:[{width:(0,t.readUnsigned)(!0)},{height:(0,t.readUnsigned)(!0)},{gct:(0,t.readBits)({exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}})},{backgroundColorIndex:(0,t.readByte)()},{pixelAspectRatio:(0,t.readByte)()}]},(0,r.conditional)({gct:(0,t.readArray)(3,(function(e,r){return Math.pow(2,r.lsd.gct.size+1)}))},(function(e,r){return r.lsd.gct.exists})),{frames:(0,r.loop)([i,d,c,o,s],(function(e){var r=(0,t.peekByte)()(e);return 33===r||44===r}))}];n.default=u})),a=e((function(e,r){Object.defineProperty(r,\"__esModule\",{value:!0}),r.deinterlace=void 0;r.deinterlace=function(e,r){for(var t=new Array(e.length),n=e.length/r,a=function(n,a){var i=e.slice(a*r,(a+1)*r);t.splice.apply(t,[n*r,r].concat(i))},i=[0,4,2,1],o=[8,8,4,2],s=0,d=0;d<4;d++)for(var c=i[d];c<n;c+=o[d])a(c,s),s++;return t}})),i=e((function(e,r){Object.defineProperty(r,\"__esModule\",{value:!0}),r.lzw=void 0;r.lzw=function(e,r,t){var n,a,i,o,s,d,c,u,l,f,p,g,y,h,v,m,x=4096,B=t,w=new Array(t),b=new Array(x),k=new Array(x),A=new Array(4097);for(s=(a=1<<(f=e))+1,n=a+2,c=-1,i=(1<<(o=f+1))-1,u=0;u<a;u++)b[u]=0,k[u]=u;for(p=g=y=h=v=m=0,l=0;l<B;){if(0===h){if(g<o){p+=r[m]<<g,g+=8,m++;continue}if(u=p&i,p>>=o,g-=o,u>n||u==s)break;if(u==a){i=(1<<(o=f+1))-1,n=a+2,c=-1;continue}if(-1==c){A[h++]=k[u],c=u,y=u;continue}for(d=u,u==n&&(A[h++]=y,u=c);u>a;)A[h++]=k[u],u=b[u];y=255&k[u],A[h++]=y,n<x&&(b[n]=c,k[n]=y,0==(++n&i)&&n<x&&(o++,i+=n)),c=d}h--,w[v++]=A[h],l++}for(l=v;l<B;l++)w[l]=0;return w}})),o=e((function(e,o){Object.defineProperty(o,\"__esModule\",{value:!0}),o.decompressFrames=o.decompressFrame=o.parseGIF=void 0;var s,d=(s=n)&&s.__esModule?s:{default:s};o.parseGIF=function(e){var n=new Uint8Array(e);return(0,r.parse)((0,t.buildStream)(n),d.default)};var c=function(e,r,t){if(e.image){var n=e.image,o=n.descriptor.width*n.descriptor.height,s=(0,i.lzw)(n.data.minCodeSize,n.data.blocks,o);n.descriptor.lct.interlaced&&(s=(0,a.deinterlace)(s,n.descriptor.width));var d={pixels:s,dims:{top:e.image.descriptor.top,left:e.image.descriptor.left,width:e.image.descriptor.width,height:e.image.descriptor.height}};return n.descriptor.lct&&n.descriptor.lct.exists?d.colorTable=n.lct:d.colorTable=r,e.gce&&(d.delay=10*(e.gce.delay||10),d.disposalType=e.gce.extras.disposal,e.gce.extras.transparentColorGiven&&(d.transparentIndex=e.gce.transparentColorIndex)),t&&(d.patch=function(e){for(var r=e.pixels.length,t=new Uint8ClampedArray(4*r),n=0;n<r;n++){var a=4*n,i=e.pixels[n],o=e.colorTable[i]||[0,0,0];t[a]=o[0],t[a+1]=o[1],t[a+2]=o[2],t[a+3]=i!==e.transparentIndex?255:0}return t}(d)),d}console.warn(\"gif frame does not have associated image.\")};o.decompressFrame=c;o.decompressFrames=function(e,r){return e.frames.filter((function(e){return e.image})).map((function(t){return c(t,e.gct,r)}))}}));const s=(e,r,t)=>{const{width:n,height:a,top:i,left:o}=r.dims,s=i*t.width+o;for(let i=0;i<a;i++)for(let a=0;a<n;a++){const o=i*n+a,d=r.pixels[o];if(d!==r.transparentIndex){const n=s+i*t.width+a,o=r.colorTable[d]||[0,0,0];e[4*n]=o[0],e[4*n+1]=o[1],e[4*n+2]=o[2],e[4*n+3]=255}}return e},d=new Map;self.addEventListener(\"message\",(e=>{const{type:r,src:t}=e.data||e;switch(r){case\"parse\":if(!d.has(t)){const e=new AbortController,r={signal:e.signal};d.set(t,e),((e,{signal:r})=>fetch(e,{signal:r}).then((e=>{if(!e.headers.get(\"Content-Type\").includes(\"image/gif\"))throw Error(`Wrong content type: \"${e.headers.get(\"Content-Type\")}\"`);return e.arrayBuffer()})).then((e=>o.parseGIF(e))).then((e=>((e=>{let r=null;for(const t of e.frames)r=t.gce?t.gce:r,\"image\"in t&&!(\"gce\"in t)&&(t.gce=r)})(e),e))).then((e=>Promise.all([o.decompressFrames(e,!1),{width:e.lsd.width,height:e.lsd.height}]))).then((([e,r])=>{const t=[],n=r.width*r.height*4;for(let a=0;a<e.length;++a){const i=e[a],o=0===a||2===e[a-1].disposalType?new Uint8ClampedArray(n):t[a-1].slice();t.push(s(o,i,r))}return{...r,loaded:!0,delays:e.map((e=>e.delay)),frames:t}})))(t,r).then((e=>{self.postMessage(Object.assign(e,{src:t}),e.frames.map((e=>e.buffer)))})).catch((e=>{self.postMessage({src:t,error:e,loaded:!0})})).finally((()=>{d.delete(t)}))}break;case\"cancel\":if(d.has(t)){d.get(t).abort(),d.delete(t)}}}));\n";

function WorkerFactory(options) {
  let worker;

  try {
    const blob = new Blob([code], {
      type: 'application/javascript'
    });
    const url = URL.createObjectURL(blob);
    worker = new Worker(url, options);
    URL.revokeObjectURL(url);
  } catch (e) {}

  return worker;
}

const validateAndFix = gif => {
  let currentGce = null;

  for (const frame of gif.frames) {
    currentGce = frame.gce ? frame.gce : currentGce; // fix loosing graphic control extension for same frames

    if ("image" in frame && !("gce" in frame)) {
      frame.gce = currentGce;
    }
  }
};

const parse = (src, _ref) => {
  let {
    signal
  } = _ref;
  return fetch(src, {
    signal
  }).then(resp => {
    if (!resp.headers.get("Content-Type").includes("image/gif")) throw Error(`Wrong content type: "${resp.headers.get("Content-Type")}"`);
    return resp.arrayBuffer();
  }).then(buffer => parseGIF(buffer)).then(gif => {
    validateAndFix(gif);
    return gif;
  }).then(gif => Promise.all([decompressFrames(gif, false), {
    width: gif.lsd.width,
    height: gif.lsd.height
  }])).then(_ref2 => {
    let [frames, options] = _ref2;
    const readyFrames = [];
    const size = options.width * options.height * 4;

    for (let i = 0; i < frames.length; ++i) {
      const frame = frames[i];
      const typedArray = i === 0 || frames[i - 1].disposalType === 2 ? new Uint8ClampedArray(size) : readyFrames[i - 1].slice();
      readyFrames.push(putPixels(typedArray, frame, options));
    }

    return { ...options,
      loaded: true,
      delays: frames.map(frame => frame.delay),
      frames: readyFrames
    };
  });
};

const putPixels = (typedArray, frame, gifSize) => {
  const {
    width,
    height,
    top: dy,
    left: dx
  } = frame.dims;
  const offset = dy * gifSize.width + dx;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pPos = y * width + x;
      const colorIndex = frame.pixels[pPos];

      if (colorIndex !== frame.transparentIndex) {
        const taPos = offset + y * gifSize.width + x;
        const color = frame.colorTable[colorIndex] || [0, 0, 0];
        typedArray[taPos * 4] = color[0];
        typedArray[taPos * 4 + 1] = color[1];
        typedArray[taPos * 4 + 2] = color[2];
        typedArray[taPos * 4 + 3] = 255;
      }
    }
  }

  return typedArray;
};

const genearate = info => {
  return { ...info,
    frames: info.frames.map(buffer => {
      const image = new ImageData(info.width, info.height);
      image.data.set(new Uint8ClampedArray(buffer));
      return image;
    })
  };
};

const createSingleton = (constructor, destructor) => {
  const ref = {};
  return () => {
    if (!ref.instance) {
      ref.instance = constructor();
    }

    useLayoutEffect(() => {
      if (ref.timeout) {
        clearTimeout(ref.timeout);
        delete ref.timeout;
      } else {
        ref.usageCount = (ref.usageCount || 0) + 1;
      }

      return () => {
        ref.timeout = setTimeout(() => {
          ref.usageCount = ref.usageCount - 1;

          if (ref.usageCount === 0) {
            destructor && destructor(ref.instance);
            delete ref.instance;
            delete ref.timeout;
          }
        });
      };
    }, [ref, destructor]);
    return ref.instance;
  };
};

const useUpdatedRef = value => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

const useEventCallback = callback => {
  const ref = useUpdatedRef(callback);
  return useCallback(arg => ref.current && ref.current(arg), []);
};

const useRaf = (callback, pause) => {
  const cb = useEventCallback(callback);
  useLayoutEffect(() => {
    if (!pause) {
      let id;
      let prev = null;

      const handleUpdate = () => {
        id = requestAnimationFrame(now => {
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
  useAsyncEffect(controller => {
    if (typeof src === "string") {
      parse(src, {
        signal: controller.signal
      }).then(raw => genearate(raw)).then(info => cb(info)).catch(error => cb({
        error,
        loaded: true
      }));
    }
  }, [src]);
};

const useWorkerSingleton = /*#__PURE__*/createSingleton(() => new WorkerFactory(), worker => worker.terminate());

const useWorkerParser = (src, callback) => {
  const cb = useEventCallback(callback);
  const worker = useWorkerSingleton();
  useEffect(() => {
    if (typeof src === "string") {
      const handler = e => {
        const message = e.data || e;

        if (message.src === src) {
          const data = message.error ? message : genearate(message);
          cb(data);
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({
        src,
        type: "parse"
      });
      return () => {
        worker.postMessage({
          src,
          type: "cancel"
        });
        worker.removeEventListener("message", handler);
      };
    }
  }, [worker, src]);
};

const usePlayback = (state, updater) => {
  const delay = useRef(0);
  useRaf(dt => {
    const {
      delays,
      index: currentIndex
    } = state;
    delay.current += dt;

    if (delay.current > delays[currentIndex]) {
      delay.current = delay.current % delays[currentIndex];
      updater();
    }
  }, !state.playing);
};

const calcArgs = (fit, frameSize, canvasSize) => {
  switch (fit) {
    case "fill":
      return [0, 0, frameSize.width, frameSize.height, 0, 0, canvasSize.width, canvasSize.height];

    case "contain":
      {
        const ratio = Math.min(canvasSize.width / frameSize.width, canvasSize.height / frameSize.height);
        const centerX = (canvasSize.width - frameSize.width * ratio) / 2;
        const centerY = (canvasSize.height - frameSize.height * ratio) / 2;
        return [0, 0, frameSize.width, frameSize.height, centerX, centerY, frameSize.width * ratio, frameSize.height * ratio];
      }

    case "cover":
      {
        const ratio = Math.max(canvasSize.width / frameSize.width, canvasSize.height / frameSize.height);
        const centerX = (canvasSize.width - frameSize.width * ratio) / 2;
        const centerY = (canvasSize.height - frameSize.height * ratio) / 2;
        return [0, 0, frameSize.width, frameSize.height, centerX, centerY, frameSize.width * ratio, frameSize.height * ratio];
      }

    default:
      return [0, 0];
  }
};

const combine = function () {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return value => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};

const useCanvasSingleton = /*#__PURE__*/createSingleton(() => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 0;
  canvas.height = 0;
  return ctx;
});
const Canvas = /*#__PURE__*/forwardRef(function Canvas(_ref, ref) {
  let {
    index,
    frames,
    width,
    height,
    fit,
    className,
    style
  } = _ref;
  const canvasRef = useRef();
  const ctx = useRef();
  const tempCtx = useCanvasSingleton();
  useLayoutEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, [canvasRef]);
  useLayoutEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  }, [canvasRef, width, height]);
  useEffect(() => {
    const imageData = frames[index];

    if (imageData) {
      if (tempCtx.canvas.width < imageData.width || tempCtx.canvas.height < imageData.height) {
        tempCtx.canvas.width = imageData.width;
        tempCtx.canvas.height = imageData.height;
      }

      if (width > 0 && height > 0) {
        ctx.current.clearRect(0, 0, width, height);
        tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
      }

      tempCtx.putImageData(imageData, 0, 0);
      ctx.current.drawImage(tempCtx.canvas, ...calcArgs(fit, imageData, {
        width,
        height
      }));
    }
  }, [index, frames, width, height, fit]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: combine(canvasRef, ref),
    className: className,
    style: style
  });
});

export { Canvas, useParser, usePlayback, usePlayerState, useWorkerParser };
