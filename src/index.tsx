import { h, Run } from './framework/components';
import { run } from './framework/fiber';

const React = {
  createElement: h
};

let taskCount = 0;
function longTask() {
  console.time(taskCount.toString());
  let sum = 0;
  while (sum < 5e6) {
    sum += Math.random();
  }
  console.timeEnd(taskCount.toString());
  taskCount++;
  // console.log('done', taskCount++, sum);
}

const Runs = (
  <Run>
    <Run>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
    </Run>
    <Run>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
    </Run>
    <Run>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
      <Run then={longTask}/>
    </Run>
  </Run>
);

window.addEventListener('keypress', (e) => {
  if (!e) run(Runs as any);
});

// run(Runs as any);
