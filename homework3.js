
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
  new CardController(model)
  new NewGameController(model)
}


// You can add new classes, new methods, anything that can help you.
// You can also change the parameters to existing methods.
// The current parameters are there mostly to get you started.

function elt(id) {
  // useful shortcut
  return document.getElementById(id)
}

function 
create(tag, attr, id) {
  const elt = document.createElement(tag)
  if (id != -1) {
    elt.id = id.toString()
  }
  if (attr != -1) {
    for (let at of Object.keys(attr)) {
      elt.setAttribute(at, attr[at])
    }
  }
  return elt
}


class Model {

  constructor() {
    console.log('Set up the initial model state here')
    this.board = this.createBoard(6)
    this.pos1 = null
    this.pos2 = null
    this.round = 1
    // add current round state, increments every time we get a match
    // game over state
    this.changedCardSubscribers = []
    console.log(this.board)
  }

  helper(board, size, j) {
    let index = Math.floor(Math.random()*(size))
    while (board[index].card != 0) {
      index++
      if (index == (2*size)) {
        index = 0
      }
    }
    board[index].card = j
    return board
  }

  createBoard(size) {
    let board = new Array(size); for (let i=0; i<(2*size); i++) board[i]= {card: 0, state: 0}
    for (let j=1; j<size; j++) {
      board = this.helper(board, size, j)
      board = this.helper(board, size, j)
    }
    return board
  }

  subChangeCard(card){
    this.changedCardSubscribers.push(card)
  }

  // Actions.
  actionChooseCard(card) {
    let cardState = this.board[card].state
    // only click on hidden cards
    if (cardState == 0){
      if (this.pos1 == null){ // first card
        this.board[card].state = 1
        this.pos1 = card
      } else { // second card
        this.board[card].state = 1
        this.pos2 = card
      }  
    } else if (cardState == 1){
      // check how two chosen cards should be resolved
      if (this.board[this.pos1].card == this.board[this.pos2].card){
        this.board[this.pos1].state = 2
        this.board[this.pos2].state = 2
      } else {
        this.board[this.pos1].state = 0
        this.board[this.pos2].state = 0
      }
    }
  }

  actionNewGame() {
  }
  // reset everything
  

}


class BoardView {

  constructor(m) {
    // subscription to model (change card)
    this.model = m
    console.log('Set up board view here')
    this.create_board()
  }

  create_board(){
    console.log("It's time to create the board")
    const gameGrid = create('div', -1, 'game-grid')
    // Create and append the card elements
    for (let i = 0; i < 12; i++) {
      const cardDiv = create('div',  {'class':'card hidden', 'data_value':this.model.board[i].card}, i) 
      // cardDiv.addEventListener('click', () => { this.model.actionChooseCard(i)} )
      gameGrid.appendChild(cardDiv)
    }
    document.body.appendChild(gameGrid)
  }
 

}


class CardController {
  // when board view inits assign one controller per card
  constructor(m) {
    this.model = m
    this.shape_mapping = {"0":"url('shapes/red-circ.svg')", "1":"url('shapes/blu-circ.svg')", "2":"url('shapes/grn-circ.svg')", "3":"url('shapes/red-rect.svg')", "4":"url('shapes/blu-rect.svg')", "5":"url('shapes/grn-rect.svg')"}
    console.log('Set up card controller here aaaaaaaaaa')
    for (let i = 0; i < 12; i++) {
      elt(i).addEventListener('click', () => { this.handleClick(i)} )
    }
  }

  handleClick(card){
    console.log("hello i was clicked", card)
    this.model.actionChooseCard(card) // call choose card
    // either pos1 or pos 2 will be updated
    this.update_card(card) // update_card
    // check match logic time
    if (this.model.pos1 != null && this.model.pos2 != null){
      // check match
      this.model.actionChooseCard(card) //update model array
      if (this.model.board[this.model.pos1].card == this.model.board[this.model.pos2].card) {
        // this a match
        this.update_card(this.model.pos1)
        this.update_card(this.model.pos2)
        this.model.pos1 = null
        this.model.pos2 = null        
      } else {
        // this not a match
        console.log(this.model.board)
        setTimeout(() => {
          this.update_card(this.model.pos1)
          this.update_card(this.model.pos2)
          this.model.pos1 = null
          this.model.pos2 = null
        }, 1000)
      }
      
    }
  }

  update_card(card){
    console.log("hello update card")
    console.log(card, "this is card")
    elt(card).classList.remove("hidden", "chosen", "revealed")
    switch(this.model.board[card].state){
      case 0:
        elt(card).classList.add("hidden")
        console.log("noneeee")
        elt(card).style.backgroundImage = 'none'
        break
      case 1:
        elt(card).classList.add("chosen")
        elt(card).classList.add("revealed")
        elt(card).style.backgroundImage = this.shape_mapping[this.model.board[card].card];
        break
      case 2:
        elt(card).classList.add("revealed")
        console.log(this.shape_mapping)
        elt(card).style.backgroundImage = this.shape_mapping[this.model.board[card].card];

    }
  }

}


class RoundView {

  constructor(m) {
    this.model = m
    console.log('Set up round view here')
    this.render()
  }

  render(){
    const counter = create('h2', -1, 'counter')
      // Set the text content of the header to "counter"
    counter.textContent = "Round: " + this.model.round;
    document.body.appendChild(counter);

  }
  // subscription to model
  // when round changes it changes the view count
}


class FinishedView {

  constructor(m) {
    this.model = m
    console.log('Set up finished view here')
  }
  // subscription to game finished notif
  // display start new game button and finished box
}


class NewGameController {
  constructor(m) {
    this.model = m
    console.log('Set up new game controller here')
  }
  // invoke start new game action
}