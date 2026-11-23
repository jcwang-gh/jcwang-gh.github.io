async function refreshStars(counter) {
  const repository = counter.dataset.githubStars;
  try {
    const response = await fetch(`https://api.github.com/repos/${repository}`, { credentials: "omit" });
    if (!response.ok) return;

    const { full_name: name, stargazers_count: stars } = await response.json();
    if (name?.toLowerCase() === repository.toLowerCase() && Number.isSafeInteger(stars) && stars >= 0) {
      counter.textContent = String(stars);
    }
  } catch {
    // The count from the last site build stays visible when GitHub is unavailable.
  }
}

document.querySelectorAll("[data-github-stars]").forEach(refreshStars);
