const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Sert tous les fichiers à la racine ou dans un dossier public
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
