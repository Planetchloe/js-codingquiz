function printHighscores() {
  // either get scores from localstorage or set to empty array
  var highscores = JSON.parse(window.localStorage.getItem('highScores')) || [];

  // sort highscores by score property in descending order
  highscores.sort(function (a, b) {
    return b.score - a.score;
  });

  for (var i = 0; i < highscores.length; i += 1) {
    // create li tag for each high score
    var liTag = document.createElement('li');
    liTag.textContent = highscores[i].initials + ' - ' + highscores[i].score;

    // display on page
    var olEl = document.getElementById('highscores');
    olEl.appendChild(liTag);
  }
}

function clearHighscores() {
  window.localStorage.removeItem('highScores');
  window.location.reload();
}

document.getElementById('clear').onclick = clearHighscores;

// Run function when the page loads
document.addEventListener('DOMContentLoaded', function () {
  printHighscores();
});

document.getElementById('clear').onclick = function () {
  clearHighscores();
};