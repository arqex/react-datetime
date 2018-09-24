const padStart = (value: string, desiredLength: number) => {
  let str = `${value}`;
  while (str.length < desiredLength) {
    str = `0${str}`;
  }

  return str;
};

export default padStart;
