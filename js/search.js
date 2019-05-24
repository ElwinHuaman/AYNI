function validateForm(){
  var inputFrom = document.getElementById("from").value;
  var inputTo = document.getElementById("to").value;
  validateEmpty(inputTo);
  validateEmpty(inputFrom);
  sparqlQuery();
}

function validateEmpty(value){
  if(value == "")
  console.log("The form has empty fields");
}

function sparqlQuery(){
  var dbpedia = new SPARQL({
    apikey: "YOUR-API-KEY-HERE",
    endpoint: "https://dbpedia.org/sparql/"
  });

  var queryCountryName = "PREFIX  dbpedia-owl:  <http://dbpedia.org/ontology/>\n\
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
  dbpedia.query(queryCountryName).done(onSuccess).error(onFailure);
}
function onFailure(xhr, status) {
   document.getElementById("result").innerHTML = status + " (See console.)";
   console.log("error");
   console.log(xhr);
}

function onSuccess(json) {
   var html = "<table border='1'>";
   for (var b in json.results.bindings) {
       html += "<tr>";
       for (var x in json.head.vars) {
           var value = json.results.bindings[b][json.head.vars[x]];
           if (value.type == "uri")
               html += "<td><a href='"+value.value+"'>" + value.value + "</a></td>";
           else
               html += "<td>" + value.value + "</td>";
       }
       html += "</tr>";
   }
   html += "</table>";
   document.getElementById("result").innerHTML = html;
}
