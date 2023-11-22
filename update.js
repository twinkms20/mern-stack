const dbConnect = require("./mongodb");

const update = async () => {
  const db = await dbConnect();
  const result = await db.updateMany(
    { name: "cake" },
    { $set: { price: 150 } }
  );
  console.log(result);
};

update();
