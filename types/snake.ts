export type Snake = {
    coords: number[][];
    direction: 'up' | 'down' | 'left' | 'right';
    nextDirection: 'up' | 'down' | 'left' | 'right' | null;
}