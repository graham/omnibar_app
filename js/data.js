var data = {};

(function() {
    data.lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis mattis diam, vitae semper nisi. Curabitur consequat vestibulum enim, euismod viverra odio vestibulum congue. Praesent aliquet varius mi, non volutpat elit vestibulum vitae. Nam porttitor massa vel lectus luctus, quis mollis elit ullamcorper. Sed rhoncus mi a pulvinar bibendum. Donec accumsan euismod arcu. Vestibulum elit quam, sagittis eu turpis sed, lobortis tristique sapien. Praesent viverra pharetra magna ut pulvinar. Nullam id massa vitae enim faucibus consequat et sit amet felis. Suspendisse a turpis felis. Nam vel lectus egestas, venenatis orci ut, mattis tortor. Curabitur facilisis tristique sapien, sit amet varius nulla elementum quis. Mauris in dolor ac nisl eleifend eleifend. Duis in mattis risus, eget tincidunt orci.<br><br>Nam ut pellentesque purus. Integer nec sollicitudin nibh. Proin rutrum mauris ut tempus aliquam. Aliquam vel erat dictum, iaculis libero in, auctor lectus. Donec at luctus lacus. Morbi ante enim, blandit et pharetra hendrerit, gravida vel eros. Praesent suscipit leo purus, vitae varius ligula lacinia id. Duis lacinia ultricies turpis eget pulvinar. Cras non justo malesuada, pulvinar velit vitae, imperdiet lorem. Maecenas sagittis vestibulum neque, sit amet vehicula nulla finibus in. Mauris placerat ac purus vel varius. Pellentesque eget varius massa. Sed nec semper massa.<br><br>Nulla molestie, mauris a aliquam congue, felis risus vestibulum mi, eget eleifend purus felis pharetra nibh. Integer id viverra ex, id condimentum lorem. Fusce blandit, leo ac interdum consectetur, tellus risus tristique augue, vitae bibendum dolor quam et erat. In sed aliquet purus. Aenean sed rhoncus elit, sed imperdiet nisi. In fringilla libero ullamcorper, congue purus a, ultrices felis. Mauris ut sapien libero. Vestibulum rutrum lectus ipsum, eu efficitur mi volutpat ac. Cras vehicula venenatis enim eget mattis. Nulla facilisi. Ut sollicitudin lacus non eros pretium ullamcorper. Nunc interdum fringilla congue.<br><br>Nulla facilisi. Maecenas euismod ultricies tincidunt. Mauris sit amet sagittis neque. Proin lectus est, pretium nec ante ut, pretium egestas dui. Suspendisse et diam eget lacus vestibulum condimentum. Cras suscipit ante sed fringilla tincidunt. Donec hendrerit faucibus diam. Phasellus a tellus accumsan, aliquet risus id, convallis mauris. Curabitur eget pellentesque sem. Vestibulum pellentesque mollis eleifend. Vivamus et lobortis erat.<br><br>Ut feugiat arcu non lacinia egestas. Suspendisse euismod dolor sit amet tristique tristique. Nulla facilisi. Sed eleifend suscipit ex varius egestas. Curabitur quis nibh in lacus vulputate mattis vel vitae nisl. Morbi non semper nunc, vitae tristique elit. Nunc condimentum varius sapien, et mattis nisl. Nam sed elit ipsum. Aliquam in tristique mauris. Proin fringilla consectetur fermentum. Pellentesque auctor dolor sed nulla sodales facilisis. Sed cursus consequat neque a hendrerit. Morbi venenatis turpis eget nisi dignissim, ac imperdiet leo congue. Suspendisse id risus non urna ultricies ultricies.<br><br>";

    data.test_list = [
        ['a1', 'This is number one.']
    ];
    
    for(var i=0; i < 10; i++) {
        data.test_list.push(['asdf' + i, 'This is number ' + i]);
    }
})();