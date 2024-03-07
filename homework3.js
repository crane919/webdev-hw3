
// Team members:


// This initializes the application.
// You can put additional setup code in here, or add new views and controllers.
window.onload = () => {
  const model = new Model()
  // We don't do anything with the resulting objects, so we don't assign them
  // to variables.
  new BoardView(model)
  new RoundView(model)
  new FinishedView(model)
  new NewGameController(model)
}


// You can add new classes, new methods, anything that can help you.
// You can also change the parameters to existing methods.
// The current parameters are there mostly to get you started.


class Model {

  constructor() {
    console.log('Set up the initial model state here')
  }

  // Actions.
  actionChooseCard() {
  }

  actionNewGame() {
  }

}


class BoardView {

  constructor(m) {
    this.model = m
    console.log('Set up board view here')
  }
}


class CardController {

  constructor(m) {
    this.model = m
    console.log('Set up card controller here')
  }
}


class RoundView {

  constructor(m) {
    this.model = m
    console.log('Set up round view here')
  }
}


class FinishedView {

  constructor(m) {
    this.model = m
    console.log('Set up finished view here')
  }
}


class NewGameController {
  constructor(m) {
    this.model = m
    console.log('Set up new game controller here')
  }
}
