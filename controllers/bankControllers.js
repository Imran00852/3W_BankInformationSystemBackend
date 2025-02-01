import { Bank } from "../models/bankAccountModel.js";
import { User } from "../models/userModel.js";
import { trimFields } from "../utils/helper.js";

//add bank
export const addBankAccount = async (req, res) => {
  try {
    let { IFSC_Code, branchName, bankName, accountNumber, accountHolderName } =
      req.body;

    if (
      !IFSC_Code ||
      !branchName ||
      !bankName ||
      !accountNumber ||
      !accountHolderName
    ) {
      return res.status(400).json({
        msg: "All fields are required!",
      });
    }
    req.body = trimFields(req.body);
    if (!/^\d{6,18}$/.test(accountNumber)) {
      return res
        .status(400)
        .json({ msg: "Invalid account number! Must be 6-18 digits." });
    }

    if (!/^[A-Za-z\s]+$/.test(bankName)) {
      return res
        .status(400)
        .json({ msg: "Bank name must contain only letters!" });
    }

    if (!/^[A-Za-z\s]+$/.test(branchName)) {
      return res
        .status(400)
        .json({ msg: "Branch name must contain only letters!" });
    }

    if (!/^[A-Za-z\s]+$/.test(accountHolderName)) {
      return res
        .status(400)
        .json({ msg: "Account holder name must contain only letters!" });
    }

    const bank = await Bank.create({
      user: req.user._id,
      IFSC_Code,
      branchName,
      bankName,
      accountNumber,
      accountHolderName,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { banks: bank._id },
      },
      { new: true }
    );

    res.status(201).json({
      msg: "Bank added successfully!",
      bank,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in add bank!",
      err: err.message,
    });
  }
};

//get all banks
export const getAllBanks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        msg: "Id is required!",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
      });
    }
    const banks = await Bank.find({ user: user._id });
    res.status(200).json({
      msg: "Banks retrieved successfully!",
      banks,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in retrieving banks!",
      err: err.message,
    });
  }
};

//update bank details
export const updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let { IFSC_Code, branchName, bankName, accountNumber, accountHolderName } =
      req.body;
    if (!id) {
      return res.status(400).json({
        msg: "Id is required!",
      });
    }

    req.body = trimFields(req.body);

    if (accountNumber && !/^\d{6,18}$/.test(accountNumber)) {
      return res
        .status(400)
        .json({ msg: "Invalid account number! Must be 6-18 digits." });
    }

    if (bankName && !/^[A-Za-z\s]+$/.test(bankName)) {
      return res
        .status(400)
        .json({ msg: "Bank name must contain only letters!" });
    }

    if (branchName && !/^[A-Za-z\s]+$/.test(branchName)) {
      return res
        .status(400)
        .json({ msg: "Branch name must contain only letters!" });
    }

    if (accountHolderName && !/^[A-Za-z\s]+$/.test(accountHolderName)) {
      return res
        .status(400)
        .json({ msg: "Account holder name must contain only letters!" });
    }
    const bank = await Bank.findById(id);
    if (!bank) {
      return res.status(400).json({
        msg: "No bank found!",
      });
    }
    if (IFSC_Code) bank.IFSC_Code = IFSC_Code;
    if (branchName) bank.branchName = branchName;
    if (bankName) bank.bankName = bankName;
    if (accountNumber) bank.accountNumber = accountNumber;
    if (accountHolderName) bank.accountHolderName = accountHolderName;

    await bank.save();

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { banks: bank._id },
      },
      { new: true }
    );

    return res.status(201).json({
      msg: "Bank details updated successfully!",
      bank,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in update!",
      err: err.message,
    });
  }
};

//delete bank account
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        msg: "Id is required!",
      });
    }
    const bank = await Bank.findById(id);

    if (!bank) {
      return res.status(400).json({
        msg: "No bank found!",
        bank,
      });
    }

    await Bank.deleteOne({ _id: id });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { banks: bank._id },
      },
      { new: true }
    );

    res.status(200).json({
      msg: "Bank deleted successfully!",
      bank,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in deleting bank!",
      err: err.message,
    });
  }
};

