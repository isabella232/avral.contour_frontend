export default class CheckForm {
    constructor(options) {
        this.form = document.getElementById("geoproc-check-form");
        this.uuid = document.getElementById("check-id");
        this.formBtn = this.form.querySelector("[type=submit]");
        this.url = "/wps/simple/contour_lines/check?uuid=";
        this.success = this.form.querySelector(".form__message--success");
        this.error = this.form.querySelector(".form__message--error");
        this.warning = this.form.querySelector(".form__message--warning");

        var that = this;

        this.formBtn.addEventListener("click", function(e){
            e.preventDefault();
            that.checkOrder();
        })
    };

    checkOrder(){
        var that = this;
        var url = this.url + this.uuid.value.replace(/\s/g, '');

        function checkStatus(response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        }

        function parseJSON(response) {
            return response.json();
        }

        fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .then(function(data) {
                if (data.type === "success"){
                    that.showSuccessMessage(data.data);
                };
                if (data.type === "warning"){
                    that.showWarningMessage(data.data);
                } 
                if (data.type === "error"){
                    that.showErrorMessage(data.data);
                } 
            }).catch(function(error) {
                that.showErrorMessage(error.message);
            });
    };

    showSuccessMessage(data){
        this.warning.classList.remove("active");
        this.error.classList.remove("active");
        document.getElementById("contours-link").setAttribute("href", data);
        this.success.classList.add("active");
    };

    showWarningMessage(warning){
        var that = this;
        that.error.classList.remove("active");
        that.success.classList.remove("active");
        that.warning.innerHTML = warning;
        that.warning.classList.add("active");        
        setTimeout(function(){
            that.warning.classList.remove("active");
        }, 4000);
    };

    showErrorMessage(error){
        var that = this;
        that.warning.classList.remove("active");
        that.success.classList.remove("active");
        that.error.innerHTML = error;
        that.error.classList.add("active");        
        setTimeout(function(){
            that.error.classList.remove("active");
        }, 4000);
    };

    cleanMessages(){
        this.error.classList.remove("active");
        this.success.classList.remove("active");
        this.warning.classList.remove("active");
    }
};
