class View {
    contructor() {
        this.beacon = new Beacon();
        console.log('init inside view.');
    }

    render() {
        console.log("Core View rendering.");
        var d = document.createElement('div')
        d.innerHTML = "Someone didn't implement the render method on their view. :(";
        return d;
    }

    prepare() {
        console.log("Prepare basic ViewController.");
    }

    destroy() {
        console.log("Destroy basic ViewController.");
    }
}

class OmniListView extends View {
    render(controller, is_done) {
        var table = document.createElement('table');
        table.className = 'ob-table ob-reset';

        if (controller.cursor_index >= controller.item_list.length) {
            controller.cursor_index = controller.item_list.length-1;
        }
        
        if (controller.item_list.length == 0) {
            controller.cursor_index = 0;
        }
        
        controller.item_list.forEach((obj, _index) => {
            obj.index = _index;
            
            if (controller.cursor_index == _index) {
                obj.active = true;
            } else {
                obj.active = false;
            }
            
            var d = null;
            
            try {
                d = omni_app.plugin_manager.default_transformer.parse(obj, controller);
            } catch (e) {
                console.log(e, e.stack);
                d = document.createElement('div')
                d.innerHTML = "" + e.stack
            }
            
            table.appendChild(d);
        });                   
        // Needs to be better.
        $("#ob-content").parent().animate({'scrollTop':0}, 10);
        
        is_done(table);
    }
}
