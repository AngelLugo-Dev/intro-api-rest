const API_URL =
  "https://68bb0de484055bce63f104b3.mockapi.io/api/v1/dispositivos_IoT";

// Función para obtener la IP pública del cliente
async function getPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error al obtener IP:", error);
    return "Desconocida";
  }
}

// Función para obtener la fecha actual en zona horaria de Ciudad de México
function getMexicoCityDate() {
  const options = {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("es-MX", options);
  const parts = formatter.formatToParts(new Date());
  const date = `${parts.find((p) => p.type === "year").value}-${
    parts.find((p) => p.type === "month").value
  }-${parts.find((p) => p.type === "day").value}`;
  const time = `${parts.find((p) => p.type === "hour").value}:${
    parts.find((p) => p.type === "minute").value
  }:${parts.find((p) => p.type === "second").value}`;
  return `${date} ${time}`;
}

// Función para cargar los últimos 5 registros y el último status
async function loadRecords() {
  try {
    const response = await fetch(
      `${API_URL}?sortBy=createdAt&order=desc&limit=5`
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

// Evento para agregar registro
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const status = document.getElementById("status").value;

  if (!name || !status) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const ip = await getPublicIP();
  const date = getMexicoCityDate();

  const newRecord = { name, status, ip, date };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    });
    alert("Registro agregado exitosamente.");
    document.getElementById("addForm").reset();
    loadRecords(); // Recargar datos
  } catch (error) {
    console.error("Error al agregar registro:", error);
    alert("Error al agregar registro.");
  }
});

// Cargar datos al iniciar
window.addEventListener("load", loadRecords);
