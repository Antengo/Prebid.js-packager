const { getInput, setOutput, setFailed } = require("@actions/core");

function main() {
  const configPath = getInput("configPath");

  console.log({ configPath });

  setOutput("files", files);
}

main().catch((err) => {
  setFailed(err.message);
});
