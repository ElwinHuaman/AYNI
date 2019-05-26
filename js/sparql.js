SPARQL = function(o) {
  this.query = function(q) {
    return $.ajax({
      url: o.endpoint,
      headers: {  'Access-Control-Allow-Origin': 'http://lod.cs.aau.dk:8891/sparql' },
      crossDomain: true,
      accepts: {json: "application/sparql-results+json"},
      data: {query: q, apikey: o.apikey},
      dataType: "json"
    });
  };
};

// SPARQL = function(o) {
//   this.query = function(q) {
//     return $.ajax({
//       url: o.endpoint,
//       accepts: {json: "application/sparql-results+json"},
//       data: {query: q, apikey: o.apikey},
//       dataType: "json"
//     });
//   };
// };
