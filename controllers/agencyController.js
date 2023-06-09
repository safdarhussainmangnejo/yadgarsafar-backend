const UserModel = require("../models/companySchema");
const AgencyModel = require("../models/agencyRegisterSchema");

//get all users
exports.readAll = async (req, res) => {
  try {
    const result = await UserModel.find({});
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

//insert data
exports.insertPackage = async (req, res) => {
  const tripPlan = JSON.parse(req.body.tripPlan);
  const agencyId = req.body.agencyId;
  console.log("AgencyID: ", agencyId);
  const packages = [];

  packages.push({
    packageName: req.body.packageName,
    packageCity: req.body.packageCity,
    packageDescription: req.body.packageDescription,
    packageDuration: req.body.packageDuration,
    packageStartFrom: req.body.packageStartFrom,
    packageEndAt: req.body.packageEndAt,
    included1: req.body.included1,
    included2: req.body.included2,
    notIncluded1: req.body.notIncluded1,
    notIncluded2: req.body.notIncluded2,
    price: req.body.price,
    tourCategory: req.body.tourCategory,
    ageRange: req.body.ageRange,
    image: req.body.image,
    packageProvince: req.body.packageProvince,
    tourType: req.body.tourType,
    question1: req.body.question1,
    question2: req.body.question2,
    question3: req.body.question3,
    answer1: req.body.answer1,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    tripPlan: tripPlan,
  });

  try {
    const record = await UserModel.findOneAndUpdate(
      { _id: agencyId },
      {
        $push: { packages: packages },
      },
      { new: true }
    );
    res.status(200).json(record);
    console.log("res.json(record);: ", record)
  
  } catch (err) {
    console.log("Error Maes: ", err)
    res.status(500).json({ err: "please try again later" });
  }

  // .then(res => {
  //     res.json();
  //     console.log("New Package Added: ", res.json());
  //   })
  // .catch((err) => console.log("Receieved Errorin Adding Package: ", err));
  // console.log("Finally New Package Added: ", record);
};

// update agency data
exports.updateAgencyInfo = async (req, response) => {
  const agencyId = req.body.agencyId;
  console.log("AgencyID: ", agencyId);
  console.log("Image URL: ", req.body?.companyImage);
  console.log("body Data: ", req.body);

  try{
    const record = await UserModel.findOneAndUpdate(
      { _id: agencyId },
      {
        $set: 
        {
          "companyImage": req.body.companyImage,
          "companyNumber": req.body.companyNumber,
          "companyProvince": req.body.companyProvince,
          "companyOwner": req.body.companyOwner,
          "companyCity": req.body.companyCity,
          "companyDescription": req.body.companyDescription
        }
      },
      { new: true }
    )

    response.json(record);
    console.log("Data updated sucesfully")
  }catch(error){
    console.log("Error in data updtion, try again")
  }
 
  //   .then((res) => {
  //     response.json(res);
  //     console.log("Agency data updated successfully: ", res);
  //   })
  //   .catch((err) =>
  //     console.log("Receieved Errorin Updating Agency Data: ", err)
  //   );
  // console.log("This is the Response after query: " + record);
};

// update agency's package data
exports.updatePackage = async (req, response) => {
  const agencyId = req.body.agencyId;
  const packageId = req.body.packageId;
  console.log("AgencyID: ", agencyId, "PackageID: ", packageId);
  console.log("body Data: ", req.body);

  const record = await UserModel.findOneAndUpdate(
    { _id: agencyId, "packages._id": packageId },
    {
      $set: {
        "packages.$.packageName": req.body.packageName,
        "packages.$.packageCity": req.body.packageCity,
        "packages.$.packageDescription": req.body.packageDescription,
        "packages.$.packageDuration": req.body.packageDuration,
        "packages.$.packageStartFrom": req.body.packageStartFrom,
        "packages.$.packageEndAt": req.body.packageEndAt,
        "packages.$.image": req.body.image,
        "packages.$.included1": req.body.included1,
        "packages.$.included2": req.body.included2,
        "packages.$.tourCategory": req.body.tourCategory,
        "packages.$.notIncluded1": req.body.notIncluded1,
        "packages.$.notIncluded2": req.body.notIncluded2,
        "packages.$.price": req.body.price,
        "packages.$.ageRange": req.body.ageRange,
        "packages.$.tourType": req.body.tourType,
        "packages.$.packageProvince": req.body.packageProvince,
      },
    }
  )
    .then((res) => {
      response.json(res);
      console.log("Package data updated successfully");
    })
    .catch((err) =>
      console.log("Receieved Errorin Updating Package Data: ", err)
    );
};

exports.searchAgencybyId = async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const agency = await UserModel.findById(packageId);
    // console.log("Agency: ", agency);
    res.json(agency);
  } catch (err) {
    console.log(err, "agencyController.searchAgencybyId error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

// search by email

exports.searchAgencybyEmail = async (req, res) => {
  try {
    const email = req.params.userLocalEmail;
    const agency = await UserModel.findOne({ email });
    
    res.json(agency);
    console.log("Agency Found: ");
  } catch (err) {
    console.log(err, "agencyController.searchAgencybyId error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};


// return actual price of package of specific agency

exports.findPackagePrice = async (req, res) => {
  try {
    // const email = req.params.userLocalEmail;
    const id = req.params.id;
    let price=0;
    const agency = await UserModel.findOne({'packages._id': id}, {
      'packages.$': 1
    });
    agency.packages.forEach(user=>{
        price = user.price;
    })
    
    res.json({price:price});
  } catch (err) {
    console.log(err, "agencyController.searchAgencybyId error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.agencyRegister = async (req, res) => {
  const companyName = req.body.companyname;
  const email = req.body.email;
  console.log("Received Body: ", req.body);
  const newUser = new AgencyModel(req.body);
  const newAgency = new UserModel({ email, companyName });
  try {
    const AddedData = await newUser.save();
    const AgencyAdded = newAgency.save();
    res.status(200).send("Data Inseted");
    console.log("Signup data inserted", AddedData);
    console.log("Agency Crreated", AgencyAdded);
  } catch (error) {
    console.log("Error Message " + error.message);
    res.status(500).json(error);
  }
};

// signin agency
exports.agencyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(405).json({ error: "Email or Password missing..." });
    }

    const userLogin = await AgencyModel.findOne({ email: email });

    if (userLogin) {
      console.log("Backend");

      // email = email;

      // const isMatch = await bcrypt.compare(password, userLogin.password);

      // if (!isMatch) {
      // res.status(400).json({ error: "invalid credentials!" })
      // } else {

      // const token = await userLogin.generateAuthToken();

      res.send({
        status: 200,
        // token: token
      });
      // }
    } else {
      res.status(404).json({ error: "invalid credentials!" });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.directLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Body Data : ", req.body);

    const userLogin = await AgencyModel.findOne({
      email: email,
      password: password,
    });
    console.log("Loggedin User : ", userLogin);
    if (userLogin) {
      res.send(userLogin);
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
  }
};

//delete product by ID
exports.deletePackage = async (req, res) => {
  // try {
  const agencyId = req.params.agencyId;
  const packageId = req.params.packageId;
  console.log("AgencyID: ", agencyId, " Package ID: ", packageId);

  await UserModel.findOneAndUpdate(
    { _id: agencyId },
    {
      $pull: { packages: { _id: packageId } },
    }
  )
    .then((response) => {
      res.json(response);
      console.log("Deleted Package Successfully ");
    })
    .catch((err) => console.log("Receieved Errorin Deleting Package: ", err));
};

//create agency
exports.createAgency = async (req, res) => {
  const companyName = req.body.companyname;
  const email = req.body.email;
  console.log("Received Body, companyName: ", companyName, " email: ", email);
  const newUser = new UserModel({ companyName, email });
  try {
    const AddedData = await newUser.save();
    res.status(200).json(AddedData);
    console.log("New Agency Created: ", AddedData);
  } catch (error) {
    console.log("Error Message " + error.message);
    res.status(500).json(error);
  }
};

exports.getTotalNumberOfPackages = async (req, res) => {
  try {
    const result = await UserModel.find({});
    let totalNumberOfPackages = 0;
    result.forEach((user) => {
      user.packages.forEach((order) => {
        totalNumberOfPackages = totalNumberOfPackages + 1;
      });
    });
    res.json({
      totalNumberOfPackages: totalNumberOfPackages,
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// count total number of travel agencies in the document
exports.getTotalNumberOfAgencies = async (req, res) => {
  try {
    const result = await UserModel.estimatedDocumentCount();
    res.json({
      totalNumberOfAgencies: result,
    });
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};

// count total number of travel packages by agency
exports.getTotalNumberOfAgencyPackages = async (req, res) => {
  console.log("req.params.userLocalEmail: ", req.params.userLocalEmail);
  const email = req.params.userLocalEmail;
  try {
    const result = await UserModel.find({ email });
    let totalNumberOfPackages = 0;
    result.forEach((user) => {
      user.packages.forEach((order) => {
        totalNumberOfPackages = totalNumberOfPackages + 1;
      });
    });
    res.json({
      totalNumberOfPackages: totalNumberOfPackages,
    });
    console.log("totalNumberOfPackages: ", totalNumberOfPackages);
  } catch (err) {
    res.status(500).json({ err: "please try again later" });
  }
};