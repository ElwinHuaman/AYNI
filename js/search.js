function validateForm(){
  var inputFrom = document.getElementById("from").value.toUpperCase();
  var inputTo = document.getElementById("to").value.toUpperCase();
  var inputDays = document.getElementById('days').value;
  var email = document.getElementById('email').value;
  validateEmpty(inputTo);
  validateEmpty(inputFrom);
  sparqlQuery(inputTo);
}

function validateEmpty(value){
  if(value == "")
  console.log("The form has empty fields");
}

function sparqlQuery(inputTo){
  var dbpedia = new SPARQL({
    apikey: "YOUR-API-KEY-HERE",
    // endpoint: "https://dbpedia.org/sparql/"
    endpoint: "http://lod.cs.aau.dk:8891/sparql/"
  });

  var queryCityNO2 = "PREFIX s: <http://qweb.cs.aau.dk/airbase/schema/>\n\
                      PREFIX p: <http://qweb.cs.aau.dk/airbase/property/>\n\
                      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
                      SELECT (avg(?no2) as ?NO2)\n\
                      WHERE { \n\
                        ?obs s:NO2 ?no2 . \n\
                        ?obs s:year ?year . \n\
                        ?obs s:station ?station . \n\
                        ?station s:inCity ?city . \n\
                        FILTER(?city = <http://qweb.cs.aau.dk/airbase/data/city/" + inputTo + "/>) \n\
                      } LIMIT 10";

  var queryCountryName = "PREFIX dbpedia-owl:  <http://dbpedia.org/ontology/>\n\
                          PREFIX dbpedia: <http://dbpedia.org/resource>\n\
                          PREFIX dbpprop: <http://dbpedia.org/property>\n\
                       SELECT DISTINCT ?citylabel ?countrylabel ?pop \n\
                       WHERE { \n\
                         ?city rdf:type dbpedia-owl:City. \n\
                         ?city rdfs:label ?citylabel. \n\
                         ?city dbpedia-owl:country ?country. \n\
                         ?country rdfs:label ?countrylabel. \n\
                         ?city dbpedia-owl:populationTotal ?pop . \n\
                         FILTER ( lang(?countrylabel) = 'en' and lang(?citylabel) = 'en' and ?pop>10000) \n\
                      } LIMIT 10";

  // dbpedia.query(queryCountryName).done(onSuccess).error(onFailure);
  dbpedia.query(queryCityNO2).done(onSuccess).error(onFailure);
}
function onFailure(xhr, status) {
   document.getElementById("result").innerHTML = status + " (See console.)";
   console.log("error");
   console.log(xhr);
}

function onSuccess(json) {
   var html = "<table border='1'>";
   for (var binding in json.results.bindings){
     var name = json.head.vars[binding];
     var total = json.results.bindings[binding][json.head.vars[binding]].value;
     html += "<tr>";
     html += "<td>" + name + "</td>";
     html += "<td>" + total + "</td>";
     html += "<td><progress id=progress value="+total+" max=100></progress></td>";
     html += "</tr>";
   }
   html += "</table>";
   document.getElementById("result").innerHTML = html;
   progressBar(total);
}

function progressBar(value) {
  var duration = 5000; // it should finish in 5 seconds !
  var st = new Date().getTime();
  var interval = setInterval(
    function() {
      var diff = Math.round(new Date().getTime() - st),
        val = Math.round(diff / duration * 100);
      val = val > 100 ? 100 : val;
      $("#progress").css("width", val + "px");
      $("#progress").text(val + "%");
      if (diff >= duration) {
        clearInterval(interval);
      }
    }, value);
}


// function progressBar(value){
//     if(value > 60){
//     $("#progress").css('background','red');
//   }else if(numChecked == 2){
//     $("#progress").css('background','orange');
//   }else if(numChecked == 3){
//     $("#progress").css('background','yellow');
//   }else {
//     $("#progress").css('background','lime');
//   }
// }

// function onSuccess(json) {
//    var html = "<table border='1'>";
//    for (var b in json.results.bindings) {
//        html += "<tr>";
//        for (var x in json.head.vars) {
//            var value = json.results.bindings[b][json.head.vars[x]];
//            if (value.type == "uri")
//                html += "<td><a href='"+value.value+"'>" + value.value + "</a></td>";
//            else
//                html += "<td>" + value.value + "</td>";
//        }
//        html += "</tr>";
//    }
//    html += "</table>";
//    document.getElementById("result").innerHTML = html;
// }
