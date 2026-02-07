const express = require("express")

const cors = require("cors")

const nodemailer = require("nodemailer");

const mongoose = require("mongoose")

const app = express()

app.use(cors())

app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function () {
  console.log("Connected to db...")
}).catch(function () { console.log("Failed to connect") })

const credential = mongoose.model("credential", {}, "bulkmail")





app.post("/sendemail", function (req, res) {

  var msg = req.body.msg
  var emailList = req.body.emailList

  credential.find().then(function (data) {

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass
      },
    });

    new Promise(async function (resolve, reject) {

      try {

        for (var i = 0; i < emailList.length; i++) {

          await transporter.sendMail(
            {
              from: "gkkani2001@gmail.com",
              to: emailList[i],
              subject: "A message from Bulk Mail",
              text: msg
            }
          )

          console.log("Email sent to:" + emailList[i])

        }

        resolve("Success")

      }

      catch (error) {
        reject("Failed")
      }


    }).
      then(function () {
        res.send(true)
      }).
      catch(function () {
        res.send(false)
      })

    console.log(data[0].toJSON())
  }).catch(function (error) {
    console.log(error)
  })



})




app.listen(5000, function () {
  console.log("Server Started.....")
})