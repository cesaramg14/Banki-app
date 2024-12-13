import { Account } from "@models/account";
import { User } from "../models/User";
import { Transaction } from "@models/transaction";
import { AppError } from "@utils/appError";
import { Op } from "sequelize";

export const registerAccount = async (accountNumber: string, userId: number, balance: number) => {
    const existingAccount = await Account.findOne({ where: { accountNumber } });
    if (existingAccount) {
      throw new Error("El número de cuenta ya está registrado.");
    }
  
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
  
    const newAccount = await Account.create({
      userId,
      accountNumber,
      balance,
      active: true
    });
  
    return newAccount;
  };
  

export const validateAccount = async (accountNumber: string, userId: number) => {
  const account = await Account.findOne({ where: { accountNumber } });
  if (!account) {
    throw new Error("Cuenta no encontrada.");
  }

  if (account.userId !== userId) {
    throw new Error("El número de cuenta no pertenece a este usuario.");
  }

  return account;
};

export const getAccountBalance = async (accountNumber: string) => {
  const account = await Account.findOne({
    where: { accountNumber, active: true }
  });

  if (!account) {
    throw new Error("Cuenta no encontrada o inactiva.");
  }

  return account.balance;
  
};

export const getAccount = async (accountNumber: string) => {
  const account = await Account.findOne({
    where: { accountNumber, active: true }
  });


  if (!account) {
    throw new Error("Cuenta no encontrada o inactiva.");
  }

  return account;
  
};


interface TransactionHistoryParams {
  accountNumber: string;
  startDate?: Date;
  endDate?: Date;
  type?: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  page: number;
  limit: number;
}

export const getTransactionHistory = async ({
  accountNumber,
  startDate,
  endDate,
  type,
  page,
  limit
}: TransactionHistoryParams) => {
  const account = await Account.findOne({
    where: { accountNumber, active: true }
  });

  if (!account) {
    throw new AppError("Cuenta no encontrada o inactiva", 404);
  }

  const whereClause: any = {
    [Op.or]: [
      { fromAccountId: account.id },
      { toAccountId: account.id }
    ]
  };

  if (startDate && endDate) {
    whereClause.createdAt = {
      [Op.between]: [startDate, endDate]
    };
  }

  if (type) {
    whereClause.type = type;
  }

  const { count, rows } = await Transaction.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Account,
        as: 'sourceAccount',
        attributes: ['accountNumber']
      },
      {
        model: Account,
        as: 'destinationAccount',
        attributes: ['accountNumber']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit
  });

  const transactions = rows.map((transaction: any) => ({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
    description: transaction.description,
    fromAccount: transaction.sourceAccount?.accountNumber,
    toAccount: transaction.destinationAccount?.accountNumber,
    date: transaction.createdAt,
    isDebit: transaction.fromAccountId === account.id
  }));

  return {
    transactions,
    pagination: {
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      limit
    }
  };
};
