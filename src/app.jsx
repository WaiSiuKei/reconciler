/* eslint-disable */
import React from './mini-react.ts';

class App extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">abc</div>
        <div className="game-info">
          <div>status</div>
          <ol>moves</ol>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line react/no-deprecated
React.render(<App />, document.getElementById('root'));
