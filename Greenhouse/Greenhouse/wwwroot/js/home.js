﻿var rowTemplate = $('<tr><td class="alert alert-danger">00:21:41 - Alert from active temperature sensor 2.</td></tr>');

function drawEvent(e) {
  var tr = $('<tr></tr>');
  var cell = $('<td>');


  if(e.type == "warning")
    cell.addClass("alert alert-warning");
  if(e.type == "alert")
    cell.addClass("alert alert-danger");
  cell.html(e.time + ' – ' + e.data);

  tr.append(cell);
  $('tbody').append(tr);
  console.log(e);
}

var refreshFlag = true;

function getLog() {
  $.get( "/History/GetUnseenLog", function( data ) {

    //alert(data);

    data = $.parseJSON(data);
    data = data.events;
    if(data.length > 0) {
      $('#counter').text(data.length);
      $('#counter').fadeIn();
    }

    if(refreshFlag)
      $('tbody').html("");   
    for (var i = 0, len = data.length; i < len; i++) {
      drawEvent(data[i]);
    };
    if(refreshFlag)
      setTimeout(getLog, 1000);
    else
      $('#counter').fadeOut();
  });
}

function markSeen() {
  $('#counter').text('0');
  $.get('/History/MarkSeen');
}


$(document).ready(function(){
  $('#counter').hide();
  getLog();

  $('#notifications-tab').click(function(e) {
    $('#counter').fadeOut();
    markSeen();
    refreshFlag = false;
    setTimeout(function() {
      $('#counter').fadeOut();
    }, 100);
  });
  $('#about-tab').click(function() {
    refreshFlag = true;
    setTimeout(getLog, 1000);
  });
});

