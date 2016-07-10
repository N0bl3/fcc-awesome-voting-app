'use strict';

$(document).ready(function () {
  function randomColor() {
    var colorSet = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7',
      '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#dce775', '#fff176', '#ffd54f', '#ffb74d',
      '#ff8a65', '#a1887f', '#90a4ae'];
    return colorSet[Math.floor(Math.random() * colorSet.length)];
  }

  var colors = poll.choices.map(function () {
    return randomColor();
  });
  var pollID = poll._id;
  var ctx = $('#chart');
  var data = {
    datasets: [{
      data: poll.votes, backgroundColor: colors
    }], labels: poll.choices
  };
  var myChart = new Chart(ctx, { // eslint-disable-line
    type: 'pie', data: data
  });

  $('#delete-poll').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/poll/' + pollID, method: 'DELETE', success: function success() {
        window.location.replace('/');
      }
    });
  });
  $('#poll-form').submit(function (e) {
    e.preventDefault();
    var data = $('#poll-form').serializeArray().filter(function (obj) {
      return obj.value;
    });
    /**
     * TODO Implement validation
     * @type {*|boolean}
     */
    var isValid = true;
    if (isValid) {
      $.ajax({
        url: '/poll/' + pollID, method: 'POST', data: data, success: function success() {
          window.location.reload();
        }
      });
    }
  });
  $('.vote-option').click(function (e) {
    e.preventDefault();
    var vote = $(e.target).attr('data-option');

    $.ajax({
      url: '/poll/' + pollID + '/vote/',
      method: 'POST',
      data: { vote: vote },
      success: function success() {
        window.location.reload();
      }
    });
  });
  $('#add-option').click(function (e) {
    e.preventDefault();
    if ($.trim($('.option').last().children('input').val())) {
      var index = $('.option').length;
      var elemId = 'choice-' + index;
      var element = '<div class="col s12 valign-wrapper"><div class="col s6 input-field option"><input id=' + elemId + ' type=\'text\' name=' + elemId + ' value=\'\'/><label for=' + elemId + '>Option #' + index + '</label></div><div class="col s4"><button class="vote-option btn waves-effect waves-light red accent-3" data-option="' + index + '">VOTE</button></div><div class="col s2"><button id="remove-option" class="btn btn-floating waves-effect waves-light green"><i class="material-icons">remove</i></button></div></div>'; // eslint-disable-line max-len

      $('#polls-display').append(element);
    }
  });
  $('button#remove-option').click(function (e) {
    e.preventDefault();
  });
});