// Each event has:
//   - date: "YYYY-MM-DD" format
//   - title: The event title (can include HTML)
//   - description: Short description (can include HTML)
//   - type: "normal" or "highlight" (highlighted events are shown in a box)
//   - link: (optional) URL for the title
//   - future: (optional) If true, this event is phrased in future tense and will be
//             hidden once its date has passed (at end of day)
//
// Events are automatically sorted by date and the "Today" marker is inserted
// only when there are upcoming future events to display.

const events = [
  {
    date: "2026-12-13",
    title: "NeurIPS 2026 Competition:<br>The Steerability Challenge",
    description: "An open competition to steer models to be less dishonest without degrading general capabilities. Final submissions due Nov 21. Workshop on Dec 13 at NeurIPS in Paris.",
    type: "highlight",
    link: "https://steerability.github.io/competition/"
  },
  {
    date: "2026-12-12",
    title: "FAST @ NeurIPS 2026",
    description: "The second iteration of the Foundations of Agentic Systems Theory workshop. Held at NeurIPS in Paris.",
    type: "highlight",
    link: "https://fast-workshop.github.io"
  },
  // past events below --
  {
    date: "2026-01-27",
    title: "AAAI Workshop: Foundations of Agentic Systems Theory",
    description: "Hosted the first iteration of <a href='https://fast-workshop.github.io'>FAST</a> aiming to build our understanding of why agentic systems work (or do not work). Thank you to all of the participants!",
    type: "normal",
  },
  {
    date: "2026-01-21",
    title: "AAAI Lab: Learning to Steer Large Language Models",
    description: "Hosted a comprehensive <a href='https://steerability.github.io/lab/'>lab session</a> on how to steer LLMs in a more principled way.",
    type: "normal",
  },
];

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function renderTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Clear existing content
  timeline.innerHTML = '';

  // Get today's date (normalized to midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // End of today (for future event comparison)
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Filter out future-tense events that have already passed (after end of their day)
  const filteredEvents = events.filter(event => {
    const eventEndOfDay = new Date(event.date + 'T23:59:59');
    // Keep the event if:
    // - It's not marked as a future event, OR
    // - It IS a future event and its date hasn't fully passed yet (end of day)
    return !event.future || eventEndOfDay >= today;
  });

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Check if there are any future events remaining (event date is today or later)
  const hasFutureEvents = sortedEvents.some(event => {
    const eventDate = new Date(event.date + 'T00:00:00');
    return eventDate >= today;
  });

  let todayMarkerInserted = false;

  sortedEvents.forEach((event, index) => {
    const eventDate = new Date(event.date + 'T00:00:00');
    const isFutureEvent = eventDate >= today;
    
    // Insert "Today" marker only if there are future events
    if (hasFutureEvents && !todayMarkerInserted && eventDate < today) {
      const todayDiv = document.createElement('div');
      todayDiv.className = 'timeline-today';
      todayDiv.innerHTML = '<span class="timeline-today-label">today</span>';
      timeline.appendChild(todayDiv);
      todayMarkerInserted = true;
    }

    const isHighlight = event.type === 'highlight';

    // Build the event HTML
    const itemDiv = document.createElement('div');
    itemDiv.className = `timeline-item${isHighlight ? ' highlight' : ''}`;

    let titleHTML = event.title;
    // For non-highlighted items, keep the link on the title
    if (event.link && !isHighlight) {
      titleHTML = `<a href="${event.link}">${event.title}</a>`;
    }

    // Add clock icon for future events
    const dateHTML = isFutureEvent 
      ? `<i class="fa-regular fa-clock"></i> ${formatDate(event.date)}`
      : formatDate(event.date);

    const content = `
      <span class="timeline-date">${dateHTML}</span>
      <h3 class="timeline-title">${titleHTML}</h3>
      <p class="timeline-description">${event.description}</p>
    `;

    if (isHighlight) {
      // For highlighted items, make the whole box clickable if there's a link
      itemDiv.innerHTML = event.link
        ? `<a href="${event.link}" class="timeline-box timeline-box-link">${content}</a>`
        : `<div class="timeline-box">${content}</div>`;
    } else {
      itemDiv.innerHTML = content;
    }

    timeline.appendChild(itemDiv);
  });

  // If all events are in the future and we have future events, add Today at the end
  if (hasFutureEvents && !todayMarkerInserted) {
    const todayDiv = document.createElement('div');
    todayDiv.className = 'timeline-today';
    todayDiv.innerHTML = '<span class="timeline-today-label">Today</span>';
    timeline.appendChild(todayDiv);
  }
}

// Render when DOM is ready
document.addEventListener('DOMContentLoaded', renderTimeline);