document.addEventListener("DOMContentLoaded", () => {
  const propertyList = document.getElementById("propertyList");

  // Fetch properties from server and render
  fetch("/api/properties")
    .then(response => response.json())
    .then(properties => {
      properties.forEach(property => {
        const card = createPropertyCard(property);
        propertyList.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching properties:', error));

  


  // Function to create property card
  function createPropertyCard(property) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <i class="fas fa-home"></i>
      <h3>${property.PropertyType}</h3>
      <p>${property.Location} - ${property.Size} sqft</p>
      <p>Price: $${property.Price}</p>
      <button class="book-appointment" data-property-id="${property.PropertyID}">Book Appointment</button>
    `;

    // Event listener for booking appointment
    const bookButton = card.querySelector(".book-appointment");
    bookButton.addEventListener("click", () => {
      openModal(property.PropertyID, property.agentid);
    });

    return card;
  }

  // Modal functionality
  const modal = document.getElementById("modal");
  const closeModal = document.querySelector(".close");
  closeModal.onclick = () => {
    modal.style.display = "none";
  };
  window.onclick = event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  function openModal(propertyId, agentId) {
    const appointmentForm = document.getElementById("appointmentForm");
    appointmentForm.reset();
    document.getElementById("propertyId").value = propertyId;
    document.getElementById("agentId").value = agentId;
    modal.style.display = "block";
  }

  // Handle form submission for booking appointment
  const appointmentForm = document.getElementById("appointmentForm");
  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(appointmentForm);
    const date = formData.get("date");
    const propertyId = formData.get("propertyId");
    const agentId = formData.get("agentId"); // Assuming you have agentId from somewhere
    const urlParams = new URLSearchParams(window.location.search);
    const buyerId = urlParams.get('buyerId');



    fetch("/api/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        propertyId,
        agentId,
        date,
        buyerId
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Appointment booked successfully:', data);
        alert("Appointment booked sucessfully!")
        modal.style.display = "none";
        // You can add further UI updates or notifications here
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
        // Handle errors or show user a message
      });
  });

  // Fetch appointments for the logged-in buyer when "My Appointments" is clicked
  const myAppointmentsButton = document.getElementById("myAppointments");
  myAppointmentsButton.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const buyerId = urlParams.get('buyerId');
    const homeButton = document.getElementById("prop");


    fetch(`/api/my-appointments?buyerId=${buyerId}`)
      .then(response => response.json())
      .then(appointments => {
        // Clear existing properties
        console.log(appointments)
        propertyList.innerHTML = "";
        appointments.forEach(appointment => {
          const card = createAppointmentCard(appointment);
          propertyList.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching appointments:', error));
  });

  // Function to create appointment card
  function createAppointmentCard(appointment) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <i class="fas fa-calendar-alt"></i>
      <h3>${appointment.AppointmentDate}</h3>
      <p>Status: ${appointment.Status}</p>
    `;
    return card;
  }
});
