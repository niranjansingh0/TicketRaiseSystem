const apiURL = "/api/tickets";

// ----------------- Create Ticket -----------------
document.getElementById("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.querySelector(".submit-btn");
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting... ⏳";

  const ticketData = {
    name: document.getElementById("name").value,
    department: document.getElementById("department").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData)
    });

    const data = await res.json();

    if (data.success) {
      const successMessage = document.getElementById("successMessage");
      successMessage.style.display = "block";
      setTimeout(() => successMessage.style.display = "none", 3000);

      document.getElementById("ticketForm").reset();
      loadTickets();
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error submitting ticket. Try again!");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// ----------------- Load Tickets -----------------
async function loadTickets() {
  const res = await fetch(apiURL);
  const tickets = await res.json();

  const ticketsList = document.getElementById("ticketsList");
  ticketsList.innerHTML = "";

  if (!tickets || tickets.length === 0) {
    ticketsList.innerHTML = `<div class="no-tickets">No tickets available. Create your first ticket!</div>`;
    updateStats([]);
    return;
  }

  tickets.forEach(ticket => {
    ticketsList.innerHTML += `
      <div class="ticket-card ${ticket.status === "Completed" ? "ticket-completed" : ""}">
        <div class="ticket-header">
          <h5>${ticket.name}</h5>
          <span class="ticket-department">(${ticket.department || "General"})</span>
        </div>
        <p class="ticket-description">${ticket.description}</p>
        <div class="ticket-footer">
          <span class="ticket-date">📅 ${new Date(ticket.createdAt).toLocaleString()}</span>
          <p class="ticket-status">Status: <b>${ticket.status}</b></p>
          ${
            ticket.status === "Open"
              ? `<button class="complete-btn" data-id="${ticket._id}">✅ Mark Completed</button>`
              : ""
          }
        </div>
      </div>
    `;
  });

  updateStats(tickets);
}

// ----------------- Update Stats -----------------
function updateStats(tickets) {
  document.getElementById("totalTickets").textContent = tickets.length;
  document.getElementById("openTickets").textContent = tickets.filter(t => t.status === "Open").length;
  document.getElementById("completedTickets").textContent = tickets.filter(t => t.status === "Completed").length;
}

// ----------------- Mark Ticket Completed -----------------
async function markCompleted(ticketId, btn) {
  btn.textContent = "Submitting... ⏳";
  btn.disabled = true;
  btn.style.cursor = "not-allowed";
  btn.style.background = "#adb5bd"; // gray while processing

  try {
    const res = await fetch(`/api/tickets/${ticketId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.success) {
      btn.textContent = "Completed ✅";
      btn.style.background = "#40c057"; // green
      setTimeout(() => loadTickets(), 1000);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
      btn.textContent = "Retry";
      btn.disabled = false;
      btn.style.cursor = "pointer";
      btn.style.background = "#fa5252"; // red
    }
  } catch (err) {
    alert("Error updating ticket status");
    btn.textContent = "Retry";
    btn.disabled = false;
    btn.style.cursor = "pointer";
    btn.style.background = "#fa5252";
  }
}

// ----------------- Event Delegation -----------------
document.getElementById("ticketsList").addEventListener("click", (e) => {
  if (e.target.classList.contains("complete-btn")) {
    const ticketId = e.target.getAttribute("data-id");
    markCompleted(ticketId, e.target);
  }
});

// ----------------- Initial Load -----------------
loadTickets();
