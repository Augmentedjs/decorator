require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery-2.1.4.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

        // hosted version
		'augmented': '/augmented/scripts/core/augmented',
        'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation'

        // local version
		//'augmented': 'lib/augmented',
        //'augmentedPresentation': 'lib/augmentedPresentation'
	}
});

require(['augmented', 'augmentedPresentation'], function(Augmented, Presentation) {
    "use strict";
    var app = new Augmented.Presentation.Application("Stickies!");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Work+Sans:300,400");
    app.registerStylesheet("styles/main.css");
    app.start();

    var supportsColorPicker = function(){
        var inp = document.createElement("input");
        inp.setAttribute("type", "color");
        return inp.type !== "text";
    };

    // 'Controller' as a view
    var StickyView = Augmented.Presentation.DecoratorView.extend({
        name: "sticky",
        el: "#sticky",
        init: function() {
            if (!supportsColorPicker()) {
                var colorInput = document.getElementById("colors");
                colorInput.style.display = "none";
                colorInput.style.visibility = "hidden";
            }
        },
        // bound functions from the html
        addNote: function(data) {
            // faster than dynamic templates, but can function with innerHTML and handlebars
            var titleText = (this.model.get("title") ? this.model.get("title") : "Untitled");
            var noteText = (this.model.get("note") ? this.model.get("note") : "");

            var notes = document.getElementById("notes");
            var note = document.createElement("div");
            var h = document.createElement("h1");
            var t = document.createTextNode(titleText);
            h.appendChild(t);
            note.appendChild(h);
            h = document.createElement("p");
            t = document.createTextNode(noteText);
            h.appendChild(t);
            note.appendChild(h);
            h = document.createElement("button");
            h.setAttribute("data-sticky", "close");
            h.setAttribute("data-click", "closeNote");
            t = document.createTextNode("✕");
            h.appendChild(t);
            note.appendChild(h);

            // find the color
            var color = this.model.get("color");
            if (color) {
                var cl = "yellow";
                if (color === "#ffebee") {
                    cl = "red";
                } else if (color === "#e8f5e9") {
                    cl = "green";
                } else if (color === "#e3f2fd") {
                    cl = "blue";
                } else if (color === "#f3e5f5") {
                    cl = "purple";
                } else if (color === "#fffde7") {
                    cl = "yellow";
                } else {
                    note.style.background = color;
                }
                note.setAttribute("class", cl);
            }

            notes.appendChild(note);
            this.delegateEvents();
        },
        closeNote: function(event) {
            if (event && event.currentTarget && event.currentTarget.parentNode) {
                var note = event.currentTarget.parentNode;
                while (note.firstChild) {
                    note.removeChild(note.firstChild);
                }
                var notes = note.parentNode;
                notes.removeChild(note);
                this.delegateEvents();
            }
        }
    });

    var view = new StickyView();
});
