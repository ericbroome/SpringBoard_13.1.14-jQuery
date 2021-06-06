const movieList = [];           //Use this to store movie entries
let sortBy = 0;                 //0 = no sort, 1/-1 = title, 2/-2 = rating
let rtIndex = 0;                //Used for alternating colors of items
let cellTemplates = [
    '<div class="col-3 text-center">',
    '<div class="col-3 text-center text-red" onclick="deleteMe(event)"><i class="fas fa-trash"></i>',
];
let rowTemplates = [
  '<div class="row justify-content-center text-white" style="background-color: rgba(127, 127, 127, 0.5)">',
  '<div class="row justify-content-center text-white" style="background-color: rgba(127, 127, 127, 0.25)">'
];

const addRowToUI = function(title, rating, index) {
    let $row = $(`${rowTemplates[rtIndex]}</div>`);
    let $cell0 =  $(`${cellTemplates[0]}${title}</div>`);
    let $cell1 =  $(`${cellTemplates[0]}${rating}</div>`);
    let $cell2 =  $(`${cellTemplates[1]}</div>`);
    $row.attr('data-index', `${index}`);    //The index into the array
    $row.appendTo('#movieGrid');
    $cell0.appendTo($row);
    $cell1.appendTo($row);
    $cell2.appendTo($row);
    rtIndex++;
if(rtIndex >= rowTemplates.length)rtIndex = 0;
}

const updateUI = function() {
    $('#movieGrid').html("");   //Clear the UI
    let index = 0;
    movieList.forEach((item) => {
        addRowToUI(item.title, item.rating, index++);
    })
}

//Respond to the trash icon
const deleteMe = function(event) {
    //First, find the item in each of the maps and delete those entries
    //Finally, update the UI. No matter what, the sort order will not change.
    let $item = $(event.currentTarget.parentElement);
    let index = +($item.attr('data-index'));
    movieList.splice(index, 1);
    //Just update the whole UI rather than updating individual entrie's data-row-index attribute
    updateUI();
}

const compareRating = function(a, b) {
    return a.rating - b-rating;
}

const compareTitle = function(a, b) {
    return String(a.title).localeCompare(b.title);
}

/* The equivalent of onDOMContentLoaded */      
$(()=>{
    //Event handler for the Insert button
    $('#addEntry').click((e)=>{
        let strTitle = $('#movie').val();
        if(strTitle.length < 2)return;
        let lcTitle = strTitle.toLowerCase().replaceAll(' ', '');   //.replace(/\s/g, '') is the regex way
        let nRating = +($('#rating').val());
        let bFail = false;
        movieList.forEach(function(entry) { //Prevent duplicate names, mostly.
            if(entry.title.toLowerCase().replaceAll(' ', '') == lcTitle) {
                bFail = true;
                return;
            }
        });
        if(bFail)return;
        addRowToUI(strTitle, nRating, movieList.length);  //In this order such that the row index of the html element is accurate
        movieList.push({title:strTitle, rating:nRating});
        $('#movie').val("");
        $('#rating').val(0);
        $('#movie').focus();
    });

    //Event handler for rating input - force it to be 0-10 because manually typing is not constrained by min and max
    $('#rating').on('input', (e) => {
            if($('#rating').val() > 10)$('#rating').val(10);
        });

    //Event handler for sort title button
    $('#sortTitle').click((e) => {
        movieList.sort(compareTitle);
        if(sortBy != -1) {
            movieList.reverse();
            sortBy = -1;
        }
        else sortBy = 1;
        updateUI();
    })

    //Event handler for sort rating button
    $('#sortRating').click((e) => {
        movieList.sort(compareRating);
        if(sortBy != -2) {
            movieList.reverse();
            sortBy = -2;
        }
        else sortBy = 2;
        updateUI();
    })

    //Event handler for delete all button
    $('#deleteAll').click((e) => {
        movieList.length = 0;
        updateUI();
    })

});


