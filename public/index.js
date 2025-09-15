const apiURL = "/api/tickets";

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
            ${ticket.status === "Open" ? `<button class="complete-btn" onclick="markCompleted('${ticket._id}')">✅ Mark Completed</button>` : ""}
        </div>
    </div>
  `;
  });

  updateStats(tickets);
}

function updateStats(tickets) {
  document.getElementById("totalTickets").textContent = tickets.length;
  document.getElementById("openTickets").textContent = tickets.filter(t => t.status === "Open").length;
  document.getElementById("completedTickets").textContent = tickets.filter(t => t.status === "Completed").length;
}

async function markCompleted(ticketId) {
  const btn = document.querySelector(`button[onclick="markCompleted('${ticketId}')"]`);
  if (btn) {
    btn.textContent = "Submitting... ⏳";
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  }

  try {
    const res = await fetch(`/api/tickets/${ticketId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.success) {
      if (btn) {
        btn.textContent = "Completed ✅";
        btn.style.background = "#40c057";
      }
      // Refresh ticket list
      setTimeout(() => loadTickets(), 800);
    } else {
      alert("Error: " + (data.error || "Unknown error"));
      if (btn) {
        btn.textContent = "Retry";
        btn.disabled = false;
        btn.style.cursor = "pointer";
      }
    }
  } catch (err) {
    alert("Error updating ticket status");
    if (btn) {
      btn.textContent = "Retry";
      btn.disabled = false;
      btn.style.cursor = "pointer";
    }
  }
}


// initial load
loadTickets();
