/**
 * Created by Moshe on 05/03/2017.
 */

const movementDelta = 10;
const movementDuration = 5;
const gridSize = 15;
const neighbourhoodRadius = 2;

var rows = neighbourhoodRadius*2+1;
var columns = neighbourhoodRadius*2+1;

var grid;
var neighbourHood;
var centerNode;

var $cell = $("<div />", {
    class: 'cell'
});

var $row = $("<div />", {
    class: 'row'
});

jQuery.expr.filters.offscreen = function(el) {
    var rect = el.getBoundingClientRect();
/*    console.log(rect);
    console.log('windowW: ' + window.innerWidth + ', windowH: ' +window.innerHeight);*/
    return (
        (rect.left + rect.width) < 0
        || (rect.top  + rect.height) < 0
        || (rect.left > window.innerWidth || rect.top > window.innerHeight)
    );
};

$(document).ready(function(){

    //create grid

    grid = new Grid(gridSize);
    centerNode = grid.centerNode;
    neighbourHood = grid.getNeighbourhood(centerNode,neighbourhoodRadius);

    for (let i=0; i < rows; i++) {

        $("#grid").append($row.clone());
        if (i > 0) {
            let rowHeight = $('.row:last').height();
            $('.row:last').css('top', rowHeight*i);
        }
        for(let j=0;j<columns;j++) {
            let url = neighbourHood[i][j].url;
            let $newCell = $cell.clone().append('<img src="' + url + '" alt="">');
            let cellWidth = 0;
            if (j > 0) {
                cellWidth = $('.row:last > .cell:first').width();
            }
            $('.row:last').append($newCell.css('left', cellWidth *j));
        }

    }

    document.onkeydown = checkKey;


});

function moveRight() {
    grid.moveRight(neighbourHood);
    centerNode = neighbourHood[neighbourhoodRadius][neighbourhoodRadius];

    $('.row').each(function(i, obj) {
        //remove first cell
        let $firstCell = $(this).children('.cell').first();
        let firstCellWidth = $firstCell.width();
        $firstCell.remove();

        let $lastCell = $(this).children('.cell').last();
        //add new cell
        let url = neighbourHood[i][columns-1].url;
        $(this).append($cell.clone().append('<img src="' + url + '" alt="">'));
        //move new cell to after previous to last/new cell
        let newCellLeft = parseFloat($lastCell.css('left'))+parseFloat(firstCellWidth);
        $(this).children('.cell').last().css('left', newCellLeft);
    });
}

function moveLeft() {
    grid.moveLeft(neighbourHood);
    centerNode = neighbourHood[neighbourhoodRadius][neighbourhoodRadius];
    $('.row').each(function(i, obj) {
        //remove last cell
        let $lastCell = $(this).children('.cell').last();
        let lastCellWidth = $lastCell .width();
        $lastCell.remove();

        let $firstCell = $(this).children('.cell').first();
        //add new cell
        let url = neighbourHood[i][0].url;
        $(this).prepend($cell.clone().append('<img src="' + url + '" alt="">'));
        //move new cell to after previous to last/new cell
        let newCellLeft = parseFloat($firstCell.css('left'))-parseFloat(lastCellWidth);
        $(this).children('.cell').first().css('left', newCellLeft);
    });
}

function moveUp() {
    grid.moveUp(neighbourHood);
    centerNode = neighbourHood[neighbourhoodRadius][neighbourhoodRadius];
    $('.row:last').remove();
    let firstRowTop = parseFloat($('.row:first').css('top'));
    $('#grid').prepend($row.clone());
    let newRowWidth = parseFloat($('.row:first').height());
    $('.row:first').css('top',firstRowTop - newRowWidth);
    for (let j=0;j<columns;j++){
        let url = neighbourHood[0][j].url;
        let $newCell = $cell.clone().append('<img src="' + url + '" alt="">');
        let cellWidth = 0;
        if (j > 0) {
            cellWidth = $('.row:first > .cell:first').width();
        }
        $('.row:first').append($newCell.css('left', cellWidth *j));

    }
}

function moveDown() {

}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        let isOffscreen = $(".row:last").is(':offscreen');
        if (isOffscreen) {
            moveUp();
        }
        $(".row").animate({
            top: '+='+movementDelta+'px'
        },movementDuration);
    }
    else if (e.keyCode == '40') {
        // down arrow
        console.log($(".row:first").is(':offscreen'));
        $(".row").animate({
            top: '-='+movementDelta+'px'
        },movementDuration);
    }
    else if (e.keyCode == '37') {
        // left arrow
        let isOffscreen = $(".row:first > .cell:last").is(':offscreen');
        if (isOffscreen) {
            moveLeft();
        }
        $(".cell").animate({
            left: '+='+movementDelta+'px'
        },movementDuration);
    }
    else if (e.keyCode == '39') {
        // right arrow
        let isOffscreen = $(".row:first > .cell:first").is(':offscreen');
        console.log(isOffscreen);
        if (isOffscreen) {
            moveRight();
        }
        $(".cell").animate({
            left: '-='+movementDelta+'px'
        },movementDuration);
/*        $(".cell").velocity({
            translateX: "-=" + movementDelta+"px"
        },{ duration: movementDuration });*/
        /*$(window).scrollTo({left:'+='+movementDelta+'px', top:0}, movementDuration);*/
    }
}
