import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

const sql = neon(DATABASE_URL);

function classifyTransaction(transaction) {
  if (transaction.credit === 'Revenue') {
    return 'Revenue';
  }

  if (transaction.debit === 'Rent Expense' || transaction.debit === 'Utilities Expense') {
    return 'Expense';
  }

  return 'Other';
}

export async function load() {
  const transactions = await sql`
    SELECT id, date, amount, description, debit, credit, type
    FROM transactions
    ORDER BY created_at DESC;
  `;

  return {
    transactions
  };
}

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const transaction = {
      date: formData.get('date'),
      amount: Number(formData.get('amount')),
      description: formData.get('description'),
      debit: formData.get('debit'),
      credit: formData.get('credit')
    };

    transaction.type = classifyTransaction(transaction);

    await sql`
      INSERT INTO transactions (date, amount, description, debit, credit, type)
      VALUES (
        ${transaction.date},
        ${transaction.amount},
        ${transaction.description},
        ${transaction.debit},
        ${transaction.credit},
        ${transaction.type}
      );
    `;

    return {
      success: true
    };
  }
};
