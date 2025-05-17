const CACHE_NAME = "hand-cricket-v1"
const urlsToCache = [
    "./index.html",
    "./handCricket.css",
    "./handCricket.js",
    "./confetti.min.js",
    "./manifest.json",
    "./pwa.js",
    "./offline.html",
    "./audio/childrenApplause.mp3",
    "./audio/awwSound.mp3",
    "./audio/whistle.wav",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache")
            return cache.addAll(urlsToCache)
        })
    )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// Fetch event - serve from cache or network with offline fallback
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response
            }

            return fetch(event.request)
                .then((response) => {
                    // Check if we received a valid response
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response
                    }

                    // Clone the response
                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache)
                    })

                    return response
                })
                .catch(() => {
                    // If the request is for the main page and it fails, show the offline page
                    if (event.request.mode === "navigate") {
                        return caches.match("./offline.html")
                    }
                    // For other resources that might be missing when offline
                    return new Response("Resource not available offline")
                })
        })
    )
})
