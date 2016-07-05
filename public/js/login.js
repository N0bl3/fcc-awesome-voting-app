$(document).ready(() => {
  $('form#login-form').submit((e) => {
    e.preventDefault();
    const formData = new FormData($(this));

    $.post('/login', formData);
  });
});
