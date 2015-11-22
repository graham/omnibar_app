class WordsMixin extends BaseMixin {
    search(query) {
        return [
            new Item("words"),
            new Item("are"),
            new Item("fun"),
            new Item("right?")
        ]
    }
}

class NumbersMixin extends BaseMixin {
    search(query) {
        var results = [];
        for(var i=0; i < 20; i++) {
            results.push(new Item(''+ i));
        }
        return results;
    }
}
