$(document).ready(() => {
  $('#delete-poll').click((e) => {
    e.preventDefault();
    $.ajax({
      url: `/poll/${pollID}`, method: 'DELETE', success() {
        window.location.replace('/');
      },
    });
  });
});
