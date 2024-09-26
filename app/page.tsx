'use client'

import { Game } from "@/app/Game"
import { useState } from "react"
import type { GameStatus } from "@/types";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus["status"]>("stopped");

  
  return (
    <main className="min-h-screen flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center">Snake Game</h1>
      <div className="flex flex-col gap-2 max-w-[300px] mx-auto">
        Game status: {gameStatus}

        <button
          onClick={() => setGameStatus("playing")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play
        </button>
        <button
          onClick={() => setGameStatus("stopped")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Stop
        </button>
      </div>
      <div className="m-auto">
        <Game
          status={gameStatus}
          setStatus={setGameStatus}
        />
      </div>
    </main>
  )
}