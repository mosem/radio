/**
 * Created by Moshe on 07/03/2017.
 */
"use strict";

class Node{
    constructor(){
        this.url = null;
        this.north = null;
        this.east = null;
        this.south = null;
        this.west = null;
        this.visible = false;
    }

    toString(){
        return '${this.url} | N: ${this.north} | E: ${this.east} | S: ${this.south} | W: ${this.west}';
    }

    print() {
        console.log(this.toString() );
    }
}

class Grid{

    constructor(size){
        this.width = size;
        this.height = size;

        this.initData();
    }

    initData() {
        var grid = new Array(this.width);
        for (let i=0; i<this.width;i++) {
            grid[i] = new Array();
            for (let j = 0; j < this.height; j++) {
                grid[i].push(new Node());
            }
        }


        var centerIdx = Math.floor(this.width/2);
        this.centerNode = grid[centerIdx][centerIdx];

        //assign circular grid
        for (let  i=0;i<this.width;i++){
            for (let j=0;j<this.height;j++){
                let currNode = grid[i][j];
                currNode.url = "https://dummyimage.com/445x250/222/fff&text=" + i + "-" + j;

                let northNeighbour = j>0 ? grid[i][j-1] : grid[i][this.height-1];
                currNode.north = northNeighbour;
                northNeighbour.south = currNode;

                let eastNeighbour = (i < this.width-1) ? grid[i+1][j] : grid[0][j];
                currNode.east = eastNeighbour;
                eastNeighbour.west = currNode;

                let southNeighbour = (j < this.height-1) ? grid[i][j+1] : grid[i][j];
                currNode.south = southNeighbour;
                southNeighbour.north = currNode;

                let westNeighbour = i>0 ? grid[i-1][j] : grid[this.width-1][j];
                currNode.west = westNeighbour;
                westNeighbour.east = currNode;
            }
        }
    }

    getNeighbourhood(node,r) {
        var topLeft = node;
        for (let i=0;i<r;i++) {
            topLeft = topLeft.north.west;
        }
        var arr = new Array(r*2+1);
        var tempLeftmost = topLeft;
        for(let i=0;i<arr.length;i++) {
            arr[i] = new Array(r*2+1);
            var temp = tempLeftmost;
            for (let j=0;j<arr[i].length;j++){
                arr[i][j] = temp;
                temp = temp.east;
            }
            tempLeftmost = tempLeftmost.south;
        }
        return arr;
    }

    moveRight(neighbourhood){
        var neighbourhoodWidth = neighbourhood[0].length;
        var neighbourhoodHeight = neighbourhood.length;
        for (let i=0;i<neighbourhoodHeight;i++) {
            neighbourhood[i].shift();
            let rightmostNode = neighbourhood[i][neighbourhood[i].length-1].east;
            neighbourhood[i].push(rightmostNode);
            //assuming neighbourhood width is at least 2
            // console.log(rightmostNode);
        }
    }

    moveLeft(neighbourhood) {
        var neighbourhoodWidth = neighbourhood[0].length;
        var neighbourhoodHeight = neighbourhood.length;
        for (let i=0;i<neighbourhoodHeight;i++) {
            neighbourhood[i].pop();
            let leftmostNode = neighbourhood[i][0].west;
            neighbourhood[i].unshift(leftmostNode);
        }
    }

    moveUp(neighbourhood) {
        var neighbourhoodWidth = neighbourhood[0].length;
        var neighbourhoodHeight = neighbourhood.length;
        neighbourhood.shift();
        neighbourhood.unshift(new Array());
        for (let j=0;j<neighbourhoodWidth;j++) {
            let topMostNode = neighbourhood[1][j].north;
            neighbourhood[0].push(topMostNode);
        }
    }
}