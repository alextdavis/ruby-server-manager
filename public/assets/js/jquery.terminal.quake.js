(function($) {
    $.fn.quake = function(eval, options) {
        if ($('body').data('quake')) {
            return $('body').data('quake').terminal;
        }
        this.addClass('quake');
        options = options || {};
        eval = eval || function(command, term) {
            term.echo("you don't set eval for quake");
        };
        var settings = {
            prompt: 'quake> ',
            name: 'quake',
            height: 100,
            enabled: false,
            greetings: 'Quake like console',
            keypress: function(e) {
                if (e.which == 96) {
                    return false;
                }
            }
        };
        if (options) {
            $.extend(settings, options);
        }
        this.append('<div class="td"></div>');
        var self = this;
        self.terminal = this.find('.td').terminal(eval, settings);
        var focus = false;
        $(document.documentElement).keypress(function(e) {
            if (e.which == 96) {
                self.slideToggle('fast');
                self.terminal.focus(focus = !focus);
                self.terminal.attr({
                    scrollTop: self.terminal.attr("scrollHeight")
                });
            }
        });
        $('body').data('quake', this);
        this.hide();
        return self;
    };
})(jQuery);