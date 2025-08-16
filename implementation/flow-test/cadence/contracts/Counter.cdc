access(all) contract Counter {
    access(all) var count: Int

    access(all) fun increment() {
        self.count = self.count + 1
    }

    init() {
        self.count = 0
    }
} 