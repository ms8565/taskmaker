$(document).ready(function() {

    const handleError = (message) => {
        $("#errorMessage").text(message);
        $("#TaskMessage").animate({width:'toggle'},350);
    }
    
    const sendAjax = (action, data) => {
        console.log(data);
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: (result, status, xhr) => {
                $("#TaskMessage").animate({width:'hide'},350);

                window.location = result.redirect;
                
            },
            error: (xhr, status, error) => {
                const messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
                
            }
        }); 
    }
    
    $("#makeTaskSubmit").on("click", (e) => {
        e.preventDefault();
    
        $("#TaskMessage").animate({width:'hide'},350);
    
        if($("#TaskName").val() == '' || $("#TaskAge").val() == '' || $("#TaskWeight").val() == '') {
            handleError("All fields are required");
            
            return false;
        }

        sendAjax($("#TaskForm").attr("action"), $("#TaskForm").serialize());
        
        return false;
    });
    
    $(".completeTaskSubmit").click(function() {
        //e.preventDefault();
        
        const name = this.id;
        const origin = window.location.pathname;
        
        sendAjax("/completeTask", "name="+name+"&_csrf="+$("#token").val()+"&origin="+origin);
        
        return false;
    });
    
});