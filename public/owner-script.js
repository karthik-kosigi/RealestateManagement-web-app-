// // Function to fetch properties and transactions data for the owner
// function fetchOwnerData(ownerId) {
//   // Fetch properties data
//   fetch(`/ownerdata?entity=properties&ownerId=${ownerId}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log("Received properties data:", data);
//       if (data.tableData) {
//         displayProperties(data.tableData);
//       }
//     })
//     .catch(error => {
//       console.error("Error fetching properties data:", error);
//     });

//   // Fetch transactions data
//   fetch(`/ownerdata?entity=transactions&ownerId=${ownerId}`)
//     .then(response => response.json())
//     .then(data => {
//       console.log("Received transactions data:", data);
//       if (data.tableData) {
//         displayTransactions(data.tableData);
//       }
//     })
//     .catch(error => {
//       console.error("Error fetching transactions data:", error);
//     });
// }

// // Function to display properties in the table
// function displayProperties(properties) {
//   const propertiesTableBody = document.getElementById("propertiesTableBody");
//   propertiesTableBody.innerHTML = "";
//   properties.forEach(property => {
//     const row = `
//       <tr>
//         <td>${property.PropertyID}</td>
//         <td>${property.PropertyType}</td>
//         <td>${property.Location}</td>
//         <td>${property.Size}</td>
//         <td>${property.Price}</td>
//         <td>${property.agentid}</td>
//         <td>${property.Status}</td>
//         <td><button onclick="editProperty(${property.PropertyID})">Edit</button></td>
//         <td><button onclick="deleteEntity('Property', ${property.PropertyID})">Delete</button></td>
//       </tr>
//     `;
//     propertiesTableBody.innerHTML += row;
//   });
// }

// // Function to display transactions in the table
// function displayTransactions(transactions) {
//   const transactionsTableBody = document.getElementById("transactionsTableBody");
//   transactionsTableBody.innerHTML = "";
//   transactions.forEach(transaction => {
//     const row = `
//       <tr>
//         <td>${transaction.TransactionID}</td>
//         <td>${transaction.PropertyID}</td>
//         <td>${transaction.BuyerID}</td>
//         <td>${transaction.AgentID}</td>
//         <td>${transaction.TransactionDate}</td>
//         <td>${transaction.TransactionAmount}</td>
//         <td><button onclick="editTransaction(${transaction.TransactionID})">Edit</button></td>
//         <td><button onclick="deleteEntity('Transaction', ${transaction.TransactionID})">Delete</button></td>
//       </tr>
//     `;
//     transactionsTableBody.innerHTML += row;
//   });
// }

// // Function to delete an entity
// function deleteEntity(entity, id) {
//   fetch(`/delete?entity=${entity}&id=${id}`, {
//     method: 'DELETE'
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log("Delete response:", data);
//     // Refresh the data after deletion
//     fetchOwnerData(ownerId); // Assuming ownerId is defined globally or passed as an argument
//   })
//   .catch(error => {
//     console.error("Error deleting entity:", error);
//   });
// }

// // Function to edit a property
// function editProperty(propertyId) {
//   // Here you can define the logic to edit a property
//   console.log('Editing property with ID:', propertyId);
//   // For example, you might open a modal with a form for editing
// }

// // Function to edit a transaction
// function editTransaction(transactionId) {
//   // Here you can define the logic to edit a transaction
//   console.log('Editing transaction with ID:', transactionId);
//   // For example, you might open a modal with a form for editing
// }

// // Assuming ownerId is defined globally or passed as an argument
// // Fetch properties and transactions data for the owner on page load
// const urlParams = new URLSearchParams(window.location.search);
// const ownerId = urlParams.get('ownerId');
// fetchOwnerData(ownerId);
