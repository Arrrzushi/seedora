import Counter from 0xd0963316d56da678

transaction {
    prepare(acct: auth(BorrowValue) &Account) {}

    execute {
        Counter.increment()
    }
} 