const CACHE_NAME = 'neovalues-deutsch-v14';
const APP_SHELL = [
  './',
  './index.html',
  './Instruction.html',
  './quiz.html',
  './results.html',
  './values.html',
  './ideologies.html',
  './description.html',
  './style.css',
  './theme.js',
  './quiz.js',
  './data.js',
  './questions_tree.json',
  './icon.svg',
  './manifest.webmanifest',
  './icons/economics/agrarian_socialism.svg',
  './icons/economics/basic_income_capitalism.svg',
  './icons/economics/cameralism.svg',
  './icons/economics/communization.svg',
  './icons/economics/corporatism.svg',
  './icons/economics/countereconomics.svg',
  './icons/economics/dirigisme.svg',
  './icons/economics/distributism.svg',
  './icons/economics/feudalism.svg',
  './icons/economics/free_market_distributism.svg',
  './icons/economics/free_socialism.svg',
  './icons/economics/guild_socialism.svg',
  './icons/economics/keynesianism.svg',
  './icons/economics/laissez_faire.svg',
  './icons/economics/market_socialism.svg',
  './icons/economics/mutual_distributism.svg',
  './icons/economics/mutualism.svg',
  './icons/economics/neo_corporatism.svg',
  './icons/economics/ordnungspolitik.svg',
  './icons/economics/paternalistic_capitalism.svg',
  './icons/economics/residualism.svg',
  './icons/economics/rhine_capitalism.svg',
  './icons/economics/social_corporatism.svg',
  './icons/economics/social_distributism.svg',
  './icons/economics/social_market.svg',
  './icons/economics/social_solidarity_economy.svg',
  './icons/economics/socialism.svg',
  './icons/economics/state_capitalism.svg',
  './icons/economics/state_socialism.svg',
  './icons/economics/syndicalism.svg',
  './icons/economics/third_way.svg',
  './icons/economics/utopian_socialism.svg',
  './icons/economics/yellow_socialism.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(async (error) => {
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match('./index.html');
            if (fallback) return fallback;
          }
          throw error;
        });
    })
  );
});
