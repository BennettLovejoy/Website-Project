// data.js

// Function to fetch and parse data from a CSV
async function loadData(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.error("CSV parsing errors:", results.errors);
                    reject(results.errors);
                } else {
                    resolve(results.data);
                }
            },
            error: (error) => {
                console.error("CSV loading error:", error);
                reject(error);
            }
        });
    });
}
