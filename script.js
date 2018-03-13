
// //////////////////////////////////////
// SPARQL data
// //////////////////////////////////////

	var sparqlquery = `
		PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?person ?name ?start ?end ?url ?image ?title WHERE {
{
  SERVICE <https://query.wikidata.org/sparql>
  {
   ?person p:P39 ?bn .
   ?person rdfs:label ?name .
   ?bn ps:P39 wd:Q13423495 .
   OPTIONAL { ?bn pq:P580 ?start . }
   OPTIONAL { ?bn pq:P582 ?end . }
   FILTER(lang(?name) = 'nl' )
  }
 ?url dc:subject ?person .
 ?url foaf:depiction ?image .
 ?url dc:title ?title .
}
UNION
{
 SERVICE <https://query.wikidata.org/sparql>
  {
   ?person rdfs:label ?name .
   ?person p:P39 ?bn .
   ?bn ps:P39 wd:Q13423495 .
   OPTIONAL { ?bn pq:P580 ?start . }
   OPTIONAL { ?bn pq:P582 ?end . }
   FILTER(lang(?name) = 'nl' )
  }
 ?url dc:subject ?pers .
 ?pers owl:sameAs ?person .
 ?url foaf:depiction ?image .
 ?url dc:title ?title .
}
}
ORDER BY ?start

		`;


	var encodedquery = encodeURIComponent(sparqlquery);

	var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

	fetch(queryurl)
	.then((resp) => resp.json()) // transform the data into json
  	.then(function(data) {
		
		rows = data.results.bindings; // get the results
		imgdiv = document.getElementById('images');
		console.log(rows);



		for (i = 0; i < rows.length; ++i) {
		    
			var li = document.createElement('li');
		    imgdiv.appendChild(li);
		    
        var link = document.createElement('a');
        link.classList.add('item'); 
        link.setAttribute("data-name", rows[i]['name']['value']);
        link.name = rows[i]['name']['value'];
        // link.href = '#' + rows[i]['name']['value'];
        li.appendChild(link);

		    var img = document.createElement('img');
		    img.src = rows[i]['image']['value'];
		    img.title = rows[i]['title']['value'];
		    link.appendChild(img);

		    var p = document.createElement('p');
		    p.textContent = rows[i]['title']['value'];
		    link.appendChild(p);
		}
	})

.catch(function(error) {
    // if there is any error you will catch them here
    console.log(error);
  });

// //////////////////////////////////////
// Filter element
// //////////////////////////////////////

    let filterInput = document.getElementById('filterInput');
    
    filterInput.addEventListener('keyup', filterResultaten);

    function filterResultaten(){

      let filterValue = document.getElementById('filterInput').value.toUpperCase();

      let ul = document.getElementById('images');
   
      let li = ul.getElementsByTagName('li');

    
      for(let i = 0;i < li.length;i++){
        let p = li[i].getElementsByTagName('p')[0];
  
        if(p.innerHTML.toUpperCase().indexOf(filterValue) > -1){
          li[i].style.display = '';
        } else {
          li[i].style.display = 'none';
        }
      }
    }

// //////////////////////////////////////
// Toggle grid
// //////////////////////////////////////

(function() {
    var images = document.querySelector('#images');
    var toggleGrid = document.querySelector('.toggle-grid');
    var eed = document.querySelector('.eed');
    var achtergrond = document.querySelector('.achtergrond');
    
      toggleGrid.addEventListener('click', function() {

          if (toggleGrid.innerHTML == "Grid weergave") {
              toggleGrid.innerHTML = "Colom weergave";
          } else {
              toggleGrid.innerHTML = "Grid weergave";
          }
          
          images.classList.toggle('grid-layout');
          

          images.classList.toggle('normal-layout');


          eed.classList.toggle('hide');
          achtergrond.classList.toggle('normaal');
          achtergrond.classList.toggle('grid');
      });
})();
	
// //////////////////////////////////////
// Toggle oudere/nieuwere resultaten
// //////////////////////////////////////

(function() {
    var images = document.querySelector('#images');
    var reverseOrder = document.querySelector('.reverse-order');

      reverseOrder.addEventListener('click', function() {

          images.classList.toggle('reverse');
      });
})();

// //////////////////////////////////////
// Data over burgemeesterds
// //////////////////////////////////////

document.getElementById("images").addEventListener("click", function(e) {

  var burgemeester = e.target.name;
  console.log(burgemeester)

  if(e.target && e.target.nodeName == "A") {
 
  var queryurl = 'https://nl.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + burgemeester;
  // fetch de gegevens van de wikipedia url
  fetch(queryurl)
  .then(response => response.json()) // transform the data into json
    // .then(data => console.log(data))
    .then(function(data) {

      console.log(data)
      //console.log(queryurl)

      var datadiv = document.querySelector('.beschrijving');
      var item = document.querySelector('.item');

      var pageID = data.query.pages;
      var specificPageID = Object.keys(pageID)[0];
      console.log(specificPageID);
      
      // event listener voor gegenereerde elementen
     
          // creeer textuele beschrijving van burgemeester
            // var beschrijving = document.createElement('h4');
            // console.log(data.query.pages[specificPageID].extract)
            // beschrijving.textContent = data.query.pages[specificPageID].extract;
            // datadiv.appendChild(beschrijving);

            var div = document.querySelector('.beschrijving h4')
            console.log(div.classList.length)

            // if (div.classList.length > 0 ) {
            //     console.log(div.classList.item(0))
            //     div.classList.remove(div.classList.item(0))
            //     div.classList.add(specificPageID);
            //   } else {
            //     console.log('test')
            //     div.classList.add(specificPageID);
            //   }

            var text = document.querySelector('.beschrijving h4');
            text.innerHTML = data.query.pages[specificPageID].extract;

            var titel = document.querySelector('.beschrijving h3');
            titel.innerHTML = burgemeester;
        })
      };
    });





// item.addEventListener('click', function() {
          

// var name  = this.dataset.name;
//  });


    // var datadiv = document.querySelector('.beschrijving');

    //   var beschrijving = document.createElement('h4');
    //   beschrijving.textContent = 'werkt dit?';
    //   datadiv.appendChild(beschrijving);







