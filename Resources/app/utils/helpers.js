/*global define:true*/
define( function(){
    var htmlTextTruncate = function(text, limit, postfix, forceClosingTags) {
        if (!limit || text.length < limit) return text;
    
        var tags = [], count = 0, finalPos = 0, i = 0;
    
        for(i = 0; i < text.length; i++) {
            var symbol = text.charAt(i);
            if (symbol === "<") {
                var tail = text.indexOf(">", i);
                if (tail < 0) return text;
                var source = text.substring(i + 1, tail);
                var tag = {"name": "", "closing": false};
                if (source.charAt(0) === "/") {
                        tag.closing = true;
                        source = source.substring(1);
                }
                tag.name = source.match(/(\w)+/)[0];
                if (tag.closing) {
                        var current = tags.pop();
                        if (!current || current.name !== tag.name) return text;
                }
                i = tail;
            } else if (symbol === "&" && text.substring(i).match(/^(\S)+;/)) {
                i = text.indexOf(";", i);
            } else {
                if (count === limit) {
                    finalPos = i;
                    break;
                }
                count++;
            }
        }

        if (finalPos || forceClosingTags) {
            if (finalPos) {
                text = text.substring(0, finalPos) + (postfix || "");
            }
            for (i = tags.length - 1; i >= 0; i--) {
                text += "</" + tags[i].name + ">";
            }
        }
        
        return text;
    };

    var Utils = {};
    Utils.htmlTruncate = htmlTextTruncate;

    return Utils;
});