let currentTab = "all";
let countIssue = document.getElementById("count-issue");

// function to manage spinner visibility
const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issue-container").classList.add("hidden");
  } else {
    document.getElementById("issue-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// function to create html elements for labels
const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) => `
    <p class="btn btn-outline  rounded-full uppercase ${el.toUpperCase() === "BUG" ? "btn-error" : el.toUpperCase() === "HELP WANTED" ? "btn-warning" : el.toUpperCase() === "ENHANCEMENT" ? "btn-success" : "btn-primary"}">
        ${el.toUpperCase() === "BUG" ? '<i class="fa-solid fa-bug"></i> ' : el.toUpperCase() === "HELP WANTED" ? '<i class="fa-solid fa-life-ring"></i> ' : el.toUpperCase() === "ENHANCEMENT" ? '<i class="fa-solid fa-wand-magic-sparkles"></i>' : '<i class="fa-solid fa-star"></i>'} ${el}
    </p>
  `,
  );
  return htmlElements.join(" ");
};

// function to load all issues from the server and display in the UI
const loadAllIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const response = await fetch(url);
  const data = await response.json();
  countIssue.innerText = data.data.length;
  displayAllIssues(data.data);
};

// function to load open issues from the server and display in the UI
const loadOpenIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const response = await fetch(url);
  const data = await response.json();
  const openIssues = data.data.filter(
    (issue) => issue.status.toLowerCase() === "open",
  );
  countIssue.innerText = openIssues.length;
  displayAllIssues(openIssues);
};

// function to load closed issues from the server and display in the UI
const loadClosedIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const response = await fetch(url);
  const data = await response.json();
  const closedIssues = data.data.filter(
    (issue) => issue.status.toLowerCase() === "closed",
  );
  countIssue.innerText = closedIssues.length;
  displayAllIssues(closedIssues);
};

// function to display any type of issues in the UI
const displayAllIssues = (issues) => {
  const issuesContainer = document.getElementById("issue-container");
  issuesContainer.innerHTML = "";

  issues.forEach((issue) => {
    const issueItem = document.createElement("div");
    issueItem.innerHTML = `
        <!-- issue item -->
        <div onclick = "loadIssueDetails(${issue.id})"
            class="issue-item bg-white p-4 shadow-lg rounded-xl space-y-4 h-full border-t-4 ${issue.status.toLowerCase() === "open" ? "border-green-600" : "border-purple-600"}">
            <div class="flex justify-between items-center">
              ${issue.status === "open" ? '<img class="w-8" src="./images/Open-Status.png" alt="status"/>' : '<img class="w-8" src="./images/ClosedStatus.png" alt="status"/>'}
              <span class="btn rounded-xl btn-soft ${issue.priority.toUpperCase() === "HIGH" ? "btn-error" : issue.priority.toUpperCase() === "MEDIUM" ? "btn-warning" : "btn-success"}">${issue.priority.toUpperCase()}</span>
            </div>
            <h4 class="text-lg font-semibold">${issue.title}</h4>
            <p class="text-sm text-neutral/80">${issue.description}</p>
            <div class="flex flex-wrap gap-2">${createElements(issue.labels)}</div>
            <div class="flex justify-between items-center text-neutral/70 py-4 border-t border-neutral/20 space-y-2">
              <h4>#${issue.id} by ${issue.author}</h4>
              <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
    `;
    issuesContainer.appendChild(issueItem);
  });
  manageSpinner(false);
};
loadAllIssues();

// function to load issue details from the server and display in the UI
const loadIssueDetails = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayIssueDetails(data.data);
};

const displayIssueDetails = (issue) => {
  const issueDetailsContainer = document.getElementById("modal-container");
  issueDetailsContainer.innerHTML = `
      <h2 class="text-2xl font-bold">${issue.title}</h2>
      <p class="text-neutral/70 space-x-2">
        ${issue.status.toLowerCase() === "open" ? '<span class="badge badge-success">Opened</span>' : '<span class="badge badge-error">Closed</span>'}
        <span> • </span>
        <span>Opened by ${issue.author}</span>
        <span> • </span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
      </p>
      <div class="flex flex-wrap gap-2">${createElements(issue.labels)}</div>
      <p class="text-sm text-neutral/80">${issue.description}</p>
      <div class="flex justify-between items-center p-4 bg-gray-50 rounded-md mb-4">
          <div class = "left space-y-2">
            <p class="text-neutral/80">Assignee:</p>
            <p class="font-bold capitalize">${issue.assignee !== "" ? issue.assignee : "Unassigned"}</p>
          </div>
          <div class = "right space-y-2">
            <p class="text-neutral/80">Priority:</p>
             <span class="btn rounded-xl  ${issue.priority.toUpperCase() === "HIGH" ? "btn-error" : issue.priority.toUpperCase() === "MEDIUM" ? "btn-warning" : "btn-success"}">${issue.priority.toUpperCase()}</span>
          </div>
      </div>
  `;
  document.getElementById("issue_modal").showModal();
};

// function to switch between tabs and load respective issues
const switchTab = (tab) => {
  currentTab = tab;
  const tabs = ["all", "open", "closed"];
  tabs.forEach((t) => {
    const tabName = document.getElementById(t + "-issues");
    if (t === tab) {
      tabName.classList.add("btn-primary");
    } else {
      tabName.classList.remove("btn-primary");
    }
  });

  if (tab === "all") {
    loadAllIssues();
  } else if (tab === "open") {
    loadOpenIssues();
  } else {
    loadClosedIssues();
  }
};

document.getElementById("btn-search").addEventListener("click", () => {
  const input = document.getElementById("input-search");
  const searchInput = input.value.trim().toLowerCase();

  if (searchInput === "") {
    alert("Please enter a search term");
    switchTab(currentTab);
    return;
  }

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchInput}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.data.length === 0) {
        alert("No issues found");
        switchTab(currentTab);
        return;
      }
      countIssue.innerText = data.data.length;
      displayAllIssues(data.data);
    });
});

switchTab(currentTab);
