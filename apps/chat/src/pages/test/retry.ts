const retry = (data) => {
  let times = 3;

  return new Promise(async (res, rej) => {
    const run = async () => {
      const r = await axios(data);
      res(r);
    };
    try {
      run();
    } catch (error) {
      times--;
      if (times > 0) {
        return run();
      } else {
        rej(error);
      }
    }
  });
};

/*
2. 封装一个使用Promise发送异步请求的函数，可以在失败时重试3次
*/

async () => {
  await retry(async () => {});
};
