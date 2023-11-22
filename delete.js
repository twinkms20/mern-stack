const dbConnect = require("./mongodb");

const deleteData = async () => {
  const db = await dbConnect();
  const result = await db.deleteMany({ name: "cup-cake" });
  if (result.acknowledged) {
    console.log("Record deleted");
  }
};

deleteData();
