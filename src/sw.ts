/// <reference no-default-lib="true" />
/// <reference lib="es7" />
/// <reference lib="webworker" />
const sw = (self as unknown) as ServiceWorkerGlobalScope & {
  __precacheManifest: {
    files: string[];
    ver: string;
  };
};

const cache = (): Promise<Cache> => caches.open(sw.__precacheManifest.ver);
const cacheRequest = (request: Request): Promise<Response> =>
  cache().then(cache =>
    fetch(request).then(freshRes => {
      cache.put(request, freshRes.clone());
      return freshRes;
    })
  );
const networkFirst = /\/api/;

sw.addEventListener('install', ev => {
  ev.waitUntil(
    cache()
      .then(c => c.addAll(sw.__precacheManifest.files))
      .then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', ev => {
  sw.clients.claim();
  ev.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== sw.__precacheManifest.ver).map(key => caches.delete(key))
        )
      )
  );
});
sw.addEventListener('fetch', ev => {
  ev.respondWith(
    networkFirst.test(ev.request.url)
      ? fetch(ev.request)
      : cache().then(cache => cache.match(ev.request).then(res => res || cacheRequest(ev.request)))
  );
});
