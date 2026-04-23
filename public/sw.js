// Service Worker for IELTS Vocabulary Learning System
const CACHE_NAME = 'ielts-vocab-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/ebbinghaus.html',
  '/synonyms.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/config.js',
  '/auth.js',
  '/vocabulary_data.js'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.log('Cache failed:', err);
    })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 网络优先策略：先尝试网络，失败时使用缓存
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求和跨域请求
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // 跳过 Firebase 和其他外部 API
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('google') ||
      url.hostname.includes('gstatic')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 网络请求成功，更新缓存
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 缓存也没有，返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
