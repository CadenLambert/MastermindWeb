const colors = ['Red', 'Blue', 'Orange', 'White', 'Green', 'Magenta', 'Empty'];
const color_classes = ['red-peg', 'blue-peg', 'orange-peg', 'white-peg', 'green-peg', 'magenta-peg', 'empty-peg']
const max_code_length = 4;
const max_guess = 10;
let game_board = initialize_game_board(max_guess, max_code_length, 'Empty');
let current_guess = 0;
let current_code_pos = 0;
let code_to_break = [];
let held_peg = '';
let cur_guess_id;
let cur_hint_id;

//TODO
//Allow users to place pegs in any position for current guess (drag and drop) Do this first
//Save and load gamestates
//Implement better alert system

window.onload = function(){
    for(let x of document.getElementsByClassName('peg-button')){
        //x.addEventListener('', build_code, false);
        x.addEventListener('dragstart', grab_peg, false);
    }
    for(let x of document.getElementsByClassName('color-choice')){
        x.addEventListener('drop', drop_peg, false);
        x.addEventListener('dragenter', handle_drag_enter, false);
        x.addEventListener('dragleave', handle_drag_leave, false);
        x.addEventListener('dragover', allow_drop, false);
        x.setAttribute("value", parseInt(x.getAttribute('id').slice(-1)));
        //x.attributes.value = parseInt(x.getAttribute('id').slice(-1)); //setting values to use as indexes for gameboard
    }
    document.getElementById('clear-button').addEventListener('click', clear_guess, false);
    document.getElementById('submit-button').addEventListener('click', submit_guess, false);
    generate_code();
    set_cur_guess_ids(false);
}

// function gen_guess_id(val){
//     if(val >= 0 && val <= max_guess){
//         return `guess-row-${val}`;
//     }
//     return null;
// }

// function gen_hint_id(val){
//     if(val >= 0 && val <= max_guess){
//         return `hint-${val}`;
//     }
//     return null;
// }

function generate_code(){
    var color_id
    for(var i = 0; i < max_code_length; i++){
        color_id = Math.floor(Math.random() * (colors.length - 1));
        code_to_break.push(colors[color_id]);
    }
}

function set_cur_guess_ids(increment){
    if(increment){
        current_guess++;
    }
    cur_guess_id = `guess-row-${current_guess}`;
    cur_hint_id = `hint-${current_guess}`;
}

function handle_drag_enter(event){
    event.preventDefault();
}

function handle_drag_leave(event){
    event.preventDefault();
}

function allow_drop(event){
    event.preventDefault();
}

function grab_peg(event){
    held_peg = this.getAttribute('value');
    console.log('grabbed a peg');
}

function drop_peg(event){
    event.stopPropagation();
    if(colors.indexOf(held_peg) >= 0 && this.parentElement.getAttribute('id') == cur_guess_id){
        this.firstChild.className = "";
        this.firstChild.classList.add(color_classes[colors.indexOf(held_peg)]);
        game_board[current_guess][this.getAttribute('value')] = held_peg;
        held_peg = '';
        console.log('dropped a peg');
    }
}

function clear_guess(){
    for(let x of document.getElementById(cur_guess_id).children){
        if(x.classList.contains('color-choice')){
            x.firstChild.className = '';
            x.firstChild.classList.add('empty-peg');
            game_board[current_guess][x.getAttribute('value')] = 'Empty';
        }
    }
}

function submit_guess(){
    var match_results = [];
    if(game_board[current_guess].indexOf('Empty') == -1){
        match_results = compare_codes(game_board[current_guess], code_to_break);
        if(match_results[0] == max_code_length){
            reveal_code(true);
            alert('You Win');
        }
        else if(current_guess < max_guess-1){
            document.getElementById(cur_hint_id).innerHTML = `Position: ${match_results[0]}<br>Color: ${match_results[1]}`
            set_cur_guess_ids(true);
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

