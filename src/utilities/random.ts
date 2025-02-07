export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomNumber(min: number = 0, max: number = 1): number {
    return Math.random() * (max - min) + min;
}

export function randomBoolean(): boolean {
    return Math.random() < 0.5;
}

export function randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}