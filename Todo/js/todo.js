'use strict';

class ToDoList {
  constructor() {
    this.init();
  }

  init() {
    this.users = {};
    this.validator = new Validator();
    this.eventBinder(this.users);
  }

  eventBinder(userObject) {
    $('body').on('click', function(e) {
      const target = e.target;
      if (target.id === 'todo-save') {
        this.createUserTodo(userObject);
      } else if (target.id === 'userButton') {
        $('#create-user').slideToggle();
      } else if (target.id === 'addUserButton') {
        this.createUser(userObject);
      } else if (target.type === 'checkbox') {
        this.toggleTaskStatus(target);
      }
    }.bind(this));
  }

  createUser(userObject) {
    const $createUserForm = $('#create-user');
    const $input = $createUserForm.find('input');
    if (this.isUserCreated(userObject)) {
      if (Object.keys(userObject).length) {
        this.showTodoButton();
      }
      $createUserForm.slideUp();
      $('#user-name').val('');
    }
  }

  isUserCreated(userObject) {
    const name = $('#user-name').val().trim();
    if (this.validator.isFieldValid(name)) {
      if (!this.validator.isUserDuplicate(name, userObject)) {
        const titledName = this.validator.toTitleCase(name);
        userObject[titledName] = {};
        $('#users-ul-list').append(`<li>${titledName} <span id="${titledName}">(${this.getTaskCount(titledName)})</span></li>`);
        this.populateSelectOption(titledName);
        if (Object.keys(userObject).length) {
          return true;
        }
      } else {
        alert(`${name} already exists. Please provide another name`);
        return false;
      }
    } else {
      alert(`Name can NOT be empty`);
      return false;
    }
  }

  createUserTodo(userObject) {
    const todoText = $('#todo-text').val();
    if (this.validator.isFieldValid(todoText)) {
      if (Object.keys(userObject).length) {
        this.createTodo(todoText);
      } else {
        alert('No Users Available To Create Task For. Please Create a User.');
      }
    } else {
      alert('ToDo can NOT be empty');
    }
  }

  createTodo(todo) {
    const selectedOption = $('#name-list').find('option:selected').text();
    const $checkBox = $('<input/>').attr({
        'type': 'checkbox',
        'data-id': selectedOption});
    const $li = $(`<li><span>${todo} assigned by (${selectedOption})</span></li>`);
    $checkBox.prependTo($li);
    $('#todo-ul-list').append($li);
    $('#users-ul-list').find(`span[id="${selectedOption}"]`).text(`(${this.getTaskCount(selectedOption)})`);
    $('#todo-form').removeClass('show').addClass('hidden');
    $('#todo-text').val('');
  }

  toggleTaskStatus(target) {
    const that = this;
    $(target).next().toggleClass('strike');
    const targetUser = $(target).data('id');
    $('#users-ul-list').find(`span[id="${targetUser}"]`).text(`(${this.getTaskCount(targetUser)})`);
  }

  getTaskCount(user) {
    const $todoCount = $('#todo-ul-list').find(`input[data-id=${user}]`).not(':checked');
    return $todoCount.length;
  }

  populateSelectOption(name) {
    let $option = $('<option/>');
    $option
      .text(name)
      .appendTo('#name-list');
  }

  showTodoButton() {
    $('#todoButton').fadeIn()
      .on('click', function() {
        $('#todo-form').removeClass('hidden').addClass('show');
    });
  }
}

$(function() {
  new ToDoList();
});
