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
  $.get( "/History/GetLog", function( data ) {

    //alert(data);
    data = $.parseJSON(data);
    data = data.events;

    $('tbody').html("");   
    for (var i = 0, len = data.length; i < len; i++) {
      drawEvent(data[i]);
    };
  });

  setTimeout(getLog, 2000);
}

$(document).ready(function(){
  getLog();
});