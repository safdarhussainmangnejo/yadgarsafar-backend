const signupSchema = require('../models/signupSchema');
const UserModel = require("../models/companySchema");
const cookie = require("cookie");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

//get all tourists
exports.getTourists = async (req, res) => {
  try {
    const result = await signupSchema.find({});
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

exports.getTotalNumberOfPaidOrders = async (req, res) => {
  try {
    const result = await signupSchema.find({});
    let totalNumberOfPaidOrders=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.paymentStatus=="Paid"){
          totalNumberOfPaidOrders=totalNumberOfPaidOrders+1;
        }
      })
    })
    res.json({
      totalNumberOfPaidOrders:totalNumberOfPaidOrders
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

exports.getTotalNumberOfOrdersPending = async (req, res) => {
  const email = req.params.userLocalEmail;
  try {
    const result = await signupSchema.find({email});
    let ordersPending=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.paymentStatus=="Pending" || order.paymentStatus=="Unpaid"){
          ordersPending=ordersPending+1;
        }
      })
    })
    res.json({
      ordersPending:ordersPending
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// find total number of paid/completed packages of agency
exports.getTotalNumberOfAgencyPaidOrders = async (req, res) => {
  const companyEmail = req.params.userLocalEmail;
  try {
    const result = await signupSchema.find({'bookedPackages.companyEmail':companyEmail});
    let totalNumberOfPaidOrders=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.companyEmail === companyEmail && order.paymentStatus=="Paid"){
          totalNumberOfPaidOrders=totalNumberOfPaidOrders+1;
        }
      })
    })
    res.json({
      totalNumberOfPaidOrders:totalNumberOfPaidOrders
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// search tourist by email
exports.searchTouristbyEmail = async (req, res) => {
  try {
    const email = req.params.userLocalEmail;
    const agency = await signupSchema.findOne({ email });
    res.json(agency);
  } catch (err) {
    console.log(err, "agencyController.searchAgencybyId error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};


// get number of active clients

exports.getTotalNumberOfActiveClients = async (req, res) => {
  const companyEmail = req.params.userLocalEmail;
  try {
    
    const response = await signupSchema.distinct('email', { 'bookedPackages.companyEmail':companyEmail });
    
    console.log("totalNumberOfActiveClients: ", response, "and length ",response.length)
    res.json({
      totalNumberOfActiveClients:response.length
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

//
exports.getActiveClients = async (req, res) => {
  const companyEmail = req.params.userLocalEmail;
  try {
    
      		const products = await signupSchema.find({})
      			.populate('bookedPackages.companyEmail')
      			.limit(6);
      
      		res.json({ products });
      	} catch (err) {
      		console.log(err, 'productController.readAll error');
      		res.status(500).json({
      			errorMessage: 'Please try again later',
      		});
        }
  //   const result = await signupSchema.find( {'bookedPackages.companyEmail': companyEmail});
  //   console.log("Result of Active USers: ", result, " & Length is ",result.length);
  //   let clients;
  //   result.forEach((user)=>{
  //      const clients = await result.distinct( "email" );
  //      console.log("clients: ", clients)
  //     user.bookedPackages.forEach((order)=>{
  //       order.distinct( "companyEmail" )
  //     })
  //   })
  //   res.json({
  //     clients:result,
  //     number: result.length
      
  //   });
  //   console.log("clients of ", companyEmail, " ", clients, "legnth ", clients.length);
  // } catch (err) {
  //   res.status(500).json({ err: "please try again later" });
  // }
};


// get total revenue of agency

exports.getAgencyRevenue = async (req, res) => {
  const email = req.params.userLocalEmail;
  try {
    const result = await signupSchema.find();
    let totalRevenue=0;
    result.forEach((user)=>{
      user.bookedPackages.forEach((order)=>{
        if(order.companyEmail===email && order.paymentStatus=="Paid"){
          totalRevenue=totalRevenue+order.amountPaid;
        }
      })
    })
    res.json({
      totalRevenue:totalRevenue
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

exports.insertUser = async (req, res) => {
  const { name, owner, city, earned } = req.body;

  const user = new UserModel({
    name: name,
    owner: owner,
    city: city,
    earned: earned,
  });
  try {
    await user.save();
    res.send("Data Inseted");
  } catch (err) {
    res.send(err.message);
  }
};

// signup user
exports.insertData = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(401).json({ error: "kindly fill all fields!" });
  } else {
    await signupSchema.findOne({ email: email }).then((userExist) => {
      if (userExist) {
        res.status(401).json({ message: "user already registered" });
      } else {
        const user = new signupSchema({ firstname, lastname, email, password });

        user
          .save()
          .then(() => {
            res.status(200).json({ message: "user registered successfully" });
          })
          .catch(() => {
            res.status(401).json({ error: "Failed to register!" });
          });
      }
    });
  }
};

// add/book Package
exports.addpackage=  async (req, res) => {
  const {
    id,
    companyName,
    companyEmail,
    packageName,
    packageCity,
    packageDuration,
    image,
    packageProvince,
    price,
    tourCategory,
    paymentStatus,
    amountPaid,
    numberofPeople,
  } = req.body;

  let bookedPackages = [];

  bookedPackages.push({
    companyName,
    companyEmail,
    packageName,
    packageCity,
    packageDuration,
    packageProvince,
    image,
    price,
    tourCategory,
    paymentStatus,
    amountPaid,
    numberofPeople,
  });

  await signupSchema
    .findOneAndUpdate(
      { _id: id },
      {
        $push: { bookedPackages: bookedPackages },
      }
    )
    .then((res2) => {
      res.json({ success: "package booked successfully" });
    })
    .catch((err) => console.log("Receieved Errorin Adding Package: ", err));
};

let email1 = null;

exports.getData = async (req, res) => {
  const userData = await signupSchema.findOne({ email: email1 });
  // const userData = await signupSchema.find();
  if (email1 != null) {
    res.json(userData);
    // console.log("userData FROM GETDATA: " + userData);
  }
  // res.send(userData);
  else {
    res.send("userData can't found");
  }
};

// signin user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(405).json({ error: "Email or Password missing..." });
    }

    const userLogin = await signupSchema.findOne({ email: email });

    if (userLogin) {
      email1 = email;

      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials!" });
      } else {
        const token = await userLogin.generateAuthToken();

        res.send({
          status: 200,
          token: token,
        });
      }
    } else {
      res.status(404).json({ error: "invalid credentials!" });
    }
  } catch (err) {
    console.log(err);
  }
};

// edit profile api
exports.updateId = async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, city, image, country, interests } = req.body;

  await signupSchema.findByIdAndUpdate(id, {
    $set: {
      firstname: firstName,
      lastname: lastName,
      city: city,
      country: country,
      interests: interests,
      image: image,
    },
  });
  res.status(200).send({ msg: "Update Done" });
};
 // strip payment
exports.payment =async (req, res) => {
  let { amount, id } = req.body;
  console.log("amount: ", amount, "ID: ", id);
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Yadgar Safar company",
      payment_method: id,
      confirm: true,
    });
    console.log("Payment Done", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
};
