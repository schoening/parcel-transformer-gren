const { Transformer } = require("@parcel/plugin");
const ThrowableDiagnostic = require("@parcel/diagnostic");

const compiler = require("../gren-compiler");

module.exports = new Transformer({
  async transform({ asset, logger }) {
    // const code = await asset.getCode();

    const fileName = asset.filePath.split("/").pop();
    const pathName = asset.filePath.replace(fileName, "");

    let updatedCode = "";

    try {
      const result = await compiler.compile(
        pathName,
        fileName,
        `gren_output.js`,
        false
      );
      if (result.type === "WithErrors") {
        asset.type = "js";
        asset.setCode(`console.error('🤖')`);
        // return [asset];

        logger.error(ThrowableDiagnostic.errorToDiagnostic(result.error));
      }
      if (result.type === "Success") {
        updatedCode = result.output;
      }
    } catch (error) {
      logger.error(ThrowableDiagnostic.errorToDiagnostic(error));
    }

    asset.type = "js";
    asset.setCode(updatedCode);

    return [asset];
  },
});
