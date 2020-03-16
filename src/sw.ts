/// <reference no-default-lib="true" />
/// <reference lib="es7" />
/// <reference lib="webworker" />
/// <reference lib="dom.iterable" />
import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { baseURL } from './util/api';

const sw = (self as unknown) as ServiceWorkerGlobalScope & {
  __precacheManifest: {
    files: string[];
    ver: string;
  };
};
interface DB extends DBSchema {
  pending: {
    key: number;
    value: StorableRequest;
  }
};
const pending = (): Promise<IDBPDatabase<DB>> => openDB<DB>('pending', 1, {
  upgrade(db) {
    db.createObjectStore('pending', { autoIncrement: true });
  }
});
const cache = (): Promise<Cache> => caches.open(sw.__precacheManifest.ver);
const cacheRequest = (request: Request): Promise<Response> =>
  cache().then(cache =>
    fetch(request).then(freshRes => {
      cache.put(request, freshRes.clone());
      return freshRes;
    })
  );
const networkFirst = new RegExp(baseURL);
const postponable = new RegExp(baseURL + '/submit/');

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
      ? fetch(ev.request.clone()).catch(async e => {
        if (postponable.test(ev.request.url)) {
          const db = await pending();
          db.add('pending', await requestToStorable(ev.request));
          return new Response();
        } else {
          throw e;
        }
      })
      : cache().then(cache => cache.match(ev.request).then(res => res || cacheRequest(ev.request)))
  );
});
sw.addEventListener('sync', e => {
  if (e.tag === 'sendPending') {
    e.waitUntil(pending().then(async db => {
      const pendingRequests = db.transaction('pending', 'readwrite').objectStore('pending');
      const reqs = await pendingRequests.getAll();
      await pendingRequests.clear();
      for (let req of reqs) {
        await fetch(storableToRequest(req));
      }
    }))
  }
});

type StorableRequest = RequestInit & {
  url: Request['url'];
}

const requestToStorable = async (req: Request): Promise<StorableRequest> => {
  const headers: { [k: string]: string } = {};
  for (let [k, v] of req.headers.entries())
    headers[k] = v;
  const storeReq: StorableRequest =  {
    cache: req.cache,
    credentials: req.credentials,
    headers,
    integrity: req.integrity,
    method: req.method,
    redirect: req.redirect,
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    url: req.url
  };
  if (!['HEAD', 'GET'].includes(req.method)) {
    storeReq.body = await req.clone().blob();
  }
  return storeReq;
}

const storableToRequest = (req: StorableRequest): Request => new Request(req.url, req);