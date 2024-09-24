const fetchActivity = async (username) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`
    );

    return response.json();
  } catch (error) {
    console.error(error);
  }
};

function displayActivity(events) {
  if (events.length === 0) {
    console.log("No recent activity found.");
    return;
  }

  events.forEach((event) => {
    let action;
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
        break;
      case "IssuesEvent":
        action = `${
          event.payload.action.charAt(0).toUpperCase() +
          event.payload.action.slice(1)
        } an issue in ${event.repo.name}`;
        break;
      case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
      case "ForkEvent":
        action = `Forked ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }
    console.log(`- ${action}`);
  });
}

const username = process.argv[3];

if (!username) {
  console.error("Please provide a GitHub username.");
  process.exit(1);
}

fetchActivity(username)
  .then((activity) => {
    displayActivity(activity);
  })
  .catch((err) => {
    console.error(err);
  });
