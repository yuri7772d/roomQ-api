const usecase = require("./src/usecase/queue");

async function main() {
  let date =new Date()
  date.setFullYear(2025,12-1,7+1)
  date.setHours(0,0,0,0)
  //const result = await usecase.booking("fffff",1,1,date);
  const result = await usecase.approve(7,date,1);
  console.log(result);
}

main();
