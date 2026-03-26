let currentSort = 'eventDate';
let currentView = 'list';

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getUrgencyClass(urgency) {
    const classes = {
        'red': 'urgency-red',
        'yellow': 'urgency-yellow',
        'green': 'urgency-green',
        'closed': 'urgency-closed'
    };
    return classes[urgency] || 'urgency-green';
}

function getUrgencyText(urgency) {
    const texts = {
        'red': '🔴 URGENT',
        'yellow': '🟡 THIS WEEK',
        'green': '🟢 UPCOMING',
        'closed': '⬛ CLOSED'
    };
    return texts[urgency] || '🟢 UPCOMING';
}

function sortHackathons(hackathons, sortBy) {
    return [...hackathons].sort((a, b) => {
        const dateA = new Date(sortBy === 'eventDate' ? a.eventDate : a.regDate);
        const dateB = new Date(sortBy === 'eventDate' ? b.eventDate : b.regDate);
        return dateA - dateB;
    });
}

function renderListView() {
    const sorted = sortHackathons(hackathons, currentSort);
    const listContainer = document.getElementById('hackathonList');
    
    listContainer.innerHTML = sorted.map(hack => `
        <div class="hackathon-item" data-id="${hack.id}">
            <div class="hackathon-header" onclick="toggleHackathon(${hack.id})">
                <div class="hackathon-title">
                    <span class="urgency-badge ${getUrgencyClass(hack.urgency)}">
                        ${getUrgencyText(hack.urgency)}
                    </span>
                    <span class="hackathon-name">${hack.name}</span>
                </div>
                <div class="hackathon-dates">
                    <span>📅 Event: ${formatDate(hack.eventDate)}</span>
                    <span>📝 Reg: ${formatDate(hack.regDate)}</span>
                </div>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="hackathon-details">
                <div class="hackathon-content">
                    <div class="prize-highlight">
                        <strong>💰 Prize Pool:</strong> ${hack.prize}
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Status</div>
                        <div class="detail-value">${hack.status}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Event Date</div>
                        <div class="detail-value">${formatDate(hack.eventDate)}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Registration Deadline</div>
                        <div class="detail-value">${formatDate(hack.regDate)}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Team Size</div>
                        <div class="detail-value">${hack.teamSize}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Entry Fee</div>
                        <div class="detail-value">${hack.fee}</div>
                    </div>
                    
                    ${hack.duration ? `
                    <div class="detail-row">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">${hack.duration}</div>
                    </div>
                    ` : ''}
                    
                    ${hack.domains ? `
                    <div class="detail-row">
                        <div class="detail-label">Domains</div>
                        <div class="detail-value">${hack.domains}</div>
                    </div>
                    ` : ''}
                    
                    <div class="detail-row">
                        <div class="detail-label">Mode</div>
                        <div class="detail-value">${hack.mode}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Venue</div>
                        <div class="detail-value">${hack.venue}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Organizer</div>
                        <div class="detail-value">${hack.organizer}</div>
                    </div>
                    
                    ${hack.links.length > 0 ? `
                    <div class="detail-row">
                        <div class="detail-label">Links</div>
                        <div class="detail-value">
                            ${hack.links.map(link => 
                                `<a href="${link.url}" target="_blank">${link.label}</a>`
                            ).join(' | ')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function renderCalendarView() {
    const sorted = sortHackathons(hackathons, 'eventDate');
    const calendarContainer = document.getElementById('calendar');
    
    const eventsByDate = {};
    
    sorted.forEach(hack => {
        const eventDate = hack.eventDate;
        const regDate = hack.regDate;
        
        if (!eventsByDate[eventDate]) {
            eventsByDate[eventDate] = [];
        }
        eventsByDate[eventDate].push({
            ...hack,
            type: 'Event Day'
        });
        
        if (!eventsByDate[regDate]) {
            eventsByDate[regDate] = [];
        }
        eventsByDate[regDate].push({
            ...hack,
            type: 'Registration Deadline'
        });
    });
    
    const sortedDates = Object.keys(eventsByDate).sort((a, b) => new Date(a) - new Date(b));
    
    calendarContainer.innerHTML = sortedDates.map(date => `
        <div class="calendar-day">
            <div class="calendar-date">${formatDate(date)}</div>
            ${eventsByDate[date].map(event => `
                <div class="calendar-event">
                    <div class="calendar-event-name">${event.name}</div>
                    <div class="calendar-event-type">${event.type}</div>
                    <span class="urgency-badge ${getUrgencyClass(event.urgency)}" style="display: inline-block; margin-top: 8px;">
                        ${getUrgencyText(event.urgency)}
                    </span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function toggleHackathon(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    item.classList.toggle('open');
}

function switchView(view) {
    currentView = view;
    
    document.getElementById('listView').classList.remove('active');
    document.getElementById('calendarView').classList.remove('active');
    document.getElementById('listViewBtn').classList.remove('active');
    document.getElementById('calendarViewBtn').classList.remove('active');
    
    if (view === 'list') {
        document.getElementById('listView').classList.add('active');
        document.getElementById('listViewBtn').classList.add('active');
        renderListView();
    } else {
        document.getElementById('calendarView').classList.add('active');
        document.getElementById('calendarViewBtn').classList.add('active');
        renderCalendarView();
    }
}

document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));
document.getElementById('calendarViewBtn').addEventListener('click', () => switchView('calendar'));

document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    if (currentView === 'list') {
        renderListView();
    }
});

document.getElementById('totalEvents').textContent = hackathons.length;

renderListView();
