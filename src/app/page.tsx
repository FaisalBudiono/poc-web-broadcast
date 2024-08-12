'use client'

import { useWithBroadcast } from '@/lib/hook/useWithBroadcast'
import { useEffect, useState } from 'react'

export default function Home() {
  const { clear, action, get } = useWithBroadcast()

  const [time, setTime] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <main className='container mx-auto'>
      <div className='mt-10 bg-white text-center text-4xl text-black'>
        Time elapsed: {time}
      </div>
      <div className='flex flex-row justify-center space-x-5 p-24'>
        <button
          className='bg-yellow-500 p-10'
          onClick={async () => {
            await action()

            setCount(await get())
          }}
        >
          Action
        </button>
        <button
          className='bg-green-500 p-10'
          onClick={async () => {
            setCount(await get())
          }}
        >
          Get
        </button>
        <button
          className='bg-red-500 p-10'
          onClick={async () => {
            await clear()

            setCount(await get())
          }}
        >
          Clear
        </button>
      </div>
      <div className='flex flex-row justify-center border border-white text-6xl'>
        Counter: {count}
      </div>
    </main>
  )
}
