<script>
  let transactions = $state([]);

  let date = $state('');
  let amount = $state('');
  let description = $state('');
  let debit = $state('');
  let credit = $state('');

  let totalRevenue = $derived(
    transactions
      .filter((transaction) => transaction.type === 'Revenue')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  let totalExpenses = $derived(
    transactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  let netIncome = $derived(totalRevenue - totalExpenses);

  function classifyTransaction(transaction) {
    if (transaction.credit === 'Revenue') {
      return 'Revenue';
    }

    if (transaction.debit === 'Rent Expense' || transaction.debit === 'Utilities Expense') {
      return 'Expense';
    }

    return 'Other';
  }

  function addTransaction() {
    const newTransaction = {
      date: date,
      amount: Number(amount),
      description: description,
      debit: debit,
      credit: credit
    };

    newTransaction.type = classifyTransaction(newTransaction);

    transactions = [newTransaction, ...transactions];

    date = '';
    amount = '';
    description = '';
    debit = '';
    credit = '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTransaction();
  }

  function formatCurrency(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
</script>

<div class="max-w-5xl mx-auto p-6 space-y-8">
  <header class="border-b border-slate-200 pb-4">
    <h1 class="text-3xl font-bold text-slate-800">Final New Books</h1>
    <p class="text-slate-500 text-sm mt-1">Track transactions. See your income statement live.</p>
  </header>

  <section class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold text-slate-800 mb-4">New Transaction</h2>

    <form onsubmit={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="date" class="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          id="date"
          bind:value={date}
          type="date"
          required
          class="border border-slate-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label for="amount" class="block text-sm font-medium text-slate-700 mb-1">Amount</label>
        <input
          id="amount"
          bind:value={amount}
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          class="border border-slate-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div class="md:col-span-2">
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <input
          id="description"
          bind:value={description}
          type="text"
          placeholder="e.g. Service revenue"
          required
          class="border border-slate-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label for="debit" class="block text-sm font-medium text-slate-700 mb-1">
          Debit Account
        </label>
        <select
          id="debit"
          bind:value={debit}
          required
          class="border border-slate-300 rounded px-3 py-2 w-full"
        >
          <option value="">-- Select --</option>
          <option>Cash</option>
          <option>Accounts Receivable</option>
          <option>Revenue</option>
          <option>Rent Expense</option>
          <option>Utilities Expense</option>
          <option>Owner's Equity</option>
        </select>
      </div>

      <div>
        <label for="credit" class="block text-sm font-medium text-slate-700 mb-1">
          Credit Account
        </label>
        <select
          id="credit"
          bind:value={credit}
          required
          class="border border-slate-300 rounded px-3 py-2 w-full"
        >
          <option value="">-- Select --</option>
          <option>Cash</option>
          <option>Accounts Receivable</option>
          <option>Revenue</option>
          <option>Rent Expense</option>
          <option>Utilities Expense</option>
          <option>Owner's Equity</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <button
          type="submit"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-medium"
        >
          Save Transaction
        </button>
      </div>
    </form>
  </section>

  <section class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold text-slate-800 mb-4">Income Statement</h2>

    <div class="space-y-2">
      <div class="flex justify-between text-emerald-700 font-medium">
        <span>Total Revenue</span>
        <span>{formatCurrency(totalRevenue)}</span>
      </div>

      <div class="flex justify-between text-rose-700 font-medium">
        <span>Total Expenses</span>
        <span>{formatCurrency(totalExpenses)}</span>
      </div>

      <div class="flex justify-between border-t border-slate-300 pt-2 text-lg font-bold">
        <span>Net Income</span>
        <span>{formatCurrency(netIncome)}</span>
      </div>
    </div>
  </section>

  <section class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-600 uppercase text-xs">
          <tr>
            <th class="text-left px-3 py-2">Date</th>
            <th class="text-left px-3 py-2">Description</th>
            <th class="text-left px-3 py-2">Debit</th>
            <th class="text-left px-3 py-2">Credit</th>
            <th class="text-right px-3 py-2">Amount</th>
            <th class="text-left px-3 py-2">Type</th>
          </tr>
        </thead>

        <tbody>
          {#if transactions.length === 0}
            <tr class="border-t border-slate-200">
              <td colspan="6" class="px-3 py-6 text-center text-slate-400 italic">
                No transactions yet. Add one using the form above.
              </td>
            </tr>
          {:else}
            {#each transactions as transaction}
              <tr class="border-t border-slate-200">
                <td class="px-3 py-2">{transaction.date}</td>
                <td class="px-3 py-2">{transaction.description}</td>
                <td class="px-3 py-2">{transaction.debit}</td>
                <td class="px-3 py-2">{transaction.credit}</td>
                <td class="px-3 py-2 text-right">{formatCurrency(transaction.amount)}</td>
                <td class="px-3 py-2">{transaction.type}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </section>
</div>
