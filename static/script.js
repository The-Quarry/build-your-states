const candidates = [
  { name: "Lindsay de Sausmarez", image: "photos/1.png" },
  { name: "Yvonne Burford", image: "photos/2.png" },
  { name: "Charles Parkinson", image: "photos/3.png" },
  { name: "Steve Falla", image: "photos/4.png" },
  { name: "Paul Montague", image: "photos/5.png" },
  { name: "Sasha Kazantseva-Miller", image: "photos/6.png" },
  { name: "Gavin St Pier", image: "photos/7.png" },
  { name: "Tina Bury", image: "photos/8.png" },
  { name: "Jonathan Le Tocq", image: "photos/9.png" },
  { name: "Chris Blin", image: "photos/10.png" },
  { name: "George Oswald", image: "photos/11.png" },
  { name: "Marc Laine", image: "photos/12.png" },
  { name: "Aidan Matthews", image: "photos/13.png" },
  { name: "Marc Leadbeater", image: "photos/14.png" },
  { name: "Andy Cameron", image: "photos/15.png" },
  { name: "Sally Rochester", image: "photos/16.png" },
  { name: "Adrian Gabriel", image: "photos/17.png" },
  { name: "Lee Van Katwyk", image: "photos/18.png" },
  { name: "Liam McKenna", image: "photos/19.png" },
  { name: "Mark Helyar", image: "photos/20.png" },
  { name: "Steve Williams", image: "photos/21.png" },
  { name: "John Gollop", image: "photos/22.png" },
  { name: "David Goy", image: "photos/23.png" },
  { name: "Tom Rylatt", image: "photos/24.png" },
  { name: "Jennifer Strachan", image: "photos/25.png" },
  { name: "Simon Vermeulen", image: "photos/26.png" },
  { name: "Munazza Malik", image: "photos/27.png" },
  { name: "Jayne Ozanne", image: "photos/28.png" },
  { name: "Andy Sloan", image: "photos/29.png" },
  { name: "Bruno Kay-Mouat", image: "photos/30.png" },
  { name: "Haley Camp", image: "photos/31.png" },
  { name: "Garry Collins", image: "photos/32.png" },
  { name: "Andrew Niles", image: "photos/33.png" },
  { name: "Rob Curgenven", image: "photos/34.png" },
  { name: "Neil Inder", image: "photos/35.png" },
  { name: "David Dorrity", image: "photos/36.png" },
  { name: "Rhona Humphreys", image: "photos/37.png" },
  { name: "Sarah Hansmann Rouxel", image: "photos/38.png" },
  { name: "Edward Hill", image: "photos/39.png" },
  { name: "Alex Snowden", image: "photos/40.png" }
];

window.onload = function () {
  const deck = document.getElementById("deck");

  candidates.forEach((candidate) => {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.name = candidate.name;

    const img = document.createElement("img");
    img.src = "./static/" + candidate.image;
    img.alt = candidate.name;
    img.className = "card-image";

    card.appendChild(img);
    deck.appendChild(card);

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", candidate.name);
    });
  });

  loadAssignments(); // <- Load on page load
};

function drop(event) {
  event.preventDefault();
  const candidateName = event.dataTransfer.getData("text/plain");
  const dropzone = event.currentTarget;

  const candidate = candidates.find(c => c.name === candidateName);
  if (!candidate) return;

  const isPolicy = dropzone.dataset.committee === "Policy & Resources";
  const policyZone = document.querySelector('[data-committee="Policy & Resources"]');
  const isInPolicy = Array.from(policyZone.querySelectorAll('.card')).some(card => card.dataset.name === candidate.name);

  if (!isPolicy && isInPolicy) {
    alert(`${candidate.name} is already on Policy & Resources and cannot be assigned elsewhere.`);
    return;
  }

  if (isPolicy) {
    document.querySelectorAll('.dropzone').forEach(zone => {
      if (zone !== dropzone) {
        zone.querySelectorAll('.ghost-slot').forEach(slot => {
          const card = Array.from(slot.children).find(c => c.dataset.name === candidate.name);
          if (card) card.remove();
        });
      }
    });
  }

  const slot = event.target.closest('.ghost-slot');
  if (!slot) return;

  const existingCard = slot.querySelector('.card');
  if (existingCard) existingCard.remove();

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.name = candidate.name;

  const img = document.createElement("img");
  img.src = "static/" + candidate.image;
  img.alt = candidate.name;
  img.className = "card-image";

  card.appendChild(img);
  slot.appendChild(card);

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", candidate.name);
  });

  updateCommitteeHighlight(slot.closest('.dropzone'));
}

function allowDrop(event) {
  event.preventDefault();
}

function clearCommittee(button) {
  const committeeZone = button.previousElementSibling;
  if (!committeeZone || !committeeZone.classList.contains('dropzone')) return;

  committeeZone.querySelectorAll('.card').forEach(card => card.remove());
  updateCommitteeHighlight(committeeZone);
}

function clearAssignments() {
  document.querySelectorAll('.dropzone').forEach(zone => {
    zone.querySelectorAll('.card').forEach(card => card.remove());
    updateCommitteeHighlight(zone);
  });

  localStorage.removeItem('assignments');
}

function saveAssignments() {
  const data = {};
  document.querySelectorAll('.dropzone').forEach(zone => {
    const committee = zone.getAttribute('data-committee');
    const members = Array.from(zone.querySelectorAll('.card')).map(card => card.dataset.name);
    data[committee] = members;
  });
  localStorage.setItem('assignments', JSON.stringify(data));
  alert('Saved!');
}

function loadAssignments() {
  const data = JSON.parse(localStorage.getItem('assignments') || '{}');
  Object.entries(data).forEach(([committee, names]) => {
    const dropzone = document.querySelector(`.dropzone[data-committee="${committee}"]`);
    if (!dropzone) return;

    names.forEach(name => {
      const candidate = candidates.find(c => c.name === name);
      if (!candidate) return;

      const slot = Array.from(dropzone.querySelectorAll('.ghost-slot')).find(slot => !slot.querySelector('.card'));
      if (!slot) return;

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.name = candidate.name;

      const img = document.createElement("img");
      img.src = "static/" + candidate.image;
      img.alt = candidate.name;
      img.className = "card-image";

      card.appendChild(img);
      slot.appendChild(card);

      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", candidate.name);
      });
    });

    updateCommitteeHighlight(dropzone);
  });
}

function updateCommitteeHighlight(dropzone) {
  const container = dropzone.closest('.committee');
  if (!container) return;

  const allSlots = dropzone.querySelectorAll('.ghost-slot');
  const filled = Array.from(allSlots).filter(slot => slot.querySelector('.card')).length;

  container.classList.remove('partial', 'full');
  if (filled === allSlots.length) {
    container.classList.add('full');
  } else if (filled > 0) {
    container.classList.add('partial');
  }
}

function exportAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const committees = document.querySelectorAll('.committee');
  committees.forEach((committee, index) => {
    const title = committee.querySelector('h3')?.textContent || `Committee ${index + 1}`;
    const cards = committee.querySelectorAll('.card');

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(title, 10, y);
    y += 8;

    if (cards.length === 0) {
      doc.setFontSize(11);
      doc.setTextColor(150);
      doc.text('(No members assigned)', 14, y);
      y += 8;
    } else {
      cards.forEach(card => {
        const name = card.dataset.name || 'Unknown';
        doc.setFontSize(11);
        doc.setTextColor(60);
        doc.text(`• ${name}`, 14, y);
        y += 6;
      });
      y += 4;
    }

    // Handle page break
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("your_committee_assignments.pdf");
}
