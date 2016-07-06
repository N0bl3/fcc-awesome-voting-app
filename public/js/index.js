$(document).ready(() => {
  $('#addPoll').click((e) => {
    e.preventDefault();
    $.post('/poll').done((view) => {
      $('body').html($.parseHTML(view));
    });
  });
});
