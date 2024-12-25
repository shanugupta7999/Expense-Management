const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const transectionModel = require("../models/transectionModel");

const router = express.Router();

// Setup multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Function to extract the total amount from the extracted text
const extractAmountFromText = (text) => {
  const totalRegex = /Total[\s\S]*?(\d+(\.\d{2})?)/i; // Regex to find "Total" followed by an amount
  const match = text.match(totalRegex); // Match the regex with the extracted text
  return match ? match[1] : null; // Return the amount or null if not found
};

// Function to extract and normalize the date from the extracted text
const extractDateFromText = (text) => {
  // Updated regex pattern to match common date formats:
  const dateRegex = /(\d{2}[\/.-]\d{2}[\/.-]\d{2,4})|(\d{4}[\/.-]\d{2}[\/.-]\d{2})|([A-Za-z]+\s\d{1,2},\s\d{4})/;
  const match = text.match(dateRegex); // Match the regex with the extracted text
  
  if (!match) return null; // Return null if no date is found
  
  let dateStr = match[0]; // Extracted date string

  // Normalize the date string based on its format
  let formattedDate;
  if (/\d{2}[\/.-]\d{2}[\/.-]\d{2}$/.test(dateStr)) {
    // Case: Two-digit year (e.g., 18.03.15 => 2015-03-18)
    const [day, month, year] = dateStr.split(/[\/.-]/);
    const fullYear = `20${year}`; // Assuming the year is in the 2000s
    formattedDate = new Date(`${fullYear}-${month}-${day}`);
  } else if (/\d{2}[\/.-]\d{2}[\/.-]\d{4}/.test(dateStr)) {
    // Case: Four-digit year (e.g., 18.03.2023)
    const [day, month, year] = dateStr.split(/[\/.-]/);
    formattedDate = new Date(`${year}-${month}-${day}`);
  } else if (/\d{4}[\/.-]\d{2}[\/.-]\d{2}/.test(dateStr)) {
    // Case: YYYY-MM-DD or YYYY.MM.DD
    formattedDate = new Date(dateStr);
  } else {
    return null; // Unhandled format
  }

  return isNaN(formattedDate.getTime()) ? null : formattedDate; // Return the Date object if valid
};



// Endpoint to upload a bill
router.post("/upload", upload.single("bill"), async (req, res) => {
 
    
    // Read the uploaded bill file (image)
    const  path  = req.file.buffer;
    
    Tesseract.recognize(path, "eng", { logger: (m) => console.log(m) })
    .then(({ data: { text } }) => {
      console.log("Extracted Text: ", text); // Log the extracted text for debugging

      const amount = extractAmountFromText(text); // Extract the amount using regex
      const date = extractDateFromText(text); // Extract the date using regex

      if (amount && date) {


        const newTransection = new transectionModel({
          userid: req.body.user,
          amount: amount,
          date: date,
          category: "bills",
          type: "expense",
        });
    
         newTransection.save();
        res.json({ amount, date });
        // // If both amount and date are found, create a new expense
        // const newExpense = new Expense({ amount, date });

        // // Save the new expense to the database
        // newExpense.save()
        //   .then(() => res.json({ amount, date })) // Respond with the extracted total and date
        //   .catch((err) => res.status(500).send("Error saving to database")); // Handle save errors
      } else {
        // If either the amount or date is not found, send a 400 Bad Request response
        res.status(400).send("Total amount or date not found in the bill");
      }
    })
    .catch((err) => {
      // Handle errors during the image processing
      res.status(500).send("Error processing image");
      console.error(err);
    });


    
  
});

module.exports = router;
