$(document).ready(() => {
  $('form#register-form').submit((e) => {
    e.preventDefault();
    const formData = new FormData($(this));

    $.post('/register', formData);
  });
});
