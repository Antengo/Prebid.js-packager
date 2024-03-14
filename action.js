const { getInput, setOutput, setFailed } = require("@actions/core");
const run = require('./src')

function main() {
  const configPath = getInput("configPath");
  console.log(process.cwd(), [configPath]);
  return run(process.cwd(), [configPath])
}

main()
.then((res) => {
  setOutput("files", res.files || [])
})
.catch((err) => {
  setFailed(err.message);
});
