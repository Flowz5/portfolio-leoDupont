const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Sert tous les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Route principale vers index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
