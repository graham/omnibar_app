class LinkMixin extends BaseMixin {}
class ImgMixin extends BaseMixin {}

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

class Email extends BaseMixin {
    on_view(eobj, item) {
        var p = item.parse()
        p.entries.forEach((item) => {
            if (item[0] == '$' && item[1] == 'id') {
                window.open('https://mail.google.com/mail/u/0/#inbox/' + item[3])
            }
        })
    }
}

glob_mixins['gmail'] = Email
