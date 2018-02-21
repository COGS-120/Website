$(function () {
  $("#topNavBar").load('/html/navbar.html', function() {
    $('#dummyBar').remove();
  });
});