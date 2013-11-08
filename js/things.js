$(function() {
    function card(number, quote, author, episode) {
        this.number=number;
        this.quote=quote;
        this.author=author;
        this.episode=episode;
        this.inplay=false;
        this.played=false;
        this.discarded=false;
        this.rightcount=0;
        this.wrongcount=0;
    }
    
    function player(number,name) {
        this.number=number;
        this.name=name;
        this.score=0;
        votedwrong=false;
        votedright=false;
    }
    var Player1=new player(1,"Jeremy Fernandez");
    var Player2=new player(2,"VARZENDEH!!!");
    var Player3=new player(3,"Humid Researcher");
    var Player4=new player(4,"Hate Is Man");
    
    myPlayer = Player2;
    
    var Card1=new card(1,"Clowns aer sexy.", "Sofonda Silicone", 113);
    var Card2=new card(2,"Not being turned on by bugs is unnatural", "Bugger", 95);
    var Card3=new card(3,"Liverpool fc is the best football team ever","lukepa",90);
    var Card4=new card(4,"JRR Tolkein might have been into mudding","Lomax",82);
    var Card5=new card(5,"We don't know what makes people fat","unattributed",89);
    var Card6=new card(6,"Slavery did not exist in America","Free Free",79);
    var Card7=new card(7,"I was having sex with my ladyfriend and we're both prego","Snuffleboo",79);
    var Card8=new card(8,"A boy gets married with a girl and they both can't hump","234567890",79);
    var Card9=new card(9,"Car never change since automobile invention","Thien63",94);
    var Card10=new card(10,"I am fully capable of going backwards and forwards in time and at will","Deus Ex Machina 42",75);
    var Card11=new card(11,"The first polio vaccine, the Salk vaccine, was a total disaster","mamakay",92);
    var Card12=new card(12,"The formation of planets is a lie. Climate science is a lie.","mnemeth1",75);
    var Card13=new card(13, "Two-Dimoensional love is controversial, yet not psychologically, philosophically or biologically wrong","anonymous",74);
    var Card14=new card(14,"Interpreters say there is no difference between night dreams and daytime dreams except about elephant.","Varzandeh",73);
    var Card14=new card(15,"[Dolphins] know how to access multiple dimensions.","Joan Ocean",65);
    var Card16=new card(16,"It is legal to post nude photos of someone without their consent","unattributed",64);
    var Card17=new card(17,"Laura Ingalls Wilder is God.","John Charles Wilson",30);
    var Card18=new card(18,"Disney’s Roadside Romeo has opened in India and it’s a huge hit. Let me repeat that: It’s a HUGE HIT.","Amid Amidi",36);
    var Card19=new card(19,"Frozen cum is a refreshing summer treat","cumpantyboy",63);
    var Card20=new card(20,"A beautiful woman is like a wild horse; she will need to be tamed before you can enjoy each other’s company.","ewokdisco",35);
    var Card21=new card(21,"a toilet is becoming a completely foreign object to women.","antifeministtech.info",103);
    var Card22=new card(22,"I think the logical thing is for the company to provide the male bosses with a prostitution expense account","unattributed",103);
    var Card23=new card(23,"Obama told children to take away my money","TigerMegatron",9);
    var Card24=new card(24,"polio (the actual polio virus) was never the plague it was made out to be.","mamakay",92);
    var Card25=new card(25,"The Kardashians are in league with Al-Qaeda","Johnathan Lee Riches",80);
    var Card26=new card(26,"many bad boys are overweight or otherwise physically unattractive.","Love Shy Wiki",114);
    var Card27=new card(27,"The Latino people have never had a revolution","femalepharoe",75);
    var Card28=new card(28,"Che Guevara failed spectacularly at everything he attempted in his life.","Conservapedia",15);
    var Card29=new card(29,"Homosexual bait-and-switch is a technique used by covert homosexuals to convert heterosexuals to homosexuality, using deceit and powerful mind-control techniques.","GeorgeE",15);
    var Card30=new card(30,"Light creates gravity. Since photons from the sky do not have mass their bombardment doesn't hurt, but they don't let you jump very high either.","Smithjustinb",75);
    var Card31=new card(31,"Elisha Cuthbert has to pee sometimes, and that's hot.","Spurting",84);
    var Card32=new card(32,"I want to punch a hippo right there in the face. He wouldn't even feel it, but I'd feel fuckin' ace.","nevski pazza",85);
    var Card33=new card(33,"In alternate universes, mirror images of yourself are living out their lives, just as you are.","Burt Goldman",104);
    var Card34=new card(34,"Everything will be okay if you just let me yiff the otter.","nekobe",100);
    var Card35=new card(35,"Light is the most basic corrosive we know","theRhenn",35);
    var Card36=new card(36,"Pour vegetable oil and flour into a baking dish and microwave at 70% power for 6 minutes. This will create a white roux","flatscat",26);
    var Card37=new card(37,"There is a way you can be a wizard in reality.","wikihow",44);
    var Card38=new card(38,"Most people are not intellectual enough to understand Family Guy, making it superior.",90);
    var Card39=new card(39,"The smell of fresh pee isn't nasty and the residual dry smell is like a perfume.","Humidresearcher",52);
    var Card40=new card(40,"Forums are like the herpes of the internet","WillieDangDoodle",108);
    var Card41=new card(41,"There is no such thing as a “best” when it comes to sports or sports teams. It would take away the ability of people to have opinions.","Bangbangcoconut",90);

    var deckcount = 41;
    var discardcount = 0;

    //**********************//
    function DrawCard(players) {
        for (var i=1;i<(players+1);i++){ 
            var num = Math.floor((Math.random()*41)+1);
            randomcard = eval('Card'+num);
            drawncard = "Card"+randomcard.number;
            if (randomcard.inplay === true || randomcard.discarded === true) {
                DrawCard(i--);
            } else {
                $('#Hand'+i).attr('data-deck',drawncard);
                //alert();
                $('#Hand'+i).children('span').children('.series').text(randomcard.number);
                $('#Hand'+i).children('.quote').text(randomcard.quote);
                $('#Hand'+i).children('small').children('.author').text(randomcard.author);
                $('#Hand'+i).children('small').children('cite').text(randomcard.episode);
                randomcard.inplay=true;
                deckcount--
            }
        }
        $('.indeck .count').text(deckcount);
        $('.discarded .count').text(discardcount);
    }
    
    function nextRoundCheck() {
        if (myPlayer.votedright===true && myPlayer.votedwrong===true) {
            $('#NextRound').removeAttr('disabled');    
        }
    }
    
    function newRound(players) {
        DrawCard(4);
        $('.card').removeClass('marked right wrong');
        $('.card button').show();
    }
    
    
    $('.card button.wrong').click(function() {
        markcard = eval($(this).parent().attr('data-deck'));
        markcard.wrongcount++
        $(this).parent('.card').addClass('marked wrong');
        $(this).parent('.card').children('button').hide();
        $('.card button.wrong').hide();
        myPlayer.votedwrong = true;
        nextRoundCheck();
        
        
        //This needs to be more complex. Here's the simplified version....
        markcard.played=true;
        markcard.discarded=false;
        markcard.inplay=false;
        deckcount++
    });
    $('.card button.right').click(function() {
        markcard = eval($(this).parent().attr('data-deck'));
        markcard.rightcount++
        $(this).parent('.card').addClass('marked right');
        $(this).parent('.card').children('button').hide();
        $('.card button.right').hide();
        myPlayer.votedright=true;
        nextRoundCheck();
        
        //This needs to be more complex. Here's the simplified version....
        markcard.played=true;
        markcard.discarded=true;
        markcard.inplay=false;
        discardcount++
    });
    
    $('#NextRound').click(function() {
       newRound(); 
    });
    
    
    DrawCard(4);
});
