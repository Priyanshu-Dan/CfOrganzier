// Add event listeners for filters, custom lists, and dark mode
document.getElementById('applyFilters').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value;
    const tags = document.getElementById('tags').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFilters', difficulty, tags });
    });
  });
  
  document.getElementById('addToList').addEventListener('click', () => {
    const list = document.getElementById('listSelector').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'addToList', list });
    });
  });
  
  document.getElementById('toggleDarkMode').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDarkMode' });
    });
  });
  
  // Fetch and display statistics
  chrome.storage.local.get(['totalSolved', 'avgDifficulty'], (data) => {
    document.getElementById('totalSolved').textContent = data.totalSolved || 0;
    document.getElementById('avgDifficulty').textContent = data.avgDifficulty || 0;
  });
  
  // Fetch and display recommendations
  function fetchRecommendations() {
    chrome.storage.local.get(['solvedProblems'], (data) => {
      const solvedProblems = data.solvedProblems || [];
      const solvedIds = solvedProblems.map((p) => p.id);
      fetch('https://codeforces.com/api/problemset.problems')
        .then((response) => response.json())
        .then((data) => {
          const recommendations = data.result.problems
            .filter((problem) => !solvedIds.includes(problem.contestId + problem.index))
            .slice(0, 5); // Show top 5 recommendations
          displayRecommendations(recommendations);
        });
    });
  }
  
  function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '<h2>Recommendations</h2>';
    recommendations.forEach((problem) => {
      const p = document.createElement('p');
      p.textContent = `${problem.contestId}${problem.index}: ${problem.name}`;
      recommendationsDiv.appendChild(p);
    });
  }
  
  fetchRecommendations();