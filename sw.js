// 도안수목토 재벌부동산 PWA Service Worker (v3 - 캐시 갱신 및 최신 데이터 즉시 반영)
const CACHE_NAME = 'sumokto-chebol-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css?v=20261116_FINAL',
  '/js/app.js?v=20261116_FINAL',
  '/logo01.png',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets could not be pre-cached:', err);
      });
    })
  );
  self.skipWaiting();
});

// 서비스 워커 활성화 및 구버전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시 폴백 (Network-first with cache fallback)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 외부 API나 CDN 요청 또는 로컬 요청 처리
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 유효한 응답이면 캐시에 복사본 저장
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 오프라인 상태이거나 네트워크 에러 시 캐시에서 제공
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
