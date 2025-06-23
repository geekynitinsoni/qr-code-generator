const express = require('express');
const qrCode = require('qrcode');
const app = express();
const port = 5000;

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/',(req,res)=>{
    res.render('index1',{QR_code:''});
})

app.post('/', (req, res) => {
    // Step 1: Get the URL submitted from the form
    const url = req.body.url;

    // Step 2: If URL is missing, send error response
    if (!url) return res.status(400).send("URL Not Set!");

    // Step 3: Create a unique file path to save the QR image
    const filePath = `store/${Date.now()}.png`;

    // Step 4: Save the QR code as a PNG file to disk
    qrCode.toFile(filePath, url, {
        color: {
            dark: '#000',   // Black color for QR dots
            light: '#0000'  // Transparent background
        }
    }, err => {
        if (err) {
            // If file saving fails, send error response
            return res.status(500).send("Failed to save QR file");
        }

        // Step 5: Also generate base64 string of the QR to show on webpage
        qrCode.toDataURL(url, (err, src) => {
            if (err) {
                // If DataURL generation fails, send error
                return res.status(500).send("Failed to generate QR image");
            }

            // Step 6: Render the EJS view with QR code and file path for download
            res.render('index1', { QR_code: src, img_src: filePath });
        });
    });
});


// Handle download request: if file path is present, download it; otherwise send error
app.get('/download', (req, res) => 
    req.query.file_path
        ? res.download(req.query.file_path)
        : res.status(400).send("File path is missing!")
);

app.listen(port,()=>console.log('Server running on http://localhost:5000'));