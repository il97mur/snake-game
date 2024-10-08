"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import type { Snake, Eat, GameStatus } from "@/types";

const initialSnake: Snake = {
    coords: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
    ],
    direction: "up",
    nextDirection: "up",
};

type GameProps = {
    status: GameStatus["status"];
    setStatus: (status: GameStatus["status"]) => void;
};

export const Game = ({ status, setStatus } : GameProps) => {
    const fieldWidth = 50;
    const fieldHeight = 50;

    const [snake, setSnake] = useState<Snake>(initialSnake);
    const [eat, setEat] = useState<Eat>({
        coords: [Math.round(Math.random() * fieldWidth), Math.round(Math.random() * fieldHeight)],
    });

    const handleChangeDirection = useCallback(
        (event: KeyboardEvent) => {
            if (event.code === "ArrowUp" && snake.direction !== "down" && snake.nextDirection !== "down") {
                setSnake((prevSnake) => ({
                    ...prevSnake,
                    nextDirection: "up",
                }));
            } else if (event.code === "ArrowDown" && snake.direction !== "up" && snake.nextDirection !== "up") {
                setSnake((prevSnake) => ({
                    ...prevSnake,
                    nextDirection: "down",
                }));
            } else if (event.code === "ArrowLeft" && snake.direction !== "right" && snake.nextDirection !== "right") {
                setSnake((prevSnake) => ({
                    ...prevSnake,
                    nextDirection: "left",
                }));
            } else if (event.code === "ArrowRight" && snake.direction !== "left" && snake.nextDirection !== "left") {
                setSnake((prevSnake) => ({
                    ...prevSnake,
                    nextDirection: "right",
                }));
            }
        },
        [snake.direction, snake.nextDirection]
    );

    const regenerateEat = () => {
        const generateEatCoords = (): [number, number] => {
            const XCoord = Math.floor(Math.random() * fieldWidth);
            const YCoord = Math.floor(Math.random() * fieldHeight);
            if (XCoord === snake.coords[0][0] && YCoord === snake.coords[0][1]) {
                return generateEatCoords();
            }
            return [XCoord, YCoord];
        };
        setEat({ coords: generateEatCoords() });
    };

    useEffect(() => {
        if (status !== 'playing') return;
        const interval = setInterval(() => {
            setSnake((prevSnake) => {
                const direction = prevSnake.nextDirection || prevSnake.direction;
                const getHeadCoords = () => {
                    switch (direction) {
                        case "up":
                            return [prevSnake.coords[0][0], (prevSnake.coords[0][1] - 1 + fieldHeight) % fieldHeight];
                        case "down":
                            return [prevSnake.coords[0][0], (prevSnake.coords[0][1] + 1) % fieldHeight];
                        case "left":
                            return [(prevSnake.coords[0][0] - 1 + fieldWidth) % fieldWidth, prevSnake.coords[0][1]];
                        case "right":
                            return [(prevSnake.coords[0][0] + 1) % fieldWidth, prevSnake.coords[0][1]];
                    }
                };

                const headCoords = getHeadCoords();

                const isSnakeOverlaps = prevSnake.coords.some((coord) => coord[0] === headCoords[0] && coord[1] === headCoords[1]);
                if (isSnakeOverlaps) {
                    setStatus('lost');
                    return prevSnake;
                }

                const isSnakeEating = headCoords[0] === eat.coords[0] && headCoords[1] === eat.coords[1];

                let newCoords = null;
                if (isSnakeEating) {                   
                    regenerateEat();
                    newCoords = prevSnake.coords;
                } else {
                    newCoords = prevSnake.coords.slice(0, -1);
                }

                newCoords.unshift(headCoords);

                return {
                    ...prevSnake,
                    coords: newCoords,
                    direction: direction,
                    nextDirection: null,
                };
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [status, eat.coords]);
    useEffect(() => {
        if (status !== 'playing') return;
        const eatInterval = setInterval(() => {
            regenerateEat();
        }, 10000);

        return () => {
            clearInterval(eatInterval);
        };
    }, [status, eat.coords]);

    useEffect(() => {
        document.addEventListener("keydown", handleChangeDirection);

        return () => {
            document.removeEventListener("keydown", handleChangeDirection);
        };
    }, [handleChangeDirection]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the game board
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the snake
        snake.coords.forEach(([x, y]) => {
            ctx.fillStyle = "black";
            ctx.fillRect(x * 10, y * 10, 10, 10); // Assuming 2x2 pixel cells
        });

        // Draw the eat
        ctx.fillStyle = "red";
        ctx.fillRect(eat.coords[0] * 10, eat.coords[1] * 10, 10, 10); // Assuming 2x2 pixel cells
    }, [snake, eat]);

    return (
        <canvas
            ref={canvasRef}
            width={fieldWidth * 10} // Assuming 2x2 pixel cells
            height={fieldHeight * 10}
        />
    );
};
