'use strict';

class ToDoList {
  constructor() {
    this.init();
  }

  init() {
    this.users = {};
    const $addUserBtn = $('#userButton');
    const $todoUl = $('#todo-ul-list')
    this.toggleAddUserForm($addUserBtn);
    this.createUser(this.users);
    this.createUserTodo(this.users);
    this.toggleTaskStatus($todoUl);
  }

  toggleAddUserForm($addUserBtn) {
    const $createUserForm = $('#create-user');
    $addUserBtn.on('click', function() {
      $createUserForm.slideToggle();
    });
  }

  createUser(userObject) {
    const $createUserForm = $('#create-user');
    const $input = $createUserForm.find('input');
    const that = this;
    $createUserForm.find('button').on('click', function() {
      const isUserCreated = this.isUserCreated(userObject, $input, $createUserForm);
      if (isUserCreated) {
        if (Object.keys(userObject).length) {
          this.showTodoButton();
        }
        $createUserForm.slideUp();
        $('#user-name').val('');
      }
    }.bind(this));
  }

  isUserCreated(userObject, $input, $createUserForm) {
    const name = $input.val().trim();
    const isNameValid = this.isFieldValid(name);
    if (isNameValid) {
      const isUserDuplicate = this.isUserDuplicate(name);
      if (!isUserDuplicate) {
        const titledCase = this.toTitleCase(name);
        userObject[titledCase] = {};
        $('#users-ul-list').append(`<li>${titledCase} <span id="${titledCase}">(${this.getTaskCount(titledCase)})</span></li>`);
        this.populateSelectOption(titledCase);
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
    const $todoSaveBtn = $('#todo-save');
    const that = this;
    $todoSaveBtn.on('click', function() {
      const todoText = $('#todo-text').val();
      const isTodoValid = that.isFieldValid(todoText);
      if (isTodoValid) {
        const selectedOption = $('#name-list').find('option:selected').text();
        const $checkBox = $('<input/>').attr({
            'type': 'checkbox',
            'data-id': selectedOption});
        const $li = $(`<li><span>${todoText} assigned by (${selectedOption})</span></li>`);
        $checkBox.prependTo($li);
        $('#todo-ul-list').append($li);
        $('#users-ul-list').find(`span[id="${selectedOption}"]`).text(`(${that.getTaskCount(selectedOption)})`);
        $('#todo-form').removeClass('show').addClass('hidden');
      } else {
        alert('ToDo can NOT be empty');
      }
    });
  }

  toggleTaskStatus($ul) {
    const that = this;
    $ul.on('click', 'input[type="checkbox"]', function() {
      $(this).next().toggleClass('strike');
      const targetUser = $(this).data('id');
      $('#users-ul-list').find(`span[id="${targetUser}"]`).text(`(${that.getTaskCount(targetUser)})`);
    });
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
    const $todoButton = $('#todoButton');
    $todoButton.fadeIn()
      .on('click', function() {
        $('#todo-form').removeClass('hidden').addClass('show');
    });
  }

  isFieldValid(fieldText) {
    if (!fieldText) {
      return false;
    }
    return true;
  }

  isUserDuplicate(name) {
    const titleCase = this.toTitleCase(name);
    if (!this.users.hasOwnProperty(titleCase)) {
      return false;
    }
    return true;
  }

  toTitleCase(name) {
    return name.replace(/\w+/g, function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    });
  }
}

$(function() {
  new ToDoList();
});
