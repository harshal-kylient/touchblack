const createArray = (arr: any[], n: number) => Array.from({ length: n }, (_, i) => (i < arr.length ? arr[i] : undefined));
export default createArray;
