Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",   // Not used, we override with API
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Drop an image here or click to upload",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, { image_data: file.dataURL }, function(data, status) {
            console.log(data);

            if (!data || data.length === 0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }

            let persons = ["abdul_qadeer", "babar_azam", "imran_khan", "quaid_azam"];
            
            let match = null;
            let bestScore = -1;

            // Find best match
            for (let i = 0; i < data.length; ++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if (maxScoreForThisClass > bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }

            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();

                // Show best match card
                $("#resultHolder").html($(`[data-player="${match.class.toLowerCase()}"]`).html());

                // Fill probability scores
                let classDictionary = match.class_dictionary;
                for (let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let probabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName.toLowerCase();
                    $(elementName).html(probabilityScore.toFixed(2) + "%");
                }

                // Fetch details from APIs
                fetchCharacterDetails(match.class);
            }
        });
    });

    $("#submitBtn").on('click', function () {
        dz.processQueue();		
    });
}

function fetchCharacterDetails(name) {
    let apiToken = "66e3415199a7b6e64b995f9a831482af";

    // Convert name properly
    let formattedName = name.replace("_", " ");

    // If superhero (Batman, Superman etc.)
    let superheroList = ["batman", "superman", "ironman", "spiderman"]; // extend as needed

    if (superheroList.includes(name.toLowerCase())) {
        $.get(`https://superheroapi.com/api.php/${apiToken}/search/${formattedName}`, function(data) {
            if (data.response === "success") {
                let hero = data.results[0];
                $("#resultHolder").append(`
                    <div class="mt-3 p-3 border rounded bg-light">
                        <h5>Details</h5>
                        <p><strong>Full Name:</strong> ${hero.biography["full-name"]}</p>
                        <p><strong>Publisher:</strong> ${hero.biography["publisher"]}</p>
                        <p><strong>Powerstats:</strong></p>
                        <ul>
                          <li>Strength: ${hero.powerstats.strength}</li>
                          <li>Speed: ${hero.powerstats.speed}</li>
                          <li>Intelligence: ${hero.powerstats.intelligence}</li>
                        </ul>
                    </div>
                `);
            }
        });
    } else {
        // For real figures -> Wikipedia API
        $.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`, function(data) {
            if (data.extract) {
                $("#resultHolder").append(`
                    <div class="mt-3 p-3 border rounded bg-light">
                        <h5>About ${formattedName}</h5>
                        <p>${data.extract}</p>
                        ${data.thumbnail ? `<img src="${data.thumbnail.source}" width="200"/>` : ""}
                    </div>
                `);
            }
        });
    }
}

$(document).ready(function() {
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});
