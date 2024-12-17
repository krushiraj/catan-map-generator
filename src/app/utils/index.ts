// eslint-disable @typescript-eslint/no-explicit-any
export const randomiser = <T>(arr: T[]) => {
  let currentIndex = arr.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
};
