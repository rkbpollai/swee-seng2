const mongoose = require("mongoose");
const { omitBy, isNil } = require("lodash");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/**
 * User Roles
 */
const roles = ["user", "admin"];

/**
 * Loan Status
 */
const status = [
  "NOT SUBMITTED",
  "PENDING",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED"
];

/**
 * Loan Schema
 * @private
 */
const loanSchema = new mongoose.Schema(
  {
    dealerCode: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, trim: true },
    status: { type: String, enum: status, default: "NOT SUBMITTED" },
    approvedDate: { type: Date, trim: true },
    applicationNo: { type: mongoose.Schema.Types.ObjectId, trim: true },
    interestRate: { type: Number, trim: true },
    approvedAmount: { type: Number, trim: true },
    amount: { type: Number, trim: true },
    duration: { type: Number, trim: true },
    vehicleExpiryDate: { type: Date, trim: true },
    salutation: { type: String, trim: true },
    fullName: { type: String, maxlength: 128, index: true, trim: true },
    nationality: { type: String, maxlength: 128, trim: true },
    passport: { type: String, maxlength: 128, trim: true },
    phone: { type: String, maxlength: 128, trim: true },
    email: { type: String, maxlength: 128, lowercase: true, trim: true },
    dateOfBirth: { type: Date, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, maxlength: 128, trim: true },
    address: { type: String, trim: true },
    buildingNo: { type: String, trim: true },
    unitNo: { type: String, trim: true },
    name: { type: String, maxlength: 128, index: true, trim: true },
    employmentAddress: { type: String, trim: true },
    occupation: { type: String, trim: true },
    durationOfService: { type: Number, trim: true },
    monthlyGrossIncome: { type: Number, trim: true },
    proofOfIncome: { type: String, trim: true },
    carNumber: { type: String, trim: true },
    purchaseOfVehicle: { type: Boolean, trim: true },
    selfEmployed: { type: String, trim: true },
    employmentStatus: { type: String, trim: true },
    carType: { type: String, trim: true },
    advanceInstal: { type: Number, trim: true },
    finalInstal: { type: Number, trim: true },
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    chassisNo: { type: String, trim: true },
    engineNo: { type: String, trim: true },
    carPrice: { type: Number, trim: true },
    handledBy: { type: String, trim: true },
    serialNumber: { type: Number, trim: true },
    document: [
      {
        name: { type: String, trim: true },
        type: { type: String, unique: true, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

loanSchema.plugin(AutoIncrement, {
  id: "serialNumber_seqLoan",
  inc_field: "serialNumber",
  start_seq: 1001,
});
/**
 * Methods
 */
loanSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "dealerCode",
      "type",
      "status",
      "user",
      "approvedDate",
      "applicationNo",
      "interestRate",
      "approvedAmount",
      "amount",
      "fullName",
      "duration",
      "createdAt",
      "vehicleExpiryDate",
      "nationality",
      "passport",
      "phone",
      "email",
      "dateOfBirth",
      "postalCode",
      "address",
      "buildingNo",
      "unitNo",
      "name",
      "occupation",
      "durationOfService",
      "monthlyGrossIncome",
      "proofOfIncome",
      "carNumber",
      "employmentAddress",
      "selfEmployed",
      "employmentStatus",
      "carType",
      "purchaseOfVehicle",
      "advanceInstal",
      "finalInstal",
      "make",
      "model",
      "chassisNo",
      "engineNo",
      "carPrice",
      "handledBy",
      "serialNumber",
      "document",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  transformLoanApplication() {
    const transformed = {
      data: {
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
      },
    };
    const fields = [
      "id",
      "applicationNo",
      "user",
      "dealerCode",
      "interestRate",
      "type",
      "status",
    ];
    const step1 = ["amount", "duration", "vehicleExpiryDate"];
    const step2 = [
      "salutation",
      "fullName",
      "nationality",
      "passport",
      "phone",
      "email",
      "dateOfBirth",
    ];
    const step3 = ["country", "postalCode", "address", "buildingNo", "unitNo"];
    const step4 = [
      "employmentStatus",
      "name",
      "employmentAddress",
      "occupation",
      "durationOfService",
      "monthlyGrossIncome",
      "proofOfIncome",
    ];
    const step5 = ["purchaseOfVehicle", "carNumber", "vehicleExpiryDate"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    step1.forEach((field) => {
      transformed.data.step1[field] = this[field];
    });
    step2.forEach((field) => {
      transformed.data.step2[field] = this[field];
    });
    step3.forEach((field) => {
      transformed.data.step3[field] = this[field];
    });
    step4.forEach((field) => {
      transformed.data.step4[field] = this[field];
    });
    step5.forEach((field) => {
      transformed.data.step5[field] = this[field];
    });
    return transformed;
  },
});

/**
 * Statics
 */
loanSchema.statics = {
  roles,

  /**
   * Get loan
   *
   * @param {ObjectId} id - The objectId of loan.
   * @returns {Promise<Loan, APIError>}
   */
  async get(id) {
    let loan;

    if (mongoose.Types.ObjectId.isValid(id)) {
      loan = await this.findById(id).exec();
    }
    if (loan) {
      return loan;
    }

    throw new APIError({
      message: "Loan does not exist",
      status: httpStatus.NOT_FOUND,
    });
  },

  // Update Loan

  async updateLoan(loanData) {
    let updateLoan;

    if (loanData) {
      const { applicationNo } = loanData;
      updateLoan = await this.updateOne(
        { applicationNo },
        loanData,
        (err, updateLoan) => {
          if (err) return next(err);
        }
      );
    }
    return updateLoan;
  },

  /**
   * List Loan in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of loan to be skipped.
   * @param {number} limit - Limit number of loan to be returned.
   * @param {ObjectId} id - User of loan to be returned.
   * @returns {Promise<Loan[]>}
   */
  list({ page = 1, perPage = 30, user, status }) {
    const options = omitBy({ user, 'status': {$ne : status} }, isNil);
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
  * List Dashboard Loan Data in descending order of 'createdAt' timestamp.
  * @returns {Promise<Loan[]>}
  */
  dashboardLoanList({ startDate, endDate }) {
    return this.find({ 'createdAt': { $gt: startDate, $lt: endDate  }})
      .sort({ createdAt: -1 })
      .exec();
  },

  calculate(data) {
    let monthlyRepayment = 0;
    if (data.amount && data.interestRate && data.duration) {
      let monthlyInterest = data.interestRate / (12 * 100);
      let InterestCompoundedPerYear = Math.pow(1 + monthlyInterest, data.duration);
      monthlyRepayment = [(data.amount * monthlyInterest * InterestCompoundedPerYear)] /
      [InterestCompoundedPerYear - 1];
    }
    return monthlyRepayment;
  },
};

/**
 * @typedef Loan
 */
module.exports = mongoose.model("Loan", loanSchema);
