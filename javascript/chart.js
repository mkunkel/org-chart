google.charts.load('current', {'packages' : ['orgchart', 'table']});
google.charts.setOnLoadCallback(function() { initialize('') });

function initialize() {
  document.getElementById('orgchart_admin').innerHTML = "<i class='fa fa-spinner fa-spin fa-3x fa-fw'></i>";

  // Provide sheet ID in the sheet param to change the data source
  var sheetId = new URLSearchParams(window.location.search).get('sheet');
  sheetId = sheetId ? sheetId : '12W2y9pI-JfYLuAH7gZbxUSVQMqnoqB7uYdLVDQof-4Y';

  var dataSourceUrl = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?';

  // Tells it that the first row contains headers: 'Role', 'Reports To', 'Name'
  var query = new google.visualization.Query(dataSourceUrl + '&headers=1');

  // Send the query with a callback function.
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  // Called when the query response is returned.
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var raw_data = response.getDataTable();
  var data = new google.visualization.DataTable();

  data.addColumn('string', 'Entity');
  data.addColumn('string', 'ParentEntity');
  data.addColumn('string', 'ToolTip');

  // Loops through all rows and populates a new DataTable with formatted values for the orgchart
  var num_rows = raw_data.getNumberOfRows();
  for (var i = 0; i < num_rows; i++) {
    var role = raw_data.getValue(i, 0);
    var reportsTo = raw_data.getValue(i,1);
    var name = raw_data.getValue(i,2) != null ? raw_data.getValue(i,2) : '';
    var description = raw_data.getValue(i,3) != null ? raw_data.getValue(i,3) : '';
    var alternateRole = raw_data.getValue(i,4);
    var displayRole = alternateRole != null ? alternateRole : role;
    var roleDiv = "<div class='role'>" + displayRole + "</div>"
    var nameDiv = "<div class='name'>" + name + "</div>";
    var descriptionDiv = "";

    if (description != "") {
      descriptionDiv = "<div class='job-description'>" + description + "</div>";
    }


    data.addRows([[
      { v: role,
        f: "<div class='role-container'>" + roleDiv + nameDiv + descriptionDiv + "</div>"
      },
      reportsTo,
      description]]);
  }

  // Loops through all rows and populates a new DataTable with formatted values for the orgchart
  var container = document.getElementById('orgchart_admin');
  var chart = new google.visualization.OrgChart(container);
  chart.draw(data, {allowHtml:true, 'size': 'large'});
}
