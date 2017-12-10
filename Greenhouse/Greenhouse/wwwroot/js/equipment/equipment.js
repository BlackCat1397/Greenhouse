function createTable(width, height, table) {
  tbody = table.append('<tbody>');

  for(i = 0; i < height; i++) {
    var tr = $(document.createElement('tr'));
    for(j = 0; j < width; j++) {
      tr.append('<td></td>');
    }
    tbody.append(tr);
  }
}

var table = $(document.createElement('table'));
createTable(10, 8, table);
table.addClass('equipment-table');
table.addClass('table-responsive');


var div = $('<div class="col-md-6">');
$(div).append(table);
$('#page-container').children().first().prepend(div);


$('#add-sensor-air').on('click', function(e) {
  placeSensor('air');
});
$('#add-sensor-water').on('click', function(e) {
  placeSensor('water');
});
$('#add-sensor-ph').on('click', function(e) {
  placeSensor('ph');
});
$('#add-sensor-humidity').on('click', function(e) {
  placeSensor('humidity');
});
$('#add-sensor-fert').on('click', function(e) {
  placeSensor('fert');
});
$('#add-sensor-light').on('click', function(e) {
  placeSensor('light');
});



function placeSensor(type) {
  var color = [["air", "#ddf"], ["humidity", "#add8e6"], ["fert", "brown"], ["light", "#fff04e"], ["water", "blue"], ["ph", "green"]];
  color = new Map(color);

  $('td').on('click', function(e) {
    $(this).css('background-color', color.get(type));
    $('td').off('click');
  });
}