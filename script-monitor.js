const API_URL =
  "https://68bb0de484055bce63f104b3.mockapi.io/api/v1/dispositivos_IoT";

// Función para cargar los últimos 10 registros y el último status
async function loadRecords() {
  try {
    const response = await fetch(
      `${API_URL}?sortBy=createdAt&order=desc&limit=10`
    );
    const data = await response.json();

    // Actualizar tabla
    const tableBody = document.getElementById("recordsTable");
    tableBody.innerHTML = "";
    data.forEach((record) => {
      const row = `
                <tr>
                    <td>${record.id}</td>
                    <td>${record.name}</td>
                    <td>${record.status}</td>
                    <td>${record.ip}</td>
                    <td>${record.date}</td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });

    // Actualizar último status
    const lastStatus = data.length > 0 ? data[0].status : "Ninguno";
    document.getElementById("lastStatus").textContent = lastStatus;
  } catch (error) {
    console.error("Error al cargar registros:", error);
  }
}

// Cargar datos al iniciar y polling cada 2 segundos
window.addEventListener("load", () => {
  loadRecords();
  setInterval(loadRecords, 2000); // Actualizar cada 2 segundos
});
