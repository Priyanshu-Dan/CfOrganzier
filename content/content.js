// Add solve buttons to problems
function addSolveButton(problemElement) {
    const solveButton = document.createElement('button');
    solveButton.textContent = 'Mark as Solved';
    solveButton.style.marginLeft = '10px';
    solveButton.addEventListener('click', () => {
      const problemId = problemElement.querySelector('.id').textContent.trim();
      const difficulty = parseInt(problemElement.querySelector('.difficulty').textContent.trim().slice(1));
      chrome.storage.local.get(['solvedProblems'], (data) => {
        const solvedProblems = data.solvedProblems || [];
        if (!solvedProblems.some((p) => p.id === problemId)) {
          solvedProblems.push({ id: problemId, difficulty });
          chrome.storage.local.set({ solvedProblems }, () => {
            updateStatistics();
          });
        }
      });
    });
    problemElement.appendChild(solveButton);
  }
  
  // Update statistics
  function updateStatistics() {
    chrome.storage.local.get(['solvedProblems'], (data) => {
      const solvedProblems = data.solvedProblems || [];
      const totalSolved = solvedProblems.length;
      const avgDifficulty = solvedProblems.reduce((sum, problem) => sum + problem.difficulty, 0) / totalSolved || 0;
      chrome.storage.local.set({ totalSolved, avgDifficulty });
      chrome.runtime.sendMessage({ action: 'updateStatistics', totalSolved, avgDifficulty });
    });
  }
  
  // Add solve buttons to all problems
  document.querySelectorAll('.problem-statement').forEach(addSolveButton);
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyFilters') {
      filterProblems(request.difficulty, request.tags);
    } else if (request.action === 'addToList') {
      const problemId = document.querySelector('.problem-statement .id').textContent.trim();
      chrome.storage.local.get([request.list], (data) => {
        const list = data[request.list] || [];
        if (!list.some((p) => p.id === problemId)) {
          list.push({ id: problemId });
          chrome.storage.local.set({ [request.list]: list });
        }
      });
    } else if (request.action === 'toggleDarkMode') {
      document.body.classList.toggle('dark-mode');
    }
  });
  
  // Filter problems based on difficulty and tags
  function filterProblems(difficulty, tags) {
    const problems = document.querySelectorAll('.problem-statement');
    problems.forEach((problem) => {
      const problemDifficulty = problem.querySelector('.difficulty').textContent;
      const problemTags = problem.querySelector('.tag-box').textContent;
      const showProblem =
        (difficulty === 'all' || problemDifficulty.includes(difficulty)) &&
        (tags === 'all' || problemTags.includes(tags));
      problem.style.display = showProblem ? 'block' : 'none';
    });
  }