// form.on("value", function(data) {
//   var name = data.val() ? data.val().name : "";
//   console.log("My name is " + name);
// });
(function($) {
    $.fireform = function(element, options) {

        var fb = new Firebase(options),
            target = $(element);

        target.children(':submit').on('click', function() {
            event.preventDefault()
            var obj = {};
            target.find('input').each(function(key, input) {
                var name = $(input).attr('name'),
                    val = $(input).val();
                if (name)
                    obj[name] = val;
                else if ($(input).attr('type') !== 'submit')
                    obj['unnamed' + key] = val;
            });
            var form = fb;
            obj['_time'] = new Date().toString();
            form.push(obj, function(err) {
                if (!err)
                    target.addClass("submited");
                else
                    target.addClass("error");
            });
        });
    }

    // add the plugin to the jQuery.fn object
    $.fn.fireform = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('fireform')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.fireform(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('fireform', plugin);

            }

        });

    }
})($);


// form.on("value", function(data) {
//   var name = data.val() ? data.val().name : "";
//   console.log("My name is " + name);
// });
(function($) {
    $.fireform2 = function(element, selector, options) {

        if ( !options.fireBaseRepo )
            console.error("Please pass fireBaseRepo as a option in the 2nd parameter.")

        Fireform(element, options.fireBaseRepo)
    };
    // add the plugin to the jQuery.fn object
    $.fn.fireform2 = function(options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('fireform2')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.fireform2(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('fireform2', plugin);

            }

        });

    }
})($);


function Fireform (selector, fireBaseRepo){
            this.error=function(text){console.error(text)};
            var formDOMObject, inputs, submit, that=this;
            if (typeof selector!=="string"){
                formDOMObject = selector;
            }else if ( selector.search(/^\./)===0 ) {
                formDOMObject = document.getElementsByClassName(selector.slice(1))[0]
                console.warn("We will default to the first form matching this class selector");
            }
            else if ( selector.search(/^\#/)===0 ){
                formDOMObject = document.getElementById(selector.slice(1));
            }else if (!formDOMObject){
                this.error('Please use a Class or Id Selector. This mean your string should begin with a "." or "#".  You man also pass in a Dom elment object')
                return
            }
            if (!formDOMObject.tagName){
                this.error('No DOM object found!')
                return
            }else if(formDOMObject.tagName!=="FORM"){
                this.error('DOM elments is not a <form>')
                return
            }
            this.formDOMObject=formDOMObject

            this.inputs=inputs=formDOMObject.elements

            for (var i = this.inputs.length - 1; i >= 0; i--) {
                var type;
                type = inputs[i].getAttribute('type');
                if (type==="submit"){ submit=inputs[i]; break;}
            };
            if (!submit) this.error('Please add a submit button with a <input type="submit"> attr"')

            submit.onclick=function(event){
                event.preventDefault();
                var payLoad={};
                for (var i = that.inputs.length - 1; i >= 0; i--) {
                    var name, type;
                    name = that.inputs[i].name ? inputs[i].name : 'input_'+String(i);
                    type = inputs[i].getAttribute('type');
                    if (type!=="submit") payLoad[name]=inputs[i].value;
                }
                that.submit(fireBaseRepo, payLoad);
            }

            this.getRepo=function(url){

                source_tuple=url.split("://")[1].split('/list/')

                source=source_tuple[0]

                user_repo_tuple=source_tuple[1].split('/')

                user=user_repo_tuple[0]

                repo=user_repo_tuple[1]

                return "https://"+source+".firebaseio.com/users/simplelogin:"+user+"/lists/"+repo+"/formPosts.json"



                //"http://fireform/list/1/r".split('/list/').split("://")[1].split('/list/')

                //"https://fireform.firebaseio.com/users/simplelogin:1/lists/123/formPosts.json"


            }

            this.submit=function(fireBaseRepo, payLoad){
                var xmlhttp = new XMLHttpRequest;
                xmlhttp.open("POST",this.getRepo(fireBaseRepo),true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send( JSON.stringify(payLoad) );
            }


    };