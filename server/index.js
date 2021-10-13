const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserModel = require("./models/Users");

const app = express();

app.use(cors());
app.use(express.json()); // accept JSON object received from front-end

// Database Connection
mongoose.connect(
  `mongodb+srv://FirstDatabase:${password}@cluster0.tnkve.mongodb.net/test`,
  { useNewUrlParser: true }
);

app.post("/insert", async (req, res, next) => {
  const { name, age } = req.body;
  const user = new UserModel({
    name,
    age,
  });
  await user.save();
  res.send(user);
});

app.get("/read", async (req, res, next) => {
  // to read all data from database, leave the first parameter to an empty {}
  UserModel.find({}, (err, result) => {
    if (err) console.error(err);
    res.send(result);
  });
});

app.put("/update", async (req, res, next) => {
  const { newAge, id } = req.body;

  try {
    await UserModel.findById(id, (err, user) => {
      user.age = Number(newAge);
      user.save();
    });
  } catch (err) {
    console.error(err);
  }

  res.send("updated!");
});

// when deleting data, we cannot pass body to backend, but parameters through url
app.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  await UserModel.findByIdAndRemove(id).exec();
  res.send("user deleted");
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
