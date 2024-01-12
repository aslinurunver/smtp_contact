const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// multer konfigürasyonu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/sendContact", upload.single("file"), async (req, res) => {
  try {
    const formData = req.body;

    sendEmail(formData)
      .then(() => {
        console.log("E-posta gönderildi.");
        res.json({ message: "Başvuru alındı ve e-posta gönderildi." });
      })
      .catch((error) => {
        console.error("E-posta gönderme hatası:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (e) {
    console.log(e);
    res.status(500).send("Dosya yükleme hatası");
  }
});

app.listen(5000, () => {
  console.log("App is listening on port 5000");
});

async function sendEmail(formData) {
  console.log("Email gönderiliyor");
  // console.log(formData);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yilmaz.u.237@gmail.com",
      pass: "yvoc nvjw pwlz iter",
    },
  });

  let htmlContent = `
        <p><strong>İsim:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Konu:</strong> ${formData.subject}</p>
        <p><strong>Mesaj:</strong> ${formData.message}</p>
    `;

  transporter
    .sendMail({
      from: "yilmaz.u.237@gmail.com",
      to: "aslounvr@gmail.com",
      subject: "Itech robotik iş başvurusu ✔",
      html: htmlContent,
    })
    .then((info) => {
      console.log("E-posta gönderildi:", info);
    })
    .catch((error) => {
      console.error("E-posta gönderme hatası:", error);
      throw error;
    });
}