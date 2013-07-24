var sections = ["section0","section1","section2","section3","section4"];
var currentsection = 0;

var footnotes = new Array;
var fnpattern = new RegExp("fn[0-9]");

var partials = new Array;

function partial(idname,level) {
    this.idname = idname;
    this.level = level;
}


// keyboard listener

// process parentheses



// coloring!

function getByClass (className, parent) {
// from http://stackoverflow.com/questions/3808808/how-to-get-element-by-class-in-javascript 
  parent || (parent=document);
  var descendants=parent.getElementsByTagName('*'), i=-1, e, result=[];
  while (e=descendants[++i]) {
    ((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) && result.push(e);
  }
  return result;
}

function processcolors() {
    var allpartials = getByClass("partial",document);
    var dummyid = 0;
    for(i in allpartials) {
        var currentpartial = new partial;
        if(!(allpartials[i].id)) {  
            allpartials[i].setAttribute("id","dummyid"+dummyid); 
            dummyid++;
        }
        currentpartial.idname = allpartials[i].id;
        var thiselement = allpartials[i];
        var j = 1;
        do{
            thiselement = thiselement.parentNode;
            var thisclass = thiselement.className;
            if(thisclass === "partial") {
                j++;
            }
        } while((thisclass != "poemtext") && (thisclass != "content footnote"))
        if(thisclass === "content footnote") {
            j--;
        }
        currentpartial.level = j;
        partials.push(currentpartial);
    }
}

function colorcode() {
    for(j in partials) {
      switch (partials[j].level) {
        case 0: 
            document.getElementById(partials[j].idname).style.color = "black";
            break;
        case 1: 
            document.getElementById(partials[j].idname).style.color = "red";
            break;
        case 2:
            document.getElementById(partials[j].idname).style.color = "orange";
            break;
        case 3:
            document.getElementById(partials[j].idname).style.color = "yellow";
            break;
        case 4:
            document.getElementById(partials[j].idname).style.color = "green";
            break;
        case 5:
            document.getElementById(partials[j].idname).style.color = "blue";
            break;
        case 6:
            document.getElementById(partials[j].idname).style.color = "purple";
            break;
        case 7:
            document.getElementById(partials[j].idname).style.color = "gray";
            break;
        }
    }
}

function uncolor() {
    for(j in partials) {
        document.getElementById(partials[j].idname).style.color = "black";
    }
}

// hide all but me

function setsection(nodenumber) {
    document.getElementById("leftarrow").style.display = "none";
    document.getElementById("rightarrow").style.display = "none";
    for(i in sections) {
        document.getElementById(sections[i]).style.display = "none";
    }
    document.getElementById(sections[nodenumber]).style.display = "block";
    if(nodenumber === 0) {
        document.getElementById("poemcontrol").style.display = "none";
    } else {
        document.getElementById("poemcontrol").style.display = "block";
    }
    if(nodenumber > 0) {
        document.getElementById("leftarrow").style.display = "block";
    }
    if(nodenumber < (sections.length - 1)) {
        document.getElementById("rightarrow").style.display = "block";
    }
    currentsection = nodenumber;
}

function showall() {
    for(i in sections) {
        document.getElementById(sections[i]).style.display = "block";
    }
    currentsection = 0;
    document.getElementById("leftarrow").style.display = "none";
    document.getElementById("rightarrow").style.display = "none";
    document.getElementById("poemcontrol").style.display = "block";
}

// anshul's code

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



// start here

$(document).ready(function(){

    breakContentIntoPartials();

    processcolors();

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

// my code starts here!

    $('a#a0').click(function() {
        setsection(0);
        return false;
    });

    $('a#a1').click(function() {
        setsection(1);
        return false;
    });

    $('a#a2').click(function() {
        setsection(2);
        return false;
    });

    $('a#a3').click(function() {
        setsection(3);
        return false;
    });

    $('a#a4').click(function() {
        setsection(4);
        return false;
    });

    $('a#showallsections').click(function() {
        showall();
        return false;
    });

    $('a#leftarrow').click(function() {
        if(currentsection > 0) {
            currentsection--;
            setsection(currentsection);
        }
        return false;
    });

    $('a#rightarrow').click(function() {
        if(currentsection < (sections.length-1)) {
            currentsection++;
            setsection(currentsection);
        }
        return false;
    });

    $('a#colorcode').click(function() {
        colorcode();
        return false;
    });

    $('a#uncolor').click(function() {
        uncolor();
        return false;
    });


// initialize keyboard listener

// set current section

setsection(currentsection);

});
