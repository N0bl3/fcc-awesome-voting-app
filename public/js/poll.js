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
    const data = $('#poll-form').serializeArray().filter((obj) => obj.value);
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
  $('#add-option').click((e)=> {
    e.preventDefault();
    if ($.trim($('.option').last().children('input').val())) {
      const index = $('.option').length;
      const elemId = `choice-${index}`;
      const element = `<div class="col s12 valign-wrapper">` +
        `<div class='col s6 input-field option'><input id=${elemId} type='text' name=${elemId} value=''/><label for=${elemId}>Option #${index}</label></div>` +
        `<div class="col s4"><button class="vote-option btn waves-effect waves-light red accent-3" data-option="${index}">VOTE</button></div>` +
        `<div class="col s2"><button id="remove-option" class="btn btn-floating waves-effect waves-light green"><i class="material-icons">remove</i></button></div></div>`;

      $('#polls-display').append(element);
    }
  });
  $('button#remove-option').click((e)=> {
    e.preventDefault();
  })
});
