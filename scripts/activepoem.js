$(document).ready(function(){
    breakContentIntoPartials();

    $('.content.parentheses > .partial').show("slow", setInline);
    $('.content.footnote > .partial').hide("slow", setInline);

    $('.poemtext a').click(function() {
        if ($(this).parent('sup').length) {
            // footnote
            nextContent($(this).parent('sup')).children('.partial').show('slow', setInline);
            $(this).hide();
        } else {
            // parentheses
            var op = $(this).text().match(/\)/) ? 'prev' : 'next';
            $(this)[op]('.content').children('.partial').toggle('slow', setInline);
        }
        return false;
    });

    $('span.content.footnote').click(function() {
        // footnote content
        var $content = $(this);
        $(this).children('.partial').hide('slow', setInline);
        previousFootnote($content).show('slow', setInline);
    });

    $('a#openallpi').click(function() {
        $('.content.parentheses > .partial').show('slow', setInline)
        return false;
    });

    $('a#closeallpi').click(function() {
        $('.content.parentheses > .partial').hide('slow', setInline)
        return false;
    });

    $('a#openallfi').click(function() {
        $('.content.footnote').each(function(i,e) {
            $(e).children('.partial').show('slow', setInline);
            previousFootnote($(e)).hide('slow', setInline);
        });
        return false;
    });

    $('a#closeallfi').click(function() {
        $('.content.footnote').each(function(i,e) {
            $(e).children('.partial').hide('slow', setInline);
            previousFootnote($(e)).show('slow', setInline);
        });
        return false;
    });

});

function previousFootnote($e) {
    var $item = $e.prev();
    if ($item.get(0).tagName == 'BR') $item = $item.prev('sup');
    return $item.find('a');
}

function nextContent($e) {
    var $item = $e.next();
    if ($item.get(0).tagName == 'BR') $item = $item.next('span.footnote.content');
    return $item;
}

function breakContentIntoPartials() {
    // animating changes spans into inline-blocks; we break them
    // into partials to avoid this problem
    // reverse forces things to happen outside in
    var id = 0;
    $('span.content').reverse().each(function(i,e) {
        var html = $(e).html();
        var matches = html.match(/^([^<]*?<br.*?>)([\s\S]*)$/);
        if (matches) {
            html = '<span class="partial" id="p1-' + id +'" >' + matches[1] + '</span>';
        } else {
            matches = html.match(/^([^<]*?)(<[\s\S]*)$/);
            if (matches) {
                html = '<span class="partial" id="p2-' + id +'" >' + matches[1] + '</span>';
                var firstLineMatches = matches[2].match(/([\s\S]*)(<br[\s\S]*)/);
                if (firstLineMatches) {
                    html += '<span class="partial" id="p3-' + id + '">' + firstLineMatches[1] + '</span>';
                    matches[2] = firstLineMatches[2];
                }
            }
        }
        if (matches) {
            if (matches[2].length) {
                var tailMatches = matches[2].match(/^([\s\S]*<br\ ?\/?>)([^<]+?)($|<span[\s\S]*|<sup[\s\S]*)/);
                if (tailMatches) {
                    html += '<span class="partial" id="p4-' + id +'" >'
                        + tailMatches[1] + '</span>'
                        + '<span class="partial last">' 
                        + tailMatches[2] + tailMatches[3]
                        + '</span>';
                } else {
                    html += '<span class="partial" id="p6-' + id + '">' + matches[2] + '</span>';
                }
            }
        } else {
            html = '<span class="partial" id="p8-' + id + '">' + html + '</span>';
        }
        $(e).html(html);
        id += 1;
    });
}

// hack: after animations, restore .partial display
function setInline() {
    if ($(this).css('display') == 'inline-block') $(this).css('display','inline');
}

$.fn.reverse = [].reverse;

