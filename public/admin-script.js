document.addEventListener("DOMContentLoaded", function() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", function() {
      const current = document.getElementsByClassName("active");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }
      this.className += " active";

      const target = this.getAttribute("id");
      displayTable(target);
    });
  });

 
    // Fetch row counts for each table
    fetchRowCounts();
  
    function fetchRowCounts() {
      fetch("/rowcounts")
        .then(response => response.json())
        .then(data => {
          // Update the HTML elements with the retrieved row counts
          document.getElementById("totalCount").textContent = data.User || 'Error';
          // document.getElementById("adminsCount").textContent = data.Admin || 'Error';
          document.getElementById("ownersCount").textContent = data.Owner || 'Error';
          document.getElementById("buyersCount").textContent = data.Buyer || 'Error';
          document.getElementById("agentsCount").textContent = data.Agent || 'Error';
          document.getElementById("appointmentsCount").textContent = data.Appointment || 'Error';
          document.getElementById("transactionsCount").textContent = data.Transaction || 'Error';
        })
        .catch(error => {
          console.error("Error fetching row counts:", error);
        });
    }

  




  



  function displayTable(entity) {
    // Hide all tables
    hideAllTables();

    // Show the selected table
    const table = document.getElementById(`${entity}Data`);
    if (table) {
      table.style.display = "block";
      fetchTableData(entity);
    }
  }

  function hideAllTables() {
    const tables = document.querySelectorAll(".data-table");
    tables.forEach(table => {
      table.style.display = "none";
    });
  }

  function fetchTableData(entity) {
    console.log(entity);
    fetch(`/data?entity=${entity}`)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById(`${entity}TableBody`);
        tableBody.innerHTML = ""; // Clear existing data

        if (data.tableData && data.tableData.length > 0) {
          data.tableData.forEach(row => {
            const tr = document.createElement("tr");
            for (const key in row) {
              if (Object.hasOwnProperty.call(row, key)) {
                const td = document.createElement("td");
                td.textContent = row[key];
                tr.appendChild(td);
              }
            }
            const actionTd = document.createElement("td");
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => deleteRow(entity, row));
            actionTd.appendChild(deleteBtn);
            tr.appendChild(actionTd);
            tableBody.appendChild(tr);
          });
        } else {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.setAttribute("colspan", "7");
          td.textContent = "No data available";
          tr.appendChild(td);
          tableBody.appendChild(tr);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  function deleteRow(entity, row) {
    switch (entity) {
      case 'users':
        rentity = 'User';
        break;
      case 'properties':
        rentity = 'Property';
        break;
      case 'owners':
        rentity = 'Owner';
        break;
      case 'agents':
        rentity = 'Agent';
        break;
      case 'appointments':
        rentity = 'Appointment';
        break;
      case 'buyers':
        rentity = 'Buyer';
        break;
      case 'transactions':
        rentity = 'Transaction';
        break;
      default:
        res.status(400).json({ error: 'Invalid entity' });
        return;
    }
    console.log(rentity);

    const id = row[`${rentity}ID`]; // Extract ID based on entity name
    console.log(id);

    if (!id) {
      console.error("Invalid ID for deletion");
      return;
    }
    
    fetch(`/delete?entity=${rentity}&id=${id}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete row");
        }
        return response.json();
      })
      .then(data => {
        // Assuming successful deletion, refresh the table
        fetchTableData(entity);
      })
      .catch(error => {
        console.error("Error deleting row:", error);
      });
  }

  // Initially display the users table on page load
 // displayTable("users");
});

