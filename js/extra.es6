class ExecMixin extends BaseMixin {}
class PeopleMixin extends BaseMixin {}

glob_mixins['exec'] = new ExecMixin()
glob_mixins['person'] = new PeopleMixin()

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
