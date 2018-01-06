google.charts.load('current', {'packages':['timeline']});


google.charts.setOnLoadCallback(drawCharts);

/*function drawChart(plan_id) {
  var container = document.getElementById('timeline');
  var chart = new google.visualization.Timeline(container);

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'President' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
  dataTable.addRows([
    [ 'Period 1', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 4', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 5', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 6', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 7', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 8', new Date(1, 1, 1, 0), new Date(1, 1, 1, 20) ],
    [ 'Period 2',      new Date(1, 1, 1, 20),  new Date(1, 1, 2, 10) ],
    [ 'Period 3',  new Date(1, 1, 2, 10),  new Date(1, 1, 2, 20) ]]);


  var options = {
    height: dataTable.getNumberOfRows() * 44 + 60,
    timeline: { rowLabelStyle: { fontSize: 13 }, barLabelStyle: { fontSize: 13 }, showRowLabels: false },
  };
  chart.draw(dataTable, options);

  $(window).resize(function(){
    chart.draw(dataTable, options);
  });
}*/

function drawCharts() {
  var containers = $('.timeline');
  for(var i = 0; i < containers.length; i++) {
    var plan_id = containers[i].id;
    plan_id = plan_id.split('-')[1];
    if(plan_id !== "template") {
      drawChart(plan_id);
    }
  }
}

function drawChart(plan_id) {
  var container = document.getElementById('timeline-' + plan_id);
  var chart = new google.visualization.Timeline(container);

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'RowLabel' });
  dataTable.addColumn({ type: 'string', id: 'BarLabel'});
  dataTable.addColumn({ type: 'number', id: 'Start' });
  dataTable.addColumn({ type: 'number', id: 'End' });

  var periods = $('#tbody-' + plan_id).children();

  var b = 0;
  for(var i = 0; i < periods.length; i++) {
    var p = periods.eq(i);
    dataTable.addRow([(i+1).toString(), (i+1).toString() + '. ' + p.children().eq(0).text(), b, b += parseInt(p.children().eq(1).text()) * 3600000]);  
  }



  dataTable.insertColumn(2, {type: 'string', role: 'tooltip', p: {html: true}});
  for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
    var period = $('#tbody-' + plan_id).children().eq(i);
    var params = new Map([['air', 22], ['water', 23], ['ph', 5.6],
    ['humidity', 92], ['lighting', 80], ['fertilizer', 90]]);
    var j = 0;

    for(let p of params.keys()) {
      params.set(p, period.children().eq((j++)+2).text());

    }
   
    var duration = (dataTable.getValue(i, 4) - dataTable.getValue(i, 3)) / 1000;
    var days = parseInt( duration / 3600 / 24); 
    var hours = parseInt( duration / 3600 ) % 24;
    var minutes = parseInt( duration / 60 ) % 60;
    var seconds = duration % 60;


    var tooltip = '<div class="ggl-tooltip"><span>' +
      dataTable.getValue(i, 1) + '</span></div>' + 
      '<div class="ggl-tooltip">' +
      dataTable.getValue(i, 3)/1000/3600 + ' - ' +
      dataTable.getValue(i, 4)/1000/3600 + '</div>' +
      '<div class="ggl-tooltip"><span>Duration: ' +
      days + 'd ' + hours + 'h</span></div>' +
      '<div class="ggl-tooltip"><span>Air temperature: ' +
      params.get('air') + '&#176C </span></div>' +
      '<div class="ggl-tooltip"><span>Water temperature: ' +
      params.get('water') + '&#176C </span></div>' +
      '<div class="ggl-tooltip"><span>PH: ' +
      params.get('ph') + ' </span></div>' +
      '<div class="ggl-tooltip"><span>Humidity: ' +
      params.get('humidity') + '% </span></div>' +
      '<div class="ggl-tooltip"><span>Lighting: ' +
      params.get('lighting') + '% </span></div>' +
      '<div class="ggl-tooltip"><span>Fertilizer: ' +
      params.get('fertilizer') + '% </span></div>';

    dataTable.setValue(i, 2, tooltip);
  }


  var options = {
    height: dataTable.getNumberOfRows() * 44 + 60,
    timeline: { rowLabelStyle: { fontSize: 13 },
      barLabelStyle: { fontSize: 13 },
      showRowLabels: false,
      showAxisLabels: false
    },
    hAxis: {
      format: ' '
    }
  };

  chart.draw(dataTable, options);

  $(window).resize(function(){
    chart.draw(dataTable, options);
  });
}