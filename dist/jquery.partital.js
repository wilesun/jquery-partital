(function ($) {
    function emptyCallback(cb) {
        return cb && cb(null);
    }

    var partital = {
        cache: {},
        load: function ($dom, url, success, failure) {
            var self = this;
            var uninit = emptyCallback;
            var domid = $dom.attr('id');
            if (!domid) {
                throw 'must have id attribute';
            }
            if (self.cache[domid] && self.cache[domid].uninit) {
                uninit = self.cache[domid].uninit()
            }
            uninit(function () {
                $dom.load(url, function (resText, status) {
                    if (status == 'error') {
                        if (failure) {
                            failure(resText);
                        } else {
                            BootstrapDialog.alert({title: '错误', message: resText});
                        }
                    } else {
                        var elements = this.find('[data-controller]');
                        var loaderThis = this;
                        if (elements.length) {
                            require([elements.attr('data-controller')], function (controller) {
                                delete self.cache[domid];
                                if (controller) {
                                    self.cache[domid] = controller;
                                    if (controller.init) {
                                        controller.init.call(loaderThis);
                                    }
                                }
                                success && success.call(loaderThis);
                            });
                        } else {
                            success && success.call(loaderThis);
                        }
                    }
                });
            });
        }
    };
    $.partital = partital;
}(jQuery));