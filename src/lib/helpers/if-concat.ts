const ifConcat = (
    source: string = '',
    options: {
      c: any;
      s: string;
    }[],
) => {
  for (let option of options) {
    if (option.c) {
      source += option.s;
    }
  }

  return source;
};

export default ifConcat;
