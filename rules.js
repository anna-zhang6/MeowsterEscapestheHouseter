class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.currentKey = key;
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body);
        
        if (locationData.Items) {
            for (let item of locationData.Items) {
                if (!this.engine.hasItem(item.id)) {
                    this.engine.addChoice(item.Text, { isItem: true, item });
                }
            }
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                // add requires check here
                if (choice.requires && !this.engine.hasItem(choice.requires)) {
                    this.engine.addChoice("🔒 " + choice.Text, { isLocked: true, requires: choice.requires });
                } else {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice && choice.isLocked) {
            this.engine.show("&gt; You need the " + choice.requires + " first!");
            this.engine.gotoScene(Location, this.currentKey);
        } else if (choice && choice.isItem) {
            const item = choice.item;
            if (item.requires && !this.engine.hasItem(item.requires)) {
                this.engine.show("&gt; You need the " + item.requires + " first!");
            } else {
                this.engine.addItem(item.id);
                this.engine.show("&gt; " + item.description);
            }
            this.engine.gotoScene(Location, this.currentKey);
        } else if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');