0// Hello

class ItemRenderer {
    constructor() {
        var _this = this;
    }

    create_base_tr(obj) {
        var parsed = obj.parse()
        var tr = document.createElement('tr')

        if (obj.active) {
            tr.className = 'ob-tr active'
        } else {
            tr.className = 'ob-tr'
        }
        
        var select_td = document.createElement('td');
        select_td.className = 'ob-highlight';
        tr.appendChild(select_td);

        var checkbox_td = document.createElement('td');
        checkbox_td.className = 'ob-checkbox-holder'

        var internal_cb = document.createElement('input')
        internal_cb.type = 'checkbox'
        internal_cb.checked = obj.selected || false
        internal_cb.style.cssText = 'margin-top: 3px;'
        $(internal_cb).on('click', () => {
            omni_app.fire_event("control:select", {"index":obj.index})
        });

        checkbox_td.appendChild(internal_cb)
        tr.appendChild(checkbox_td)

        var outer_td = document.createElement('td')
        outer_td.style.cssText = 'width: auto;'

        var star_div = document.createElement('div')
        star_div.className = 'ob-star'
        
        if (obj.flagged) {
            if (parsed.attr.flagged_class_on) {
                star_div.className += ' ' + parsed.attr.flagged_class_on
            } else {
                star_div.className += ' is_flagged'
            }
        } else {
            if (parsed.attr.flagged_class_off) {
                star_div.className += ' ' + parsed.attr.flagged_class_off
            } else {
                star_div.className += ' is_not_flagged'
            }
        }

        checkbox_td.appendChild(star_div)
        $(star_div).on('click', () => {
            obj.on_event('toggle_star', {})
        });

        var inner_div = document.createElement('div')
        inner_div.className = 'ob-inner'
        var content_div = document.createElement('div')
        content_div.className = 'ob-litem'
        
        inner_div.appendChild(content_div)
        outer_td.appendChild(inner_div)
        tr.appendChild(outer_td)

        return [tr, content_div]
    }

    float_right() {
        var d = document.createElement('div')
        d.className = 'ob-line-right'
        return d;
    }

    project_right() {
        var d = document.createElement('div')
        d.className = 'ob-project-right'
        return d;
    }

    parse(obj) {
        var tr, inner_div;
        [tr, inner_div] = this.create_base_tr(obj)
        inner_div.innerHTML = obj.as_line()

        var roles = obj.parse()['roles']
        roles.forEach((item) => {
            //if (item[0] != '_') {
                var tag = this.float_right();
                tag.innerHTML = item
                tag.style.backgroundColor = color_for_word(item);
                inner_div.appendChild(tag)
            //}
        })

        return tr
    }
}
