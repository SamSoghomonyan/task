$(document).ready(function () {
  const cargoList = [
    {
      id: "CARGO001",
      name: "Строительные материалы",
      status: "В пути",
      origin: "Москва",
      destination: "Казань",
      departureDate: "2024-11-24",
    },
    {
      id: "CARGO002",
      name: "Хрупкий груз",
      status: "Ожидает отправки",
      origin: "Санкт-Петербург",
      destination: "Екатеринбург",
      departureDate: "2024-11-26",
    },
  ];

  const statusColors = {
    "Ожидает отправки": "yellow",
    "В пути": "lightblue",
    Доставлен: "lightgreen",
  };

  function renderTable() {
    const selectedStatus = $("#filterStatus").val();
    const filteredCargo = cargoList.filter((cargo) =>
      selectedStatus ? cargo.status === selectedStatus : true
    );

    $("#cargoTableBody").empty();

    filteredCargo.forEach((cargo) => {
      const row = $(`
        <tr style="background-color: ${statusColors[cargo.status]}">
          <td>${cargo.id}</td>
          <td>${cargo.name}</td>
          <td>
            <select class="form-select cargo-status" data-id="${cargo.id}">
              <option ${cargo.status === "Ожидает отправки" ? "selected" : ""}>
                Ожидает отправки
              </option>
              <option ${
                cargo.status === "В пути" ? "selected" : ""
              }>В пути</option>
              <option ${cargo.status === "Доставлен" ? "selected" : ""}>
                Доставлен
              </option>
            </select>
          </td>
          <td>${cargo.origin}</td>
          <td>${cargo.destination}</td>
          <td>${cargo.departureDate}</td>
        </tr>
      `);

      $("#cargoTableBody").append(row);
    });
  }

  function addCargo(event) {
    event.preventDefault();

    const cargoName = $("#cargoName").val();
    const departureCity = $("#departureCity").val();
    const destinationCity = $("#destinationCity").val();
    const departureDate = $("#departureDate").val();

    if (!cargoName || !departureCity || !destinationCity || !departureDate) {
      alert("Please fill in all fields.");
      return;
    }

    const id = `CARGO${String(cargoList.length + 1).padStart(3, "0")}`;
    cargoList.push({
      id,
      name: cargoName,
      status: "Ожидает отправки",
      origin: departureCity,
      destination: destinationCity,
      departureDate,
    });

    renderTable();
    $("#addCargoForm")[0].reset();
  }

  function updateCargoStatus() {
    const id = $(this).data("id");
    const newStatus = $(this).val();
    const cargo = cargoList.find((c) => c.id === id);

    if (
      newStatus === "Доставлен" &&
      new Date(cargo.departureDate) > new Date()
    ) {
      alert("Cannot mark cargo as delivered before departure.");
      renderTable();
      return;
    }

    cargo.status = newStatus;
    renderTable();
  }

  // Event Listeners
  $("#filterStatus").on("change", renderTable);
  $("#addCargoForm").on("submit", addCargo);
  $(document).on("change", ".cargo-status", updateCargoStatus);

  // Initial Render
  renderTable();
});
