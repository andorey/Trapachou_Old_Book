// $(document).ready(function () {
$(window).on('load', function (e) {

    class Hand {
        constructor(selector) {
            this.$hand = $(selector);
            this.handArr = [];
            this.$line = this.$hand.children('.main_hand');
            this.$counter = this.$hand.children('.counter');
            this.counter = {points: 0, altPoints: 0};
            this.splitted = false;
            this.pot = 0;
            this.potIns = 0;
            this.$pot = this.$hand.children('.hand_pot');
            this.$insPot = this.$hand.children('.ins_pot');
        }

        clearHand() {
            this.handArr = [];
            this.counter = {points: 0, altPoints: 0};
            this.splitted = false;
            this.$line.html('');
            this.hidePoints();
            this.pot = 0;
            this.potIns = 0;
            this.$pot.html('');
            this.$pot.removeClass('hand_pot_positive');
            this.$insPot.html('');
            this.$insPot.removeClass('hand_pot_positive');
            this.shineOff();
        }

        hideDealers2() {
            cardsPack.cardFace(this.$hand.children('.main_hand').children('.in_game').eq(1), cardBack);
        }

        showDealers2() {
            var $d2 = this.$hand.children('.main_hand').children('.in_game').eq(1);
            var d2num = +$d2.attr('id').slice(4);
            cardsPack.cardFace($d2, d2num);
        }

        cardTransfer(callback) {
            $player.potDown();
            var card = this.cardTransferArr(shuffledPack);
            this.showTransferredCard(card, callback);
            this.cardAddPoints(card);
        }

        cardTransferArr(orig) {
            var dest = this.handArr;
            var card = orig[0];
            dest.push(card);
            orig.shift();
            return card;
        }

        cardAddPoints(card) {
            var counter = this.counter;
            var $counter = this.$counter;
            var cardsArr = this.handArr;

            if (hasThisRankCard(cardsArr, 1, 13) > 1) {
                counter.points += cards[card - 1].altPoints;
                counter.altPoints += cards[card - 1].altPoints;
            } else {
                counter.points += cards[card - 1].points;
                counter.altPoints += cards[card - 1].altPoints;
            }

            if (counter.points > 21 && counter.points !== counter.altPoints) {
                counter.points = counter.altPoints;
            } else if (counter.points === 21) {
                counter.altPoints = 21;
            }
            showPoints(counter, $counter);

            function showPoints(counter, $counter) {
                var points = counter.points;
                var altPoints = counter.altPoints;
                var str = '';
                if (points === altPoints) {
                    str = points;
                } else {
                    str = points + ' / ' + altPoints;
                }
                $counter.children().html(str);
            }

            function hasThisRankCard(arr, card, inRow) {
                var result = 0;
                arr.forEach(function (elem) {
                    if (elem % inRow === card) {
                        result++;
                    }
                });
                return result;
            }
        }

        hidePoints() {
            this.$counter.css('display', 'none');
        }

        hidePots() {
            this.$pot.html('');
            this.$insPot.html('');
        }

        unHidePoints() {
            this.$counter.css('display', 'block');
        }

        getCardPoint(num) {
            var card = this.handArr[num - 1];
            return cards[card - 1].points;
        }

        getPoints() {
            return this.counter.points;
        }

        hasSplitted() {
            return this.splitted;
        }

        getNumberOfCards() {
            return this.handArr.length;
        }

        animChangePot($elem) {
            $elem.effect('bounce', {distance: 10, times: 1}, 100);
        }

        changePot(newPot) {
            this.pot = newPot;
            writeYourMoney(this.$pot, newPot, '- $ ');
            this.animChangePot(this.$pot);
        }

        writePize(sum) {
            writeYourMoney(this.$pot, sum, '+ $ ');
            this.$pot.addClass('hand_pot_positive');
            this.animChangePot(this.$pot);
        }

        getPot() {
            return this.pot;
        }

        getPotIns() {
            return this.potIns;
        }

        changePotIns() {
            this.potIns = this.pot / 2;
            writeYourMoney(this.$insPot, this.potIns, '- $ ');
            this.animChangePot(this.$insPot);
        }

        insPositive() {
            writeYourMoney(this.$insPot, this.potIns * 2, '+ $ ');
            this.$insPot.addClass('hand_pot_positive');
            this.animChangePot(this.$insPot);
        }

        insClear() {
            this.potIns = 0;
        }

        shineOn() {
            // this.$counter.css('box-shadow', 'white 0 0 15px 15px');
            this.$hand.css('opacity', '0.7')
        }

        shineOff() {
            // this.$counter.css('box-shadow', 'none');
            this.$hand.css('opacity', '1')
        }

        splitPositionOn() {
            this.$hand.css('left', '-320px');
        }

        splitPositionOff() {
            this.$hand.css('left', '0px');
        }

        potUp() {
            this.$pot.css('top', '400px')
        }

        potDown() {
            this.$pot.css('top', '465px')
        }

        showTransferredCard(card, callback) {
            var $hand = this.$hand;
            var $line = this.$line;
            var handArr = this.handArr;
            var counter = this.counter;
            var $counter = this.$counter;

            $line.append('<div class="cards in_game" id="' + 'card' + card + '"></div>');
            var $card = $('#card' + card);
            var zeroLeft = 0;
            if ($hand.attr('id') === 'player_line' && $player.hasSplitted()) {
                zeroLeft = 320;
            }
            $card.css({
                'left': 719 + zeroLeft + 'px',
                'top': '-130px',
                'transform': 'rotate(30deg)'
            });
            if ($hand.attr('id') === 'dealer_line' && handArr.length === 2) {
                $dealer.hideDealers2();
            } else {
                cardsPack.cardFace($card, card);
            }
            var newCoords = getCoordsToMove();
            var left = newCoords.left;
            var top = newCoords.top;
            var transform = newCoords.transform;
            var cardAnim = $card.get(0);

            var anim1 = anime({
                targets: cardAnim,
                left: left,
                rotate: transform,
                top: top,
                easing: 'easeOutCirc',
                duration: 200,
                complete: function () {
                    // cardAddPoints(card, counter, $counter, handArr);
                    callback();
                }
            });
            function getCoordsToMove() {
                var zero, left, top, transform;
                if ($hand.attr('id') === 'dealer_line') {
                    zero = coords.dealer;
                } else if ($hand.attr('id') === 'player_line') {
                    zero = coords.player;
                } else if ($hand.attr('id') === 'player_line_spl') {
                    zero = coords.playerSpl;
                }
                left = zero.left + zero.step * (handArr.length - 1);
                top = zero.top;
                transform = cards[card - 1].degree;
                return {left: left, top: top, transform: transform}
            }
        }

    }

    class PlayButtons {
        constructor() {
            this.$all = $('.buttons');
            this.$play = $('#btn_play');
            this.$deal = $('#btn_deal');
            this.$insure = $('#btn_ins');
            this.$insureNot = $('#btn_ins_not');
            this.$split = $('#btn_split');
            this.$keep = $('#btn_keep');
            this.$hit = $('#btn_hit');
            this.$hitSpl = $('#btn_hit_spl');
            this.$double = $('#btn_double');
            this.$doubleSpl = $('#btn_double_spl');
            this.$stand = $('#btn_stand');
            this.$standSpl = $('#btn_stand_spl');
            this.$max = $('#btn_max');
            this.$flat = $('#btn_flat');
            this.$repeat = $('#btn_repeat');
            this.$clear = $('#btn_clear');
            this.$chips = $('.chip');
            this.$playAgain = $('#btn_play_again');
        }
        activateButtons() {
            var self = this;
            this.$play.click(function () {
                self.animButton($(this), self.clear);
            });
            this.$deal.click(function () {
                self.animButton($(this), function () {
                    betRound = betPre;
                    btnsPlay.checkForDisable();
                    self.afterDeal();
                });
            });
            this.$insure.click(function () {
                if (betRound / 2 <= money) self.animButton($(this), function () {
                    money -= betRound / 2;
                    reWriteYourMoney();
                    $player.changePotIns();
                    self.checkD2();
                });
            });
            this.$insureNot.click(function () {
                self.animButton($(this), self.checkD2);
            });
            this.$split.click(function () {
                if (betRound <= money) self.animButton($(this), function () {

                    btnsPlay.activateCompare();
                    money -= betRound;
                    reWriteYourMoney();
                    $playerSpl.changePot(betRound);
                    $playerSpl.handArr.push($player.handArr[1]);
                    $player.handArr.pop();
                    $player.counter.points = cards[$player.handArr[0] - 1].points;
                    $player.counter.altPoints = cards[$player.handArr[0] - 1].altPoints;
                    $playerSpl.counter.points = cards[$playerSpl.handArr[0] - 1].points;
                    $playerSpl.counter.altPoints = cards[$playerSpl.handArr[0] - 1].altPoints;
                    $player.$line.children('.in_game').last().appendTo($playerSpl.$line);
                    $player.splitted = true;
                    $player.splitPositionOn();
                    $player.cardTransfer(function () {
                        $playerSpl.cardTransfer(function () {
                            $playerSpl.unHidePoints();
                            $player.shineOff();
                            $playerSpl.shineOn();
                            standartPlay(1);
                        });
                    });
                });
            });
            this.$keep.click(function () {
                self.animButton($(this), function () {
                    standartPlay(1);
                });
            });
            this.$hit.click(function () {
                self.animButton($(this), function () {
                    self.hitting(1);
                });
            });
            this.$hitSpl.click(function () {
                self.animButton($(this), function () {
                    self.hitting(2);
                });
            });
            this.$stand.click(function () {
                self.animButton($(this), function () {
                    checkSplitted(1);
                });
            });
            this.$standSpl.click(function () {
                self.animButton($(this), function () {
                    checkSplitted(2);
                });
            });
            this.$double.click(function () {
                if (betRound <= money) self.animButton($(this), function () {
                    self.doubling(1);
                });
            });
            this.$doubleSpl.click(function () {
                if (betRound <= money) self.animButton($(this), function () {
                    self.doubling(2);
                });
            });
            this.$max.click(function () {
                self.animButton($(this), function () {
                    betRound = money;
                    self.putBet();
                    self.afterDeal();
                });
            });
            this.$flat.click(function () {
                self.animButton($(this), function () {
                    var flat = Math.ceil(money * 0.05);
                    if (money < 1) {
                        flat = money;
                    }
                    betRound = flat;
                    self.putBet();
                    self.afterDeal();
                });
            });
            this.$repeat.click(function () {
                self.animButton($(this), function () {
                    self.putBet();
                    self.afterDeal();
                });
            });
            this.$clear.click(function () {
                self.animButton($(this), function () {
                    money += betPre;
                    reWriteYourMoney();
                    $player.changePot(0);
                    startBets();
                });
            });
            this.$chips.click(function () {
                var $self = $(this);
                $self.effect('highlight', {color: '#ffffff'}, 100, function () {
                    // chipping(+$self.attr('data-value'));

                    var value = +$self.attr('data-value');

                    if (betPre === 0) {
                        btnsPlay.activateConfirmChips();
                    }
                    betPre += value;
                    money -= value;
                    btnsPlay.checkChipsForShow();
                    reWriteYourMoney();
                    $player.changePot(betPre);
                });
            });
            this.$playAgain.click(function () {
                self.animButton($(this), function () {
                    $summary.css('display', 'none');
                    shuffledPack = cardsPack.getShuffledPack(cards.length);
                    money = 5000;
                    betRound = 0;
                    betPre = 0;
                    writeYourMoney($moneyText, money, '$ ');
                    prize1 = 0;
                    prize2 = 0;
                    startPlay();
                });
            });
        }
        clear() {
            var self = this;
            btnsPlay.activateCompare();

            money += prize1 + prize2;
            money += $player.getPotIns() * 2;
            reWriteYourMoney();
            $summary.css('display', 'none');
            $dealer.hidePoints();
            $player.hidePoints();
            $playerSpl.hidePoints();
            $dealer.hidePots();
            $player.hidePots();
            $playerSpl.hidePots();

            allCardsOff(function () {

                if (money > 0) {
                    if (betRound > money) {
                        betRound = 0;
                    }
                    startBets();
                } else {
                    $summaryText.html('Game over!');
                    $summary.css('display', 'block');
                    btnsPlay.gameOver();
                }

                $dealer.clearHand();
                $player.clearHand();
                $playerSpl.clearHand();
                cardsPack.cardFace($cardsDeck_played, cardBack);

                if (shuffledPack.length < 21) {
                    shuffledPack = cardsPack.getShuffledPack(cards.length);
                }
                if (shuffledPack.length === 52) {
                    cardsPack.cardFace($cardsDeck_played, 65);
                }

                $player.splitPositionOff();
                btnsPlay.checkChipsForShow();
            });

            function allCardsOff(callback) {

                var allCards = $('.in_game');
                if (allCards.length === 0) {
                    callback();
                } else {
                    allCards.each(function () {
                        var zeroLeft = 0;
                        var $self = $(this);
                        var self = $self.get(0);

                        var anim2 = anime({
                            targets: self,
                            left: -131 + zeroLeft,
                            rotate: '1turn',
                            top: -190,
                            easing: 'linear',
                            duration: 400,
                            complete: function () {
                                // cardAddPoints(card, counter, $counter, handArr);
                                callback();
                            }
                        });
                    });
                }
            }
        }
        checkD2() {
            var self = this;
            var d2 = $dealer.getCardPoint(2);
            if (d2 === 10) {
                if ($player.getPotIns() > 0) {
                    $player.insPositive();
                    //pay on the clear
                }
                $dealer.showDealers2();
                $dealer.unHidePoints();
                compare();
            } else {
                $player.insClear();
                self.checkPPs();
            }
        }
        afterDeal() {
            var self = this;
            $chips.css('display', 'none');
            $sliderButtons.css('display', 'none');
            btnsPlay.activateCompare();
            $player.potDown();
            $player.cardTransfer(function () {
                $dealer.cardTransfer(function () {
                    $player.cardTransfer(function () {
                        $dealer.cardTransfer(function () {

                            // $dealer.hideDealers2();
                            $player.unHidePoints();

                            checkD1();
                        });
                    });
                });
            });

            function checkD1() {
                var d1 = $dealer.getCardPoint(1);
                if (d1 === 11) {
                    btnsPlay.activateInsuring();
                } else if (d1 === 10) {
                    checkD2_1();
                } else {
                    self.checkPPs();
                }

                function checkD2_1() {
                    var d2 = $dealer.getCardPoint(2);
                    if (d2 === 11) {
                        $dealer.showDealers2();
                        $dealer.unHidePoints();
                        compare();
                    } else {
                        self.checkPPs();
                    }
                }
            }
        }
        putBet() {
            money -= betRound;
            reWriteYourMoney();
            $player.changePot(betRound);
        }
        doubling(handNum) {
            btnsPlay.activateCompare();
            money -= betRound;
            reWriteYourMoney();
            hand(handNum).changePot(betRound * 2);
            hand(handNum).cardTransfer(function () {
                checkSplitted(handNum);
            });
        }
        hitting(handNum) {
            btnsPlay.activateCompare();
            hand(handNum).cardTransfer(function () {
                checkPps_1(handNum);
            });

            function checkPps_1(handNum) {
                var points = hand(handNum).getPoints();
                if (points < 21) {
                    btnsPlay.activateHitStand(handNum);
                } else {
                    checkSplitted(handNum);
                }
            }
        }
        checkPPs() {
            var points = $player.getPoints();
            if (points === 21) {
                $dealer.showDealers2();
                $dealer.unHidePoints();
                compare();
            } else {
                play();
            }

            function play() {
                if (!$player.hasSplitted() && $player.getCardPoint(1) === $player.getCardPoint(2)) {
                    btnsPlay.activateSplit();
                } else {
                    standartPlay(1);
                }
            }
        }
        animButton($elem, func) {
            $elem.effect('highlight', {color: '#ffffff'}, 150, function () {
                func();
            });
        }
        activateStartPlay() {
            this.$all.css('display', 'none');
            this.$play.css('display', 'inline-block');
        }
        activateDeal() {
            this.$all.css('display', 'none');
            this.$deal.css('display', 'inline-block');
        }
        activateInsuring() {
            this.$all.css('display', 'none');
            this.$insure.css('display', 'inline-block');
            this.$insureNot.css('display', 'inline-block');
        }
        activateCompare() {
            this.$all.css('display', 'none');
        }
        activateSplit() {
            this.$all.css('display', 'none');
            this.$split.css('display', 'inline-block');
            this.$keep.css('display', 'inline-block');
        }
        activateHitStand(handNum) {
            this.$all.css('display', 'none');
            if (handNum === 2) {
                this.$hitSpl.css('display', 'inline-block');
                this.$standSpl.css('display', 'inline-block');
            } else {
                this.$hit.css('display', 'inline-block');
                this.$stand.css('display', 'inline-block');
            }
        }
        activateStandartPlay(handNum) {
            this.activateHitStand(handNum);
            if (handNum === 2) {
                this.$doubleSpl.css('display', 'inline-block');
            } else {
                this.$double.css('display', 'inline-block');
            }
        }
        checkForDisable() {
            if (betRound > money) {
                this.$split.addClass('btn_disable');
                this.$double.addClass('btn_disable');
                this.$doubleSpl.addClass('btn_disable');

                if (betRound / 2 > money) {
                    this.$insure.addClass('btn_disable');
                } else {
                    this.$insure.removeClass('btn_disable');
                }
            } else {
                this.$split.removeClass('btn_disable');
                this.$double.removeClass('btn_disable');
                this.$doubleSpl.removeClass('btn_disable');
                this.$insure.removeClass('btn_disable');
            }
        }
        gameOver() {
            this.$all.css('display', 'none');
            this.$playAgain.css('display', 'inline-block');
        }
        activateBets() {
            this.$all.css('display', 'none');
            this.$max.css('display', 'inline-block');
            this.$flat.css('display', 'inline-block');
            this.$repeat.css('display', 'inline-block');
        }
        activateBets0() {
            this.$all.css('display', 'none');
            this.$max.css('display', 'inline-block');
            this.$flat.css('display', 'inline-block');
        }
        activateConfirmChips() {
            this.$all.css('display', 'none');
            this.$clear.css('display', 'inline-block');
            this.$deal.css('display', 'inline-block');
        }
        checkChipsForShow() {
            this.$chips.each(function () {
                var $self = $(this);
                var value = +$self.attr('data-value');
                if (money < value && $self.parent().css('display') === 'none') {
                    $self.css('display', 'none');
                } else if (money < value && $self.css('display') === 'inline-block') {
                    $self.effect('fade', 200, function () {
                        $self.css('display', 'none');
                    });
                } else if (money < value) {
                    $self.css('display', 'none');
                } else {
                    $self.css('display', 'inline-block');
                }
            });
        }
    }

    class Cards {
        constructor() {
            this.suits = ['s', 'h', 'c', 'd'];
            this.ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'j', 'q', 'k'];
            this.points = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
            this.degrees = [3, -5, 1, -4, 0, -2, 2, -3, 0, 5, 4, -1, 0];
        }
        getCards() {
            var cards = [];
            var number = 0;
            for (var i = 0; i < this.suits.length; i++) {
                for (var j = 0; j < this.ranks.length; j++) {
                    number++;
                    var altPoint;
                    if (this.points[j] === 11) {
                        altPoint = 1;
                    } else {
                        altPoint = this.points[j];
                    }
                    var card = {
                        suit: this.suits[i],
                        rank: this.ranks[j],
                        points: this.points[j],
                        altPoints: altPoint,
                        id: this.suits[i] + this.ranks[j],
                        number: number,
                        degree: this.degrees[j]
                    };
                    cards.push(card);
                }
            }
            return cards;
        }
        cardFace($elem, num) {
            var coords = getSpriteCoordsForCard(131, 190, this.ranks.length, num);
            $elem.css('background-position', coords.x + 'px ' + coords.y +'px');
        }
        getShuffledPack(cards) {
            var pack = [];
            var card = getRandomInt(1, cards);
            pack.push(card);
            for (var i = 0; i < cards - 1; i++) {
                card = getUnique(pack, cards);
                pack.push(card);
            }
            return pack;
            function getUnique(arr, nums) {
                var num = getRandomInt(1, nums);
                if (isUnique(arr, num)) {
                    return num;
                } else {
                    return getUnique(arr, nums);
                }
                function isUnique(arr, num) {
                    for (var i = 0; i < arr.length; i++) {
                        if (num === arr[i]) return false;
                    }
                    return true;
                }
            }
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
    }

    class Chips {
        constructor(selector) {
            this.chipsNums = [1, 5, 25, 100, 500];
            this.chipsLevels = ['', 'K', 'M', 'B'];
            // var chips = getChips(this.chipsLevels, this.chipsNums);
            this.$chips = $(selector);
        }
        buildChips() {
            var self = this;
            chips.forEach(function (elem) {
                $chips.append('<div id="chip' + elem.number + '" class="chip" data-value="' +
                    elem.value + '">' + elem.text + '</div>');
                chipFace($('#chip' + elem.number), elem.number + 2);
            });

            function chipFace($elem, num) {
                var coords = getSpriteCoordsForCard(74, 74, self.chipsNums.length, num);
                $elem.css({
                    'background-position': coords.x + 'px ' + coords.y +'px',
                    'left': (20 + 74) * (num - 2) + 15 + 'px'
                });
            }

        }
        getChips() {
            var chips = [];
            var level = 1;
            var num = 0;
            for (var i = 0; i < this.chipsLevels.length; i++) {
                for (var j = 0; j < this.chipsNums.length; j++) {
                    var chip = {
                        text: '$ ' + this.chipsNums[j] + ' ' + this.chipsLevels[i],
                        value: this.chipsNums[j] * level,
                        number: num
                    };
                    num++;
                    chips.push(chip);
                }
                level *= 1000;
            }
            return chips;
        }
    }

    var cardBack = 59; //рубашка от 53 по 64, 65 - пустота

    const cardsPack = new Cards();
    var cards = cardsPack.getCards();

    console.log(cards);

    const coords = {
        dealer: {left: 300, top: 20 , step: 30},
        player: {left: 350, top: 270 , step: 30},
        playerSpl: {left: 380, top: 270 , step: 30}
    };

    const chips_ = new Chips('#chips');
    var chips = chips_.getChips();
    var $chips = $('#chips');
    console.log(chips);

    chips_.buildChips();

    var $summaryText = $('#summary_text');
    var $summary = $('#summary_wrapper');

    var $cardsDeck_new = $('.cards_new');
    var $cardsDeck_played = $('.cards_played');

    cardsPack.cardFace($cardsDeck_new, cardBack);
    cardsPack.cardFace($cardsDeck_played, 65);
    $cardsDeck_new.css('display', ' block');
    $cardsDeck_played.css('display', ' block');

    var shuffledPack = cardsPack.getShuffledPack(cards.length);
    console.log(shuffledPack);

    var testPack = [1, 3, 14, 8, 10, 7, 34, 2, 5, 28, 25, 20, 3, 22, 8, 43, 34, 1, 5, 28, 25, 19, 1, 21, 8, 43, 34, 1, 5, 28, 25, 19, 1, 21];
// shuffledPack = testPack;

    var $dealer = new Hand('#dealer_line');
    var $player = new Hand('#player_line');
    var $playerSpl = new Hand('#player_line_spl');
    var btnsPlay = new PlayButtons();

    var money = 1000000;
    var betRound = 0;
    var betPre = 0;
    var $moneyText = $('#money').children('span');
    writeYourMoney($moneyText, money, '$ ');

    var prize1 = 0;
    var prize2 = 0;

    btnsPlay.activateButtons();

    var $sliderButtons = $('.slider');

    $dealer.hidePoints();
    $player.hidePoints();
    $playerSpl.hidePoints();
    startPlay();

    slider();

    function slider() {

        var $prev2 = $('#prev2');
        var $prev1 = $('#prev1');
        var $next1 = $('#next1');
        var $next2 = $('#next2');

        var chipWidth = 74 + 20;
        var width = parseInt($chips.parent().css('width'));

        $('#chips_wrapper').get(0).addEventListener('wheel', function (e) {
            e = e || window.event;
            var delta = e.deltaY || e.detail || e.wheelDelta;

            delta = parseInt(delta);
            delta = fixDelta(94);
            move(delta);

            e.preventDefault();

            function fixDelta(num) {
                if (delta > 0) return num;
                else return 0 - num;
            }
        });

        function move(delta) {
            var zeroLeft = parseInt($chips.css('left'));
            var chips = getChipsNum();
            var minLeft = width - chips * chipWidth - 10;
            var maxLeft = 0;

            if (delta > 0) moveRight(delta, zeroLeft, maxLeft);
            if (delta < 0) moveLeft(delta, zeroLeft, minLeft);
        }

        function moveRight(delta, zeroLeft, maxLeft) {
            var final = delta + zeroLeft;
            if (delta === 1) final = maxLeft;
            if (final > maxLeft) final = maxLeft;
            makeLeftForChips(final);
        }

        function moveLeft(delta, zeroLeft, minLeft) {
            var final = delta + zeroLeft;
            if (delta === -1) final = minLeft;
            if (final < minLeft) final = minLeft;
            makeLeftForChips(final);
        }

        $prev1.click(function () {
            move(94);
        });
        $next1.click(function () {
            move(-94);
        });
        $prev2.click(function () {
            move(1);
        });
        $next2.click(function () {
            move(-1);
        });

        function getChipsNum() {
            var counter = 0;
            $chips.children('.chip').each(function () {
                if ($(this).css('display') === 'none') {
                    counter++;
                }
            });
            return 20 - counter;
        }
    }

    function makeLeftForChips(final) {
        $chips.css('left', final + 'px');
    }

    function startBets() {
        betPre = 0;
        makeLeftForChips(0);
        $chips.css('display', 'block');
        $sliderButtons.css('display', 'block');
        $player.potUp();
        btnsPlay.checkChipsForShow();
        if (betRound === 0) {
            btnsPlay.activateBets0();
        } else {
            btnsPlay.activateBets();
        }
    }

    function reWriteYourMoney() {
        writeYourMoney($moneyText, money, '$ ');
        btnsPlay.checkForDisable();
    }

    function writeYourMoney($text, str, symbol) {
        str = '' + str;
        var str1 = str.replace(/(\d)\s(?=(\d)+([\D]|$))/g, '$1');
        var newStr = str1.replace(/(\d)(?=(\d\d\d)+([\D]|$))/g, '$1 ');

        $text.html(symbol + newStr);

    }

    function startPlay() {
        btnsPlay.activateStartPlay();
        btnsPlay.checkChipsForShow();
    }

    function compare() {
        btnsPlay.activateCompare();
        $dealer.unHidePoints();


        var summary = summaryProtocol();
        var summary1 = summary.summ1;
        var summary2 = summary.summ2;

        var text, pot1, pot2 = 0, summ1, summ2;

        if (summary2 === 0 && summary1 < 4) {
            switch (summary1) {
                case 1: text = 'Dealer have BlackJack! You loose!'; pot1 = 0; break;
                case 2: text = 'Dealer and you have BlackJack! Push!'; pot1 = 1; break;
                case 3: text = 'You have BlackJack! You win!'; pot1 = 1.5; break;
            }
        } else if (summary2 === 0) {
            summ1 = summaryForHand(summary1);
            pot1 = summ1.pot;
            text = 'You ' + summ1.text + '!';
            if (summary1 === 8) text = 'Push!';
            if (summary1 === 5) text = 'Dealer bust, you win!';
        } else if (summary2 > 0) {
            summ1 = summaryForHand(summary1);
            summ2 = summaryForHand(summary2);

            pot1 = summ1.pot;
            pot2 = summ2.pot;

            text = 'Left hand ' + summ1.text + ', right hand ' + summ2.text + '!';
        }

        $summaryText.html(text);
        writePrize(pot1, pot2);
        $summary.css('display', 'block');

        startPlay();

        function writePrize(pot1, pot2) {
            prize1 = $player.getPot() * pot1;
            prize2 = $playerSpl.getPot() * pot2;

            writePrizeToHand(prize1, $player);
            writePrizeToHand(prize2, $playerSpl);

            function writePrizeToHand(prize, $hand) {
                if (prize > 0) {
                    $hand.writePize(prize);
                }
            }
        }

        function summaryForHand(summary1or2) {
            var txt, pot;
            switch (summary1or2) {
                case 4: txt = 'bust'; pot = 0; break;
                case 5: txt = 'win'; pot = 2; break;
                case 6: txt = 'loose'; pot = 0; break;
                case 7: txt = 'win'; pot = 2; break;
                case 8: txt = 'push'; pot = 1; break;
                case 9: txt = 'bust'; pot = 0; break;
            }
            return {
                text: txt,
                pot: pot
            }
        }
        function summaryProtocol() {
            var dealer = summary($dealer);
            var player = summary($player);
            var summary1 = summaryCombination(dealer, player);
            var summary2 = 0;
            if ($player.hasSplitted()) {
                var playerSpl = summary($playerSpl);
                summary2 = summaryCombination(dealer, playerSpl);
            }
            return {
                summ1: summary1,
                summ2: summary2,
                dealer: dealer,
                player: player,
                playerSpl: playerSpl
            };

            function summary($hand) {
                var points = $hand.getPoints();
                var numCards = $hand.getNumberOfCards();
                var splitted = $hand.hasSplitted();
                var secondHand = false;
                if ($hand === $playerSpl) {
                    secondHand = true;
                }
                if (points === 21 && numCards === 2 && splitted === false && !secondHand) {
                    return 'BlackJack';
                } else if (points <= 21) {
                    return points;
                } else if (points > 21) {
                    return 'Bust';
                }
            }

            function summaryCombination(dealer, player) {
                if (dealer === 'BlackJack' && player <= 21) return 1;
                else if (dealer === 'BlackJack' && player === 'BlackJack') return 2;
                else if (dealer <= 21 && player === 'BlackJack') return 3;
                else if (dealer <= 21 && player === 'Bust') return 4;
                else if (dealer === 'Bust' && player <= 21) return 5;
                else if (dealer > player) return 6;
                else if (dealer < player) return 7;
                else if (dealer === player && player <= 21) return 8;
                else if (dealer === player && player === 'Bust') return 9;
            }
        }

    }

    function checkDps() {
        btnsPlay.activateCompare();
        if ($dealer.getPoints() < 17) {
            $dealer.cardTransfer(function () {
                checkDps();
            });
        } else {
            compare();
        }
    }

    function checkSplitted(handNum) {
        if (hand(handNum).hasSplitted()) {
            $player.shineOn();
            $playerSpl.shineOff();
            standartPlay(2);
            $player.shineOn();
            $playerSpl.shineOff();
        } else {
            checkPps_2(handNum);
            $player.shineOff();
        }

        function checkPps_2(handNum) {
            if (dealerPlayBlock(handNum)) {
                $dealer.showDealers2();
                compare();
            } else {
                $dealer.showDealers2();
                btnsPlay.activateCompare();
                checkDps();
            }

        }

        function dealerPlayBlock(handNum) {
            var points1 = hand(1).getPoints();
            var cards1 = hand(1).getNumberOfCards();
            if (handNum === 2) {
                var points2 = hand(2).getPoints();
                var cards2 = hand(1).getNumberOfCards();
                if ((points1 > 21 && points2 > 21) || (points1 > 21 && points2 === 21 && cards2 === 2) ||
                    (points1 === 21 && points2 > 21 && cards1 === 2) ||
                    (points1 === 21 && points2 === 21 && cards1 === 2 && cards2 === 2)) {
                    return true;
                }
            } else {
                if (points1 > 21) {
                    return true;
                }
            }
            return false;
        }
    }

    function hand(handNum) {
        if (handNum === 2) {
            return $playerSpl;
        } else {
            return $player;
        }
    }

    function standartPlay(handNum) {
        if (hand(handNum).getPoints() === 21) {
            checkSplitted(handNum);
        } else {
            btnsPlay.activateStandartPlay(handNum);
        }
    }

    function getSpriteCoordsForCard(width, height, inRow, num) {
        var row = Math.ceil(num / inRow);
        var place = num % inRow;
        if (place === 0) place = inRow;
        var xCoord = 0 - width * (place - 1);
        var yCoord = 0 - height * (row - 1);
        return {x: xCoord, y: yCoord};
    }

});