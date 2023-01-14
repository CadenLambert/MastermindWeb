const colors = ['Red', 'Blue', 'Orange', 'White', 'Green', 'Magenta', 'Empty'];
const max_code_length = 4;
const max_guess = 10;
let game_board = initialize_game_board(max_guess, max_code_length, 'Empty');
let current_guess = 0;
let current_code_pos = 0;
let code_to_break = [];
let holding = false;

//TODO
//Allow users to place pegs in any position for current guess (drag and drop) Do this first
//Save and load gamestates
//Implement better alert system


window.onload = function(){
    for(let x of document.getElementsByClassName('peg-button')){
        //x.addEventListener('click', build_code, false);
        x.addEventListener('mousedown', grab_peg, false);
    }
    document.getElementById('backspace-button').addEventListener('click', backspace, false);
    document.getElementById('submit-button').addEventListener('click', submit_guess, false);
    generate_code();
}

function generate_code(){
    var color_id
    for(var i = 0; i < max_code_length; i++){
        color_id = Math.floor(Math.random() * (colors.length - 1));
        code_to_break.push(colors[color_id]);
    }
}

function grab_peg(event){
    holding = true;
    console.log('grabbed a peg');
}

function drag_peg(event){
    if(holding){
        console.log('dragged a peg');
    }
    
}

function drop_peg(event){
    holding = false;
    console.log('dropped a peg');
}

function build_code(event){
    //Implement drag and drop



    // var peg_name = event.currentTarget.value;
    // var peg_class = `${peg_name.toLowerCase()}-peg`;
    // var peg_id;
    // if(current_code_pos < max_code_length){
    //     peg_id = `color-${current_guess}-${current_code_pos}`
    //     game_board[current_guess][current_code_pos] = peg_name;
    //     document.getElementById(peg_id).innerHTML = `<div class='${peg_class}'></div>`;
    //     if(current_code_pos + 1 < max_code_length){
    //         current_code_pos++;
    //     }
    // }
    
    
}


function backspace(){
    //Implement drag and drop

    // var peg_id = `color-${current_guess}-${current_code_pos}`
    // document.getElementById(peg_id).innerHTML = `<div class='empty-peg'></div>`;
    // game_board[current_guess][current_code_pos] = 'Empty';

}

function submit_guess(){
    var match_results = [];
    var hint_id = `hint-${current_guess}`
    //Check if guess is complete, if not then notify
    if(game_board[current_guess].indexOf('Empty') == -1){
        match_results = compare_codes(game_board[current_guess], code_to_break);
        if(match_results[0] == max_code_length){
            reveal_code(true);
            alert('You Win');
        }
        else if(current_guess < max_guess-1){
            document.getElementById(hint_id).innerHTML = `Position: ${match_results[0]}<br>Color: ${match_results[1]}`
            current_guess++;
            current_code_pos = 0;
        }
        else{
            reveal_code(true);
            alert('You Lose');
        }
    } else {
        alert('Please submit complete code')
    }
}

function compare_codes(guess, code){
    var color_and_pos_match = 0;
    var color_but_no_pos_match = 0;
    const matched_guess_indexes = new Set();
    const matched_code_indexes = new Set();
    if (guess.length == code.length){
        for(var i = 0; i < code.length; i++){
            if(guess[i] == code[i])
            {
                color_and_pos_match++;
                matched_guess_indexes.add(i);
                matched_code_indexes.add(i);
            }
        }
        for(var i = 0; i < guess.length; i++){
            for(var j = 0; j < code.length; j++){
                if(guess[i] == code[j] && !matched_guess_indexes.has(i) && !matched_code_indexes.has(j)){
                    color_but_no_pos_match++;
                    matched_guess_indexes.add(i);
                    matched_code_indexes.add(j);
                }
            }
        }
        return [color_and_pos_match, color_but_no_pos_match];
    }
    else{
        return [-1, -1];
    }
}

// Not exactly necessary, but makes my C++ brain go brr
function initialize_game_board(num_guesses, code_length, default_value){
    var arr = [];
    for(var i = 0; i < num_guesses; i++){
        arr[i] = []
        for(var j = 0; j < code_length; j++){
            arr[i][j] = default_value;
        }
    }
    return arr;
}

function reveal_code(show){
    var peg_class;
    for(var i = 0; i < max_code_length; i++){
        if(show){
            peg_class = `${code_to_break[i].toLowerCase()}-peg`
        }
        else{
            peg_class = 'black-peg'
        }
        document.getElementById(`code-${i}`).innerHTML = `<div class='${peg_class}'></div>`;
    }
}

