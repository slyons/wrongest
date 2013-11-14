/* jshint strict: false */
/*global $:false */
/*jshint -W061 */
/*jshint -W065 */ //Missing radix parameter
/*jshint devel:true */

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
        this.score=0;
        this.votesagainst=0;
        this.votesfor=0;
    }
    
    function player(number,name) {
        this.number=number;
        this.name=name;
        this.score=0;
        this.votedwrong=false;
        this.votedright=false;
    }
    $('.card button').hide();
    
    
    // Set up default players.
    var Player1=new player(1,"Jeremy Fernandez");
    var Player2=new player(2,"Hate Is Man");
    var Player3=new player(3,"Humid Researcher");
    var Player4=new player(4,"Varzandeh");
    
    var myPlayer = Player2;
    $('#NextRound').attr('disabled','disabled');
    
    var Deck = [
    new card(1,"Clowns aer sexy.", "Sofonda Silicone", 113),
    new card(2,"Not being turned on by bugs is unnatural", "Bugger", 95),
    new card(3,"Liverpool fc is the best football team ever","lukepa",90),
    new card(4,"JRR Tolkein might have been into mudding","Lomax",82),
    new card(5,"We don't know what makes people fat","unattributed",89),
    new card(6,"Slavery did not exist in America","Free Free",79),
    new card(7,"I was having sex with my ladyfriend and we're both prego","Snuffleboo",79),
    new card(8,"A boy gets married with a girl and they both can't hump","234567890",79),
    new card(9,"Car never change since automobile invention","Thien63",94),
    new card(10,"I am fully capable of going backwards and forwards in time and at will","Deus Ex Machina 42",75),
    new card(11,"The first polio vaccine, the Salk vaccine, was a total disaster","mamakay",92),
    new card(12,"The formation of planets is a lie. Climate science is a lie.","mnemeth1",75),
    new card(13, "Two-Dimoensional love is controversial, yet not psychologically, philosophically or biologically wrong","anonymous",74),
    new card(14,"Interpreters say there is no difference between night dreams and daytime dreams except about elephant.","Varzandeh",73),
    new card(15,"[Dolphins] know how to access multiple dimensions.","Joan Ocean",65),
    new card(16,"It is legal to post nude photos of someone without their consent","unattributed",64),
    new card(17,"Laura Ingalls Wilder is God.","John Charles Wilson",30),
    new card(18,"Disney’s Roadside Romeo has opened in India and it’s a huge hit. Let me repeat that: It’s a HUGE HIT.","Amid Amidi",36),
    new card(19,"Frozen cum is a refreshing summer treat","cumpantyboy",63),
    new card(20,"A beautiful woman is like a wild horse; she will need to be tamed before you can enjoy each other’s company.","ewokdisco",35),
    new card(21,"a toilet is becoming a completely foreign object to women.","antifeministtech.info",103),
    new card(22,"I think the logical thing is for the company to provide the male bosses with a prostitution expense account","unattributed",103),
    new card(23,"Obama told children to take away my money","TigerMegatron",9),
    new card(24,"polio (the actual polio virus) was never the plague it was made out to be.","mamakay",92),
    new card(25,"The Kardashians are in league with Al-Qaeda","Johnathan Lee Riches",80),
    new card(26,"many bad boys are overweight or otherwise physically unattractive.","Love Shy Wiki",114),
    new card(27,"The Latino people have never had a revolution","femalepharoe",75),
    new card(28,"Che Guevara failed spectacularly at everything he attempted in his life.","Conservapedia",15),
    new card(29,"Homosexual bait-and-switch is a technique used by covert homosexuals to convert heterosexuals to homosexuality, using deceit and powerful mind-control techniques.","GeorgeE",15),
    new card(30,"Light creates gravity. Since photons from the sky do not have mass their bombardment doesn't hurt, but they don't let you jump very high either.","Smithjustinb",75),
    new card(31,"Elisha Cuthbert has to pee sometimes, and that's hot.","Spurting",84),
    new card(32,"I want to punch a hippo right there in the face. He wouldn't even feel it, but I'd feel fuckin' ace.","nevski pazza",85),
    new card(33,"In alternate universes, mirror images of yourself are living out their lives, just as you are.","Burt Goldman",104),
    new card(34,"Everything will be okay if you just let me yiff the otter.","nekobe",100),
    new card(35,"Light is the most basic corrosive we know","theRhenn",35),
    new card(36,"Pour vegetable oil and flour into a baking dish and microwave at 70% power for 6 minutes. This will create a white roux","flatscat",26),
    new card(37,"There is a way you can be a wizard in reality.","wikihow",44),
    new card(38,"Most people are not intellectual enough to understand Family Guy, making it superior.",90),
    new card(39,"The smell of fresh pee isn't nasty and the residual dry smell is like a perfume.","Humidresearcher",52),
    new card(40,"Forums are like the herpes of the internet","WillieDangDoodle",108),
    new card(41,"There is no such thing as a “best” when it comes to sports or sports teams. It would take away the ability of people to have opinions.","Bangbangcoconut",90),
    new card(42,"Gucci Mane best rapper alive","youtube",0),
    new card(43,"The urinal is just for you as a man. It's impossible for her to use it.","The Spearhead",103),
    new card(44,"As of 2002, love went extinct","Msshardy",109),
    new card(45,"Being a juggalo is just like being a normal person","unattributed",21),
    new card(46, "Warhammer 40,000 can make anything awesome.", "this troper", 60),
    new card(47,"There's nothing perverted about sniffing a pretty girl's seatcushon","quaps",66)];
    
    var decksize = 46;  // total number of cards in game
    var deckend = 46;   // index of last available card in deck
    
    var deckcount = 47;
    var discardcount = 0;
    var players = 3;
    var flipcard = 0;

    //**********************//
    
    function startGame() {
        if (players < 3) {
            $('.flip-container.player4').remove();
        }
        if (players < 3) {
            $('.flip-container.player3').remove();
        }
        if (players < 2) {
            $('.flip-container.player2').remove();
        }
        var i=1;
        $('.flipper .back').each(function() {
            $(this).children().children('.playername').text(eval('Player'+i+'.name'));
            i++;
        });
        $('.row.setup').slideUp(200);
        $('.row.allcards').fadeIn(400, function() {
            $('.row.roundcontrol').slideDown(300);
            $('.row.deckinfo').slideDown(300);
        });
        DrawCard(players);
        $('.indeck .count').text(deckcount);
        $('.discarded .count').text(discardcount);
    }
    
    function DrawCard(players) {
        for (var i=1;i<(players+1);i++){ 
            var num = Math.floor((Math.random()*deckend)+0);
            var randomcard = Deck[num];
            while (randomcard.inplay === true || randomcard.discarded === true) {
                num = Math.floor((Math.random()*deckend)+0);
                randomcard = Deck[num];
            }
            var drawncard = Deck[num];
            deckcount--;
            drawncard.inplay = true;
            var currentplayer = eval("Player"+i);
            $('#Back'+i).children().children('.playername').text(currentplayer.name);
            $('#Hand'+i).attr('data-deck',num);
            $('#Hand'+i).children('span').children('.series').text(randomcard.number);
            $('#Hand'+i).children('.quote').text(randomcard.quote);
            $('#Hand'+i).children('.score').text(randomcard.score);
            if (randomcard.quote.length > 75) {
                $('#Hand'+i).children('.quote').addClass('long'); 
            }
            if (randomcard.quote.length > 100) {
                $('#Hand'+i).children('.quote').removeClass('long').addClass('longer'); 
            }
            $('#Hand'+i).children('small').children('.author').text(randomcard.author);
            $('#Hand'+i).children('small').children('cite').text(randomcard.episode);
            
            $('#Statement'+i).children('.quote').text(randomcard.quote);
            $('#Statement'+i).children('.author').text(randomcard.author);                   
        }
    }
    
    function awardPoints(player, votes) {
        $('.front.card').each(function() {
            var votesfor = parseInt($(this).attr('data-votesfor'));
            if (votesfor > 0) {
                //var num = parseInt($(this).attr('data-deck'));
                var playerslot = parseInt($(this).attr('data-player'));
                var thisplayer = eval("Player"+playerslot);
                var multiplier = parseInt($(this).attr('data-score'));
                if (multiplier < 0) {
                    multiplier = Math.abs(multiplier);
                } else {
                    multiplier=1;
                }
                thisplayer.score = thisplayer.score + (1 * multiplier);
                $(this).siblings('.back').children('h3').children('.score').text(thisplayer.score);
            }
        });
    }
    
    function discardStuff() {
        $('.front.card').each(function() {
            var num = parseInt($(this).attr('data-deck'));
            var cardscore = parseInt($(this).attr('data-score'));
            if (cardscore > 0) {
                Deck[num].discarded = true;
                discardcount++;
            } else if (cardscore > -2) {
                var coinflip = Math.floor((Math.random()*3)+1);
                if (coinflip != 2) {
                    Deck[num].discarded = true;
                    discardcount++;
                } else {
                    deckcount++;
                }
            } else {
                // Card has a very low score.
                deckcount++;
            }
            Deck[num].inplay=false;
            Deck[num].votesfor=0;
            Deck[num].votesagainst=0;
            $(this).removeAttr('data-deck data-votesagainst data-votesfor data-score');
            $('.indeck .count').text(deckcount);
            $('.discarded .count').text(discardcount);
        });
    }
    
    function nextRoundCheck() {
        if (myPlayer.votedright===true && myPlayer.votedwrong===true) {
            $('#NextRound').removeAttr('disabled');    
        }
    }
    
    function newRound(players) {
        $('.quote').removeClass('long longer');
        $('.flip-container').removeClass('flipped active');
        $('#NextRound').attr('disabled','disabled');
        $('#HitMe').removeAttr('disabled');
        $('.card').removeClass('marked right wrong');
        $('.card button').hide();
        myPlayer.votedwrong = false;
        myPlayer.votedright = false;
        awardPoints();
        discardStuff();
        DrawCard(players);
    }
    
    $('#NumberofPlayers').blur(function() {
        if ($(this).val() > 4) {
            alert('current limit is 4 players');
            $(this).val(3);
        } else if ($(this).val() < 1) {
            alert("You can't have less than 1 players, idiot");
            $(this).val(1);
        } else if ($(this).val() == 4) {
            $('.player-signin.player2, .player-signin.player3, .player-signin.player4').fadeIn(300);
        } else if ($(this).val() == 3) {
            $('.player-signin.player4').fadeOut(300);
            $('.player-signin.player2, .player-signin.player3').fadeIn(300);
            players = 2;
        } else if ($(this).val() == 2) {
            $('.player-signin.player3, .player-signin.player4').fadeOut(300);
            $('.player-signin.player2').fadeIn(300);
            players = 2;
        } else if ($(this).val() == 1) {
            $('.player-signin.player4, .player-signin.player3, .player-signin.player2').fadeOut(300);
            players = 1;
        } else {
            alert($(this).val());
        }
    });
    
    $('#StartGame').click(function() {
        if ($('#Player1Name').val() !== "") {
            Player1.name=$('#Player1Name').val();
        }
        if ($('#Player2Name').val() !== "") {
            Player2.name=$('#Player2Name').val();
        }
        if ($('#Player3Name').val() !== "") {
            Player3.name=$('#Player3Name').val();
        }
        if ($('#Player4Name').val() !== "") {
            Player3.name=$('#Player4Name').val();
        }
        players = $('#NumberofPlayers').val();
        startGame();
    });
    
    $('.flip-container').click(function() {
        if (!$(this).hasClass('flipped')) {
            $(this).toggleClass('active');
            $(this).siblings('.flip-container').removeClass('active');
        }
    });
    
    $('.card button.wrong').click(function() {
        var cardnum = parseInt($(this).parent().attr('data-deck'));
        var markcard = Deck[cardnum];
        markcard.wrongcount++;
        $(this).parent('.card').addClass('marked wrong');
        //$(this).parent('.card').children('button').hide();
        //$('.card button.wrong').hide();
        myPlayer.votedwrong = true;
        markcard.score--;
        markcard.votesagainst++;
        $(this).parent('.card').attr('data-votesagainst',markcard.votesagainst);
        $(this).parent('.card').attr('data-score',markcard.score);
        $(this).parent('.card').children('.score').text(markcard.score);
        nextRoundCheck();
    });
    $('.card button.right').click(function() {
        var cardnum = parseInt($(this).parent().attr('data-deck'));
        var markcard = Deck[cardnum];
        markcard.rightcount++;
        $(this).parent('.card').addClass('marked right');
        //$(this).parent('.card').children('button').hide();
        //$('.card button.right').hide();
        myPlayer.votedright=true;
        markcard.score++;
        markcard.votesfor++;
        $(this).parent('.card').attr('data-votesfor',markcard.votesfor);
        $(this).parent('.card').attr('data-score',markcard.score);
        $(this).parent('.card').children('.score').text(markcard.score);
        nextRoundCheck();
    });
    
    $('#HitMe').click(function() {
        $('.card button').fadeIn(800);
        $('.flip-container').removeClass('active hover');
        $('.flip-container').addClass('flipped');
        $(this).attr('disabled','disabled');
    });
    $('#NextRound').click(function() {
       newRound(players); 
    });
});
