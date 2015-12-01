class EmailRole extends BaseRole {
    on_open(eobj, item) {
        var p = item.parse()
        if (p.attr.id != undefined) {
            window.open('https://mail.google.com/mail/u/0/#inbox/' + id)
        }
    }
}

omni_app.register_role('email', EmailRole)

class ConfigRole extends StorageRole {
    render(parsed, item) {
        if (item.flagged) {
            parsed.body += ' <span style="color: green;">ON<span> '
        } else {
            parsed.body += ' <span style="color: rgba(255,0,0,0.5);">OFF</span> '
        }

        parsed.attr['flagged_class_on'] = 'is_gear'
    }
}

omni_app.register_role('config', ConfigRole)

