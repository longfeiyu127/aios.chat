const sleep = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, time);
  });
};

async () => {
  console.log(Date.now());
  await sleep(5);
  console.log(Date.now());
};
