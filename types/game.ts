export type GameStatus = {
    status: "playing" | "stopped" | "won" | "lost";
    message?: string;
}