function Validator(options) {
    var selectorRules = {};
    function Validate (inputElement, rule) {
        var errElement = inputElement.parentElement.querySelector(options.msgSelector)
        var errMsg 
        var rules = selectorRules[rule.selector]

        for (var i = 0; i < rules.length; i++) {
            errMsg = rules[i](inputElement.value)
            if(errMsg) break
        }
        if(errMsg) {
            inputElement.parentElement.classList.add('invalid')
            errElement.innerText = errMsg
        } else {
            inputElement.parentElement.classList.remove('invalid')
            errElement.innerText = ''
        }
        return !errMsg
    }
    var formElement = document.querySelector(options.form)
    if(formElement) {
        // Submit form 
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var formValid = true;
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = Validate(inputElement, rule)
                if(!isValid) {
                    formValid = false;
                }
            });
            if(formValid) {
                if(typeof options.onSubmit === 'function') {
                    var formEnableInput = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(formEnableInput).reduce(function(values, input){
                             values[input.name] = input.value 
                             return values
                    }, {})
                    options.onSubmit(formValues);
                }
            }else {
                console.log('có lỗi')
            }
        }
       
        options.rules.forEach(rule => {
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            console.log(selectorRules)
            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement) {
                inputElement.onblur = function() {
                    Validate(inputElement, rule) 
                }
                inputElement.onclick= function() {
                    var errElement = inputElement.parentElement.querySelector(options.msgSelector)
                    var errMsg = rule.test(inputElement.value)
                    inputElement.parentElement.classList.remove('invalid')
                    errElement.innerText = ''
                }
            }
        });
    }
}

Validator.isRequired = function(selector, content) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : content || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return {
        selector: selector,
        test: function(value) {
            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function(selector, getPassword) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return {
        selector: selector,
        test: function(value) {
            return value === getPassword() ? undefined : 'Giá trị nhập không chính xác'
        }
    }
}