'use strict';

class Validator {

  isFieldValid(fieldText) {
    fieldText = fieldText || '';
    if (!fieldText) {
      return false;
    }
    return true;
  }

  isUserDuplicate(name, users) {
    name = name || '';
    users = users || '';
    const titleCase = this.toTitleCase(name);
    if (!users.hasOwnProperty(titleCase)) {
      return false;
    }
    return true;
  }

  toTitleCase(name) {
    name = name || '';
    return name.replace(/\w+/g, function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    });
  }
}
