
$(document).ready(function () {
    const time = $('.seconds');
    modalTime = $('.modal .time');
    let timer = 60;
    let rows = 4,
        columns = 4,
        pieces = '',
        emptyPieces = '',
        timerDecrement,
        move = false;


    for (o = 0; o < 16; o++) {
        emptyPieces += `<div class = " emptyPiece droppableSpace" > </div>`
    }
    for (let i = 0, top = 0, order = 0; i < rows; i++, top -= 100) {
        for (let k = 0, left = 0; k < columns; k++, left -= 100, order++) {
            pieces += `<div style = 'background-position : ${left}px ${top}px;' class = "piece" data-order = ${order}> </div>`

        }
    }






    $('.start').on('click', function () {
        move = true;
        timer = 60
        timerDecrement = setInterval(function () {
            timer--;

            time.text(` 00:${timer}`);
            modalTime.text(`You still have time, you sure ?  00:${timer}`)
            if (timer < 10) {
                time.text(` 00:0${timer}`);
            }
            if (timer == 0) {
                $(".check").prop('disabled', true);
                $(".reset").prop('disabled', false);
                $('.start').prop('disabled', false);
                clearInterval(timerDecrement)
                time.text(` 01:00`);
                timer = 60;
                $('.draggablePiece').draggable('destroy')
                $('.modal__wrapper').fadeIn()
                $('.modal h1').show()
                $('.modal h1').text('Its a pity, but you lost')
                $(".modal__check").prop('disabled', true);
                $('.modal .time').hide()
            }

        }, 1000);



        $(this).prop('disabled', true);
        $(".check").prop('disabled', false);
    });

    $('.check').click(function () {
        checkIfOkay();
        $(".reset").prop('disabled', false);
        $('.start').prop('disabled', false);
        $('.modal__wrapper').fadeIn()
    })

    $('.reset').click(function () {
        $('.start').prop('disabled', false);
        $(".check").prop('disabled', true);
        clearInterval(timerDecrement)
        time.text(` 01:00`);
        timer = 60;
        createPieces()
        $('.puzzle .emptyPieces').css({
            backgroundImage: 'none'
        })
        $('.modal h1').removeClass('beta')
        move = false;
    })

    $('.modal__close').click(function () {
        $(".reset").prop('disabled', true);
        $('.start').prop('disabled', true);
        $('.modal__wrapper').fadeOut()
        modalTime.show()
        $('.modal h1').hide()
        $(".modal__check").prop('disabled', false);


        if ($('.modal h1').hasClass('beta')) {
            $(".reset").prop('disabled', false);
            $('.modal h1').removeClass('beta')
        } else {
            $(".reset").prop('disabled', false);

        }




        return false;
    });

    $('.modal__check').click(function () {
        modalTime.hide()
        $('.modal h1').show()
        // checkIfOkay()
        clearInterval(timerDecrement)
        $(".modal__check").prop('disabled', true);
        $('.start').prop('disabled', true);
        $('.check').prop('disabled', true);
        return false;
    });





    function createPieces() {
        $('.puzzle').html(emptyPieces)
        $('.piecesPuzzle').html(pieces)
        let randPieces = $('.piecesPuzzle div');
        randPieces.each(function () {
            let leftPosition = Math.floor(Math.random() * 500) + 'px';
            let topPosition = Math.floor(Math.random() * 500) + 'px';
            $(this).addClass('draggablePiece').

            css({
                position: 'absolute',
                top: topPosition,
                left: leftPosition,
                zIndex: 100
            })

            $('.piecesPuzzle').append($(this))

        })
        draggAndDrop()


    }
    createPieces()









    function checkIfOkay() {
        if ($('.puzzle .droppedPiece').length != 16) {
            $('.modal h1').text('Its a pity, but you lost')
            $('.modal h1').addClass('beta')
            return false
        }
        for (let id = 0; id < 16; id++) {
            let item = $(`.puzzle .droppedPiece:eq(${id})`);
            let order = item.data('order');
            if (id != order) {
                $('.modal h1').text('Its a pity, but you lost')
                $(".modal__check").prop('disabled', true);
                return false;
            } else {
                $(".check").prop('disabled', true);
                $('.modal h1').text('“Woohoo, well done, you did it!”')
            }
        }
    }












    function draggAndDrop() {

        $('.draggablePiece').draggable({
            revert: 'invalid',
            start: function () {
                $('.draggablePiece').on('mouseup', function () {
                    if (move == false) {
                        $('.start').trigger('click')
                        move == true
                    }
                })

                if ($(this).hasClass('droppedPiece')) {
                    $(this).removeClass('droppedPiece'),
                        $(this).parent().removeClass('piecePresent')

                }


            }
        })
        $('.droppableSpace').droppable({
            accept: function () {
                return !$(this).hasClass('piecePresent')
            },
            tolerance: "pointer",
            drop: function (event, ui) {
                let draggableElement = ui.draggable;
                let droppedOn = $(this);
                droppedOn.addClass('piecePresent');

                $(draggableElement).addClass('droppedPiece').css({
                    top: 0,
                    left: 0,
                    position: 'relative'
                }).appendTo(droppedOn);

            }
        })

    }



})