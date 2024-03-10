
// Team members: Maya Cranor and AJ Evans


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

function elt(id) {
  // useful shortcut
  return document.getElementById(id)
}

function create(tag, attr, id) {
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
    this.board = this.createBoard(6)
    this.pos1 = null
    this.pos2 = null
    this.round = 1
    this.matches = 0
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
      this.round += 1
      if (this.board[this.pos1].card == this.board[this.pos2].card){
        this.board[this.pos1].state = 2
        this.board[this.pos2].state = 2
        this.matches += 1
      } else {
        this.board[this.pos1].state = 0
        this.board[this.pos2].state = 0
      }
    }
  }

  actionNewGame() {
    this.board = this.createBoard(6)
    this.pos1 = null
    this.pos2 = null
    this.round = 1
    this.matches = 0
    elt("congrats-board").style.display = "none"

  }
}


class BoardView {

  constructor(m) {
    // subscription to model (change card)
    this.model = m
    this.create_board()
  }

  create_board(){
    const gameGrid = create('div', -1, 'game-grid')
    // Create and append the card elements
    for (let i = 0; i < 12; i++) {
      const cardDiv = create('div',  {'class':'card hidden', 'data_value':this.model.board[i].card}, i) 
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
    for (let i = 0; i < 12; i++) {
      elt(i).addEventListener('click', () => { this.handleClick(i)} )
    }
    this.can_click = true
  }

  handleClick(card){
    if (this.can_click) {
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
          this.can_click = false
          setTimeout(() => {
            this.update_card(this.model.pos1)
            this.update_card(this.model.pos2)
            this.model.pos1 = null
            this.model.pos2 = null
            this.can_click = true
          }, 1000)
        }
        // update round counter
        elt('counter').textContent = "Round: " + this.model.round;
      }
    }
  }  

  update_card(card){
     elt(card).classList.remove("hidden", "chosen", "revealed")
    switch(this.model.board[card].state){
      case 0:
        elt(card).classList.add("hidden")
        elt(card).style.backgroundImage = "url('./shapes/card-bg.jpg')"
        break
      case 1:
        elt(card).classList.add("chosen")
        elt(card).classList.add("revealed")
        elt(card).style.backgroundImage = this.shape_mapping[this.model.board[card].card];
        break
      case 2:
        elt(card).classList.add("revealed")
        elt(card).style.backgroundImage = this.shape_mapping[this.model.board[card].card];
    }
  }
}


class RoundView {

  constructor(m) {
    this.model = m
    this.render()
  }

  render(){
    const counter = create('h2', -1, 'counter')
    counter.textContent = "Round: " + this.model.round;
    document.body.appendChild(counter);
  }
}


class FinishedView {

  constructor(m) {
    this.model = m
    this.renderNewGame()
    this.renderWin()
  }

  renderNewGame(){
    const bottom = create('div', -1, 'bottom')
    const newGame = create('button', -1, 'newGame')
    newGame.textContent = "Start New Game"
    document.body.appendChild(bottom)
    bottom.appendChild(newGame)
  }

  renderWin(){
    const div = create('div', -1, 'congrats-board')
    const congrats = create('h2', -1, "congrats")
    congrats.textContent = "Congratulations"
    const button = create('button', -1, "play-again")
    button.textContent = "Play Again"
    document.body.appendChild(div)
    div.appendChild(congrats)
    div.appendChild(button)
    div.style.display = "none"
  }

}


class NewGameController {
  constructor(m) {
    this.model = m
    elt('newGame').addEventListener('click', () => { this.handleNewGame()} )
    elt("play-again").addEventListener('click', () => { this.handleNewGame()})
    for (let i = 0; i < 12; i++) {
      elt(i).addEventListener('click', () => { this.checkWin(i)} )
    }
  }

  handleNewGame(){
    this.model.actionNewGame()
    this.resetBoard()
  }

  resetBoard(){
    for (let card = 0; card<12; card++){
      card = card.toString()
      elt(card).classList.remove("hidden", "chosen", "revealed")
      elt(card).classList.add("hidden")
      elt(card).style.backgroundImage = "url('./shapes/card-bg.jpg')"
    }
    elt('counter').textContent = "Round: " + this.model.round;
  }

  checkWin(){
    if (this.model.matches == 6){
      elt('congrats-board').style.display= "flex"
    }
  }
}

