const btn = document.querySelector('.btn')
const h1 = document.querySelector('h1')
const output = document.querySelector('.output')
const output1 = generateElement(document.body, 'div', 'Please Make Your Selection<br># of Questions')
const inputVal = document.querySelector('.val')
output1.append(inputVal)
const select1 = generateElement(output1, 'select')
const select2 = generateElement(output1, 'select')

output1.append(btn)

const baseURL = `https://opentdb.com/api.php?`

//! The global game obj
const game = {
  questions: [],
  question: 0,
  elements: []
}

const difficulties = ['easy', 'medium', 'hard']

const categories = [
  {
    title: 'Computer Science',
    num: 18
  },
  {
    title: 'General Knowledge',
    num: 9
  },
  {
    title: 'Gadgets',
    num: 30
  }
]

//! Load Start Screen w/ question amount input
window.addEventListener('DOMContentLoaded', (e) => {
  generateSelections()
  // testInsert()
  btn.textContent = 'Start Game'
  inputVal.setAttribute('type', 'number')
  inputVal.defaultValue = 3
})

function generateSelections() {
  categories.forEach((category) => {
    console.log(category)
    const optionElement = generateElement(select1, 'option', category.title)
    optionElement.value = category.num
  })
  difficulties.forEach((difficulty) => {
    console.log(difficulty)
    const optionElement = generateElement(select2, 'option', difficulty.toUpperCase())
    optionElement.value = difficulty
  })
}

//! Here we generate the page content of the Trivia Game
btn.addEventListener('click', (e) => {
  // Hide start screen elements
  btn.style.display = 'none'
  inputVal.style.display = 'none'
  // Display game content
  h1.textContent = inputVal.value + ' question(s) selected'
  // Construct fetch url and call for questions
  let tempURL = `${baseURL}amount=${inputVal.value}&category=${select1.value}&difficulty=${select2.value}`
  popPage(tempURL)
})

//! Get Questions from the API for the game and store them in our global object
function popPage(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      game.questions = data.results
      outputPage()
    })
}

//! Iterate through content and output it to page
function outputPage() {
  if (game.question >= game.questions.length) {
    output.innerHTML = 'game over ???? play again'
    btn.style.display = 'block'
    inputVal.style.display = 'block'
    game.question = 0
  } else {
    output.innerHTML = ''
    // console.log(game.questions)
    // console.log(game.questions[game.question])
    let question = game.questions[game.question]
    game.question++ // move to next question
    console.log(question)
    // Build an array of answers
    let answers = question.incorrect_answers
    // Randomize where the correct answer is placed
    let randomAnswerIndex = Math.floor(Math.random() * (answers.length + 1))
    answers.splice(randomAnswerIndex, 0, question.correct_answer)

    console.log(answers)
    const mainDiv = generateElement(output, 'div')
    const q1 = generateElement(mainDiv, 'div', question.question)

    game.elements.length = 0 // empties out the game.elements array

    const answersDiv = generateElement(output, 'div')
    answers.forEach((answer) => {
      const answer1 = generateElement(answersDiv, 'button', answer)
      game.elements.push(answer1)
      if (answer == question.correct_answer) {
        answer1.bgColor = 'green'
      } else {
        answer1.bgColor = 'red'
      }
      answer1.addEventListener('click', (e) => {
        game.elements.forEach((btn) => {
          btn.disabled = true
          btn.style.backgroundColor = btn.bgColor
          btn.style.color = 'white'
          // btn.style.borderColor = 'white'
        })

        const message = generateElement(answersDiv, 'div', 'You got it wrong, dummy!<br>')

        if (answer === question.correct_answer) {
          console.log('Correct answer!')
          message.innerHTML = 'You got it right!<br>'
          answer1.style.backgroundColor = 'green'
        } else {
          console.log('Wrong...')
          answer1.style.backgroundColor = 'red'
        }
        nextQuestion(answersDiv)
        console.log(game)
      })
    })
    // game.questions.forEach((item) => {
    //   console.log(item)
    // })
  }
}

//! Generate next question button w/ click handler to next question
function nextQuestion(parent) {
  const nextBtn = generateElement(parent, 'button', 'Next Question')
  // Click to move to next question
  nextBtn.addEventListener('click', outputPage)
}

//! Helper function to create an element and append it to target parent
//? generator object?
function generateElement(parent, eleType, html = '') {
  const temp = document.createElement(eleType)
  temp.innerHTML = html
  parent.append(temp)
  return temp
}

//! //////////////////////////////////////////////////////////////////
//! Test functions

//! Make sure that we are inserting content properly in the tempArray
function testInsert() {
  for (let i = 0; i < 500; i++) {
    let tempArr = [0, 0, 0]
    let randomIndex = Math.floor(Math.random() * (tempArr.length + 1))
    tempArr.splice(randomIndex, 0, 1)
    output.innerHTML += JSON.stringify(tempArr) + ': ' + randomIndex + '<br>'
  }
}
