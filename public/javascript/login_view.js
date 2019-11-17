var passwordChecker;

$(document).ready(() => {
    $("#reset-password").focusout(() => {
        var check = /^[0-9a-zA-Z]+$/;
        if(!$("#new-password").val().match(check)) {
            $("#reset-password-field").addClass("error");
            $("body").toast({
                class: "error",
                position: "top center",
                message: "Incorrect password format"
            })
            passwordChecker = false;
        } else if($("#reset-password").val().length < 8) {
            $("#reset-password-field").addClass("error");
            $("body").toast({
                class: "error",
                position: "top center",
                message: "Password is too short"
            })
            passwordChecker = false;
        } else if($("#reset-password").val().length > 32) {
            $("#reset-password-field").addClass("error");
            $("body").toast({
                class: "error",
                position: "top center",
                message: "Password is too long"
            })
            passwordChecker = false;
        } else {
            passwordChecker = true;
        }
    })

    $("#submit").click(() => { 
        $.ajax({
            type: "post",
            url: "/validateLogin",
            data: {
                username: $("#username").val(),
                password: $("#password").val(),
                date: getDate()
            },
            success: function(value) {
                if(value.message == 0) {
                    $("#username-input").addClass("error");
                    $("#password").val("");
                    $('body').toast({
                        class: "error",
                        position: "top center",
                        message: "Invalid username"
                    });
                } else if(value.message == 2) {
                    $("#username-input").addClass("error");
                    $("#password-input").addClass("error");
                    $("#password").val("");
                    $('body').toast({
                        class: "error",
                        position: "top center",
                        message: "Invalid password"
                    });
                } else if(value.message == 1) {
                    window.location.href="/login"
                }
            }
        })
    })
})

$(document).on("keydown", () => {
    $("#username-input").removeClass("error");
    $("#password-input").removeClass("error");
})

$(document).on("keypress", (event) => {
    if(event.keyCode == 13) {
        if($("#forgot-modal")[0].className.includes("active")) {
            $("#reset-button").click();
        } else {
            $("#submit").click();
        }
    }
    $("#reset-username-field").removeClass("error");
    $("#reset-password-field").removeClass("error");
    $("#reset-confirm-password-field").removeClass("error");
})

$("#forgot").click(() => {
    $("#forgot-modal").modal("show");
})

$("#forgot-modal").modal({
    onShow: function() {
        $('#forgot-modal').form("clear");
        passwordChecker = true;
    }
})

$("#reset-button").click(() => {
    var done = true;
    if($("#reset-username").val() == "" || $("#reset-username").val() == "admin") {
        $('body').toast({
            class: "error",
            position: "top center",
            message: "Please input a valid username"
        });
        $("#reset-username-field").addClass("error");
        if($("#reset-username").val() == "admin") {
            $("#reset-username").val("");
        }
        done = false;
    }
    if($("#reset-password").val() == "" || $("#reset-confirm-password").val() == "") {
        if($("#reset-password").val() == "") {
            $("#reset-password-field").addClass("error");
        }
        if($("#reset-confirm-password").val() == "") {
            $("#reset-confirm-password-field").addClass("error");
        }
        $('body').toast({
            class: "error",
            position: "top center",
            message: "Please input a valid password"
        });
        $("#reset-password").val("");
        $("#reset-confirm-password").val("");
        done = false;
    } else {
        if($("#reset-password").val() != $("#reset-confirm-password").val()) {
            $('body').toast({
                class: "error",
                position: "top center",
                message: "Password do not match"
            }); 
            $("#reset-password-field").addClass("error");
            $("#reset-confirm-password-field").addClass("error");
            $("#reset-password").val("");
            $("#reset-confirm-password").val("");
            done = false;
        }
    }

    if(done && passwordChecker) {
        $.ajax({
            type: "post",
            url: "/admin/updateAccountPassword",
            data: {
                username: $("#reset-username").val(),
                newPassword: $("#reset-password").val()
            },
            success: (value) => {
                if(value.message) {
                    $("#forgot-modal").modal("hide");
                    $('body').toast({
                        class: "success",
                        position: "top center",
                        message: "Password successfully reset"
                    });
                } else {
                    $('body').toast({
                        class: "error",
                        position: "top center",
                        message: "Username not found"
                    });
                    $("#reset-username-field").addClass("error");
                    $("#reset-password").val("");
                    $("#reset-confirm-password").val("");
                }
            }
        })
    } else {
        $("#reset-password-field").addClass("error");
        $('body').toast({
            class: "error",
            position: "top center",
            message: "Incorrect password format"
        });
    }
})

function getDate() {
    var date = new Date();
    return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function setup() {
    $("#form").form("clear");
}