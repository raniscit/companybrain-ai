export function vectorToSql(vector: number[]) {
    return `[${vector.join(",")}]`;
}