import code from './source'

export default function WorkerFactory (options) {
  let worker;
  try {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    worker = new Worker(url, options)
    URL.revokeObjectURL(url)
  } catch (e) {}

  return worker 
}
