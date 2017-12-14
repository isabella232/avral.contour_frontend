
import CheckForm from "check-form/check-form";

export default class OrderForm {
    constructor(options) {
        this.form = document.getElementById("geoproc-order-form"); 
        this.formRegionGroup = document.getElementById("region-group");
        this.formSouthWest = document.getElementById("south-west-coord");
        this.formNorthEast = document.getElementById("nord-east-coord");
        this.formBtn = document.getElementById("process-btn");
        this.formStep =  document.getElementById("isoline-step");
        this.url = "/wps/simple/contour_lines/book";
        this.success = this.form.querySelector(".form__message--success");
        this.error = this.form.querySelector(".form__message--error");
        this.checkForm = new CheckForm();

        var that = this;

        this.formBtn.addEventListener("click", function(e){
            e.preventDefault();
            that.sendOrder();
        });

        this.formSouthWest.addEventListener("change", function(){ that.cleanMessages(); });
        this.formNorthEast.addEventListener("change", function(){ that.cleanMessages(); });
        this.formStep.addEventListener("keyup", function(){ that.cleanMessages(); });
    };

    sendOrder(){
        var that = this;
        var url = this.url +
                "?minx=" + this.formSouthWest.getAttribute("data-minx") + 
                "&maxx=" + this.formNorthEast.getAttribute("data-maxx") + 
                "&miny=" + this.formSouthWest.getAttribute("data-miny") + 
                "&maxy=" + this.formNorthEast.getAttribute("data-maxy") + 
                "&interval=" + this.formStep.value;

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
                } else  {
                    that.showErrorMessage(data.data);
                }
            }).catch(function(error) {
                that.showErrorMessage(error.message);
            });
    };

    showSuccessMessage(data){
        this.error.classList.remove("active");
        document.getElementById("result-id").innerHTML = data;
        this.success.classList.add("active");
        this.setIdToChekInput(data);
    };

    showErrorMessage(error){
        var that = this;
        that.success.classList.remove("active");
        that.error.innerHTML = error;
        that.error.classList.add("active");
        setTimeout(function(){
            that.error.classList.remove("active");
        }, 4000);
    };

    setIdToChekInput(id){
        document.getElementById("check-id").value = id;
        document.getElementById("check-id").parentNode.MaterialTextfield.checkDirty();
        this.checkForm.cleanMessages();
    }

    cleanMessages(){
        this.error.classList.remove("active");
        this.success.classList.remove("active");
    }
};
