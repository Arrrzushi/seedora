import TitleStorage from 0xd0963316d56da678

transaction(title: String) {
    prepare(acct: AuthAccount) {}

    execute {
        // Store the title using the public function
        let id = TitleStorage.storeTitle(title: title)
        log("Title stored with ID: ".concat(id.toString()))
    }
} 