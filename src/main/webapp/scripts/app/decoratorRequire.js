require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery-2.1.4.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',
        'handlebars': 'lib/handlebars-v4.0.2',

        // hosted version
		//'augmented': '/augmented/scripts/core/augmented',
        //'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation'

        // local version
		'augmented': 'lib/augmented',
        'augmentedPresentation': 'lib/augmentedPresentation'
	}
});

require(['augmented', 'augmentedPresentation', 'handlebars'], function(Augmented, Presentation, Handlebars) {
    "use strict";
    var app = new Augmented.Presentation.Application("Stickies!");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Work+Sans:300,400");
    app.registerStylesheet("styles/main.css");
    app.start();

    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    // 'Controller' as a view
    var StickyView = Augmented.Presentation.DecoratorView.extend({
        name: "sticky",
        el: "#sticky",
        noteTemplate: Handlebars.compile(
            "<div{{#if color}} style=\"background-color: {{color}}\"{{/if}}><h1>{{title}}</h1><p>{{note}}</p><button data-sticky=\"close\" data-click=\"closeNote\">✕</button></div>"
        ),
        init: function() {
            var supportsColorPicker = function(){
                var inp = document.createElement("input");
                inp.setAttribute("type", "color");
                return inp.type !== "text";
            };
            if (!supportsColorPicker()) {
                var colorInput = document.getElementById("colors");
                colorInput.style.display = "none";
                colorInput.style.visibility = "hidden";
            }
        },
        // bound functions from the html
        addNote: function() {
            var titleText = (this.model.get("title") ? this.model.get("title") : "Untitled"),
                noteText = (this.model.get("note") ? this.model.get("note") : ""),
                color = this.model.get("color"),
                notes = this.boundElement("notes");
            var template = this.noteTemplate({"title": titleText, "note": noteText, "color": color});

            this.injectTemplate(template, notes);
        },
        closeNote: function(event) {
            if (event && event.currentTarget && event.currentTarget.parentNode) {
                var note = event.currentTarget.parentNode;
                this.removeTemplate(note);
            }
        }
    });

    var view = new StickyView();
});
