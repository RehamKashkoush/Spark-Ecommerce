self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(self.registration.showNotification(data.title || 'Spark Commerce', {
    body: data.body || 'You have a new notification.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { link: data.link || '/', ...(data.data || {}) }
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.link || '/', self.location.origin).href
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    const client = clientList.find((item) => 'focus' in item)
    if (client) { client.navigate(target); return client.focus() }
    return clients.openWindow(target)
  }))
})
