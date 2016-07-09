$(document).ready(() => {
  $('#delete-poll').click((e) => {
    e.preventDefault();
    $.ajax({
      url: `/poll/${pollID}`, method: 'DELETE', success() {
        window.location.replace('/');
      },
    });
  });
  $('#poll-form').submit((e) => {
    e.preventDefault();
    const data = $('#poll-form').serializeArray();
    /**
     * TODO Implement validation
     * @type {*|boolean}
     */
    /*    let isValid = data.map((elem) => {
     switch (elem.name) {
     case 'name':
     case 'first-choice':
     case 'second-choice':
     return /^[\d\w]+$/.test(elem.value);
     default:
     return false;
     }
     }).every((elem) => elem === true);*/
    const isValid = true;
    if (isValid) {
      $.ajax({
        url: `/poll/${pollID}`, method: 'POST', data, success() {
          window.location.reload();
        },
      });
    }
  });
  $('.vote-option').click((e) => {
    e.preventDefault();
    const vote = $(e.target).attr('data-option');
    
    $.ajax({
      url: `/poll/${pollID}/vote/`, method: 'POST', data: { "vote": vote }, success() {
        window.location.reload();
      },
    });
  });
});
