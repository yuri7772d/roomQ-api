const usecase = require("./src/usecase/queue");

async function main() {
  const result = await usecase.listingAll( 2025,10,1);
  console.log(result);
}

main();
