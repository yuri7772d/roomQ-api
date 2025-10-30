const usecase = require("./src/usecase/queue");

async function main() {
  let date =new Date()
  date.setFullYear(2025,12,6+1)
  const result = await usecase.listingAll(2025,12,2);
  console.log(result);
}

main();
