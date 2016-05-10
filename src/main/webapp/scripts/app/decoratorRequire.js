require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',
        'handlebars': 'lib/handlebars.runtime.min',

        // hosted version
		//'augmented': '/augmented/scripts/core/augmented',
        //'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation',

        // local version
		'augmented': 'lib/augmented',
        'augmentedPresentation': 'lib/augmentedPresentation',

        'note': 'app/note'
	}
});

require(['augmented', 'augmentedPresentation', 'handlebars', 'note'], function(Augmented, Presentation, Handlebars) {
    "use strict";
    var app = new Augmented.Presentation.Application("Stickies!");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Work+Sans:300,400");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Coming+Soon");
    app.start();

    // Sort-of persistance
    var Storage = Augmented.LocalStorageCollection.extend({
        key: "augmented.example.stickies",
        persist: true
    }), lsc = new Storage();

    var defaultTitle = "Untitled", defaultNote = "", defaultColor = "#fffde7";

    // 'Controller' as a view
    var StickyView = Augmented.Presentation.DecoratorView.extend({
        name: "sticky",
        el: "#sticky",
        collection: lsc,
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
            this.collection.fetch();
            if (this.collection.length > 0) {
                this.addNotesFromStorage();
            }

            this.syncModelChange();
        },
        addNotesFromStorage: function() {
            var i = 0, l = this.collection.length;
            for (i = 0; i < l; i++) {
                this.model = this.collection.at(i);
                this.addNoteToDisplay();
            }
        },
        addNoteToDisplay: function() {
            var titleText = (this.model.get("title") ? this.model.get("title") : defaultTitle),
                noteText = (this.model.get("note") ? this.model.get("note") : defaultNote),
                obj = {"title": titleText, "note": noteText, "color": this.model.get("color")};
            this.injectTemplate(Handlebars.templates.note(obj), this.boundElement("notes"));
        },
        // bound functions from the html
        addNote: function() {
            var titleText = (this.model.get("title") ? this.model.get("title") : defaultTitle),
                noteText = (this.model.get("note") ? this.model.get("note") : defaultNote),
                obj = {"title": titleText, "note": noteText, "color": this.model.get("color")};
            this.collection.push(obj);
            this.injectTemplate(Handlebars.templates.note(obj), this.boundElement("notes"));
            this.collection.save();
            this.model.set({"title": defaultTitle, "note": defaultNote, "color": defaultColor});
        },
        closeNote: function(event) {
            if (event && event.currentTarget && event.currentTarget.parentNode) {
                var note = event.currentTarget.parentNode;
                this.removeTemplate(note);
            }
            this.collection.pop();
            this.collection.save();
            this.model.set({"title": defaultTitle, "note": defaultNote, "color": defaultColor});
        }
    });

    var view = new StickyView();
});
