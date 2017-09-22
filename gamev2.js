function MemoryGame() {

    //html containers
    this.container_activePlayer;
    this.container_points_player1;
    this.container_points_player2;
    this.container_popup;
    
    //game variables
    var isMouseDown;
    var mouse_x, mouse_y;
    var canvas_width,canvas_height;
    var gameFinished;
    
    //game objects
    var cards; // array - contains the card definition, id, image etc
    var board;  // 2 dimensional array - 
                // contains card ids as the cards are placed on the board
    
    var pairs; //number of pairs in the game

    var horizontal_card_count; 
    var vertical_card_count;
    
    //player
    var activePlayer;
    var activePlayerIndex;
    var players;
    
    var selectedCard1;
    var selectedCard2;
    
    var promptNextPlayer;  
    var playerSwitchConfirmed;
    
    
    
    //visuals
    var topBoardMargin;
    var cardMargin;
    var cardWidth, cardHeight;
    
    var bubble_left, bubble_right;
    
    this.init = function(canvas_width,canvas_height){ 
        
        console.log("canvas size is "+canvas_width+"x"+canvas_height);
        
        this.isMouseDown = false;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.gameFinished = false;
        
        this.topBoardMargin = 105;
        this.cardMargin = 15;
        
        this.pairs = 9;
        
        this.vertical_card_count = 3;
        this.horizontal_card_count = 6 ;
        
        this.cardWidth = 180;
        this.cardHeight = 180;
        
        this.bubble_left = document.getElementById('img_bubble_left');
        this.bubble_right = document.getElementById('img_bubble_right');
        
        //generate cards
        
        
        
        //generate card seed

        
        
        this.players = [
            new MemoryPlayer("player 1"),     
            new MemoryPlayer("player 2")
        ];
        

        
        this.selectedCard1 = null;
        this.selectedCard2 = null;
        
        this.promptNextPlayer = false;  
        this.playerSwitchConfirmed = false;
        
    }

    this.connectContainers = function(activePlayerContainer,
                          player1PointsContainer,
                          player2PointsContainer,
                          container_popup){
        
        
        this.container_activePlayer = activePlayerContainer;
        this.container_points_player1 = player1PointsContainer;
        this.container_points_player2 = player2PointsContainer;
        this.container_popup = container_popup;
    }
    
    this.setPlayers =function(plyrs){
        this.players = plyrs;
        
        this.activePlayerIndex = 0;
        this.activePlayer = this.players[this.activePlayerIndex];
    }

    this.initCards = function(pairs){
        
        this.pairs = pairs;
        this.cards = new Array(this.pairs*2);
        
         //create first half
        for (var i = 0; i < this.pairs; i++) {
            
            var partnerIndex = i + this.pairs; //start at pair counter

            var memCard = new MemoryCard(i,partnerIndex);
            memCard.elementID = 'card_p_'+i+'_0';
            memCard.imageID =  document.getElementById('card_p_'+i+'_0');
            
            this.cards[i] = memCard;
        }
        
        //create second half
        for (var i = this.pairs; i < this.cards.length; i++) {
            
            var partnerIndex = i - this.pairs;
            var sourceCard = this.cards[partnerIndex] //get partner as source
            
            var memCard = new MemoryCard(i,partnerIndex);
            memCard.elementID = 'card_p_'+partnerIndex+'_1';
            memCard.imageID = document.getElementById('card_p_'+partnerIndex+'_1');
            
            this.cards[i] = memCard;
        }
        
        return this.cards;
    }
    
    
    this.generateBoard = function(){
        var cardSeed = new Array(this.pairs*2);
        for (var i = 0; i < cardSeed.length; i++) {
            cardSeed[i] = i;
        }
        
        this.shuffle(cardSeed);      
        return cardSeed;
    }
    

    
    
    this.clickCard = function(cardID){
        
        if(!this.promptNextPlayer){
            for(var i = 0; i < this.cards.length; i++){                
                var cur_card = this.cards[i];

                if(cur_card.elementID == cardID){
                    if(!cur_card.opened){

                        cur_card.open();

                        if(this.selectedCard1 == null){
                            this.selectedCard1 = cur_card;
                        }
                        else {
                            this.selectedCard2 = cur_card;
                        }
                        break;
                    }
                }            
            } 
        }
        
        console.log(cardID);
        

    }

    
    this.processMousePressed = function(primary_down,secondary_down){
        this.isMouseDown = primary_down;        
  
        if(primary_down){
            
            if(!this.promptNextPlayer){
                

            } //if promptplayer active 
            else{
                this.playerSwitchConfirmed = true;
            }           

        }//if primary mouse down
        
    }//function
    
    this.processKeyInput = function(e){
        if ( e.keyCode == 68 ) { //d

        }
        else if ( e.keyCode == 65 ) { //a

        }

    }
        
    this.update = function(){
        
        this.container_activePlayer.innerHTML = this.activePlayer.name +"s turn";
        
        this.container_points_player1.innerHTML = this.players[0].points+" - "+this.players[0].name;
        this.container_points_player2.innerHTML = this.players[1].points+" - "+this.players[1].name;
        
        
        
       if(this.promptNextPlayer){
           //wait for animations
           
           var tRef = this;
           
           //setTimeout(function(){
            
                tRef.showPopUp("Next player");
            //}, 1000);
       }
        
       if(this.selectedCard1 != null && this.selectedCard2 != null){
           
           if(this.selectedCard1.index == this.selectedCard2.partnerIndex){
               this.activePlayer.receivePoint();
               
               this.selectedCard1 = null;
               this.selectedCard2 = null;
               
               if(this.isGameFinished()){
                   this.showWinner();
               }
           }
           else{
            
               if(this.playerSwitchConfirmed){
                   
                  this.nextPlayer();
               
                   this.selectedCard1.close();
                   this.selectedCard2.close();

                   this.selectedCard1 = null;
                   this.selectedCard2 = null;
                   
                   this.promptNextPlayer = false;
                   this.playerSwitchConfirmed = false;
                   
                   this.hidePopUp();
                   
               }
               else if (!this.promptNextPlayer ){
                   this.promptNextPlayer = true;  
                   this.playerSwitchConfirmed = false;
               }
                           
           }
           
       }
    }
    
    this.bodyClick = function(){
        if(this.promptNextPlayer){
           this.playerSwitchConfirmed = true;
        }
    }
    
    this.debugInfo = function(text){
        
        var container = document.getElementById('debugInfoContainer');
        container.innerHTML = text;              
    }
    
    
    
    this.isFinished = function(){
        return this.gameFinished;        
    }
    
    this.shuffle = function(a) {
        
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    
    this.nextPlayer = function(){
        
        this.activePlayerIndex++;
        if(this.activePlayerIndex >= this.players.length){
            this.activePlayerIndex = 0;
        }
        this.activePlayer = this.players[this.activePlayerIndex];
    }
    
    this.showPopUp = function(text){
        this.container_popup.style = "";
        this.container_popup.innerHTML = text;
    }
    
    this.hidePopUp = function(){
        this.container_popup.style = "display:none";
    }
    
    
    this.isGameFinished = function(){
        
        for(var i = 0; i < this.cards.length; i++){                
            var cur_card = this.cards[i];
            if(!cur_card.opened){
                return false;   
            }
        }        
        return true;
    }
    
    
    this.showWinner = function(){
        var tmp = this.players[0];
        
        for(var i = 1; i < this.players.length; i++){
            
            var playr = this.players[i];
            if(playr.points > tmp.points){
                tmp = playr;
            }
        }
        
        this.showPopUp(tmp.name+" wins!");
    }
    
}//class

function MemoryCard (index, partIndex) {

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.opened = false;
    this.cardBack = document.getElementById('img_card_back');
    this.imageID = null;
    this.elementID = null;
    this.openImage = null;
    
    this.index = index;
    this.partnerIndex = partIndex;
    this.open_transition;
    
    this.elementReference = null;
    
    this.containsPoint = function (x, y) {
        return this.x <= x && x <= this.x + this.width &&
               this.y <= y && y <= this.y + this.height;
    }

    this.drawCard = function (context) {
        
        var cWidth = this.width;
        var cHeight = this.height;
        
        //if(this.open_transition){
        //    
        //}
        
        if(!this.opened){
            context.fillStyle = this.calcRGB(175,175,175);
            
            roundRect(context,this.x, this.y, cWidth,cHeight,15,true,false);
            
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.cardBack,this.x, this.y,cWidth,cHeight);
        }
        else{
            if(this.imageID != null){
                 context.drawImage(this.imageID, this.x, this.y,cWidth,cHeight);
            }
            else{
                context.fillStyle = this.calcRGB(this.r,this.g,this.b);
                roundRect(context,this.x, this.y, this.width, this.height,15,true,false);
            }
        }
    }
    
    this.open = function(){
        this.opened = true;
        //this.open_transition = true;
        
        
        this.elementReference.style.transform = "rotateY(180deg)";

        var elt = this.elementReference;
        var imgRef = this.openImage;
        
        setTimeout(function(){
            
                elt.style.backgroundImage = "url('"+imgRef+"')";
            }, 
           350); //same time as animation length
        
        //alert("open card "+this.elementID);
    }
    
    this.close = function(){
        this.opened = false;
        this.elementReference.style = "";
    }
    
    this.calcRGB = function(r, g, b){
        return ["rgb(",r,",",g,",",b,")"].join("");
    }
}


function MemoryPlayer (playerName) {

    this.name = playerName;
    this.points = 0;

    
    this.receivePoint = function () {
        this.points++;
    }

}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}