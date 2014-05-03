;define('controllers/ForgotPassword', ['appframework', 'libs/happy/happy', 'libs/happy/happy.methods', 'model/DataProvider', 'i18n!nls/forgot'],
    function ($, happy, validators, dataProvider, forgot) {

        var view, currentInterval;

        var doInit = function (v) {

            view = v;

        };

        var onRecoverPassword = function (data) {

            var currentData = JSON.parse(data);

            if (currentData.success === true) {

                renderMessage('');

            } else {

                renderMessage(currentData.message);

            }

        };

        var onRecoverPasswordError = function (xhr, error) {

            renderMessage(error.message);

        };

        var doRecoverPassword = function (email) {

            view.showLoader(true);

            var params = JSON.stringify({'details': {'action': 'recoverPassword', 'email': email}});
            dataProvider.fetchData(params, onRecoverPassword, onRecoverPasswordError);

        };

        var elementInDocument = function (element) {

            while (element = element.parentNode) {

                if (element == document) {

                    return true;

                }

            }

            return false;

        };

        var handlePopupDisposal = function (element) {

            if (!elementInDocument(element)) {

                clearInterval(currentInterval);
                $.ui.goBack();

            }

        };
        var renderMessage = function (msg) {

            view.showLoader(false);

            var popup = view.showMessage(msg);
            currentInterval = setInterval(function () {

                handlePopupDisposal(popup);

            }, 120);

        };

        var initValidation = function (form) {

            console.log('init validation', form);

            form.isHappy({
                fields: {
                    // reference the field you're talking about, probably by `id`
                    // but you could certainly do $('[name=name]') as well.
                    '#e-mail': {

                        required: true,
                        message: forgot.emailRequired, //'Might we inquire your name'
                        test: validators.email

                    },

                    '#reset-url': {

                        required: true,
                        message: forgot.urlRequired //'Please type your password!'

                    }
                },
                submitButton: '#do-recover'
            });

        };

        return{

            init: doInit,
            recoverPassword: doRecoverPassword,
            initValidation: initValidation

        };

    });