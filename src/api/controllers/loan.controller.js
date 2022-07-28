const httpStatus = require("http-status");
const { omit } = require("lodash");
const { DateTime } = require("luxon");
const Loan = require("../models/loan.model");
const User = require("../models/user.model");
const LoanCategory = require('../models/loanCategory.model');
const APIError = require("../errors/api-error");
const uploadFile = require("../middlewares/upload");
var fs = require("fs");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Get User Loan list
 * @public
 */
exports.getUserLoans = async (req, res, next) => {
  try {
    req.query.user = req.user;
    let userLoans = await Loan.list(req.query);
    const transformedLoans = userLoans.map((loan) =>
      loan.transformLoanApplication()
    );
    return res.json(transformedLoans);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get loans list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    req.query.status = "NOT SUBMITTED";
    const loans = await Loan.list(req.query);
    const transformedLoans = loans.map((loan) => loan.transform());
    res.json(transformedLoans);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new loan
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { data, dealerCode, type } = req.body;
    req.body = data;
    req.body.dealerCode = dealerCode;
    req.body.type = type;
    req.body.user = req.user._id;
    const params = omit(req.body, "data");
    var newLoan = new Loan(params);
    if (newLoan._id) newLoan.applicationNo = newLoan._id;
    const loanCategories = await LoanCategory.list(req.query);
    const transformedLoanCategory = loanCategories.map((loanCategory) => loanCategory.transform());
    transformedLoanCategory.forEach(function (element) {
      if (element.type === newLoan.type) {
        if (element.interestRate !== undefined) {
          newLoan.interestRate = element.interestRate;
        }
      }
    });
    newLoan = await newLoan.save();

    res.status(httpStatus.CREATED);
    res.json(newLoan.transformLoanApplication());
  } catch (error) {
    return next(error);
  }
};

/**
 * Update loan for mobile user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    // const {step, data} = req.body;
    var loan = await Loan.get(req.params.id);
    // loan.data[`step${step}`] = data;
    // await Loan.updateLoan(loan);
    const { data, dealerCode, type } = req.body;
    req.body = data;
    req.body.dealerCode = dealerCode;
    req.body.type = type;
    const params = omit(req.body, "data");
    loan = Object.assign(loan, params);
    loan
      .save()
      .then((savedLoan) => res.json(savedLoan.transformLoanApplication()))
      .catch((e) => next(e));
  } catch (error) {
    return next(error);
  }
};

/**
 * Calculate Monthly Repayment
 * @public
 */
exports.calculateMonthlyRepayment = async (req, res, next) => {
  try {
    let monthlyRepayment = await Loan.calculate(req.body);
    console.log(monthlyRepayment);
    let data = {};
    data.monthlyRepayment = monthlyRepayment;
    // const transformedLoan = loanData.transform();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update loan for admin
 * @public
 */
exports.updateLoan = async (req, res, next) => {
  try {
    var loan = await Loan.get(req.params.id);
    loan = Object.assign(loan, req.body);
    loan
      .save()
      .then((savedLoan) => res.json(savedLoan.transform()))
      .catch((e) => next(e));
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Loan
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let loanData = await Loan.get(req.params.id);
    let monthlyRepayment = await Loan.calculate(loanData);
    const transformedLoan = loanData.transform();
    transformedLoan.monthlyRepayment = monthlyRepayment;
    return res.json(transformedLoan);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Dashboard Loan Data
 * @public
 */
exports.getDashboardLoanData = async (req, res, next) => {
  try {
    req.query.startDate = req.body.startDate;
    req.query.endDate = req.body.endDate;
    let dashboardLoanData = await Loan.dashboardLoanList(req.query);
    const transformedLoans = dashboardLoanData.map((loan) => loan.transform());
    // var loanDate = [];
    // var newLoanApplication = {};
    // var newLoanAmount = {};
    // transformedLoans.forEach(function (element) {
    //   let createdDate = '';
    //   let isoDate = '';
    //   if (element.status !== "REJECTED"){
    //     isoDate = element.createdAt.toISOString();
    //     createdDate = DateTime.fromISO(isoDate, {setZone: true}).toFormat("dd/MM/yyyy");
    //     if (createdDate in newLoanApplication){
    //       newLoanApplication[createdDate] = newLoanApplication[createdDate] + 1;
    //     } else {
    //       var count = 1;
    //       newLoanApplication[createdDate] = count;
    //     }
    //     if (element.amount !== undefined){
    //       if (createdDate in newLoanAmount){
    //         newLoanAmount[createdDate] = newLoanAmount[createdDate] + element.amount;
    //       } else {
    //         var amount = 0;
    //         newLoanAmount[createdDate] = element.amount;
    //       }
    //     }
    //   }
    //   console.log(newLoanAmount);
    // });
    var dashboardData = {};
    var loan = {};
    var disbursedLoan = {};
    var newLoanApplication = {};
    var newLoanAmount = {};
    loan.pipelineAmount = 0;
    loan.processingAmount = 0;
    loan.disbursedAmount = 0;
    disbursedLoan.refinancing = 0;
    disbursedLoan.coeRenewalLoan = 0;
    disbursedLoan.usedCarLoan = 0;
    disbursedLoan.newCarLoan = 0;
    transformedLoans.forEach(function (element) {
      let createdDate = "";
      let isoDate = "";
      if (element.status !== "REJECTED") {
        if (element.amount !== undefined) {
          loan.pipelineAmount = loan.pipelineAmount + element.amount;
        }
        isoDate = element.createdAt.toISOString();
        createdDate = DateTime.fromISO(isoDate, { setZone: true }).toFormat(
          "dd/MM/yyyy"
        );
        if (createdDate in newLoanApplication) {
          newLoanApplication[createdDate] = newLoanApplication[createdDate] + 1;
        } else {
          var count = 1;
          newLoanApplication[createdDate] = count;
        }
        if (element.amount !== undefined) {
          if (createdDate in newLoanAmount) {
            newLoanAmount[createdDate] =
              newLoanAmount[createdDate] + element.amount;
          } else {
            var amount = 0;
            newLoanAmount[createdDate] = element.amount;
          }
        }
      }
      if (
        element.status === "PROCESSING" ||
        element.status === "PENDING" ||
        element.status === "APPROVED"
      ) {
        if (element.amount !== undefined) {
          loan.processingAmount = loan.processingAmount + element.amount;
        }
      }
      if (element.status === "COMPLETED") {
        if (element.amount !== undefined) {
          loan.disbursedAmount = loan.disbursedAmount + element.amount;
        }
        if (element.type === "Refinancing" && element.amount !== undefined) {
          disbursedLoan.refinancing =
            disbursedLoan.refinancing + element.amount;
        }
        if (
          element.type === "COE Renewal Loan" &&
          element.amount !== undefined
        ) {
          disbursedLoan.coeRenewalLoan =
            disbursedLoan.coeRenewalLoan + element.amount;
        }
        if (
          element.type === "Used Car Loan" &&
          element.amount !== undefined
        ) {
          disbursedLoan.usedCarLoan =
            disbursedLoan.usedCarLoan + element.amount;
        }
        if (element.type === "New Car Loan" && element.amount !== undefined) {
          disbursedLoan.newCarLoan =
            disbursedLoan.newCarLoan + element.amount;
        }
      }
      dashboardData.loan = loan;
      dashboardData.disbursedLoan = disbursedLoan;
      dashboardData.newLoanApplication = newLoanApplication;
      dashboardData.newLoanAmount = newLoanAmount;
    });

    return res.json(dashboardData);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Customer Loan list
 * @public
 */
exports.getCustomerLoans = async (req, res, next) => {
  try {
    req.query.user = req.params.id;
    let customerLoans = await Loan.list(req.query);
    const transformedLoans = customerLoans.map((loan) => loan.transform());
    return res.json(transformedLoans);
  } catch (error) {
    return next(error);
  }
};

/**
 * Upload File
 * @public
 */
exports.upload = async (req, res, next) => {
  try {
    const id = req.params.id;
    const loan = await Loan.findById({ _id: id }).exec();

    if (loan) {
      await uploadFile(req, res);
      if (req.file == undefined) {
        res.status(httpStatus.BAD_REQUEST);
        res.json({ message: "Please upload a file!" });
      }

      const { name, type } = req.body;
      const url = `${req.protocol}://${req.headers.host}/v1/loans/files/${id}/${req.file.filename}`;
      loan["document"].push({
        name: name,
        type: type,
        url: url,
      });

      const savedLoan = await Loan.updateLoan(loan);
      return res.json(loan.transform());
    }

    res.status(httpStatus.BAD_REQUEST);
    res.json({ message: "Loan id does not exist" });
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.json({ message: "File size cannot be larger than 2MB!" });
    }
    return next(error);
  }
};

/**
 * Download File
 * @public
 */
exports.download = (req, res) => {
  const { id, fileName } = req.params;
  const user = req.user;
  const dir = __basedir + `/resources/static/assets/uploads/${user._id}/${id}/`;
  res.download(dir + fileName, fileName, (error) => {
    if (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      res.json({ message: "Could not download the file. " + error });
    }
  });
};
/**
 * Delete Loan
 * @public
 */
exports.remove = async (req, res, next) => {
  const id = req.params.id;
  var loan = await Loan.get(id);
  loan
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};