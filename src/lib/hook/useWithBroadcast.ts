'use client'

import { BroadcastChannel } from 'broadcast-channel'
import { useEffect, useMemo } from 'react'

const REQUEST_PROCESS: number[] = []

type Action = 'start' | 'finish'
type Session = {
  key: string
}

export const useWithBroadcast = () => {
  const channelRefreshAction = useMemo(
    () => new BroadcastChannel<Action>('jwt-refresh-action'),
    [],
  )
  useEffect(() => {
    const handler = (action: Action) => {
      if (action === 'start') {
        REQUEST_PROCESS.push(1)
        console.debug(
          `refreshToken REQUEST_PROCESS  push on channel ${REQUEST_PROCESS.length}`,
        )
        return
      }

      REQUEST_PROCESS.splice(0)
      console.debug(
        `refreshToken REQUEST_PROCESS  clear on channel ${REQUEST_PROCESS.length}`,
      )
    }
    channelRefreshAction.addEventListener('message', handler)

    return () => {
      channelRefreshAction.removeEventListener('message', handler)
    }
  }, [channelRefreshAction])

  const action = async () => {
    const tokenManager = {
      isRefreshing() {
        return REQUEST_PROCESS.length !== 0
      },
      start() {
        REQUEST_PROCESS.push(1)
        console.debug(`refreshToken REQUEST_PROCESS  push on local ${REQUEST_PROCESS.length}`)
        channelRefreshAction.postMessage('start' as Action)
      },
      finish() {
        REQUEST_PROCESS.splice(0)
        console.debug(`refreshToken REQUEST_PROCESS  clear on local ${REQUEST_PROCESS.length}`)
        channelRefreshAction.postMessage('finish' as Action)
      },
    }
    tokenManager.start()
  }

  const clear = async () => {
    const tokenManager = {
      isRefreshing() {
        return REQUEST_PROCESS.length !== 0
      },
      start() {
        console.debug('refreshToken REQUEST_PROCESS  push on local')
        REQUEST_PROCESS.push(1)
        channelRefreshAction.postMessage('start' as Action)
      },
      finish() {
        console.debug('refreshToken REQUEST_PROCESS  clear on local')
        REQUEST_PROCESS.splice(0)
        channelRefreshAction.postMessage('finish' as Action)
      },
    }
    tokenManager.finish()
  }

  const get = async () => {
    return REQUEST_PROCESS.length
  }

  return { action, clear, get }
}
