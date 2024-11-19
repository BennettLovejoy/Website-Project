document.addEventListener("DOMContentLoaded", () => {
    fetch('data/merged_dataset.csv') // Replace with the actual path to your CSV
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV text into an array of objects
            const data = Papa.parse(csvText, {
                header: true, // Treat the first row as a header
                skipEmptyLines: true
            }).data;

            // Pass the parsed data to the function
            generateTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function generateTable(data) {
    const tableContainer = document.querySelector("#data-breakdown .container");

    if (!tableContainer) {
        console.error("Container not found");
        return;
    }

    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>School Name</th>
                        <th>School Address</th>
                        <th>Lowest Grade</th>
                        <th>Highest Grade</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(school => {
        tableHTML += `
            <tr>
                <td>${school['School Name']}</td>
                <td>${school['Street Address']}</td>
                <td>${school['Low Grade*']}</td>
                <td>${school['High Grade*']}</td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    tableContainer.innerHTML = tableHTML;
}
