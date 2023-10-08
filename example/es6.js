async function fiberTask() {
  let a = 1;
  let b = 2;
  await longtask(0);
  // await longtask(1);
  // longtask(2);
  // if (a) {
  //   longtask(3);
  // }
  // let b = await longtask(4);
  // let c;
  // try {
  //   c = longtask(5);
  // } catch (e) {
  //   // noop
  // }
  return { a, b, c };
}

fiberTask();
