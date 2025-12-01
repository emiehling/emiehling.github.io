// Each event has:
//   - date: "YYYY-MM-DD" format
//   - title: The event title (can include HTML)
//   - description: Short description (can include HTML)
//   - type: "normal", "highlight", or with a tag like "paper", "code", "new", "talk"
//   - link: (optional) URL for the title
//   - future: (optional) If true, this event is phrased in future tense and will be
//             hidden once its date has passed (at end of day)
//
// Events are automatically sorted by date and the "Today" marker is inserted
// only when there are upcoming future events to display.
//
// The most recent tagged event in the past will automatically display as "New"
// if it occurred within the last 3 months. Otherwise, it reverts to its original tag.

const events = [
  {
    date: "2026-01-27",
    title: "AAAI Workshop: Foundations of Agentic Systems Theory",
    description: "Join us for the first iteration of our workshop aiming to build our understanding of why agentic systems work (or do not work). Visit the <a href='https://fast-workshop.github.io'>workshop website</a> for more information.",
    type: "normal",
    future: true
  },
  {
    date: "2026-01-21",
    title: "AAAI Lab: Learning to Steer Large Language Models",
    description: "We're hosting a comprehensive lab session on how to steer LLMs in a more principled way. <a href='https://steerability.github.io/lab/'>Join us</a>!",
    type: "normal",
    future: true
  },
  {
    date: "2025-12-02",
    title: "NeurIPS Expo Demo",
    description: "We will be demoing our recently released toolkits: AI Steerability 360 and In-Context Explainability 360. Swing by if you'll be at NeurIPS!",
    type: "normal",
    future: true
  },
  // past events below --
  {
    date: "2025-10-10",
    title: "Talk @ INTERPLAY // COLM 2025",
    description: "Gave a talk on our <a href='https://arxiv.org/abs/2505.24539'>paper</a> studying how personas are encoded in the representation space of LLMs.",
    type: "normal",
  },
  {
    date: "2025-10-01",
    title: "Open sourced the AI Steerability 360 toolkit",
    description: "We have released the first version of our steerability toolkit. Keep an eye on the repo for updates.",
    type: "code",
    link: "https://github.com/IBM/AISteer360"
  },
  {
    date: "2025-05-02",
    title: "Poster @ NAACL 2025",
    description: "Presented our research on <a href='https://arxiv.org/abs/2411.12405'>evaluating the prompt steerability</a> of LLMs.",
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

  // Find the most recent tagged event in the past to mark as "new"
  // Only if it occurred within the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const tagTypes = ['paper', 'code', 'talk'];
  const mostRecentTaggedPastEvent = sortedEvents.find(event => {
    const eventDate = new Date(event.date + 'T00:00:00');
    const isPast = eventDate < today;
    const isWithinThreeMonths = eventDate >= threeMonthsAgo;
    const hasTag = tagTypes.includes(event.type);
    return isPast && isWithinThreeMonths && hasTag;
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

    // Determine the display type (override to "new" for most recent tagged past event)
    let displayType = event.type;
    const isMostRecentTagged = mostRecentTaggedPastEvent && 
      event.date === mostRecentTaggedPastEvent.date && 
      event.title === mostRecentTaggedPastEvent.title;
    
    if (isMostRecentTagged) {
      displayType = 'new';
    }

    // Determine if this is a highlighted item (has a tag type)
    const isHighlight = ['paper', 'code', 'new', 'talk', 'highlight'].includes(displayType);
    const hasTag = ['paper', 'code', 'new', 'talk'].includes(displayType);

    // Build the event HTML
    const itemDiv = document.createElement('div');
    itemDiv.className = `timeline-item${isHighlight ? ' highlight' : ''}`;

    let titleHTML = event.title;
    // For non-highlighted items, keep the link on the title
    if (event.link && !isHighlight) {
      titleHTML = `<a href="${event.link}">${event.title}</a>`;
    }

    let tagHTML = '';
    if (hasTag) {
      const tagLabels = {
        'paper': 'Paper',
        'code': 'Code', 
        'new': 'New',
        'talk': 'Talk'
      };
      tagHTML = `<span class="tag ${displayType}">${tagLabels[displayType]}</span>`;
    }

    // Add clock icon for future events
    const dateHTML = isFutureEvent 
      ? `<i class="fa-regular fa-clock"></i> ${formatDate(event.date)}`
      : formatDate(event.date);

    if (isHighlight) {
      // For highlighted items, make the whole box clickable if there's a link
      const boxContent = `
        <div class="timeline-date">${dateHTML}</div>
        <h3 class="timeline-title">${tagHTML}${titleHTML}</h3>
        <p class="timeline-description">${event.description}</p>
      `;
      
      if (event.link) {
        itemDiv.innerHTML = `
          <a href="${event.link}" class="timeline-box timeline-box-link">
            ${boxContent}
          </a>
        `;
      } else {
        itemDiv.innerHTML = `
          <div class="timeline-box">
            ${boxContent}
          </div>
        `;
      }
    } else {
      itemDiv.innerHTML = `
        <span class="timeline-date">${dateHTML}</span>
        <h3 class="timeline-title">${titleHTML}</h3>
        <p class="timeline-description">${event.description}</p>
      `;
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