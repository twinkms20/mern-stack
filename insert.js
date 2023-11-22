const dbConnect = require("./mongodb");

const insertData = async () => {
  const db = await dbConnect();
  const result = await db.insertMany([
    { name: "cup-cake", price: 100 },
    { name: "cake", price: 100 },
  ]);
  if (result.acknowledged) {
    console.log("Data inserted successfully");
  }
};

insertData();
