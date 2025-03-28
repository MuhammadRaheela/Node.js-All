const authModel = require("../Models/authModel");
const userValidate = require("../Validater/authValidate");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const profileModel = require("../Models/profileModel");

require("dotenv").config();
const secrete = process.env.JwtSecret;

exports.signup = async (req, res) => {
  try {
    let validateData = await userValidate.validate(req.body);
    if (validateData.error) {
      console.log(validateData.error.details[0].message);
      return res.status(400).json({
        message: validateData.error.details[0].message,
        status: false,
      });
    }

    let { email, password } = req.body;

    let userCheck = await authModel.findOne({ email: email });
    if (userCheck) {
      return res.status(400).json({
        message: "Email already exists",
        data: userCheck,
        status: false,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const otp = Math.floor(10000 + Math.random() * 90000);

    const user = new authModel({
      ...req.body,
      password: hashedPassword,
      otpCode: otp,
    });

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mzhassan444@gmail.com",
        pass: "zwtlzopfbluijdel",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "mzhassan444@gmail.com",
      to: req.body.email,
      subject: "Verify Your Account",
      html: `<h1>Please verify your account.</h1>
        <p>your otp ${otp}</p>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("Email Error:", err);
      } else {
        console.log("Verification email sent!");
      }
    });

    let token = JWT.sign({ _id: user._id, email: user.email }, secrete, {
      expiresIn: "2d",
    });

    return res.status(200).json({
      message: "User registered successfully!",
      data: user,
      status: true,
      token,
    });
  } catch (e) {
    console.error("Signup Error:", e);
    res.status(400).json({
      error: e.message,
    });
  }
};

exports.verifyotp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        message: "enter your otp code",
      });
    }

    let user = await authModel.findById(req._id);
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    if (user.otpCode != otp) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }

    let userupdate = await authModel.findByIdAndUpdate(req._id, {
      verify: true,
    });

    return res.status(200).json({
      message: "user successfully ok",
      data: userupdate,
    });
  } catch (e) {}
  return res.status(400).json({
    message: "ERROR",
  });
};

exports.completeprofile = async (req, res) => {
  try {
    let user = await authModel.findById(req._id);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "please a select picture",
        status: false,
      });
    }

    const folderName = "AuthPicture";
    const qualitylevel = "auto:low";
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folderName,
        quality: qualitylevel,
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            error: "Failed to upload image to Cloudinary",
          });
        }

        var body = {
          age: req.body.age,
          gender: req.body.gender,
          education: req.body.education,
          image: result.secure_url,
          authId: req._id,
        };

        var profileData = await profileModel(body);
        profileData.save();

        authModel.findOneAndUpdate(
          {
            _id: req._id,
          },
          {
            profileId: profileData._id,
          }
        );

        res.status(200).json({
          message: "Picture or data store",
          data: profileData,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (e) {
    console.error("Error in completeprofile:", e);
    return res.status(500).json({
      message: "Invalid request",
      error: e.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "invalid Data",
      });
    }

    const userCheck = await authModel.findOne({ email:email }).populate("profileId");

    if (!userCheck) {
      return res.status(400).json({
        message: "user not register",
      });
    } else {
      let checkPassword = await bcrypt.compare(password, userCheck.password);
      if (!checkPassword) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }
      if (userCheck.verify === false) {
        return res.status(400).json({ message: "Please verify your account first" });
      }

      let token = JWT.sign({ _id: userCheck._id, }, secrete, {
        expiresIn: "2d",
      });

      return res.status(200).json({
        message: "LOING USER OK....",
        data:userCheck,
        token
      });
    }
  } catch (e) {}
};
