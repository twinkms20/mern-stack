const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/cafe");
const ItemSchema = new mongoose.Schema({ name: String });
const ItemModel = mongoose.model("dishes", ItemSchema);

const main = async () => {
  const data = new ItemModel({ name: "shake", price: 300 });
  const result = await data.save();
  console.log(result);
};

const updateInDb = async () => {
  const data = await ItemModel.updateOne(
    { name: "shake" },
    {
      $set: { name: "cake" },
    }
  );
  console.log(data);
};

const deleteInDb = async () => {
  const data = await ItemModel.deleteOne({ name: "shake" });
  console.log(data);
};

const finfInDb = async () => {
  const data = await ItemModel.find({ name: "cake" });
  console.log(data);
};

finfInDb();
