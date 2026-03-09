// spinner management
const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issue-container").classList.add("hidden");
  } else {
    document.getElementById("issue-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// function to create label elements based on the labels array
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

const loadAllIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const response = await fetch(url);
  const data = await response.json();
  displayAllIssues(data.data);
};

// {
//     "id": 42,
//     "title": "Add role-based access control",
//     "description": "Implement RBAC system with different permission levels for users, moderators, and admins.",
//     "status": "open",
//     "labels": [
//         "enhancement"
//     ],
//     "priority": "high",
//     "author": "rbac_rachel",
//     "assignee": "security_sam",
//     "createdAt": "2024-01-23T08:45:00Z",
//     "updatedAt": "2024-01-23T08:45:00Z"
// }

const displayAllIssues = (issues) => {
  const issuesContainer = document.getElementById("issue-container");
  issuesContainer.innerHTML = "";

  issues.forEach((issue) => {
    console.log(issue);
    const issueItem = document.createElement("div");
    issueItem.innerHTML = `
        <!-- issue item -->
        <div
            class="issue-item bg-white p-4 shadow-lg rounded-xl space-y-4 h-full border-t-4 ${issue.status.toLowerCase() === "open" ? "border-green-600" : "border-purple-600"}">
            <div class="flex justify-between items-center">
              ${issue.status === "open" ? '<img class="w-8" src="./images/Open-Status.png" alt="status"/>' : '<img class="w-8" src="./images/ClosedStatus.png" alt="status"/>'}
              <span class="btn rounded-xl btn-soft ${issue.priority.toUpperCase() === "HIGH" ? "btn-error" : issue.priority.toUpperCase() === "MEDIUM" ? "btn-warning" : "btn-success"}">${issue.priority.toUpperCase()}</span>
            </div>
            <h4 class="text-lg font-semibold">${issue.title}</h4>
            <p class="text-sm text-neutral/80">${issue.description}</p>
            <div class="flex flex-wrap gap-2">${createElements(issue.labels)}</div>
            <div class="author text-neutral/70 py-4 border-t border-neutral/20 space-y-2">
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
