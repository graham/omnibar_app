class EmailRole extends CoreRole {
    on_view(eobj, item) {
        var p = item.parse()
        if (p.attr.id != undefined) {
            window.open('https://mail.google.com/mail/u/0/#inbox/' + p.attr.id)
        }
    }
}

omni_app.register_role('email', EmailRole)

class ConfigRole extends CoreRole {
    render(parsed, item) {
        if (item.get_meta('flagged')) {
            parsed.body += ' <span style="color: green;">ON<span> '
        } else {
            parsed.body += ' <span style="color: rgba(255,0,0,0.5);">OFF</span> '
        }

        parsed.attr['flagged_class_on'] = 'is_gear'
    }
}

omni_app.register_role('config', ConfigRole)

class NiceTag extends CoreRole {
    render(parsed, item) {
        parsed.body = parsed.body.replace(/(#\w+)/g, "<span class='is_tag'>$1</span>")
    }
}

omni_app.register_role('tag', NiceTag)
