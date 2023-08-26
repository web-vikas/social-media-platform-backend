const {
  Insert,
  HandleServerError,
  HandleSuccess,
  HandleError,
  CheckIfStringAndNonEmpty,
  Find,
  FindAndUpdate,
  Delete,
  IsExistsOne,
  FindOne,
} = require("./BaseController");
const { WalletModel, Mongoose } = require("../models");

module.exports = {
  GetBalance: async (req, res, next) => {
    const { id } = req.body;
    if (!id) return HandleError(res, "Customer Not Found !");
    try {
      const data = await FindOne({
        model: WalletModel,
        where: {
          customer_id: id,
        },
      });

      return HandleSuccess(res, data);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
  InsertBalance: async (req, res, next) => {
    const { customerId, creditBalance, creditRemarks } = req.body;
    try {
      if (customerId == "" || creditBalance == "")
        return HandleError(res, "Please Fill Credit Balance");
      const data = await IsExistsOne({
        model: WalletModel,
        where: {
          customer_id: customerId,
        },
      });
      if (!data) {
        const newData = await Insert({
          model: WalletModel,
          data: {
            customer_id: customerId,
            credit_amount: creditBalance,
            credit_remarks: creditRemarks,
          },
        });
        return HandleSuccess(res, newData);
      }
      const updatedData = await FindAndUpdate({
        model: WalletModel,
        where: {
          customer_id: customerId,
        },
        update: {
          credit_amount: Number(creditBalance) + Number(data.credit_amount),
          credit_remarks: creditRemarks,
        },
      });
      return HandleSuccess(res, updatedData);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
};
