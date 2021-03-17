$('#search').on('click', function(){
    let phrase = $('#phrase').val();
    $.ajax({
        url: "/api",
        type: 'POST',
        data: {
            phrase,
            post_type: 'new_search'
        },
        success: function(result){
            if(result.ok){
                console.log('OK');
            }
        }
    });
});