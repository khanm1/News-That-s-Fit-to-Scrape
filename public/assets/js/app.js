//Scrape button from main.handlebars nav bar
//exectues GET when the scrape request is clicked
$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function (data) {
    console.log(data)
    window.location = "/"
  })
});

//Executes POST when save article button from home.handlebars
$(".save").on("click", function () {
  console.log("clicked");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "articles/saved/" + thisId
  }).done(function (data) {
    window.location = "/"
  })
});

//Executes POST when delete article button from the savedArticles.handlebars page
$(".delete").on("click", function () {
  console.log("delete clicked");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId
  }).done(function (data) {
  })
      window.location = "/saved"

});

// Executes a POST when to save note
$(document).on("click", ".saveNote", function () {
  console.log("sasve note is clicked");
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "POST",
      url: "notes/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  //closes modal and returns to the savedAricles.handlebars page
  window.location = "/saved"
});

// Executes the /articles page and list the data in JSON format
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

//