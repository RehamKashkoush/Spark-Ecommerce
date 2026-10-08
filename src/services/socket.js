import React from "react";
import { io } from 'socket.io-client'
import { API_URL } from './api'

export function createTrackingSocket() {
  const token = localStorage.getItem('spark-token')
  const socketUrl = API_URL.replace(/\/api$/, '')
  return io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] })
}
