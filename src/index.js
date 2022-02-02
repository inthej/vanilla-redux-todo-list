import { createStore } from 'redux'
import $ from 'jquery'
import AppConstants from "./common/AppConstants";

// DOM Reference
const myInput = $('#myInput')
const addBtn = $('.addBtn')
const todoList = $('#todoList')

// Action Types
const ADD_TODO = 'ACC_TODO'
const CLOSE_TODO = 'CLOSE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// Action Create Function
const addTodo = text => ({ type: ADD_TODO, text })
const closeTodo = todoIdx => ({ type: CLOSE_TODO, todoIdx })
const toggleTodo = todoIdx => ({ type: TOGGLE_TODO, todoIdx })

// InitialState
const initialState = {
  todos: [], // { idx:0, checked: false, text: 'text' }
  todoIndexRef: 0
}

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      state = {...state, todoIndexRef: state.todoIndexRef + 1}
      const todo = {
        idx: state.todoIndexRef,
        checked: false,
        text: action.text,
      }
      return {
        ...state,
        todos: state.todos.concat(todo)
      }
    case CLOSE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.idx !== action.todoIdx)
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => todo.idx === action.todoIdx ? {
          ...todo,
          checked: !todo.checked
        } : todo)
      }
    default:
      return state
  }
}

// store
const store = createStore(reducer)

// render
const render = () => {
  const state = store.getState()

  todoList.empty()

  state.todos.forEach(todo => {
    const itemId = `item-${todo.idx}`
    const closeBtnId = `close-${todo.idx}`
    const todoElementLi = `<li id="${itemId}" ${todo.checked ? 'class="checked"' : ''} >${todo.text}<span class="close" id="${closeBtnId}">x</span></li>`;
    todoList.append(todoElementLi)

    // toggle event
    $(`#${itemId}`).on('click', function () {
      store.dispatch(toggleTodo(todo.idx))
    })

    // close event
    $(`#${closeBtnId}`).on('click', function () {
      store.dispatch(closeTodo(todo.idx))
    })
  })
}

render()

// subscribe
store.subscribe(render)

// dispatch
addBtn.on('click', function () {
  dispatchAddTodo()
})

// dispatch
myInput.on("keyup", function (key) {
  if (key.keyCode === AppConstants.ENTER_KEY_CODE) {
    dispatchAddTodo()
  }
});

const dispatchAddTodo = () => {
  const inputText = myInput.val()
  const isEmptyInput = inputText.length === 0;
  if (isEmptyInput) {
    return
  }

  store.dispatch(addTodo(inputText))
  resetInput()
}

const resetInput = () => {
  myInput.val('')
}