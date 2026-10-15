class Start extends Scene {
    enter() {
        this.engine.setTitle(this.engine.storyData.title);
        this.engine.addNavigationCell("Begin the story");
    }

    handleNavigation() {
        var start = this.engine.storyData.start;
        this.engine.gotoScene(Room, start.x, start.y, {"items": {}, "steps": 0});
    }
}

class Room extends Scene {
    enter(x,y,player)
    {
        this.x = x;
        this.y = y;
        var roomData = this.engine.storyData.rooms[x + "_" + y];
        this.engine.showCaption(roomData.name);
        this.engine.show(roomData.description);
        this.interactions(player.items, roomData.items);
        player.steps += 1;
        if (roomData.items.length > 0)
        {
            var items = "Items collected: ";
            for(var item of roomData.items)
            {
                items += this.engine.itemString(item) + " ";
                if (player.items[item])
                {
                    player.items[item] += 1;
                }
                else
                {
                    player.items[item] = 1;
                }
            }
            roomData.items = [];
            this.engine.show(items);
        }
        else
        {
            this.engine.show("No items left to collect. Have you already been here?");
        }

        if (this.engine.storyData.exit.x == x && this.engine.storyData.exit.y == y)
        {
            this.endGame(player);
        }
        else
        {
            this.engine.addInteraction("Do something", "x", "y");
            // navigation cells come in a 3x3 grid
            // row 1
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y-1)])
            {
                if(this.engine.storyData.rooms[x+"_"+(y-1)].requires && !(this.engine.storyData.rooms[x+"_"+(y-1)].requires in player.items))
                    this.engine.addTextCell("Go North (requires " + this.engine.itemString(this.engine.storyData.rooms[x+"_"+(y-1)].requires) + ")");
                else
                    this.engine.addNavigationCell("Go North", x, y-1, player);
            }
            else
                this.engine.addTextCell();
            this.engine.addTextCell();

            // row 2
            if (this.engine.storyData.rooms[(x-1)+"_"+y])
            {   
                if(this.engine.storyData.rooms[(x-1)+"_"+y].requires && !(this.engine.storyData.rooms[(x-1)+"_"+y].requires in player.items))
                    this.engine.addTextCell("Go West (requires " + this.engine.itemString(this.engine.storyData.rooms[(x-1)+"_"+y].requires) + ")");
                else
                this.engine.addNavigationCell("Go West", x-1, y, player);
            }
            else
                this.engine.addTextCell();
            this.engine.addTextCell("You are here");
            if (this.engine.storyData.rooms[(x+1)+"_"+y])
            {
                if(this.engine.storyData.rooms[(x+1)+"_"+y].requires && !(this.engine.storyData.rooms[(x+1)+"_"+y].requires in player.items))
                    this.engine.addTextCell("Go East (requires " + this.engine.itemString(this.engine.storyData.rooms[(x+1)+"_"+y].requires) + ")");
                else
                    this.engine.addNavigationCell("Go East", x+1, y, player);
            }
            else
                this.engine.addTextCell();

            // row 3
            this.engine.addTextCell();
            if (this.engine.storyData.rooms[x+"_"+(y+1)])
            {
                if(this.engine.storyData.rooms[x+"_"+(y+1)].requires && !(this.engine.storyData.rooms[x+"_"+(y+1)].requires in player.items))
                    this.engine.addTextCell("Go South (requires " + this.engine.itemString(this.engine.storyData.rooms[x+"_"+(y+1)].requires) + ")");
                else
                    this.engine.addNavigationCell("Go South", x, y+1, player);
            }
            else
                this.engine.addTextCell();
            this.engine.addTextCell();
        }
        this.engine.transition();
    }
    handleNavigation(x,y,player) {
        this.engine.gotoScene(Room, x, y, player);
    }

    handleInteraction(a,b)
    {
        if (a == "x" && b == "y") {
            this.engine.show("Interaction successful!");
        }
        if (a == "insert_coin" && b == "slot_machine")
            {
                this.engine.show("You insert the coin into the slot machine and pull the lever.")
                let rng = Math.random();
                if (rng < 0.5) 
                    {
                    this.engine.show("You win! The slot machine dispenses a prize of that doubles your coins.");
                    this.Player.items["coin"] *= 2;
                    } 
                else 
                    {
                    this.engine.show("You lose! Better luck next time.");
                    this.Player.items["coin"] -= 1;
                    }
            }
    }

    interactions(inventory, roomItems)
    {
        if ("cat2" in inventory && roomItems.includes("coffee")) {
            this.engine.show("Your cat is unable to resist its primal instincts and knocks down the cup of coffee from the table.");
            this.engine.show("You have take a moment of silence for the cup of coffee.");            
        }
        if ("coin" in inventory && roomItems.includes("slot_machine")) {
            this.engine.addInteraction("Insert coin into slot machine", "insert_coin", "slot_machine");
        }
    }

    endGame(player)
    {
        this.engine.show("You have reached the exit! Congratulations!");
        var items = "Items collected:";
        for(var item in player.items)
        {
            items += this.engine.itemString(item) + " x" + player.items[item] + " ";
        }
        this.engine.show(items);
        this.engine.show("Total steps taken: " + player.steps);
        let score = Object.keys(player.items).length /player.steps;
        this.engine.show("Your score is: " + score);
        this.engine.show(this.engine.storyData.credits);
    }
}

Engine.load(Start, './myWorld.json');