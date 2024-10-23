// JavaScript source code for FastPass verification

// Sample FastPass data structure to simulate database behavior
const fastpass_data = {
    '1': { 'customer_name': 'Alice Smith', 'expiration': '2024-12-31', 'type': 'Priority Boarding', 'used': false },
    '2': { 'customer_name': 'Bob Johnson', 'expiration': '2024-11-15', 'type': 'Complimentary Premium Drink', 'used': true },
    '3': { 'customer_name': 'Charlie Brown', 'expiration': '2024-10-01', 'type': 'Free Inflight Internet', 'used': false }
};

// Function to retrieve FastPass information by ID
function get_fastpass_info(fastpass_id) {
    return fastpass_data[fastpass_id];
}

// Initialize the QR code scanner
function onScanSuccess(decodedText, decodedResult) {
    const resultDiv = document.getElementById('verification-result');

    const fastpassInfo = get_fastpass_info(decodedText);

    if (fastpassInfo) {
        const currentDate = new Date();
        const expirationDate = new Date(fastpassInfo.expiration);
        const isValid = expirationDate > currentDate && !fastpassInfo.used;

        let resultHTML = `
            <div class="customer-info">
                <p>Customer Name: ${fastpassInfo.customer_name}</p>
                <p>FastPass Type: ${fastpassInfo.type}</p>
                <p>Expiration Date: ${fastpassInfo.expiration}</p>
            </div>`;

        if (isValid) {
            resultHTML += `<p class="valid-fastpass">FastPass ${decodedText} is valid and can be used.</p>`;
            // Mark the FastPass as used
            fastpassInfo.used = true;
        } else if (fastpassInfo.used) {
            resultHTML += `<p class="invalid-fastpass">FastPass ${decodedText} has already been used.</p>`;
        } else {
            resultHTML += `<p class="invalid-fastpass">FastPass ${decodedText} has expired.</p>`;
        }

        resultDiv.innerHTML = resultHTML;
    } else {
        resultDiv.innerHTML = `<p class="invalid-fastpass">FastPass ${decodedText} not found.</p>`;
    }
}

function onScanFailure(error) {
    console.warn(`QR code scan error: ${error}`);
}

// Initialize and configure the HTML5 QR Code scanner
let html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanFailure);