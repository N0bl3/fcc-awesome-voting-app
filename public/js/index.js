$(document).ready(() => {
  $('#addPoll').click((e) => {
    e.preventDefault();
    $.post('/poll').done((pollID) => {
      window.location.replace(`/poll/${pollID}`);
    });
  });
  $('.delete-poll').click((e) => {
    e.preventDefault();
    const target = $(this).siblings('a').attr('href');
    $.ajax({
      url: target, method: 'DELETE', success() { window.location.reload(); },
    });
  });
});
