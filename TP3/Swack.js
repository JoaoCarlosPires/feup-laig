/**
 * Swack
 * @constructor
 */

class Swack{
    constructor(scene) {
        this.scene = scene;

        this.currPlayer = 0;

        this.board = [];
        this.board.push([[2], [1], [2], [1]]);
        this.board.push([[1], [2], [1], [2]]);
        this.board.push([[2], [1], [2], [1]]);
        this.board.push([[1], [2], [1], [2]]);

        this.ids = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];

        this.success = "1";

        this.pass = 0;

    }

    reset() {
        for (var i = 1; i <= 16; i++) {
            var id = i.toString();
            if (id == 1 || id == 3 || id == 6 || id == 8 || id == 9 || id == 11 || id == 14 || id == 16) {
                var piece = new GamePiece(this.scene, id, "whitepiece");
            } else {
                var piece = new GamePiece(this.scene, id, "redpiece");
            }
            this.scene.graph.nodes[id][6] = [];
            this.scene.graph.nodes[id][6].push(piece);
        }
    }   

    passed() {
        this.pass++;
    }

    getPass() {
        return this.pass;
    }

    changePlayer() {
        this.currPlayer = this.currPlayer == 0 ? 1 : 0;
        this.scene.changedPlayer = true;
    }

    getPlayer() {
        return this.currPlayer;
    }

    getBoard() {
        return JSON.stringify(this.board);
    }

    changeBoard(Col, Lin, FCol, FLin, Piece, New) {
        this.board[Lin][Col].shift();
        this.board[Lin][Col].unshift(New);
        this.board[FLin][FCol].unshift(Piece);
        this.pass = 0;
    }

    undoBoard(Col, Lin, FCol, FLin) {
        var piece = this.board[FLin][FCol].shift();
        this.board[Lin][Col].shift();
        this.board[Lin][Col].unshift(piece);
    }

    sendRequest(requestString, onSuccess) {    

        var requestPort = 8081;
        this.request = new XMLHttpRequest();

        this.request.onload = onSuccess || function(data){console.log("success");};
        this.request.addEventListener("error", function(data) {console.log("Error")}); 
        
        this.request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        this.request.send();
    }   

    getId(Lin, Col) {
        return this.ids[Lin][Col];
    }

    getPosX(id) {
        if (id < 5) return 0;
        else if (id < 9) return 1;
        else if (id < 13) return 2;
        return 3;
    }

    getPosY(id) {
        if (id == 1 || id == 5 || id == 9 || id == 13) return 0;
        else if (id == 2 || id == 6 || id == 10 || id == 14) return 1;
        else if (id == 3 || id == 7 || id == 11 || id == 15) return 2;
        return 3;
    }

}

