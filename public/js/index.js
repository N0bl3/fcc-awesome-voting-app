$(document).ready(() => {
  $('#addPoll').click((e) => {
    e.preventDefault();
    $.post('/poll').done((pollID) => {
      window.location.replace(`/poll/${pollID}`);
    });
  });
  $('.delete-poll').click((e) => {
    e.preventDefault();
    const target = $(e.target).attr('data-url');
    $.ajax({
      url: target, method: 'DELETE', success() { window.location.reload(); },
    });
  });
});
