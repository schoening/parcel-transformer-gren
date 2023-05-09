"use strict";

const fs = require("fs");
const { exec, spawn } = require("child_process");

// Compile the gren project with the given folder name
// Using Main.gren as the entry point
const compile = (pathToFile, fileName, outputFile, isDebugMode) => {
  console.log(pathToFile, fileName, outputFile, isDebugMode);
  return new Promise((resolve, reject) => {
    console.log("compiling");
    exec(
      `cd ${pathToFile} && gren make ./${fileName} --output=${pathToFile}/${outputFile} ${
        isDebugMode ? "--debug" : ""
      }`,
      async function (err, stout, stderr) {
        if (err) {
          return resolve({ type: "WithErrors", error: stderr });
        }
        if (stout) {
          // if (E.isRight(grenFilesEither)) {
          //   const output = (grenFilesEither.right as any)[0].content;

          console.log("stout:", stout);

          const output = fs.readFileSync(`${pathToFile}/${outputFile}`, {
            encoding: "utf-8",
          });

          fs.unlinkSync(`${pathToFile}/${outputFile}`);

          return resolve({ type: "Success", output: output });
          // } else {
          // return reject(grenFilesEither.left);
          // }
        }
        if (stderr) {
          return reject(stderr);
        }
      }
    );
  });
};

module.exports = {
  compile,
};
