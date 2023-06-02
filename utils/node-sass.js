const sass = require("node-sass");
const fs = require("fs");
const path = require("path");

function compileSass(sassFile) {
  const cssFile = path.join(
    "./assets/css",
    path.basename(sassFile, ".scss") + ".css"
  );
  sass.render(
    {
      file: sassFile,
      outputStyle: "compressed", // Output style of the compiled CSS
    },
    (error, result) => {
      if (error) {
        console.error(`Error compiling Sass file ${sassFile}:`, error);
      } else {
        fs.writeFile(cssFile, result.css, (writeError) => {
          if (writeError) {
            console.error(`Error writing CSS file ${cssFile}:`, writeError);
          } else {
            console.log(`Sass file ${sassFile} compiled successfully`);
          }
        });
      }
    }
  );
}

const sassFolder = "./assets/scss";

// Function to compile all Sass files in the folder
function compileAllSassFiles() {
  fs.readdir(sassFolder, (readError, files) => {
    if (readError) {
      console.error("Error reading Sass folder:", readError);
    } else {
      files.forEach((file) => {
        if (path.extname(file) === ".scss") {
          const sassFile = path.join(sassFolder, file);
          compileSass(sassFile);
        }
      });
    }
  });
}

module.exports.compileAllSassFiles = compileAllSassFiles;
module.exports.compileSass = compileSass;
