'use strict';

class ToDoList {
  constructor() {
    this.init();
  }

  init() {
    this.users = {};
    this.validator = new Validator();
    this.eventBinder();
  }

  eventBinder() {
    $('body').on('click', function(e) {
      const target = e.target;
      if (target.id === 'todo-save') {
        this.createUserTodo();
      } else if (target.id === 'userButton') {
        $('#create-user').slideToggle();
      } else if (target.id === 'addUserButton') {
        this.createUser();
      } else if (target.type === 'checkbox') {
        this.toggleTaskStatus(target);
      }
    }.bind(this));
  }

  createUser() {
    const $createUserForm = $('#create-user');
    const $input = $createUserForm.find('input');
    if (this.isUserCreated()) {
      this.showTodoButton();
      $createUserForm.slideUp();
      $('#user-name').val('');
    }
  }

  isUserCreated() {
    let name = $('#user-name').val().trim();
    if (this.validator.isTextFieldEmpty(name)) {
      if (!this.validator.isUserDuplicate(name, this.users)) {
        name = this.validator.toTitleCase(name);
        this.users[name] = {};
        $('#users-ul-list').append(`<li>${name} <span id="${name}">(${this.getTaskCount(name)})</span></li>`);
        this.populateSelectOption(name);
        return true;
      } else {
        alert(`${name} already exists. Please provide another name`);
        return false;
      }
    } else {
      alert(`Name can NOT be empty`);
      return false;
    }
  }

  createUserTodo() {
    const todoText = $('#todo-text').val();
    if (this.validator.isTextFieldEmpty(todoText)) {
      if (Object.keys(this.users).length) {
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
        'data-id': selectedOption
    });
    const $li = $(`<li><span>${todo} assigned by (${selectedOption})</span></li>`);
    $checkBox.prependTo($li);
    $('#todo-ul-list').append($li);
    $('#users-ul-list').find(`span[id="${selectedOption}"]`).text(`(${this.getTaskCount(selectedOption)})`);
    $('#todo-form').removeClass('show').addClass('hidden');
    $('#todo-text').val('');
  }

  toggleTaskStatus(target) {
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
        $('#todo-form').removeClass('hidden');
    });
  }
}

$(function() {
  new ToDoList();
});
