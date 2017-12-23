var rowTemplate = $('<tr><td class="alert alert-danger">00:21:41 - Alert from active temperature sensor 2.</td></tr>');

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

function getLog() {
  $.get( "/History/GetUnseenLog", function( data ) {

    //alert(data);

    data = $.parseJSON(data);
    data = data.events;
    if(data.length > 0) {
      $('#counter').text(data.length);
      $('#counter').show();
    }

    $('tbody').html("");   
    for (var i = 0, len = data.length; i < len; i++) {
      drawEvent(data[i]);
    };
  });

  //setTimeout(getLog, 200);
}

function markSeen() {
  $('#counter').text('0');
}
$(document).ready(function(){
  $('#counter').hide();
  getLog();

  $('#notifications-tab').click(function(e) {
    $('#counter').fadeOut();
    markSeen();
  });
  $('#about-tab').click(function() {
    if(('#counter').text() != '0')
      $('#counter').show();
  });
});

