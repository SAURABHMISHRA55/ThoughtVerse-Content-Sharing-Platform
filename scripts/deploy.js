const hre = require("hardhat");

async function main() {
  const ContentPlatform = await hre.ethers.getContractFactory("ContentPlatform");
  const contentPlatform = await ContentPlatform.deploy();

  await contentPlatform.waitForDeployment();

  console.log("ContentPlatform deployed to:", contentPlatform.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    let message = 'An error occurred while creating the profile.';

    if (error.errorName) {
      message = error.errorName;
      if (error.errorArgs && error.errorArgs.length > 0) {
        message += ': ' + error.errorArgs.join(', ');
      }
    } else if (error.reason) {
      message = error.reason;
    } else if (error.data && error.data.message) {
      message = error.data.message;
    } else if (error.message) {
      message = error.message;
    }

    alert(message);
    process.exit(1);
  });
