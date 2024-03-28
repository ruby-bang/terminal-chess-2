const { Chess } = require("chess.js");
const blessed = require('blessed');
const GetResponse = require('./stock');

const chess = new Chess();
const screen = blessed.screen({
  smartCSR: true,
  title: 'Terminal Button Click Example'
});

const container = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%-1',
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'grey'
    },
    style: {
      bg: 'yellow'
    }
  }
});

screen.append(container);

const statusBar = blessed.box({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  style: {
    bg: 'cyan'
  },
  content: ' Press "q" to exit '
});
screen.append(statusBar);

function handleButtonClick(button) {
  chess.move(button.content);
  const fene = chess.fen();
  GetResponse(fene).then((bestMove) => {
    console.log(bestMove);
    chess.move(bestMove);
    updateButtons();
  });
}

function createButton(text, index) {
  const button = blessed.button({
    top: `${index * 6}%`,
    left: '5%',
    width: '20%',
    height: '8%',
    content: text,
    style: {
      fg: 'white',
      bg: '',
      focus: {
        bg: 'red'
      }
    },
    border: {
      type: 'line'
    },
    mouse: true,
    clickable: true
  });

  button.on('press', () => {
    handleButtonClick(button);
  });

  return button;
}

function updateButtons() {
  const buttonTexts = chess.moves();
  container.setContent('');
  buttonTexts.forEach((text, index) => {

    const button = createButton(text, index);
    container.append(button);
  });
  screen.render();
}

updateButtons();

screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

screen.render();
