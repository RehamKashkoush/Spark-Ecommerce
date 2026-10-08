import React from "react";
import { Bell, CheckCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/notificationApi'

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const ref = useRef(null)

  const load = async () => {
    try { const data = await getNotifications(); setNotifications(data.notifications || []); setUnread(data.unreadCount || 0) } catch {}
  }

  useEffect(() => { load(); const timer = window.setInterval(load, 30000); return () => window.clearInterval(timer) }, [])
  useEffect(() => {
    const close = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false) }
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close)
  }, [])

  const read = async (id) => { try { await markNotificationRead(id); setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item)); setUnread((count) => Math.max(0, count - 1)) } catch {} }
  const readAll = async () => { try { await markAllNotificationsRead(); setNotifications((items) => items.map((item) => ({ ...item, read: true }))); setUnread(0) } catch {} }

  return <div className="notification-center" ref={ref}>
    <button className="header-icon notification-button" onClick={() => setOpen((value) => !value)} aria-label="Notifications"><Bell size={19} />{unread > 0 && <span>{unread > 9 ? '9+' : unread}</span>}</button>
    {open && <div className="notification-panel">
      <div className="notification-panel-head"><div><strong>Notifications</strong><small>{unread} unread</small></div><button type="button" onClick={readAll}><CheckCheck size={15} /> Read all</button></div>
      <div className="notification-list">
        {!notifications.length && <div className="notification-empty">No notifications yet.</div>}
        {notifications.map((item) => <Link key={item._id} to={item.link || '/'} className={`notification-item ${item.read ? '' : 'unread'}`} onClick={() => { if (!item.read) read(item._id); setOpen(false) }}><strong>{item.title}</strong><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString()}</small></Link>)}
      </div>
    </div>}
  </div>
}
