import { Account } from "@models/account";
import { Transaction } from "@models/transaction";
import {User} from "@models/User"
import { sequelize } from "@config/connection";
import { AppError } from "@utils/appError";
import { Op } from "sequelize";
import { sendSuspiciousToEmail } from "./external/sendEmailService";

interface TransferParams {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description?: string;
}
interface SuspiciousParams {
  accountId: number;
  amountThreshold: number;
  transactionLimit: number;
  timeWindowInHours: number;
}

export const transferFunds = async ({
  fromAccountNumber,
  toAccountNumber,
  amount,
  description
}: TransferParams) => {
  try {
    return await sequelize.transaction(async (t) => {
   
      const preciseAmount = Number(amount.toFixed(2));
      
    
      if (preciseAmount <= 0) {
        throw new AppError("El monto debe ser mayor a 0", 400);
      }

      const sourceAccount = await Account.findOne({
        where: { accountNumber: fromAccountNumber, active: true },
        transaction: t,
        lock: true
      });

      if (!sourceAccount) {
        throw new AppError("Cuenta origen no encontrada o inactiva", 404);
      }

      const destinationAccount = await Account.findOne({
        where: { accountNumber: toAccountNumber, active: true },
        transaction: t,
        lock: true
      });

      if (!destinationAccount) {
        throw new AppError("Cuenta destino no encontrada o inactiva", 404);
      }

      if (sourceAccount.balance < preciseAmount) {
        throw new AppError("Fondos insuficientes", 400);
      }

      const isSuspicious = await checkSuspiciousTransaction({
        accountId: sourceAccount.id,
        amountThreshold: 1000000,
        transactionLimit: 5,
        timeWindowInHours: 1,
      });

      if(isSuspicious){
        const userId = sourceAccount?.dataValues.userId
        const user = await User.findOne({
          where: { id:userId}
        });
        
        const email = user?.dataValues.email;
        const name = user?.dataValues.name;
        const date= new Date();
        const transactionDate = new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(date);
        if(email && name) {
          await sendSuspiciousToEmail({ email, name, transactionDate, amount });
        }
      }



      const transaction = await Transaction.create({
        fromAccountId: sourceAccount.id,
        toAccountId: destinationAccount.id,
        amount: preciseAmount,
        type: 'TRANSFER',
        status: 'PENDING',
        description,
        suspicious: isSuspicious
      }, { transaction: t });

      await sourceAccount.update({
        balance: sequelize.literal(`balance - ${preciseAmount}`)
      }, { transaction: t });

      await destinationAccount.update({
        balance: sequelize.literal(`balance + ${preciseAmount}`)
      }, { transaction: t });

      
      await sourceAccount.reload();
      await destinationAccount.reload();



      await transaction.update({ status: 'COMPLETED' }, { transaction: t });


      return {
        transactionId: transaction.id,
        status: 'COMPLETED',
        suspicious: isSuspicious,
        sourceBalance: sourceAccount.balance,
        destinationBalance: destinationAccount.balance, 
        timestamp: new Date()
      };
    });
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
};

export const checkSuspiciousTransaction = async ({
  accountId,
  amountThreshold,
  transactionLimit,
  timeWindowInHours,
}: SuspiciousParams): Promise<boolean> => {
  const recentTransactions = await Transaction.findAll({
    where: {
      fromAccountId: accountId,
      createdAt: {
        [Op.gte]: new Date(Date.now() - timeWindowInHours * 60 * 60 * 1000),
      },
    },
  });

  const totalAmount = recentTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    recentTransactions.length >= transactionLimit || 
    totalAmount >= amountThreshold
  );
};