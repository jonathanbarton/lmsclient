;define('controllers/Courses', ['appframework', 'core/Constants', 'model/Course'], (function($, Constants, Course){

    var that = this;
    var view;
    var token, key;

    var doInit = function(v){

      view = v;

    };

    var doGetUserCourses = function(user){

        token = user.token;
        key = user.getUsername;

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'userCourses', 'userid': user.id , 'token': token , 'key': key}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    view.showLoader(true);
                    prepareCoursesData(currentData);

                }else{

                    showError(data.message);

                }

            },
            error: function(xhr, error){

                view.showError(error.message);

            }
        });

    };

    var showError = function (message) {

        view.showLoader(false);
        view.showError(message);

    };

    var doGetCourseDetails = function(id){

        view.showLoader(true);

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'courseDetails', 'idCourse': id , 'token': token , 'key': key}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    console.log(currentData.objects);
                    var event = new CustomEvent(Constants.CHANGE_VIEW_EVENT, {detail: {view: Constants.COURSES_DETAILS_VIEW, module: Constants.COURSES_DETAILS_MODULE, data: currentData.objects, push: true}});
                    that.dispatchEvent(event);

                }else{

                    showError(data.message);

                }

            },
            error: function(xhr, error){

                view.showError(error.message);

            }
        });

    };

    var prepareCoursesData = function(data){

        var tmp = [];

        $.each(data, function(index, val){

            console.log(index, ' - ', val);

            for(var i in val.course_info){

                console.log(i, ' - ', val.course_info[i]);

            }

            try{

                var course = new Course(val.course_info);
                tmp[index] = course;

            }catch(error){

                console.log('Object malformed');

            }

        });

        console.log(tmp)
        renderData(tmp);

    };

    var renderData = function(data){

        setTimeout(function(){

            var course = data.shift();
            view.showCourse(course);

            if(data.length > 0){

                setTimeout(arguments.callee, 50);

            }else{

                view.showLoader(false);
                view.initCoursesInteraction(true);

            }

        }, 50);

    };

    var doSearchCourses = function(str){



    };


    return {

        init: doInit,
        getUserCourses: doGetUserCourses,
        searchCourses: doSearchCourses,
        getCourseDetails: doGetCourseDetails

    };

}));