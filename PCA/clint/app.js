  $("#heartForm").submit(function(event) {
      event.preventDefault(); // Prevent page reload

      // Chest pain logic
      const chestPainVal = $("#chestPain").val();
      let ChestPainType_ATA = 0, ChestPainType_NAP = 0, ChestPainType_TA = 0;

      if (chestPainVal === "ATA") ChestPainType_ATA = 1;
      else if (chestPainVal === "NAP") ChestPainType_NAP = 1;
      else if (chestPainVal === "TA") ChestPainType_TA = 1;

      // Create input object
      const inputData = {
        age: parseInt($("#age").val()),
        RestingBP: parseInt($("#RestingBP").val()),
        Cholesterol: parseInt($("#Cholesterol").val()),
        FastingBS: parseInt($("#FastingBS").val()),
        RestingECG: parseInt($("#RestingECG").val()),
        MaxHR: parseInt($("#MaxHR").val()),
        ExerciseAngina: parseInt($("#ExerciseAngina").val()),
        Oldpeak: parseFloat($("#Oldpeak").val()),
        ST_Slope: parseInt($("#ST_Slope").val()),
        Sex_M: parseInt($("#Sex_M").val()),
        ChestPainType_ATA: ChestPainType_ATA,
        ChestPainType_NAP: ChestPainType_NAP,
        ChestPainType_TA: ChestPainType_TA
      };

      // Send request to Flask API
      $.ajax({
        url: "http://127.0.0.1:5000/get_prediction_of_heart",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(inputData),
        success: function(response) {
          $("#result").html("Prediction: " + (response.prediction === 1 ? "Likely Heart Disease" : "Not Likely"));
        },
        error: function(xhr, status, error) {
          console.error("Error occurred:", error);
          $("#result").html("Error: " + error);
        }
      });
    });